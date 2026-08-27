# 🤝 Frontend Handoff & API Contract Guide (For Omkar)

Welcome Omkar! This document contains everything you need to build the frontend dashboard in parallel without any integration or merge conflicts.

---

## 📌 Architecture & Monorepo Rules

1. **Repository Structure**:
   - Create all frontend code in a top-level directory called `/frontend` (e.g., Next.js / React app inside `/frontend`).
   - The backend lives in `/backend`.
   - Keeping code in `/frontend` guarantees **zero merge conflicts** when merging your branch with `aditya-backend`.

2. **Ports & Local Dev**:
   - Backend runs on: `http://localhost:5001`
   - Frontend runs on: `http://localhost:3000`
   - Configure Next.js rewrites/proxy or call `http://localhost:5001/api/*` directly.

---

## 🏷️ Shared Vocabulary: Node IDs & Domains

Use these exact `node_id` strings in your mock data or UI state so nothing needs relabeling at integration time:

### Statistical Domain (`statistical`)
- `stat-survey-design-101` — Survey Design & Methodology
- `stat-sampling-101` — Sampling Techniques
- `stat-national-accounts-101` — National Accounts & GDP Estimation
- `stat-price-stats-101` — Price Statistics & Index Numbers
- `stat-labour-stats-101` — Labour & Employment Statistics
- `stat-sdg-indicators-101` — SDG Indicators & Monitoring
- `stat-data-quality-101` — Data Quality Frameworks

### Technical Domain (`technical`)
- `tech-python-101` — Python for Data Analysis
- `tech-sql-101` — SQL & Relational Databases
- `tech-data-vis-101` — Data Visualization & Dashboards
- `tech-gis-101` — GIS & Spatial Analytics
- `tech-ai-ml-101` — AI/ML in Official Statistics

### Digital Governance Domain (`digital_governance`)
- `gov-cybersecurity-101` — Government Cybersecurity Fundamentals
- `gov-data-privacy-101` — Data Privacy & Governance (DPDP Act)
- `gov-cloud-101` — MeghRaj & Government Cloud Infrastructure

### Behavioural / Managerial Domain (`behavioural`)
- `mgr-communication-101` — Effective Communication & Reporting
- `mgr-leadership-101` — Statistical Team Leadership
- `mgr-project-mgmt-101` — Project Management in Government

---

## 🔌 API Endpoints & Contract Reference

All endpoints accept and return `application/json`.

### 1. `POST /api/profile`
Takes official profile details and returns inferred current competency levels.

**Endpoint URL**: `http://localhost:5001/api/profile`

**Request Payload:**
```json
{
  "designation": "Statistical Investigator Grade II",
  "department": "National Sample Survey Office (NSSO)",
  "job_role": "Statistical Investigator",
  "experience_years": 4,
  "education": "M.Sc. Statistics",
  "prior_trainings": ["Survey Sampling Methods", "Basic Python"]
}
```

**Response Payload:**
```json
{
  "profile_id": "prof_a1b2c3d4",
  "competencies": [
    { "node_id": "stat-survey-design-101", "current_level": "intermediate" },
    { "node_id": "stat-sampling-101", "current_level": "basic" },
    { "node_id": "tech-python-101", "current_level": "basic" },
    { "node_id": "gov-cybersecurity-101", "current_level": "basic" }
  ]
}
```
*Level values can be*: `"none"`, `"basic"`, `"intermediate"`, `"advanced"`.

---

### 2. `POST /api/roadmap`
Generates a prerequisite-ordered, gap-scored roadmap with matched iGOT Karmayogi courses.

**Endpoint URL**: `http://localhost:5001/api/roadmap`

**Request Payload:**
```json
{
  "profile_id": "prof_a1b2c3d4",
  "job_role": "Statistical Investigator"
}
```

**Response Payload:**
```json
{
  "roadmap": [
    {
      "node_id": "stat-sampling-101",
      "name": "Sampling Techniques",
      "domain": "statistical",
      "current_level": "basic",
      "required_level": "intermediate",
      "gap_severity": "medium",
      "matched_courses": [
        {
          "course_id": "igot-stat-104",
          "title": "Complex Sampling & Variance Estimation in Official Surveys",
          "duration_hours": 16
        }
      ]
    },
    {
      "node_id": "tech-python-101",
      "name": "Python for Data Analysis",
      "domain": "technical",
      "current_level": "basic",
      "required_level": "intermediate",
      "gap_severity": "medium",
      "matched_courses": [
        {
          "course_id": "igot-tech-202",
          "title": "Data Wrangling with Pandas & NumPy",
          "duration_hours": 15
        }
      ]
    }
  ]
}
```
*`domain` values*: `"statistical"`, `"technical"`, `"digital_governance"`, `"behavioural"`  
*`gap_severity` values*: `"low"`, `"medium"`, `"high"`  
*Order of items in `roadmap` array = Recommended learning sequence (pre-sorted by prerequisites).*

---

### 3. `POST /api/quiz`
Generates 3 multiple-choice questions from pasted learning text.

**Endpoint URL**: `http://localhost:5001/api/quiz`

**Request Payload:**
```json
{
  "content_text": "Stratified random sampling is a method of sampling from a population which can be partitioned into subpopulations."
}
```

**Response Payload:**
```json
{
  "questions": [
    {
      "question": "Which principle is essential when conducting stratified sampling?",
      "options": [
        "Partitioning population into non-overlapping homogeneous strata",
        "Selecting samples without replacement only",
        "Ignoring stratum sample variance",
        "Randomizing survey interview dates"
      ],
      "correct_index": 0,
      "explanation": "Stratified sampling requires dividing the population into mutually exclusive subpopulations (strata)."
    }
  ]
}
```

---

### 4. `GET /api/dashboard/admin`
Retrieves employee overview for the administrator monitoring dashboard.

**Endpoint URL**: `http://localhost:5001/api/dashboard/admin`

**Response Payload:**
```json
{
  "employees": [
    {
      "profile_id": "emp-101",
      "name": "Rajesh Kumar",
      "department": "National Sample Survey Office (NSSO)",
      "avg_gap_severity": "medium",
      "top_gaps": ["Sampling Techniques", "Python for Data Analysis"]
    },
    {
      "profile_id": "emp-102",
      "name": "Priya Sharma",
      "department": "Central Statistics Office (CSO)",
      "avg_gap_severity": "high",
      "top_gaps": ["National Accounts & GDP Estimation", "AI/ML in Official Statistics"]
    }
  ]
}
```

---

## 💻 Sample React / Next.js API Integration Code

Here is a ready-to-use fetch helper for your React components:

```typescript
const API_BASE_URL = 'http://localhost:5001/api';

export async function submitProfile(profileData: {
  designation: string;
  department: string;
  job_role: string;
  experience_years: number;
  education: string;
  prior_trainings: string[];
}) {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  return res.json();
}

export async function fetchRoadmap(profileId: string, jobRole: string) {
  const res = await fetch(`${API_BASE_URL}/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile_id: profileId, job_role: jobRole }),
  });
  return res.json();
}
```

---

## ⚡ How to Run Backend locally for UI testing

1. Open a terminal and navigate to the project directory:
   ```bash
   cd diksha
   ```
2. Activate virtual environment and start backend server:
   ```bash
   source backend/venv/bin/activate
   python -m uvicorn app.main:app --host 0.0.0.0 --port 5001 --reload
   ```
3. Test endpoints interactively at `http://localhost:5001/docs`.
