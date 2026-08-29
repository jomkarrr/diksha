from typing import List, Literal, Optional
from pydantic import BaseModel, Field

# Common Literals
CompetencyLevel = Literal["none", "basic", "intermediate", "advanced"]
RequiredLevel = Literal["basic", "intermediate", "advanced"]
DomainType = Literal["statistical", "technical", "digital_governance", "behavioural"]
GapSeverity = Literal["low", "medium", "high"]

# --- Profile Endpoints ---
class ProfileRequest(BaseModel):
    designation: str = Field(..., json_schema_extra={"example": "Statistical Investigator"})
    department: str = Field(..., json_schema_extra={"example": "National Sample Survey Office"})
    job_role: str = Field(..., json_schema_extra={"example": "Statistical Investigator"})
    experience_years: float = Field(..., json_schema_extra={"example": 4})
    education: str = Field(..., json_schema_extra={"example": "M.Sc. Statistics"})
    prior_trainings: List[str] = Field(default_factory=list, json_schema_extra={"example": ["Basic Python", "Survey Sampling"]})

class CompetencyItem(BaseModel):
    node_id: str
    current_level: CompetencyLevel

class ProfileResponse(BaseModel):
    profile_id: str
    competencies: List[CompetencyItem]


# --- Roadmap Endpoints ---
class RoadmapRequest(BaseModel):
    profile_id: str = Field(..., json_schema_extra={"example": "prof_12345"})
    job_role: str = Field(..., json_schema_extra={"example": "Statistical Investigator"})

class MatchedCourse(BaseModel):
    course_id: str
    title: str
    duration_hours: float

class RoadmapNode(BaseModel):
    node_id: str
    name: str
    domain: DomainType
    current_level: CompetencyLevel
    required_level: RequiredLevel
    gap_severity: GapSeverity
    matched_courses: List[MatchedCourse]

class RoadmapResponse(BaseModel):
    roadmap: List[RoadmapNode]


# --- Quiz Endpoints ---
class QuizRequest(BaseModel):
    content_text: str = Field(..., json_schema_extra={"example": "Sampling error decreases as sample size increases in simple random sampling."})

class QuizQuestion(BaseModel):
    node_id: str = Field(default="stat-sampling-101", json_schema_extra={"example": "stat-sampling-101"})
    question: str
    options: List[str]
    correct_index: int
    explanation: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

# --- Quiz Submission & Mastery Endpoints ---
class QuizAnswerItem(BaseModel):
    node_id: str
    is_correct: bool

class QuizSubmitRequest(BaseModel):
    profile_id: str = Field(..., json_schema_extra={"example": "prof_12345"})
    answers: List[QuizAnswerItem]

class MasteryUpdateItem(BaseModel):
    node_id: str
    mastery: float
    current_level: CompetencyLevel
    last_reviewed: str

class QuizSubmitResponse(BaseModel):
    profile_id: str
    mastery_updates: List[MasteryUpdateItem]


# --- Employee Dashboard Endpoints ---
class CompetencySummaryItem(BaseModel):
    node_id: str
    name: str
    mastery: float
    last_reviewed: str

class RevisionSuggestion(BaseModel):
    node_id: str
    name: str
    reason: str

class EmployeeDashboardResponse(BaseModel):
    profile_id: str
    competency_summary: List[CompetencySummaryItem]
    learning_hours_logged: float
    overall_progress_pct: float
    revision_suggestions: List[RevisionSuggestion]


# --- Dashboard Admin Endpoints ---
class AdminEmployeeItem(BaseModel):
    profile_id: str
    name: str
    department: str
    avg_gap_severity: GapSeverity
    top_gaps: List[str]

class AdminDashboardResponse(BaseModel):
    employees: List[AdminEmployeeItem]
