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
    }
  ]
}
```

---

### 3. `POST /api/quiz`
Generates 5 to 8 multiple-choice questions from pasted learning material text, tagged with `node_id`.

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
      "node_id": "stat-sampling-101",
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

### 4. `POST /api/quiz/submit` (NEW for Day 3)
Submits user quiz answers, persists attempt history, updates node mastery scores, and updates official competency levels!

**Endpoint URL**: `http://localhost:5001/api/quiz/submit`

**Request Payload:**
```json
{
  "profile_id": "prof_a1b2c3d4",
  "answers": [
    { "node_id": "stat-sampling-101", "is_correct": true },
    { "node_id": "tech-python-101", "is_correct": false }
  ]
}
```

**Response Payload:**
```json
{
  "profile_id": "prof_a1b2c3d4",
  "mastery_updates": [
    {
      "node_id": "stat-sampling-101",
      "mastery": 75.0,
      "current_level": "intermediate",
      "last_reviewed": "2026-08-29T21:00:00Z"
    },
    {
      "node_id": "tech-python-101",
      "mastery": 30.0,
      "current_level": "basic",
      "last_reviewed": "2026-08-29T21:00:00Z"
    }
  ]
}
```

---

### 5. `GET /api/dashboard/employee` (NEW for Day 3)
Retrieves adaptive learning progress, mastery per competency node, total learning hours logged, overall progress percentage, and SM-2 spaced repetition **"What to Revise Next"** suggestions!

**Endpoint URL**: `http://localhost:5001/api/dashboard/employee?profile_id=prof_a1b2c3d4`

**Response Payload:**
```json
{
  "profile_id": "prof_a1b2c3d4",
  "competency_summary": [
    {
      "node_id": "stat-sampling-101",
      "name": "Sampling Techniques",
      "mastery": 75.0,
      "last_reviewed": "2026-08-29T21:00:00Z"
    },
    {
      "node_id": "tech-python-101",
      "name": "Python for Data Analysis",
      "mastery": 30.0,
      "last_reviewed": "2026-08-29T21:00:00Z"
    }
  ],
  "learning_hours_logged": 14.5,
  "overall_progress_pct": 68.0,
  "revision_suggestions": [
    {
      "node_id": "tech-python-101",
      "name": "Python for Data Analysis",
      "reason": "Shaky foundation (mastery 30%), review recommended"
    },
    {
      "node_id": "stat-sampling-101",
      "name": "Sampling Techniques",
      "reason": "Not reviewed in 4 days, moderate mastery (75%)"
    }
  ]
}
```

---

### 6. `GET /api/dashboard/admin`
Retrieves employee overview for the administrator monitoring dashboard.

**Endpoint URL**: `http://localhost:5001/api/dashboard/admin`

---

## 💻 Sample React API Integration Code (Updated for Day 3)

```typescript
const API_BASE_URL = 'http://localhost:5001/api';

export async function submitQuizAnswers(profileId: string, answers: Array<{ node_id: string; is_correct: boolean }>) {
  const res = await fetch(`${API_BASE_URL}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile_id: profileId, answers }),
  });
  return res.json();
}

export async function fetchEmployeeDashboard(profileId: string) {
  const res = await fetch(`${API_BASE_URL}/dashboard/employee?profile_id=${encodeURIComponent(profileId)}`);
  return res.json();
}
```
