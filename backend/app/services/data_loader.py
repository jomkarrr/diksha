import json
from pathlib import Path
from typing import Dict, List, Any, Optional

DATA_DIR = Path(__file__).parent.parent.parent / "data"

class DataLoader:
    _nodes: List[Dict[str, Any]] = []
    _courses: List[Dict[str, Any]] = []
    _job_reqs: Dict[str, List[Dict[str, Any]]] = {}
    _employees: List[Dict[str, Any]] = []
    _profiles_cache: Dict[str, Any] = {}

    @classmethod
    def load_all(cls):
        nodes_path = DATA_DIR / "competency_nodes.json"
        if nodes_path.exists():
            with open(nodes_path, "r", encoding="utf-8") as f:
                cls._nodes = json.load(f)

        courses_path = DATA_DIR / "mock_courses.json"
        if courses_path.exists():
            with open(courses_path, "r", encoding="utf-8") as f:
                cls._courses = json.load(f)

        job_reqs_path = DATA_DIR / "job_requirements.json"
        if job_reqs_path.exists():
            with open(job_reqs_path, "r", encoding="utf-8") as f:
                cls._job_reqs = json.load(f)

        employees_path = DATA_DIR / "mock_employees.json"
        if employees_path.exists():
            with open(employees_path, "r", encoding="utf-8") as f:
                cls._employees = json.load(f)

    @classmethod
    def get_nodes(cls) -> List[Dict[str, Any]]:
        if not cls._nodes:
            cls.load_all()
        return cls._nodes

    @classmethod
    def get_courses(cls) -> List[Dict[str, Any]]:
        if not cls._courses:
            cls.load_all()
        return cls._courses

    @classmethod
    def get_job_requirements(cls, job_role: str) -> List[Dict[str, Any]]:
        if not cls._job_reqs:
            cls.load_all()
        # Case insensitive key match or return default
        for key in cls._job_reqs:
            if key.lower() == job_role.lower():
                return cls._job_reqs[key]
        return cls._job_reqs.get("default", [])

    @classmethod
    def get_employees(cls) -> List[Dict[str, Any]]:
        if not cls._employees:
            cls.load_all()
        return cls._employees

    @classmethod
    def get_employee_by_id(cls, profile_id: str) -> Optional[Dict[str, Any]]:
        for emp in cls.get_employees():
            if emp.get("profile_id", "").lower() == profile_id.lower():
                return emp
        return None

    @classmethod
    def save_profile(cls, profile_id: str, profile_data: Dict[str, Any]):
        cls._profiles_cache[profile_id] = profile_data

    @classmethod
    def get_profile(cls, profile_id: str) -> Optional[Dict[str, Any]]:
        if profile_id in cls._profiles_cache:
            return cls._profiles_cache[profile_id]

        emp = cls.get_employee_by_id(profile_id)
        if not emp and profile_id == "prof_demo":
            emp = cls.get_employee_by_id("emp-101")

        if emp:
            from app.schemas.contracts import ProfileRequest
            from app.services.llm_service import LLMService
            req = ProfileRequest(
                designation=emp.get("designation", "Officer"),
                department=emp.get("department", "Statistics"),
                job_role=emp.get("job_role", "Statistical Investigator"),
                experience_years=float(emp.get("experience_years", 2.0)),
                education=emp.get("education", "Bachelor"),
                prior_trainings=emp.get("prior_trainings", [])
            )
            raw_comps = LLMService.parse_profile(req)
            competencies = [{"node_id": c["node_id"], "current_level": c["current_level"]} for c in raw_comps]
            profile_data = {
                "profile_id": emp["profile_id"],
                "name": emp["name"],
                "designation": emp["designation"],
                "department": emp["department"],
                "job_role": emp["job_role"],
                "experience_years": emp.get("experience_years", 2.0),
                "education": emp.get("education", "Bachelor"),
                "prior_trainings": emp.get("prior_trainings", []),
                "competencies": competencies
            }
            cls._profiles_cache[emp["profile_id"]] = profile_data
            cls._profiles_cache[profile_id] = profile_data
            return profile_data

        return None

    @classmethod
    def get_practice_dataset(cls, domain: str) -> Optional[Dict[str, Any]]:
        valid_domains = {
            "plfs": "plfs_sample.json",
            "asi": "asi_sample.json",
            "cpi": "cpi_sample.json",
            "iip": "iip_sample.json",
            "hces": "hces_sample.json",
            "asuse": "asuse_sample.json",
            "nas": "nas_sample.json",
            "nada": "nada_sample.json",
            "nssta": "nssta_sample.json",
            "igot": "igot_sample.json"
        }
        filename = valid_domains.get(domain.lower().strip())
        if not filename:
            return None

        file_path = DATA_DIR / "datasets" / filename
        if not file_path.exists():
            return None

        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
