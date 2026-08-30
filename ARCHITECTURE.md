# 🏛️ DIKSHA — System Architecture & Production Deployment Specification

> **Official Capacity Building & Adaptive Competency Intelligence Platform**  
> **Target Ministry**: Ministry of Statistics and Programme Implementation (MoSPI) / iGOT Karmayogi  

---

## 📋 Table of Contents
1. [System Overview & Architectural Vision](#1-system-overview--architectural-vision)
2. [Current Architecture (MVP)](#2-current-architecture-mvp)
3. [Target Production Architecture (Government Cloud / MeghRaj)](#3-target-production-architecture-government-cloud--meghraj)
4. [End-to-End Execution & Data Flows](#4-end-to-end-execution--data-flows)
5. [Security, Governance & DPDP Act Compliance](#5-security-governance--dpdp-act-compliance)
6. [Scalability, SLAs & Performance Engineering](#6-scalability-slas--performance-engineering)

---

## 1. System Overview & Architectural Vision

**DIKSHA** is an intelligent capacity building platform engineered to transition civil service training from static course completion to **adaptive, verified competency mastery**.

The platform provides a dual architecture:
- **Learner Experience**: Dynamic competency mapping, prerequisite-ordered learning roadmaps, contextual generative MCQ assessments, and SM-2 spaced repetition memory decay tracking.
- **Supervisor Experience**: Real-time workforce skill gap analytics, department readiness distributions, and training effectiveness telemetry.

---

## 2. Current Architecture (MVP)

The MVP is built as a modular subfolder monorepo designed for high performance, zero external database setup overhead, and deterministic execution.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      Next.js 16 + Tailwind CSS Client                  │
 │                  (App Router, React 18, Recharts, Motion)              │
 │                            http://localhost:3000                        │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │  RESTful JSON API
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                     Python 3.13 FastAPI Backend Service                │
 │                         (Uvicorn, Pydantic v2)                         │
 │                            http://localhost:5001                        │
 └──────────┬────────────────────────┬────────────────────────┬───────────┘
            │                        │                        │
            ▼                        ▼                        ▼
┌───────────────────────┐┌───────────────────────┐┌───────────────────────┐
│ Roadmap Engine (DAG   ││ Mastery & Forgetting  ││ LLM Engine (Google    │
│ Topological Sorting)  ││ Curve Engine (SM-2)   ││ Gemini 3.6 Flash /    │
│                       ││                       ││ Heuristic Fallback)   │
└───────────────────────┘└───────────────────────┘└───────────────────────┘
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                  In-Memory Document Store + JSON Files                 │
 │            (backend/data/ & backend/data/attempts/{profile_id}.json)   │
 └────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown
1. **Frontend Presentation Layer (`/frontend`)**:
   - Built with Next.js 16 App Router, React 18, Tailwind CSS, Recharts, and Framer Motion.
   - Communicates with backend REST API endpoints (`/api/profile`, `/api/roadmap`, `/api/quiz`, `/api/quiz/submit`, `/api/dashboard/employee`, `/api/dashboard/admin`).

2. **Backend API Service (`/backend`)**:
   - Powered by Python 3.13 and FastAPI with Pydantic v2 contract enforcement.
   - Implements async request processing and CORS middleware.

3. **Core Intelligence Engines**:
   - **`RoadmapEngine`**: Executes Kahn's Topological Sorting over a Directed Acyclic Graph (DAG) of 18 MoSPI competency nodes.
   - **`MasteryEngine`**: Implements rule-based mastery updates ($+15$ correct, $-10$ incorrect) and SM-2 spaced repetition decay calculation.
   - **`LLMService`**: Manages LLM prompting (Gemini 3.6 Flash) with structured JSON enforcement and fallback heuristic parsing.

4. **Persistence Layer**:
   - In-memory data loading with JSON file persistence (`backend/data/`).

---

## 3. Target Production Architecture (Government Cloud / MeghRaj)

In production, DIKSHA scales to support **100,000+ government officials** deployed on National Informatics Centre (NIC) **MeghRaj Cloud Infrastructure** using Kubernetes microservices and enterprise data systems.

```text
                               ┌────────────────────────────────┐
                               │     CDN & Web Application      │
                               │      Firewall (NIC WAF)        │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │    API Gateway & Load Balancer │
                               │     (NGINX / Kong / Envoy)     │
                               └───────────────┬────────────────┘
                                               │
             ┌─────────────────────────────────┼─────────────────────────────────┐
             │                                 │                                 │
             ▼                                 ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│ Competency & Profile    │       │ Roadmap & Topological   │       │ Assessment & Spaced     │
│ Microservice (FastAPI)  │       │ Microservice (FastAPI)  │       │ Repetition Microservice │
└────────────┬────────────┘       └────────────┬────────────┘       └────────────┬────────────┘
             │                                 │                                 │
             └─────────────────────────────────┼─────────────────────────────────┘
                                               │
                                               ▼
 ┌─────────────────────────────────────────────────────────────────────────────────────────┐
 │                                   Event Bus & Message Queue                             │
 │                                (Apache Kafka / RabbitMQ Event Stream)                   │
 └──────┬──────────────────────┬──────────────────────┬──────────────────────┬─────────────┘
        │                      │                      │                      │
        ▼                      ▼                      ▼                      ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ PostgreSQL 16│       │ Redis        │       │ iGOT         │       │ Internal NIC │
│ DB (JSONB +  │       │ Enterprise   │       │ Karmayogi    │       │ LLM Cluster  │
│ pgvector)    │       │ Cluster      │       │ API Gateway  │       │ (Self-Hosted)│
└──────────────┘       └──────────────┘       └──────────────┘       └──────────────┘
```

### Production Technology Stack

| Layer | Production Component | Purpose / Function |
| :--- | :--- | :--- |
| **Cloud Hosting** | NIC MeghRaj Cloud | MEITY-approved Government Cloud Infrastructure |
| **Containerization** | Docker + Kubernetes (K8s) | Container orchestration and auto-scaling |
| **API Gateway** | Kong / NGINX Ingress | TLS termination, rate-limiting, OAuth2 authentication |
| **Identity Management** | e-Pramaan / SSO | Government Single Sign-On integration |
| **Database** | PostgreSQL 16 + `pgvector` | Relational + JSONB document + vector embeddings |
| **Cache Layer** | Redis Enterprise Cluster | In-memory session, roadmap, and LLM output caching |
| **Event Pipeline** | Apache Kafka | Asynchronous attempt logging and analytics telemetry |
| **Course Catalog API** | iGOT Karmayogi Gateway | Real-time course sync, progress webhooks, & certificates |
| **LLM Inference** | Self-Hosted NIC LLM Cluster | On-premise Llama 3 / Mistral for zero data leakage |

---

## 4. End-to-End Execution & Data Flows

### Flow 1: Profile Assessment & Competency Gap Discovery

```text
[Learner] ──(1. Form Input)──> [Next.js UI] ──(2. POST /api/profile)──> [FastAPI Backend]
                                                                              │
   ┌──────────────────────────────────────────────────────────────────────────┘
   │
   ├──(3. If Demo/Cached)──> [Fast-Path Cache] ──(Sub-50ms)──> [Response]
   │
   └──(4. If Live LLM)───> [Google Gemini API] ──(Structured JSON)──> [PostgreSQL / Redis]
```

1. Learner enters designation, department, job role, experience, and prior training.
2. `POST /api/profile` receives request and checks fast-path cache.
3. LLM infers competency levels across 18 nodes (`none`, `basic`, `intermediate`, `advanced`).
4. Result stored in database and returned to UI.

---

### Flow 2: Prerequisite Roadmap Generation (DAG Topological Sort)

```text
[FastAPI Backend] ──(Fetch Nodes & Requirements)──> [DAG Dependency Graph]
                                                             │
   ┌─────────────────────────────────────────────────────────┘
   │
   ├──(1. Compute Gaps)──> Δ = Weight(Required) - Weight(Current)
   │
   ├──(2. Sort Nodes)───> Kahn's Topological Sort over Prerequisite Edges
   │
   └──(3. Match iGOT)───> Match Node & Severity against iGOT Course Catalog
                                                             │
                                                             ▼
                                                    [Ordered Roadmap JSON]
```

1. Backend compares profile competencies against target role requirements in `job_requirements.json`.
2. Computes gap severity (`high`, `medium`, `low`).
3. Executes Kahn's Topological Sorting over dependency edges (e.g. `stat-survey-design-101` $\rightarrow$ `stat-sampling-101` $\rightarrow$ `tech-python-101`).
4. Pairs matched courses from iGOT Karmayogi catalog.

---

### Flow 3: Quiz Submission & SM-2 Spaced Repetition Update

```text
[Learner] ──(Submit Answers)──> [POST /api/quiz/submit] ──> [MasteryEngine]
                                                                  │
   ┌──────────────────────────────────────────────────────────────┘
   │
   ├──(1. Update Score)───> Correct (+15), Incorrect (-10), Bounded [0, 100]
   │
   ├──(2. Log Attempt)────> Append attempt JSON to attempts/{profile_id}.json
   │
   └──(3. SM-2 Decay)────> Priority = (Days_Since * 15) / (Mastery / 25 + 1)
                                                                  │
                                                                  ▼
                                                      [Updated Mastery & Suggestions]
```

1. Learner completes assessment questions.
2. `POST /api/quiz/submit` updates node mastery score and updates level state.
3. Appends attempt history record to persistence layer.
4. Calculates SM-2 memory decay priority and updates "What to Revise Next" list.

---

## 5. Security, Governance & DPDP Act Compliance

DIKSHA complies with the **Digital Personal Data Protection (DPDP) Act 2023** and NIC Cyber Security Guidelines:

1. **Micro-Data Anonymization**:
   - Personal Identifiable Information (PII) is separated from statistical competency data using cryptographic pseudonymization.

2. **Role-Based Access Control (RBAC)**:
   - **Learners**: Access only their personal profile, roadmap, assessments, and progress.
   - **Supervisors / Admins**: Access aggregated department metrics without un-consented individual PII exposure.

3. **Encryption Standards**:
   - **Data in Transit**: TLS 1.3 with strict HTTPS enforcing HSTS.
   - **Data at Rest**: AES-256 encryption on PostgreSQL storage volumes.

4. **Zero Data Leakage LLM Deployment**:
   - In production, LLM prompts run on self-hosted NIC GPU infrastructure, ensuring no government data leaves official networks.

---

## 6. Scalability, SLAs & Performance Engineering

### Latency & Throughput Targets

| Metric | Target SLA | Strategy / Implementation |
| :--- | :--- | :--- |
| **Profile Assessment** | $< 200 \text{ ms}$ | Redis caching + Fast-path LLM pre-cached templates |
| **Roadmap Generation** | $< 50 \text{ ms}$ | $O(V + E)$ Topological Sort over in-memory graph |
| **Quiz Generation** | $< 1.5 \text{ s}$ | Gemini 3.6 Flash / On-premise LLM streaming |
| **Quiz Submission** | $< 30 \text{ ms}$ | Async event logging via Kafka queue |
| **System Uptime** | $99.95\%$ | Multi-AZ Kubernetes pod deployment on MeghRaj |

### Auto-Scaling Strategy
- **Horizontal Pod Autoscaler (HPA)** scales API pods based on CPU/RAM metrics and active HTTP request concurrency.
- **Redis Enterprise** provides sub-millisecond session state retrieval across load-balanced pods.
