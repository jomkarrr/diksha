# 📊 DIKSHA — PowerPoint Presentation Slide-by-Slide Content Guide

> **Problem Statement ID**: SIH26101  
> **Problem Title**: Develop an AI-enabled learning platform for India's Official Statistical System (MoSPI / Mission Karmayogi)  
> **Team Name**: Team Viksit  

---

## Slide 1: Title & Problem Statement Overview

### Slide Header & Subtitle
- **Title**: **DIKSHA — AI-Powered Competency Capacity Building Platform**
- **Subtitle**: *Strengthening Capability in India’s Official Statistical System (MoSPI & Mission Karmayogi)*
- **Problem Statement ID**: SIH26101
- **Theme**: Smart Education | **Category**: Software
- **Team**: Team Viksit

### Key Bullet Points to Include on Slide 1
- **Target Ministry**: Ministry of Statistics & Programme Implementation (MoSPI), Government of India.
- **Institutional Context**: Capacity building for official statistical cadres (NSSO, CSO, NSSTA).
- **Core Mission**: Transitioning civil service training from *static classroom/video hours* to **verified, outcome-based competency mastery**.

---

## Slide 2: Proposed Solution & 6 Core Pillars

### Slide Header
- **Header**: **Proposed Solution Architecture — DIKSHA**

### The 6 Core System Pillars
1. **AI-Based Competency Profiling**: Ingests designation, experience, and education to map official skill levels across 18 competency nodes.
2. **Topological Competency Gap Detection**: Compares current profile vs target role requirements across 4 domains (*Statistical*, *Technical*, *Digital Governance*, *Managerial*).
3. **Prerequisite-Ordered Learning Roadmaps**: Uses Directed Acyclic Graph (DAG) topological sorting so foundational prerequisites (*Survey Sampling*) appear before advanced topics (*Python Analytics*).
4. **iGOT Karmayogi & NSSTA Integration**: Seamlessly maps competency gaps against iGOT learning modules and NSSTA statistical courses.
5. **Generative Contextual AI Assessments**: Generates 5–8 dynamic MCQs with explanations from uploaded survey guidelines, PDFs, or topic keywords using Google Gemini 3.6 Flash.
6. **SM-2 Spaced Repetition Memory Decay Engine**: Calculates retention curves to surface personalized *"What to Revise Next"* recommendations on the official's dashboard.

### Bonus Highlights (Newly Integrated)
- **MoSPI Microdata Practice Workspace**: Hands-on practice modules with real unit-level MoSPI datasets (**PLFS, ASI, HCES, CPI, NAS**).
- **MoSPI Competency Passport**: Single Digital Identity tracking verified skill acquisitions across an official's career.

---

## Slide 3: Technical Approach & Algorithms

### Slide Header
- **Header**: **Technical Architecture & Algorithmic Design**

### System Architecture Highlights
- **Backend Service**: Python 3.13 + FastAPI + Pydantic v2 data contracts ($<30\text{ ms}$ execution).
- **Frontend Presentation**: Next.js 16 App Router + Tailwind CSS + Recharts + Framer Motion.
- **AI Orchestration**: Google Gemini 3.6 Flash + Structured JSON Enforcement + Sub-50ms Fast Cache + Heuristic NLP Fallback.
- **Persistence Layer**: In-Memory Document Store + JSON File System (`backend/data/`).

### Algorithmic Innovations
- **DAG Topological Sorting (Kahn's Algorithm)**: Sequences learning modules based on strict dependency edges ($O(V+E)$ time complexity).
- **SM-2 Spaced Repetition Memory Decay**: Computes retention priority:
  $$\text{Decay Priority} = \frac{\Delta t_{\text{days}} \times 15.0}{\frac{\text{Mastery}}{25.0} + 1.0}$$
- **Real Microdata Integration**: Pre-loaded with official datasets (**PLFS**, **ASI**, **HCES**, **CPI**, **IIP**, **NAS**, **NSSTA**).

---

## Slide 4: Feasibility & Viability

### Slide Header
- **Header**: **Feasibility, Viability & Government Cloud Readiness**

### 1. Technical & Operational Feasibility
- **Cloud Ready**: Designed for deployment on NIC **MeghRaj Cloud Infrastructure**.
- **SSO Integration**: Pre-architected for **e-Pramaan** (Government Single Sign-On).
- **Incremental Rollout**: Can be deployed in phases starting with pilot divisions (e.g. NSSO Field Division).

### 2. Legal & Cyber Security Compliance
- **DPDP Act 2023 Compliance**: Cryptographic separation of PII from competency telemetry.
- **Role-Based Access Control (RBAC)**: Learner-level privacy vs aggregated supervisor analytics.
- **Zero Data Leakage**: In production, LLMs run on self-hosted NIC GPU infrastructure.

### 3. Economic & Social Viability
- **Cost Efficient**: Replaces expensive recurring manual assessment overhead.
- **High ROI**: Single platform serves all statistical cadres across ministries.
- **Continuous Capability**: Improves data collection precision and national statistical output quality.

---

## Slide 5: Impact & System-Level Benefits

### Slide Header
- **Header**: **Multi-Level Impact on India's Statistical Ecosystem**

### Impact Matrix
- **For Official Learners**:
  - Personalized upskilling targeted strictly at real competency gaps.
  - Active retention tracking via SM-2 spaced repetition.
  - Portable **MoSPI Competency Passport** for career progression.

- **For Administrators & Supervisors**:
  - Real-time departmental gap analytics (Gap Severity Pie Chart & Competency Radar).
  - Reduced administrative overhead and automated intervention alerts.

- **For System-Level MoSPI Infrastructure**:
  - Higher precision in primary data collection (PLFS, HCES, ASI).
  - Evidence-based policy decision support for national accounts and economic planning.

---

## Slide 6: MoSPI Real Datasets, Research & References

### Slide Header
- **Header**: **Datasets, Frameworks & Official References**

### Primary Data Sources & References Integrated
1. **MoSPI Official Portals**: [`mospi.gov.in`](https://www.mospi.gov.in/) — Official source for national statistical programmes and indicators.
2. **MoSPI NADA Microdata Portal**: [`microdata.gov.in`](https://microdata.gov.in/NADA/index.php/catalog) — Microdata foundation for unit-level survey datasets (PLFS, ASI, HCES, ASUSE).
3. **iGOT Karmayogi Ecosystem**: [`igotkarmayogi.gov.in`](https://www.igotkarmayogi.gov.in/) — National civil service digital learning platform.
4. **National Accounts Statistics (NAS)**: Official GDP, GVA, and sectoral output frameworks.
5. **NSSTA (National Statistical Systems Training Academy)**: Standardized training curricula for Indian Statistical Service (ISS) & SSS cadres.
