import uuid
from fastapi import APIRouter, HTTPException, status
from app.schemas.contracts import (
    ProfileRequest, ProfileResponse, CompetencyItem,
    RoadmapRequest, RoadmapResponse,
    QuizRequest, QuizResponse,
    AdminDashboardResponse, AdminEmployeeItem
)
from app.services.data_loader import DataLoader
from app.services.llm_service import LLMService
from app.services.roadmap_engine import RoadmapEngine

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
        # Parse default dummy profile
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
    Generate multiple-choice questions from provided learning material text.
    """
    if not payload.content_text.strip():
        raise HTTPException(status_code=400, detail="content_text cannot be empty")

    questions = LLMService.generate_quiz(payload.content_text)
    return QuizResponse(questions=questions)


@router.get("/dashboard/admin", response_model=AdminDashboardResponse, status_code=status.HTTP_200_OK)

def get_admin_dashboard():
    """
    GET /api/dashboard/admin
    Retrieve overview of employee skill gaps for admin dashboard monitoring.
    """
    employees = DataLoader.get_employees()
    formatted = [AdminEmployeeItem(**emp) for emp in employees]
    return AdminDashboardResponse(employees=formatted)
