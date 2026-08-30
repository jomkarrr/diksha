import uuid
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, status
from app.schemas.contracts import (
    ProfileRequest, ProfileResponse, CompetencyItem,
    RoadmapRequest, RoadmapResponse,
    QuizRequest, QuizResponse,
    QuizSubmitRequest, QuizSubmitResponse,
    EmployeeDashboardResponse,
    AdminDashboardResponse, AdminEmployeeItem, GapSeverity,
    KnowledgeDocument, KnowledgeDocumentListResponse
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
    Generate between 8 to 10 multiple-choice questions from provided learning material text.
    """
    if not payload.content_text.strip():
        raise HTTPException(status_code=400, detail="content_text cannot be empty")

    questions = LLMService.generate_quiz(payload.content_text)
    return QuizResponse(questions=questions)


@router.post("/quiz/submit", response_model=QuizSubmitResponse, status_code=status.HTTP_200_OK)
def submit_quiz_answers(payload: QuizSubmitRequest):
    """
    POST /api/quiz/submit
    Submit quiz answers for a profile, persist attempt history, and update competency mastery scores.
    """
    if not payload.answers:
        raise HTTPException(status_code=400, detail="answers array cannot be empty")

    updates = MasteryEngine.process_quiz_submission(payload.profile_id, payload.answers)
    return QuizSubmitResponse(profile_id=payload.profile_id, mastery_updates=updates)


@router.get("/dashboard/employee", response_model=EmployeeDashboardResponse, status_code=status.HTTP_200_OK)
def get_employee_dashboard(profile_id: str = Query("prof_demo", description="Official Profile ID")):
    """
    GET /api/dashboard/employee?profile_id=...
    Retrieve employee adaptive learning dashboard metrics: node mastery scores, learning hours,
    overall progress %, and SM-2 forgetting-curve revision priority suggestions.
    """
    return MasteryEngine.get_employee_dashboard(profile_id)


@router.get("/dashboard/admin", response_model=AdminDashboardResponse, status_code=status.HTTP_200_OK)
def get_admin_dashboard():
    """
    GET /api/dashboard/admin
    Retrieve overview of employee skill gaps for admin dashboard monitoring.
    Dynamically processes employee profiles to compute average gap severities and top gaps.
    """
    raw_employees = DataLoader.get_employees()
    admin_items: List[AdminEmployeeItem] = []

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

    return AdminDashboardResponse(employees=admin_items)


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
