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
    tech_text = "Stratified random sampling is a method of sampling from a population which can be partitioned into subpopulations."
    res1 = client.post("/api/quiz", json={"content_text": tech_text})
    assert res1.status_code == 200
    q1 = res1.json()["questions"]
    assert len(q1) >= 3

    first_q = q1[0]
    assert "question" in first_q
    assert len(first_q["options"]) == 4
    assert 0 <= first_q["correct_index"] <= 3
    assert "explanation" in first_q

def test_generate_quiz_by_node_id():
    response = client.post("/api/quiz", json={"node_id": "stat-sampling-101"})
    assert response.status_code == 200
    data = response.json()
    assert "questions" in data
    assert len(data["questions"]) > 0
    assert data["node_id"] == "stat-sampling-101"
    assert "subtopics_tested" in data
    assert len(data["subtopics_tested"]) > 0

    first_q = data["questions"][0]
    assert "subtopic" in first_q
    assert first_q["node_id"] == "stat-sampling-101"

def test_quiz_submit_and_mastery_update():
    prof_res = client.post("/api/profile", json={
        "designation": "Field Assistant",
        "department": "NSSO",
        "job_role": "Statistical Investigator",
        "experience_years": 1,
        "education": "Bachelor",
        "prior_trainings": []
    }).json()
    profile_id = prof_res["profile_id"]

    submit_payload = {
        "profile_id": profile_id,
        "answers": [
            {"node_id": "stat-sampling-101", "is_correct": True},
            {"node_id": "tech-python-101", "is_correct": False}
        ]
    }
    response = client.post("/api/quiz/submit", json=submit_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["profile_id"] == profile_id
    assert len(data["mastery_updates"]) == 2
    assert "objective_coverage_pct" in data
    assert data["objective_coverage_pct"] is not None
    assert "feedback" in data
    assert len(data["covered_subtopics"]) > 0 or len(data["missed_subtopics"]) > 0

    stat_node = next(item for item in data["mastery_updates"] if item["node_id"] == "stat-sampling-101")
    assert stat_node["mastery"] > 10.0
    assert "current_level" in stat_node
    assert "last_reviewed" in stat_node

def test_get_employee_dashboard():
    response = client.get("/api/dashboard/employee?profile_id=prof_test123")
    assert response.status_code == 200
    data = response.json()
    assert data["profile_id"] == "prof_test123"
    assert len(data["competency_summary"]) > 0
    assert "learning_hours_logged" in data
    assert "overall_progress_pct" in data
    assert "readiness_score" in data
    assert "target_role_coverage" in data
    assert "active_courses" in data
    assert len(data["active_courses"]) > 0
    assert "progress_pct" in data["active_courses"][0]
    assert len(data["revision_suggestions"]) > 0
    assert "reason" in data["revision_suggestions"][0]

def test_get_admin_dashboard_dynamic():
    response = client.get("/api/dashboard/admin")
    assert response.status_code == 200
    data = response.json()
    assert "employees" in data
    assert len(data["employees"]) == 6
    assert "organizational_gaps" in data
    assert len(data["organizational_gaps"]) > 0
    assert "progress" in data["organizational_gaps"][0]
    emp = data["employees"][0]
    assert "profile_id" in emp
    assert emp["avg_gap_severity"] in ["low", "medium", "high"]
    assert len(emp["top_gaps"]) > 0

def test_roadmap_edge_cases():
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

def test_knowledge_upload_and_list():
    # 1. Test uploading a valid text document
    test_content = b"Official NSSTA Sample Survey Scrutiny Manual 2026."
    response = client.post(
        "/api/knowledge/upload",
        files={"file": ("Sample_Survey_Scrutiny.txt", test_content, "text/plain")}
    )
    assert response.status_code == 200
    doc_data = response.json()
    assert "document_id" in doc_data
    assert doc_data["filename"] == "Sample_Survey_Scrutiny.txt"
    assert doc_data["file_type"] == "TXT"
    assert doc_data["size_bytes"] == len(test_content)
    assert doc_data["status"] == "ready"

    # 2. Test listing documents
    list_res = client.get("/api/knowledge/documents")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert "documents" in list_data
    doc_ids = [d["document_id"] for d in list_data["documents"]]
    assert doc_data["document_id"] in doc_ids

def test_knowledge_upload_validation():
    # 1. Unsupported extension
    res_unsupported = client.post(
        "/api/knowledge/upload",
        files={"file": ("malicious_script.exe", b"binary content", "application/octet-stream")}
    )
    assert res_unsupported.status_code == 400
    assert "Unsupported file extension" in res_unsupported.json()["detail"]

    # 2. Empty file
    res_empty = client.post(
        "/api/knowledge/upload",
        files={"file": ("empty_notes.txt", b"", "text/plain")}
    )
    assert res_empty.status_code == 400
    assert "empty" in res_empty.json()["detail"]

