# Diksha Backend API (`aditya-backend`)

Backend service for the **Indian Official Statistical System Skill Intelligence Platform**.
Provides profile competency parsing, prerequisite-ordered learning roadmap generation mapped to mock iGOT Karmayogi courses, AI quiz generation, and admin dashboard monitoring.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+** (Python 3.13 tested)

### 2. Environment Setup
From the `backend/` directory:

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables Configuration
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

To enable live LLM calls, set your key in `.env`:
- `ANTHROPIC_API_KEY=your_key_here` (for Claude 3.5 Sonnet) OR
- `GEMINI_API_KEY=your_key_here` (for Gemini 2.5 Flash)

*(Note: If no API key is provided, the backend automatically uses intelligent built-in fallback parsers and quiz generators).*

### 4. Run Development Server
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 5001 --reload
```
The server will run at: **`http://localhost:5001`**
Interactive Swagger Documentation: **`http://localhost:5001/docs`**

---

## 🧪 Running Automated Tests

```bash
pytest
```

---

## 📄 Shared API Contract Reference

### 1. `POST /api/profile`
Parses an official's profile and returns inferred current competency levels.

**Request:**
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

**Response:**
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

---

### 2. `POST /api/roadmap`
Generates a prerequisite-ordered, gap-scored learning roadmap matched to mock iGOT Karmayogi courses.

**Request:**
```json
{
  "profile_id": "prof_a1b2c3d4",
  "job_role": "Statistical Investigator"
}
```

**Response:**
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
Generates multiple-choice quiz questions from pasted learning material.

**Request:**
```json
{
  "content_text": "Stratified random sampling is a method of sampling from a population which can be partitioned into subpopulations."
}
```

**Response:**
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
Retrieves employee list and skill gap metrics for the admin dashboard.

**Response:**
```json
{
  "employees": [
    {
      "profile_id": "emp-101",
      "name": "Rajesh Kumar",
      "department": "National Sample Survey Office (NSSO)",
      "avg_gap_severity": "medium",
      "top_gaps": ["Sampling Techniques", "Python for Data Analysis"]
    }
  ]
}
```
