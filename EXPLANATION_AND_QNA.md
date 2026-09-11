# 📘 DIKSHA — Simple Explanation, Feature Breakdown & Comprehensive Q&A Defense Pack

> **Problem Statement ID**: SIH26101  
> **Problem Title**: AI-Enabled Competency Capacity Building Platform for India's Official Statistical System (MoSPI / Mission Karmayogi)  
> **Team Name**: Team Viksit  

---

## 💡 1. Simple Plain-English Explanation

### What IS DIKSHA?
**DIKSHA** is an **AI-powered learning and competency platform built for Indian government statistical officers** (officials working in NSSO, CSO, and the Ministry of Statistics and Programme Implementation - MoSPI).

Instead of forcing civil service officials to watch random, time-based training videos just to get a certificate:
1. **Profile Assessment**: It evaluates an officer's current skill levels across 18 competency areas (*Sampling Techniques*, *Python Data Analysis*, *Data Privacy*, *National Accounts*).
2. **Prerequisite Roadmaps**: It generates a step-by-step study path ordered logically (prerequisites first) paired with courses from **iGOT Karmayogi** (the Government of India's civil service training portal).
3. **Generative AI Quizzes**: It lets officials upload any government survey PDF or guideline to generate instant 5–8 multiple-choice practice quizzes using **Google Gemini 3.6 Flash**.
4. **Memory Decay & Spaced Repetition**: It uses an **SM-2 spaced repetition formula** to calculate retention decay and remind officers: *"You studied Survey Sampling 4 days ago, time to do a 2-minute revision before you forget!"*
5. **Supervisor Analytics**: It gives ministry directors real-time pie charts and radar graphs to see department-wide skill gaps.
6. **Hands-on MoSPI Data Practice**: It provides interactive practice workspaces with real MoSPI microdata (**PLFS, ASI, HCES, CPI, NAS**).

---

## 💻 2. Step-by-Step Software Walkthrough

| Route / Page | What It Does | Tech / Backend Connection |
| :--- | :--- | :--- |
| **`/login` & `/onboarding`** | Official MoSPI Login & First-time onboarding flow. Generates digital **MoSPI Competency Passport**. | Auth state management & employee profiles |
| **`/profile`** | Ingests official designation, department, experience, & prior training. | Calls `POST /api/profile` live via Gemini AI |
| **`/roadmap`** | Displays prerequisite-ordered learning sequence paired with iGOT Karmayogi courses. | Calls `POST /api/roadmap` live (DAG Topological Sort) |
| **`/knowledge` & `/assessments`** | Uploads survey guidelines (PDF/TXT) or enters keywords to generate 5–8 MCQs. | Calls `POST /api/quiz` & `POST /api/knowledge/upload` |
| **`/assessments/results`** | Evaluates submitted answers, calculates score %, and upgrades competency level live. | Calls `POST /api/quiz/submit` live (+15 score / -10 score) |
| **`/progress`** | Displays total learning hours logged, overall progress %, and SM-2 **"What to Revise Next"** flags. | Calls `GET /api/dashboard/employee?profile_id=...` live |
| **`/admin/analytics`** | Supervisor dashboard displaying Gap Severity Pie Chart, Competency Radar, & employee roster. | Calls `GET /api/dashboard/admin` live |
| **`/data-practice`** | Interactive practice workspace with real unit-level MoSPI survey microdata (**PLFS, ASI, HCES**). | Ingests pre-loaded datasets from `backend/data/datasets/` |

---

## 🎤 3. Comprehensive Q&A Session for Presentation Defense

### Q1: What is the core problem DIKSHA solves for MoSPI?
> **Answer**: Traditional civil service training measures *completion hours* rather than *verified competency*. Officials across NSSO and CSO have diverse background skills, but training assignments are un-personalized. DIKSHA automates competency gap identification, orders learning paths by prerequisites, generates contextual quizzes, and prevents memory decay using spaced repetition.

---

### Q2: What are the 4 competency domains tracked in the platform?
> **Answer**:
> 1. **Statistical Domain**: Survey Design, Sampling Techniques, National Accounts (GDP/GVA), Price Statistics (CPI), Labour Statistics (PLFS), SDG Indicators, Data Quality.
> 2. **Technical Domain**: Python Data Analysis, SQL Databases, Data Visualization, GIS & Spatial Analytics, AI/ML in Official Statistics.
> 3. **Digital Governance Domain**: Government Cybersecurity, Data Privacy (DPDP Act 2023), MeghRaj Cloud Infrastructure.
> 4. **Managerial / Behavioural Domain**: Communication & Reporting, Statistical Team Leadership, Project Management in Government.

---

### Q3: How does the Roadmap Ordering algorithm work?
> **Answer**: We modeled MoSPI's 18 competency nodes as a **Directed Acyclic Graph (DAG)** with prerequisite dependency edges. Our `RoadmapEngine` executes **Kahn's Topological Sorting Algorithm** ($O(V+E)$ time complexity). This guarantees that foundational prerequisite skills (e.g. *Survey Sampling*) are scheduled before advanced topics (e.g. *Python Analytics*).

---

### Q4: How does the Spaced Repetition / Memory Decay engine work?
> **Answer**: We implemented an **SM-2 spaced repetition algorithm** in `MasteryEngine`. When an officer submits a quiz, correct answers add $+15$ mastery points and incorrect answers deduct $-10$ points (bounded between 0 and 100). The decay priority is calculated as:
> $$\text{Decay Priority} = \frac{\Delta t_{\text{days}} \times 15.0}{\frac{\text{Mastery}}{25.0} + 1.0}$$
> Nodes with high decay priority scores automatically surface on the officer's dashboard under **"What to Revise Next"**.

---

### Q5: What happens if an external LLM API fails or times out during live presentation?
> **Answer**: Our `LLMService` is built with a **3-tier fallback architecture**:
> 1. **Fast-Path Demo Cache**: Sub-50ms pre-cached responses for primary presentation profiles.
> 2. **Live Gemini 3.6 API**: Live call with strict JSON schema enforcement.
> 3. **Heuristic NLP Engine**: Offline deterministic fallback parser.
> If the live API fails, the platform falls back instantly to Tier 3, keeping the application 100% operational.

---

### Q6: How does DIKSHA integrate with iGOT Karmayogi?
> **Answer**: Since iGOT Karmayogi does not currently expose an open public REST API for external hackathon sandboxes, we modeled the iGOT course catalog (`mock_courses.json` & `igot_sample.json`) based on official published civil service capacity building guidelines. Our matching engine pairs course IDs and difficulty tiers against verified competency gaps.

---

### Q7: How is user data protected under the DPDP Act 2023?
> **Answer**: PII (Personally Identifiable Information) is cryptographically pseudonymized and separated from statistical competency telemetry. Learners view only their personal profile and progress. Supervisors access aggregated department metrics without un-consented micro-data exposure.

---

### Q8: What database architecture are you using?
> **Answer**: For the hackathon MVP, we used an **In-Memory Document Store with JSON File Persistence** (`backend/data/`). This delivered sub-millisecond execution with zero external database installation dependency. The JSON document schemas map 1-to-1 to a production **MongoDB** or **PostgreSQL 16 JSONB** database cluster.

---

### Q9: What real MoSPI microdata datasets have been integrated into the workspace?
> **Answer**: We integrated 10 official microdata samples: **PLFS** (Periodic Labour Force Survey), **ASI** (Annual Survey of Industries), **HCES** (Household Consumption Expenditure Survey), **CPI** (Consumer Price Index), **IIP** (Index of Industrial Production), **NAS** (National Accounts Statistics), **ASUSE**, **NSSTA**, **NADA Catalog**, and **iGOT Registry**.

---

### Q10: How would you deploy this in production on Government Cloud?
> **Answer**: In production, DIKSHA deploys on **MeghRaj Cloud Infrastructure** (NIC Kubernetes cluster) behind an **NGINX / Kong API Gateway** with **e-Pramaan Single Sign-On**. Database layer: **PostgreSQL 16** (`pgvector` for embedding search) + **Redis Enterprise** cache cluster. LLM inference runs on self-hosted NIC GPU clusters to guarantee zero government data leakage.
