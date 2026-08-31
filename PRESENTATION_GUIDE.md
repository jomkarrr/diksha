# 🎤 DIKSHA — 10-Minute Master Presentation Guide & Live Software Demo Script

> **Team Name**: Team Viksit  
> **Problem Statement ID**: SIH26101  
> **Problem Title**: AI-Enabled Competency Capacity Building Platform for India's Official Statistical System (MoSPI / Mission Karmayogi)  

---

## ⏱️ 10-Minute Time Allocation Breakdown

```text
┌───────────────────────────────────────┬───────────────┬──────────────────────────────────────────┐
│ Phase                                 │ Time          │ Focus Area                               │
├───────────────────────────────────────┼───────────────┼──────────────────────────────────────────┤
│ Part 1: PPT Slides 1 to 3             │ 3.0 Minutes   │ Problem, Solution Architecture, Tech     │
│ Part 2: LIVE Software Demo            │ 4.5 Minutes   │ Live UI Walkthrough (Profile to SM-2)    │
│ Part 3: PPT Slides 4 to 6             │ 1.5 Minutes   │ Feasibility, Impact, Institutional Value │
│ Part 4: Judge Q&A Defense             │ 1.0 Minute    │ Closing & Rapid Q&A Handling             │
└───────────────────────────────────────┴───────────────┴──────────────────────────────────────────┘
```

---

## 📢 Part 1: PPT Slide Walkthrough (Minutes 0:00 – 3:00)

### Slide 1: Title & Introduction (0:00 – 0:30)
- **Visual**: Slide 1 — Problem Statement SIH26101, Team Viksit.
- **What to Speak (Verbatim Script)**:
  > *"Respected Judges and Members of the Jury, Good Morning. I am representing Team Viksit for Problem Statement 26101: Developing an AI-enabled Capacity Building Platform for India’s Official Statistical System under MoSPI and Mission Karmayogi.*  
  > *India's statistical infrastructure, managed by bodies like NSSO and CSO, generates critical national data including GDP, CPI, and PLFS. However, capacity building for statistical officials has traditionally been time-based rather than competency-based. Today, we present **DIKSHA**—an outcome-oriented, adaptive intelligence platform designed to transform official capacity building."*

---

### Slide 2: Proposed Solution Architecture (0:30 – 1:45)
- **Visual**: Slide 2 — 6 Core Pillars (AI Profiling, Gap Detection, Roadmap, iGOT Mapping, Generative MCQs, AI Assistant).
- **What to Speak (Verbatim Script)**:
  > *"Our solution, DIKSHA, addresses the entire learning lifecycle through 6 core pillars:*  
  > *1. **AI-Based Competency Profiling**: Automatically ingests official designations, experience, and prior training to build standardized skill profiles.*  
  > *2. **Topological Competency Gap Detection**: Compares current skills against target role requirements across 4 domains: Statistical, Technical, Digital Governance, and Managerial.*  
  > *3. **Prerequisite-Ordered Learning Roadmaps**: Uses graph algorithms so foundational prerequisites like Survey Sampling appear before advanced analytics like Python.*  
  > *4. **iGOT Karmayogi Alignment**: Pairs identified gaps directly with relevant iGOT learning modules.*  
  > *5. **Contextual Generative MCQs**: Generates dynamic assessment quizzes from any uploaded document or topic text using Google Gemini AI.*  
  > *6. **SM-2 Spaced Repetition Engine**: Calculates memory decay to tell officials exactly what skills to revise next before memory fades."*

---

### Slide 3: Technical Architecture & Tech Stack (1:45 – 3:00)
- **Visual**: Slide 3 — Tech Stack (FastAPI, Next.js, Gemini AI, SM-2 Engine, iGOT Contracts).
- **What to Speak (Verbatim Script)**:
  > *"To achieve enterprise government-grade stability, our technical architecture is built on a high-performance stack:*  
  > *- **Backend**: Python 3.13 and FastAPI providing sub-millisecond API execution with validated Pydantic data contracts.*  
  > *- **Frontend**: Next.js 16 App Router with Tailwind CSS, Recharts for dynamic analytics, and Framer Motion for responsive UI.*  
  > *- **Core Engines**: A Directed Acyclic Graph (DAG) topological sorting algorithm for prerequisite sequencing, and an SM-2 spaced repetition decay engine for retention tracking.*  
  > *- **AI Orchestration**: Google Gemini 3.6 Flash with structured JSON enforcement, backed by a sub-50ms fast-path cache and heuristic fallback.*  
  > *Let us now step directly into the live platform to see DIKSHA in action."*

---

## 💻 Part 2: LIVE Software Demo Walkthrough (Minutes 3:00 – 7:30)

*(Switch screen from PowerPoint to Browser at `http://localhost:3000`)*

### Demo Step 1: Official Profile Assessment (`http://localhost:3000/profile`)
- **Action**: Open `/profile`. Point to the form pre-filled with *Statistical Investigator Grade II*, *4 Years Experience*, *NSSO Department*.
- **What to Speak**:
  > *"Here is the Official Profile interface. When a government official enters their designation and experience and clicks **'Run AI Assessment'**, our backend calls Gemini 3.6 Flash live. Notice how the system infers competency levels across 18 nodes—such as 'basic' in Sampling Techniques and 'none' in Data Privacy."*
- **Highlight**: Green `Backend Data` badge proving live API execution.

---

### Demo Step 2: Topological Learning Roadmap (`http://localhost:3000/roadmap`)
- **Action**: Click **Roadmap** in the sidebar. Scroll through the sequenced nodes.
- **What to Speak**:
  > *"On the Learning Roadmap, notice the prerequisite sequence. Instead of dumping random courses, DIKSHA runs Kahn's Topological Sorting over a Directed Acyclic Graph. Foundational nodes like 'Survey Sampling Techniques' are scheduled before 'Python Data Analysis'. Each gap displays severity tags—High, Medium, Low—and pairs directly with matched iGOT Karmayogi courses."*

---

### Demo Step 3: Generative AI Assessment & Knowledge Upload (`http://localhost:3000/knowledge` & `/assessments`)
- **Action**: Open `/knowledge` or `/assessments`. Type or upload text on *Sampling & Variance Estimation*, then click **"Generate Quiz"**.
- **What to Speak**:
  > *"Now let us test Generative Assessment. An official uploads a survey guidelines PDF or types a topic like 'Sampling Techniques' or 'Quantum Computing'. Clicking **'Generate Quiz'** prompts Gemini AI to generate 5 to 8 structured MCQs with options, correct answer keys, and detailed explanations."*
- **Action**: Select answers for Question 1 through 5, then click **"Submit"**.

---

### Demo Step 4: Live Mastery Update & Results (`http://localhost:3000/assessments/results`)
- **Action**: On the results page, highlight the score (e.g. `80%`) and updated competency level (`INTERMEDIATE`).
- **What to Speak**:
  > *"When the official submits their quiz, `POST /api/quiz/submit` processes the answers live. Correct answers increase node mastery by +15 points. Notice how the competency level instantly upgrades from Basic to Intermediate and persists to the official's profile."*

---

### Demo Step 5: Employee Spaced Repetition & SM-2 Dashboard (`http://localhost:3000/progress`)
- **Action**: Open `/progress`. Point to the **"What to Revise Next (SM-2 Spaced Repetition)"** section.
- **What to Speak**:
  > *"On the Employee Progress dashboard, we solve the forgetting curve. Our SM-2 engine calculates memory decay based on days since last review and current mastery. It automatically surfaces personalized 'What to Revise Next' suggestions—for instance, reminding an officer to revise Sampling Techniques because it was last reviewed 4 days ago."*

---

### Demo Step 6: Supervisor Workforce Analytics (`http://localhost:3000/admin/analytics`)
- **Action**: Open `/admin/analytics`. Show the **Gap Severity Pie Chart**, **Competency Radar Chart**, and employee roster.
- **What to Speak**:
  > *"Finally, for Capacity Building Managers and Ministry Directors, the Admin Dashboard aggregates live workforce metrics. The Gap Severity Pie Chart and Radar Chart show at a glance which departments need intervention—for example, highlighting that 60% of NSSO field investigators require Data Privacy training."*

---

## 📢 Part 3: PPT Slides 4 to 6 Walkthrough (Minutes 7:30 – 9:00)

*(Switch screen back to PowerPoint presentation)*

### Slide 4: Feasibility & Viability (7:30 – 8:15)
- **Visual**: Slide 4 — Feasibility & Viability (Technical, Operational, Legal, Economic, Social).
- **What to Speak**:
  > *"DIKSHA is engineered for immediate government deployment:*  
  > *- **Technical**: Microservice architecture designed for MeghRaj cloud hosting and e-Pramaan Single Sign-On.*  
  > *- **Legal & Privacy**: Fully compliant with the DPDP Act 2023 through data pseudonymization and role-based access control (RBAC).*  
  > *- **Economic**: Phased pilot rollouts reduce redundant training costs while maximizing civil service capability."*

---

### Slide 5: Impact & Benefits (8:15 – 8:45)
- **Visual**: Slide 5 — Impact & Benefits (Employee, Admin, Workforce, System-Level).
- **What to Speak**:
  > *"The impact of DIKSHA spans all administrative levels:*  
  > *- **Officials** receive personalized upskilling and long-term retention.*  
  > *- **Administrators** gain real-time visibility into skill gaps without manual monitoring.*  
  > *- **System-Level**: Better skilled statistical officers lead to higher quality statistical outputs for national policy making."*

---

### Slide 6: Research, References & Closing (8:45 – 9:00)
- **Visual**: Slide 6 — MoSPI NADA portal, iGOT Karmayogi, National Accounts.
- **What to Speak**:
  > *"Our platform is grounded in official guidelines from MoSPI, the NADA Microdata portal, and Mission Karmayogi framework. Thank you for your time. We are now open for your questions."*

---

## 🛡️ Part 4: Judge Q&A Rapid Defense Guide (Minutes 9:00 – 10:00)

| Potential Judge Question | Crisp Winning Answer |
| :--- | :--- |
| **"How does this differ from traditional LMS platforms like Moodle?"** | *"Traditional LMS tracks course completion hours. DIKSHA measures verified competency mastery, enforces prerequisite ordering via graph algorithms, and prevents skill decay using SM-2 spaced repetition."* |
| **"What if external LLM APIs fail during live quiz generation?"** | *"We enforce strict Pydantic contract validation. If the LLM API fails or times out, our `LLMService` automatically falls back to an offline deterministic heuristic NLP engine, keeping the app 100% operational."* |
| **"How is user data protected under the DPDP Act?"** | *"PII is cryptographically separated from competency telemetry. Supervisors view aggregated departmental metrics, while individual micro-data access is strictly governed by Role-Based Access Control (RBAC)."* |
| **"How will you integrate with iGOT Karmayogi in production?"** | *"Our architecture includes a dedicated iGOT Integration Gateway designed to connect with Karmayogi APIs for course catalog sync, progress webhooks, and verified digital certificates."* |
