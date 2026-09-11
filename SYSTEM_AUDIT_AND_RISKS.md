# 🚨 DIKSHA — Complete System Audit, Risks, & Defense Strategy

> **Confidential Presenter Guide**: This document details exactly what the DIKSHA MVP is, where its technical limitations lie, where it could break during a live demo, and how to defend it professionally to the judges.

---

## 🏛️ 1. The Context & Theme (Your Anchor)
**Theme**: Smart Education (SIH26101)  
**Target User**: Ministry of Statistics and Programme Implementation (MoSPI) & Mission Karmayogi.  
**The Narrative**: You are presenting a transition from *Static Training* (watching videos) to *Adaptive Intelligence* (testing skills, finding gaps, spaced repetition memory tracking). 

*If judges ask why you built something:* Always refer back to **"Strengthening the Official Statistical System so India produces better data (GDP, CPI, PLFS)."**

---

## 💻 2. The EXACT Tech Stack We Are Using
Be absolutely precise if judges ask. Do not claim tech we aren't using.

### Frontend (User Interface)
*   **Framework**: Next.js 16 (App Router) + React 18
*   **Styling**: Tailwind CSS + Framer Motion (for animations)
*   **Charts**: Recharts (Radar charts, Pie charts, Trajectory lines)
*   **State**: React Hooks + `localStorage` / `sessionStorage`

### Backend (API & Logic)
*   **Framework**: Python 3.13 + FastAPI + Uvicorn (Runs on port 5001)
*   **Data Validation**: Pydantic v2 (Strict type-checking for APIs)
*   **AI Integration**: Google Gemini 3.6 Flash (via `google-genai` SDK)
*   **PDF Parsing**: `pypdf` & `python-multipart` (for file uploads)

### Database (The "Hackathon MVP" DB)
*   **Actual implementation**: Flat JSON files (`backend/data/`) and in-memory Python dictionaries.
*   **Production equivalent**: PostgreSQL (JSONB) + Redis. *(Always say: "We used an in-memory JSON document store for the MVP for zero-dependency portability, which maps 1-to-1 to a production PostgreSQL database.")*

---

## ⚠️ 3. WHERE IT CAN BREAK (And How to Defend It)

This is the most critical section. Know your vulnerabilities before the judges find them.

### Vulnerability 1: The PDF Upload / Quiz Generation Timeout
*   **The Risk**: If you upload a massive, complex 100-page PDF with lots of images/tables during the live demo, `pypdf` might extract garbage text, and sending 100 pages to Gemini might cause a **timeout error** (taking >30 seconds) or hit a token limit.
*   **How to avoid in demo**: Upload a small, text-heavy PDF (1-3 pages) or just use the text-box input.
*   **Defense if judges ask about scale**: *"For this MVP, we pass extracted text directly to the LLM. In our production architecture (MeghRaj cloud), we will implement **RAG (Retrieval-Augmented Generation)** using a Vector Database (like pgvector) to chunk documents and only send relevant sections to the AI."*

### Vulnerability 2: JSON File Concurrency (Data Loss)
*   **The Risk**: We are saving quiz attempts and mastery scores directly to text files (e.g., `attempts/prof_123.json`). If two users take a quiz at the exact same millisecond, the file could corrupt because Python doesn't have file-locking implemented here.
*   **How to avoid in demo**: It won't happen during a single-user live demo.
*   **Defense if judges notice**: *"We intentionally used a flat-file JSON document store to ensure the hackathon project runs instantly on your machines without needing Docker or a database installation. The schema is designed to drop perfectly into PostgreSQL JSONB for production concurrency."*

### Vulnerability 3: The "Mock" Integrations (iGOT & MoSPI Datasets)
*   **The Risk**: Judges might ask: *"Is this actually pulling live courses from iGOT Karmayogi right now?"* or *"Are you querying the live MoSPI NADA database?"*
*   **The Reality**: No. We are using highly realistic mock JSON files (`igot_sample.json`, `plfs_sample.json`) because the government does not expose these APIs to the public internet.
*   **Defense**: *"iGOT Karmayogi and MoSPI NADA do not currently provide open public REST APIs for hackathon sandboxes. Therefore, we meticulously modeled their official data structures into our local gateway. Our API contracts are production-ready to swap our mock gateway with the real NIC endpoints once authorized."*

### Vulnerability 4: Authentication Security
*   **The Risk**: The login/onboarding stores a profile ID in the browser's `localStorage`. It is not a secure, cryptographically signed JWT token.
*   **Defense**: *"To prioritize user-experience during the hackathon evaluation, we simplified session management using local storage. In production, this integrates directly with **e-Pramaan** (Govt SSO) to issue secure OAuth2 JWT tokens."*

### Vulnerability 5: LLM Hallucinations (Bad MCQs)
*   **The Risk**: Gemini might occasionally generate a quiz question where the "Correct Answer" is actually wrong, or the JSON format breaks.
*   **Defense**: *"We use strict Pydantic JSON schema enforcement to guarantee the output format. To prevent hallucinated facts, we instruct the LLM to only use the provided context. In production, we will introduce a 'Human-in-the-loop' supervisor approval step before AI quizzes are deployed to thousands of officers."*

---

## 🔍 4. Illusion vs. Reality (What works vs. What is UI)

Be confident about what you actually built. You built a LOT of real tech.

**✅ REAL (Fully functional Backend/Algorithms):**
*   **DAG Topological Sorting**: The roadmap actually orders prerequisites correctly using graph math (`roadmap_engine.py`).
*   **SM-2 Memory Decay**: The math for the forgetting curve is real (`mastery_engine.py`). If you change the dates, the priority score physically changes.
*   **Live Quiz Submission**: When you submit a quiz, the $+15 / -10$ scoring and level upgrading happens live on the backend.
*   **AI Generation**: The quiz generation actually hits the live Google Gemini API.

**🎨 ILLUSION (UI Mockups / Simulated):**
*   **Data Practice Workspaces (`/data-practice`)**: The UI looks like a complex Jupyter notebook for PLFS data, but the charts and code blocks are largely pre-rendered frontend components designed to *show* the vision.
*   **Admin Analytics Pie Charts**: Powered by the 6 mock employees in `mock_employees.json`, not thousands of live users.
*   **Document Knowledge Base (`/knowledge`)**: The repository UI displays static mock documents alongside anything you temporarily upload.

---

## 🏁 5. Golden Rules for Your Presentation
1.  **Control the Demo Path**: Follow the exact script provided in `PRESENTATION_GUIDE.md`. Do not click random buttons or upload massive files you haven't tested.
2.  **Use the Magic Word "Architecture"**: Whenever a judge points out a limitation, agree with them, and pivot to the *Production Architecture*. (e.g., "You're absolutely right, the JSON file won't scale. That's why our production architecture specification replaces it with PostgreSQL on the MeghRaj cloud.")
3.  **Own the Domain**: Use MoSPI terms naturally. Say "PLFS", "NSSO", "Mission Karmayogi", and "Capacity Building". It proves you didn't just build a generic quiz app; you built a *government solution*.
