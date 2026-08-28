import os
import json
import re
from typing import List, Dict, Any
from app.core.config import settings
from app.services.data_loader import DataLoader
from app.schemas.contracts import ProfileRequest, QuizQuestion

class LLMService:

    @classmethod
    def parse_profile(cls, request: ProfileRequest) -> List[Dict[str, Any]]:
        nodes = DataLoader.get_nodes()
        nodes_summary = [{ "id": n["id"], "name": n["name"], "domain": n["domain"], "description": n["description"] } for n in nodes]

        prompt = f"""
System: You are an expert AI evaluator for the Indian Official Statistical System competency framework.
Given an official's profile, infer their current competency level for each relevant node in the framework.
Allowed level values: "none", "basic", "intermediate", "advanced".

Available Competency Nodes:
{json.dumps(nodes_summary, indent=2)}

Official Profile:
- Designation: {request.designation}
- Department: {request.department}
- Job Role: {request.job_role}
- Experience (Years): {request.experience_years}
- Education: {request.education}
- Prior Trainings: {', '.join(request.prior_trainings) if request.prior_trainings else 'None'}

Return ONLY a valid JSON array of objects, with keys "node_id" and "current_level".
Do NOT include any markdown formatting, code blocks, or extra text.
"""
        api_key = settings.GEMINI_API_KEY or settings.ANTHROPIC_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                res = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=prompt
                )
                parsed = cls._extract_json(res.text)
                if isinstance(parsed, list):
                    return parsed
            except Exception as e:
                print(f"[LLMService] Gemini API profile parse failed: {e}. Falling back...")

        if settings.ANTHROPIC_API_KEY:
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
                res = client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=2048,
                    messages=[{"role": "user", "content": prompt}]
                )
                text = res.content[0].text
                parsed = cls._extract_json(text)
                if isinstance(parsed, list):
                    return parsed
            except Exception as e:
                print(f"[LLMService] Claude API profile parse failed: {e}. Falling back...")

        return cls._heuristic_profile_parse(request, nodes)

    @classmethod
    def generate_quiz(cls, content_text: str) -> List[QuizQuestion]:
        prompt = f"""
System: You are an expert AI Quiz Generator.
Generate between 5 to 8 distinct multiple-choice questions (MCQs) based on the provided input text.
Note: If the input text is a short topic name or keywords (such as "quantum computing", "data privacy", "python pandas"), generate 5 to 8 multiple-choice questions testing core concepts, definitions, techniques, and principles of THAT SPECIFIC SUBJECT.

Do NOT mix subjects. The questions must be 100% focused on the topic: "{content_text}".

Input Content / Topic:
\"\"\"{content_text}\"\"\"

Return ONLY a valid JSON array of question objects matching this exact structure:
[
  {{
    "question": "Clear question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "Detailed explanation here."
  }}
]
Do NOT include markdown formatting, backticks, or extra commentary.
"""
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                res = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=prompt
                )
                parsed = cls._extract_json(res.text)
                if isinstance(parsed, list) and len(parsed) >= 3:
                    return [QuizQuestion(**q) for q in parsed]
            except Exception as e:
                print(f"[LLMService] Gemini API quiz failed: {e}. Falling back...")

        if settings.ANTHROPIC_API_KEY:
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
                res = client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=3072,
                    messages=[{"role": "user", "content": prompt}]
                )
                parsed = cls._extract_json(res.content[0].text)
                if isinstance(parsed, list) and len(parsed) >= 3:
                    return [QuizQuestion(**q) for q in parsed]
            except Exception as e:
                print(f"[LLMService] Claude API quiz failed: {e}. Falling back...")

        return cls._fallback_quiz_generate(content_text)

    @classmethod
    def _heuristic_profile_parse(cls, req: ProfileRequest, nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        text_corpus = f"{req.designation} {req.department} {req.job_role} {req.education} {' '.join(req.prior_trainings)}".lower()

        is_sparse = (req.experience_years < 1.0) and (not req.prior_trainings)
        is_senior = req.experience_years >= 8.0

        for node in nodes:
            node_id = node["id"]
            node_name = node["name"].lower()
            domain = node["domain"]

            level = "none"

            if is_sparse:
                if any(term in text_corpus for term in node_name.split()):
                    level = "basic"
                else:
                    level = "none"
            elif is_senior:
                if any(term in text_corpus for term in node_name.split()) or any(tr.lower() in text_corpus for tr in req.prior_trainings):
                    level = "advanced"
                elif domain in ["statistical", "behavioural"]:
                    level = "intermediate"
                else:
                    level = "basic"
            else:
                if any(term in text_corpus for term in node_name.split()) or any(tr.lower() in text_corpus for tr in req.prior_trainings):
                    level = "intermediate" if req.experience_years >= 4 else "basic"
                elif domain == "statistical" and ("stat" in text_corpus or "investigator" in text_corpus):
                    level = "basic" if req.experience_years < 3 else "intermediate"
                elif domain == "behavioural" and req.experience_years >= 3:
                    level = "basic"

            results.append({"node_id": node_id, "current_level": level})

        return results

    @classmethod
    def _fallback_quiz_generate(cls, text: str) -> List[QuizQuestion]:
        lowered = text.lower().strip()

        # Subject Specific Fallbacks
        if "quantum" in lowered:
            return [
                QuizQuestion(
                    question="1. What is the fundamental unit of quantum information in quantum computing?",
                    options=["Qubit (Quantum Bit)", "Binary Bit", "Byte", "Trit"],
                    correct_index=0,
                    explanation="A qubit is the basic unit of quantum information, utilizing quantum mechanics."
                ),
                QuizQuestion(
                    question="2. Which principle allows a qubit to exist in a state of 0, 1, or both simultaneously?",
                    options=["Superposition", "Entanglement", "Decoherence", "Interference"],
                    correct_index=0,
                    explanation="Superposition enables qubits to hold combinations of 0 and 1 simultaneously."
                ),
                QuizQuestion(
                    question="3. What phenomenon links two qubits such that the state of one instantaneously determines the other?",
                    options=["Quantum Entanglement", "Quantum Teleportation", "Superconductivity", "Tunneling"],
                    correct_index=0,
                    explanation="Entanglement correlates quantum states regardless of spatial separation."
                ),
                QuizQuestion(
                    question="4. Which algorithm provides exponential speedup for factoring large integers on a quantum computer?",
                    options=["Shor's Algorithm", "Grover's Algorithm", "Dijkstra's Algorithm", "QuickSort"],
                    correct_index=0,
                    explanation="Shor's algorithm efficiently factors integers, posing implications for RSA cryptography."
                ),
                QuizQuestion(
                    question="5. What is 'Quantum Decoherence' in quantum processing?",
                    options=[
                        "Loss of quantum coherence due to environmental noise and interaction",
                        "The process of creating new qubits",
                        "Amplifying quantum signal output",
                        "Storing quantum data permanently on disk"
                    ],
                    correct_index=0,
                    explanation="Decoherence causes qubits to collapse back into classical states due to interference."
                )
            ]
        elif "python" in lowered or "pandas" in lowered or "numpy" in lowered:
            return [
                QuizQuestion(
                    question="1. What is the primary data structure in Pandas for 2D tabular data manipulation?",
                    options=["DataFrame", "Series", "ndarray", "Dictionary"],
                    correct_index=0,
                    explanation="A DataFrame is Pandas' 2-dimensional labeled data structure with rows and columns."
                ),
                QuizQuestion(
                    question="2. Which library is the core foundation for fast numerical array computations in Python?",
                    options=["SciPy", "NumPy", "Matplotlib", "Seaborn"],
                    correct_index=1,
                    explanation="NumPy provides the ndarray object for efficient vector mathematical operations."
                ),
                QuizQuestion(
                    question="3. How do you handle missing values (NaN) in a Pandas DataFrame?",
                    options=["df.dropna() or df.fillna()", "df.remove_null()", "df.clean()", "df.drop_na_rows()"],
                    correct_index=0,
                    explanation="dropna() removes rows/columns with missing values, while fillna() fills missing values."
                ),
                QuizQuestion(
                    question="4. Which function in Pandas is used to read CSV data files into a DataFrame?",
                    options=["pd.load_csv()", "pd.read_csv()", "pd.import_csv()", "pd.open_csv()"],
                    correct_index=1,
                    explanation="pd.read_csv() is the standard method for parsing CSV data into DataFrames."
                ),
                QuizQuestion(
                    question="5. What method is used to group data and compute aggregate metrics in Pandas?",
                    options=["groupby()", "aggregate_by()", "cluster()", "partition()"],
                    correct_index=0,
                    explanation="df.groupby() enables split-apply-combine data aggregations."
                )
            ]
        elif "privacy" in lowered or "cybersecurity" in lowered or "dpdp" in lowered:
            return [
                QuizQuestion(
                    question="1. What is mandatory when handling survey micro-data under the DPDP Act?",
                    options=[
                        "Anonymization and role-based access control",
                        "Storing raw data on non-encrypted public drives",
                        "Sharing passwords across departments",
                        "Disabling audit logging"
                    ],
                    correct_index=0,
                    explanation="The DPDP Act mandates data anonymization and strict role-based access control."
                ),
                QuizQuestion(
                    question="2. What does 'Data Anonymization' accomplish in official datasets?",
                    options=[
                        "Irreversibly removes personal identifiers from data records",
                        "Encrypts data temporary during transfer only",
                        "Reduces file storage size",
                        "Deletes survey responses completely"
                    ],
                    correct_index=0,
                    explanation="Anonymization removes personal identifiers so individuals cannot be identified."
                ),
                QuizQuestion(
                    question="3. Which security measure protects government cloud applications on MeghRaj?",
                    options=[
                        "TLS/SSL Encryption in transit and at rest",
                        "Open HTTP without SSL certificates",
                        "Hardcoding credentials in source code",
                        "Disabling firewall security rules"
                    ],
                    correct_index=0,
                    explanation="Encryption in transit and at rest safeguards public sector cloud infrastructure."
                ),
                QuizQuestion(
                    question="4. What is the role of a Data Protection Officer (DPO) in government bodies?",
                    options=[
                        "Overseeing data privacy compliance and addressing grievances",
                        "Managing field survey enumeration budgets",
                        "Writing statistical news releases",
                        "Setting pricing for public data requests"
                    ],
                    correct_index=0,
                    explanation="A DPO ensures organizational compliance with data privacy regulations."
                ),
                QuizQuestion(
                    question="5. What is 'Principle of Least Privilege' in cybersecurity?",
                    options=[
                        "Granting users only the minimal permissions necessary for their job role",
                        "Giving all employees administrator rights",
                        "Restricting data access to senior executives only",
                        "Disabling user login passwords"
                    ],
                    correct_index=0,
                    explanation="Least privilege limits access rights to only what is strictly necessary for tasks."
                )
            ]

        # Generic Dynamic Topic Fallback
        topic = text[:35].strip("- *•") if text else "General Knowledge"
        return [
            QuizQuestion(
                question=f"1. What is the fundamental concept underlying '{topic}'?",
                options=[
                    f"Core principles, methodology, and foundational frameworks of {topic}",
                    "Ignoring standard protocols and validation steps",
                    "Manual override of system safety metrics",
                    "Restricting operational transparency"
                ],
                correct_index=0,
                explanation=f"Understanding foundational principles is essential when studying {topic}."
            ),
            QuizQuestion(
                question=f"2. Which key metric is used to evaluate performance in '{topic}'?",
                options=[
                    f"Accuracy, reliability, and precision of {topic} implementations",
                    "File size on local storage disks",
                    "Manual paper documentation count",
                    "Arbitrary preference scores"
                ],
                correct_index=0,
                explanation=f"Performance in {topic} is measured by system accuracy, precision, and reliability."
            ),
            QuizQuestion(
                question=f"3. What is a primary real-world application of '{topic}'?",
                options=[
                    f"Optimizing data processing, analytics, and operational efficiency",
                    "Replacing digital systems with manual ledgers",
                    "Eliminating security verification steps",
                    "Bypassing regulatory compliance checks"
                ],
                correct_index=0,
                explanation=f"Real-world deployment of {topic} focuses on efficiency, optimization, and accurate analysis."
            ),
            QuizQuestion(
                question=f"4. What security or governance protocol applies when implementing '{topic}'?",
                options=[
                    "Applying strict access control, audit logging, and compliance standards",
                    "Disabling user authentication",
                    "Publishing unencrypted private data publicly",
                    "Removing system safety monitoring"
                ],
                correct_index=0,
                explanation="Access control, security standards, and compliance govern technical implementations."
            ),
            QuizQuestion(
                question=f"5. What best practice should be followed when scaling '{topic}'?",
                options=[
                    f"Continuous evaluation, structured testing, and modular architecture",
                    "Deploying untested changes directly into production",
                    "Eliminating documentation and code reviews",
                    "Hardcoding static parameters"
                ],
                correct_index=0,
                explanation="Modular architecture and structured testing enable reliable scaling."
            )
        ]

    @classmethod
    def _extract_json(cls, raw_text: str) -> Any:
        try:
            cleaned = re.sub(r"```json\s*", "", raw_text)
            cleaned = re.sub(r"```\s*", "", cleaned).strip()
            return json.loads(cleaned)
        except Exception:
            match = re.search(r"\[.*\]", raw_text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except Exception:
                    pass
            return None
