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

def test_generate_quiz_varied_inputs():
    # Technical dense text
    tech_text = "Stratified random sampling is a method of sampling from a population which can be partitioned into subpopulations."
    res1 = client.post("/api/quiz", json={"content_text": tech_text})
    assert res1.status_code == 200
    q1 = res1.json()["questions"]
    assert 5 <= len(q1) <= 8

    # Bulleted list text
    bullet_text = """
    - Apply end-to-end data encryption for survey micro-data.
    - Restrict access strictly using role-based access control.
    - Conduct regular security audits under DPDP Act guidelines.
    - Obtain explicit data principal consent prior to processing.
    """
    res2 = client.post("/api/quiz", json={"content_text": bullet_text})
    assert res2.status_code == 200
    q2 = res2.json()["questions"]
    assert 5 <= len(q2) <= 8

    # Verify MCQ item structure
    first_q = q1[0]
    assert "question" in first_q
    assert len(first_q["options"]) == 4
    assert 0 <= first_q["correct_index"] <= 3
    assert "explanation" in first_q

def test_get_admin_dashboard_dynamic():
    response = client.get("/api/dashboard/admin")
    assert response.status_code == 200
    data = response.json()
    assert "employees" in data
    assert len(data["employees"]) == 6
    emp = data["employees"][0]
    assert "profile_id" in emp
    assert emp["avg_gap_severity"] in ["low", "medium", "high"]
    assert len(emp["top_gaps"]) > 0

def test_roadmap_edge_cases():
    # 1. Sparse Profile (< 1 year experience, no training)
    sparse_prof = client.post("/api/profile", json={
        "designation": "Trainee",
        "department": "Field Division",
        "job_role": "Statistical Investigator",
        "experience_years": 0.2,
        "education": "B.A. General",
        "prior_trainings": []
    }).json()
    res_sparse = client.post("/api/roadmap", json={"profile_id": sparse_prof["profile_id"], "job_role": "Statistical Investigator"})
    assert res_sparse.status_code == 200
    assert len(res_sparse.json()["roadmap"]) > 0

    # 2. Senior Official Profile (10+ years experience, extensive trainings)
    senior_prof = client.post("/api/profile", json={
        "designation": "Director General",
        "department": "National Sample Survey Office",
        "job_role": "Director / Senior Statistical Officer",
        "experience_years": 12.0,
        "education": "Ph.D. Statistics",
        "prior_trainings": ["National Accounts", "Sampling Techniques", "Leadership", "Data Privacy", "Project Management"]
    }).json()
    res_senior = client.post("/api/roadmap", json={"profile_id": senior_prof["profile_id"], "job_role": "Director / Senior Statistical Officer"})
    assert res_senior.status_code == 200

    # 3. Unknown / Unmapped Job Role (fallback mechanism)
    res_unknown = client.post("/api/roadmap", json={"profile_id": sparse_prof["profile_id"], "job_role": "Unknown Special Consultant"})
    assert res_unknown.status_code == 200
    assert isinstance(res_unknown.json()["roadmap"], list)
