# 🇮🇳 DIKSHA — Adaptive Skill Intelligence & Competency-Based Training Platform

> **Competency-Based Capacity Building & Personalized Learning Path Architecture for the Indian Official Statistical System (MoSPI)**

---

## 📌 Executive Summary

**DIKSHA** is an intelligent capacity building platform designed for the Ministry of Statistics and Programme Implementation (MoSPI) and government departments. It transitions civil service training from static course completion to **adaptive, outcome-focused competency mastery**.

By mapping official roles against standardized competency nodes across **Statistical**, **Technical**, **Digital Governance**, and **Managerial** domains, DIKSHA automatically identifies skill gaps, calculates prerequisite-ordered learning roadmaps, generates AI-driven multiple-choice assessments, and calculates SM-2 spaced repetition revision suggestions.

---

## 🌟 Key Features

1. **AI Official Profile Assessment (`POST /api/profile`)**:
   - Parses official designation, department, job role, experience, and prior trainings.
   - Evaluates competency levels (`none`, `basic`, `intermediate`, `advanced`) across 18 competency nodes.

2. **Topological Prerequisite Roadmap Engine (`POST /api/roadmap`)**:
   - Evaluates competency gaps between current profile and target role requirements.
   - Applies topological sorting over directed dependency graphs so prerequisite foundational skills are completed first.
   - Matches gap nodes against iGOT Karmayogi course offerings.

3. **Contextual AI Assessment Generator (`POST /api/quiz`)**:
   - Accepts learning material text or short topic keywords (e.g. *Sampling Techniques*, *Python Pandas*, *DPDP Act*, *Quantum Computing*).
   - Generates 5–8 multiple-choice questions with options, correct answer keys, and detailed explanations.

4. **Quiz Submission & Mastery Engine (`POST /api/quiz/submit`)**:
   - Logs quiz attempts to disk (`/backend/data/attempts/{profile_id}.json`).
   - Increments/decrements node mastery scores (`+15` on correct, `-10` on incorrect).
   - Dynamically updates profile competency levels.

5. **SM-2 Forgetting-Curve Spaced Repetition (`GET /api/dashboard/employee`)**:
   - Calculates memory decay based on days since last review and current mastery.
   - Surfaces top 3–5 **"What to Revise Next"** recommendations with human-readable explanations.

6. **Workforce Analytics Dashboard (`GET /api/dashboard/admin`)**:
   - Provides supervisors and capacity building managers with real-time workforce gap severity distribution, department analytics, and top training needs.

---

## 🏛️ System Architecture

```text
       ┌─────────────────────────────────────────────────────────┐
       │             Next.js 16 + Tailwind CSS UI                │
       │                 (http://localhost:3000)                 │
       └────────────────────────────┬────────────────────────────┘
                                    │  REST JSON API
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │               Python FastAPI Backend Service            │
       │                 (http://localhost:5001)                 │
       └─────┬──────────────────────┬──────────────────────┬─────┘
             │                      │                      │
             ▼                      ▼                      ▼
┌────────────────────────┐┌───────────────────┐┌───────────────────────┐
│ Topological Roadmap    ││ Mastery Engine &  ││ Google Gemini 3.6     │
│ & Dependency Graph     ││ Forgetting Curve  ││ Flash AI Service      │
└────────────────────────┘└───────────────────┘└───────────────────────┘
```

---

## 🛠️ Tech Stack

- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn, Pytest, `google-genai` SDK
- **Frontend**: Next.js 16, React 18, Tailwind CSS, Recharts, Framer Motion, Lucide Icons
- **Data Persistence**: JSON Document Storage (`backend/data/`) & Attempt Log Files (`backend/data/attempts/`)

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Start the Backend API (Port 5001)

```bash
# Clone the repository
git clone https://github.com/jomkarrr/diksha.git
cd diksha

# Activate virtual environment
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt  # or use backend/venv/bin/pip install

# Start FastAPI server on port 5001
python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 5001 --reload
```

- **Interactive API Documentation**: [http://localhost:5001/docs](http://localhost:5001/docs)
- **Health Check**: [http://localhost:5001/health](http://localhost:5001/health)

---

### 2. Start the Frontend Dashboard (Port 3000)

Open a second terminal window:

```bash
cd diksha/frontend

# Install dependencies
npm install

# Start Next.js development server on port 3000
npm run dev
```

- **Open Web Application**: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Running Automated Unit Tests

Run the backend test suite:

```bash
PYTHONPATH=backend backend/venv/bin/pytest backend/tests/test_api.py
```

Output:
```text
============================== 8 passed in 0.45s ===============================
```

---

## 📡 API Contract Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/profile` | Parse official profile & infer competency levels |
| `POST` | `/api/roadmap` | Generate prerequisite-ordered learning path |
| `POST` | `/api/quiz` | Generate 5–8 contextual MCQs from text/topic |
| `POST` | `/api/quiz/submit` | Submit quiz answers & update node mastery |
| `GET` | `/api/dashboard/employee` | Retrieve employee progress & revision suggestions |
| `GET` | `/api/dashboard/admin` | Retrieve workforce capacity analytics & gap severities |

---

## 💡 Architecture & Framing Disclosure

*Note for Hackathon Judges*: The iGOT Karmayogi course catalog data (`mock_courses.json`) and MoSPI official competency nodes are modeled based on published civil service capacity building guidelines. Since iGOT Karmayogi does not currently provide an open public API for external sandbox integrations, our system maps course IDs against competency node requirements using structured JSON specifications following official architecture standards.
