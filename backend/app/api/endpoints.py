import uuid
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, status
from app.schemas.contracts import (
    ProfileRequest, ProfileResponse, CompetencyItem,
    RoadmapRequest, RoadmapResponse,
    QuizRequest, QuizResponse,
    QuizSubmitRequest, QuizSubmitResponse,
    EmployeeDashboardResponse,
    AdminDashboardResponse, AdminEmployeeItem, AdminOrganizationalGap, GapSeverity,
    KnowledgeDocument, KnowledgeDocumentListResponse,
    PracticeDatasetResponse
)
from app.services.data_loader import DataLoader
from app.services.llm_service import LLMService
from app.services.roadmap_engine import RoadmapEngine
from app.services.mastery_engine import MasteryEngine
from app.services.document_service import DocumentService

router = APIRouter()

@router.post("/profile", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
def create_profile(payload: ProfileRequest):
    """
    POST /api/profile
    Parse official profile details and return structured competency levels.
    """
    raw_competencies = LLMService.parse_profile(payload)

    competencies = [
        CompetencyItem(
            node_id=item["node_id"],
            current_level=item.get("current_level", "none")
        )
        for item in raw_competencies
    ]

    profile_id = f"prof_{uuid.uuid4().hex[:8]}"

    DataLoader.save_profile(profile_id, {
        "profile_id": profile_id,
        "job_role": payload.job_role,
        "competencies": [c.model_dump() for c in competencies]
    })

    return ProfileResponse(profile_id=profile_id, competencies=competencies)


@router.post("/roadmap", response_model=RoadmapResponse, status_code=status.HTTP_200_OK)
def generate_roadmap(payload: RoadmapRequest):
    """
    POST /api/roadmap
    Produce gap-scored, prerequisite-ordered learning roadmap mapped to mock iGOT courses.
    """
    cached_profile = DataLoader.get_profile(payload.profile_id)

    if cached_profile:
        competencies = cached_profile.get("competencies", [])
        job_role = payload.job_role or cached_profile.get("job_role", "Statistical Investigator")
    else:
        # Fallback if profile_id is unknown or direct query
        job_role = payload.job_role or "Statistical Investigator"
        dummy_req = ProfileRequest(
            designation="Officer",
            department="Statistics",
            job_role=job_role,
            experience_years=2,
            education="Bachelor",
            prior_trainings=[]
        )
        raw_comps = LLMService.parse_profile(dummy_req)
        competencies = [{"node_id": c["node_id"], "current_level": c["current_level"]} for c in raw_comps]

    roadmap = RoadmapEngine.calculate_roadmap(competencies, job_role)
    return RoadmapResponse(roadmap=roadmap)


@router.post("/quiz", response_model=QuizResponse, status_code=status.HTTP_200_OK)
def generate_quiz(payload: QuizRequest):
    """
    POST /api/quiz
    Generate targeted multiple-choice questions from node subtopics or learning material.
    """
    content_text = payload.content_text.strip() if payload.content_text else None
    node_id = payload.node_id.strip() if payload.node_id else None

    if not content_text and not node_id:
        raise HTTPException(status_code=400, detail="Either content_text or node_id must be provided")

    result = LLMService.generate_quiz(content_text=content_text, node_id=node_id)
    return QuizResponse(
        questions=result["questions"],
        node_id=result.get("node_id"),
        subtopics_tested=result.get("subtopics_tested", [])
    )


@router.post("/quiz/submit", response_model=QuizSubmitResponse, status_code=status.HTTP_200_OK)
def submit_quiz_answers(payload: QuizSubmitRequest):
    """
    POST /api/quiz/submit
    Submit quiz answers, persist attempt history, evaluate objective coverage, and update competency mastery scores.
    """
    if not payload.answers:
        raise HTTPException(status_code=400, detail="answers array cannot be empty")

    effective_node_id = payload.node_id or payload.answers[0].node_id
    updates = MasteryEngine.process_quiz_submission(payload.profile_id, payload.answers)
    evaluation = LLMService.evaluate_objective_coverage(effective_node_id, payload.answers)

    return QuizSubmitResponse(
        profile_id=payload.profile_id,
        mastery_updates=updates,
        objective_coverage_pct=evaluation.get("objective_coverage_pct"),
        covered_subtopics=evaluation.get("covered_subtopics", []),
        missed_subtopics=evaluation.get("missed_subtopics", []),
        feedback=evaluation.get("feedback")
    )


@router.get("/dashboard/employee", response_model=EmployeeDashboardResponse, status_code=status.HTTP_200_OK)
def get_employee_dashboard(
    profile_id: Optional[str] = Query(None, description="Official Profile ID"),
    employee_id: Optional[str] = Query(None, description="Official Employee ID")
):
    """
    GET /api/dashboard/employee?employee_id=...&profile_id=...
    Retrieve employee adaptive learning dashboard metrics: node mastery scores, learning hours,
    overall progress %, and SM-2 forgetting-curve revision priority suggestions.
    """
    pid = employee_id or profile_id or "emp-101"
    return MasteryEngine.get_employee_dashboard(pid)


@router.get("/employees", response_model=List[dict], status_code=status.HTTP_200_OK)
def get_employees():
    """
    GET /api/employees
    List all official employee personas from mock_employees.json
    """
    return DataLoader.get_employees()


@router.get("/employees/{profile_id}", response_model=dict, status_code=status.HTTP_200_OK)
def get_employee_by_id(profile_id: str):
    """
    GET /api/employees/{profile_id}
    Retrieve single employee by ID from mock_employees.json
    """
    emp = DataLoader.get_employee_by_id(profile_id)
    if not emp and profile_id == "prof_demo":
        emp = DataLoader.get_employee_by_id("emp-101")
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Employee '{profile_id}' not found")
    return emp


@router.get("/dashboard/admin", response_model=AdminDashboardResponse, status_code=status.HTTP_200_OK)
def get_admin_dashboard():
    """
    GET /api/dashboard/admin
    Retrieve overview of employee skill gaps for admin dashboard monitoring.
    Dynamically processes employee profiles to compute average gap severities and top gaps.
    """
    raw_employees = DataLoader.get_employees()
    admin_items: List[AdminEmployeeItem] = []
    level_num = {"none": 0, "basic": 1, "intermediate": 2, "advanced": 3}
    org_gap_map: dict = {}

    for emp in raw_employees:
        profile_req = ProfileRequest(
            designation=emp.get("designation", "Officer"),
            department=emp.get("department", "Statistics"),
            job_role=emp.get("job_role", "Statistical Investigator"),
            experience_years=float(emp.get("experience_years", 2.0)),
            education=emp.get("education", "Bachelor"),
            prior_trainings=emp.get("prior_trainings", [])
        )
        
        raw_comps = LLMService.parse_profile(profile_req)
        competencies = [{"node_id": c["node_id"], "current_level": c["current_level"]} for c in raw_comps]
        roadmap = RoadmapEngine.calculate_roadmap(competencies, profile_req.job_role)

        for r_node in roadmap:
            if r_node.node_id not in org_gap_map:
                org_gap_map[r_node.node_id] = {
                    "name": r_node.name,
                    "gap_severity": r_node.gap_severity,
                    "progress_sum": 0.0,
                    "count": 0
                }
            cur_s = level_num.get(r_node.current_level, 0)
            req_s = level_num.get(r_node.required_level, 2)
            pct = (cur_s / req_s * 100.0) if req_s > 0 else 100.0
            org_gap_map[r_node.node_id]["progress_sum"] += pct
            org_gap_map[r_node.node_id]["count"] += 1

        high_count = sum(1 for node in roadmap if node.gap_severity == "high")
        medium_count = sum(1 for node in roadmap if node.gap_severity == "medium")
        total_gaps = len(roadmap)

        if high_count >= 1 or total_gaps >= 4:
            avg_severity: GapSeverity = "high"
        elif medium_count >= 1 or total_gaps >= 2:
            avg_severity = "medium"
        else:
            avg_severity = "low"

        top_gaps = [node.name for node in roadmap[:3]]
        if not top_gaps:
            top_gaps = ["All Required Competencies Met"]

        admin_items.append(
            AdminEmployeeItem(
                profile_id=emp.get("profile_id", "emp_unknown"),
                name=emp.get("name", "Official"),
                department=emp.get("department", "Statistics Department"),
                avg_gap_severity=avg_severity,
                top_gaps=top_gaps
            )
        )

    org_gaps = [
        AdminOrganizationalGap(
            node_id=nid,
            name=data["name"],
            gap_severity=data["gap_severity"],
            progress=round(data["progress_sum"] / max(data["count"], 1), 1)
        )
        for nid, data in org_gap_map.items()
    ]
    # Sort with high severity first and lowest progress first
    org_gaps.sort(key=lambda g: (0 if g.gap_severity == "high" else 1 if g.gap_severity == "medium" else 2, g.progress))

    return AdminDashboardResponse(employees=admin_items, organizational_gaps=org_gaps)


@router.post("/knowledge/upload", response_model=KnowledgeDocument, status_code=status.HTTP_200_OK)
async def upload_knowledge_document(file: UploadFile = File(...)):
    """
    POST /api/knowledge/upload
    Upload learning material document (PDF, TXT, MD, DOCX) and persist metadata.
    """
    return await DocumentService.upload_document(file)


@router.get("/knowledge/documents", response_model=KnowledgeDocumentListResponse, status_code=status.HTTP_200_OK)
def get_knowledge_documents():
    """
    GET /api/knowledge/documents
    Retrieve list of uploaded knowledge documents and metadata.
    """
    docs = DocumentService.list_documents()
    return KnowledgeDocumentListResponse(documents=docs)


@router.get("/practice/{domain}", response_model=PracticeDatasetResponse, status_code=status.HTTP_200_OK)
def get_practice_dataset(domain: str):
    """
    GET /api/practice/{domain}
    Retrieve official statistical practice dataset and metadata by domain.
    Supported domains: plfs, asi, cpi, iip, hces, asuse, nas, nada, nssta, igot
    """
    dataset = DataLoader.get_practice_dataset(domain)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Practice dataset for domain '{domain}' not found. Supported domains: plfs, asi, cpi, iip, hces, asuse, nas, nada, nssta, igot"
        )
    return dataset
