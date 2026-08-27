import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_create_profile():
    payload = {
        "designation": "Statistical Investigator Grade II",
        "department": "National Sample Survey Office (NSSO)",
        "job_role": "Statistical Investigator",
        "experience_years": 4,
        "education": "M.Sc. Statistics",
        "prior_trainings": ["Survey Sampling Methods", "Basic Python"]
    }
    response = client.post("/api/profile", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "profile_id" in data
    assert len(data["competencies"]) > 0
    assert "node_id" in data["competencies"][0]
    assert "current_level" in data["competencies"][0]

def test_generate_roadmap():
    # First create profile
    prof_payload = {
        "designation": "Junior Officer",
        "department": "Field Operations",
        "job_role": "Statistical Investigator",
        "experience_years": 1,
        "education": "B.Sc. Mathematics",
        "prior_trainings": []
    }
    prof_res = client.post("/api/profile", json=prof_payload).json()
    profile_id = prof_res["profile_id"]

    # Now generate roadmap
    roadmap_payload = {
        "profile_id": profile_id,
        "job_role": "Statistical Investigator"
    }
    response = client.post("/api/roadmap", json=roadmap_payload)
    assert response.status_code == 200
    data = response.json()
    assert "roadmap" in data
    assert isinstance(data["roadmap"], list)
    if len(data["roadmap"]) > 0:
        first_node = data["roadmap"][0]
        assert "node_id" in first_node
        assert "domain" in first_node
        assert "gap_severity" in first_node
        assert "matched_courses" in first_node

def test_generate_quiz():
    payload = {
        "content_text": "Stratified random sampling is a method of sampling from a population which can be partitioned into subpopulations."
    }
    response = client.post("/api/quiz", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "questions" in data
    assert len(data["questions"]) > 0
    question = data["questions"][0]
    assert "question" in question
    assert "options" in question
    assert len(question["options"]) == 4
    assert "correct_index" in question
    assert "explanation" in question

def test_get_admin_dashboard():
    response = client.get("/api/dashboard/admin")
    assert response.status_code == 200
    data = response.json()
    assert "employees" in data
    assert len(data["employees"]) > 0
    emp = data["employees"][0]
    assert "profile_id" in emp
    assert "avg_gap_severity" in emp
    assert "top_gaps" in emp
