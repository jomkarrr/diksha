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
        # Try Gemini API first
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

        # Try Claude API if key available
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

        # Heuristic deterministic parser fallback
        return cls._heuristic_profile_parse(request, nodes)

    @classmethod
    def generate_quiz(cls, content_text: str) -> List[QuizQuestion]:
        prompt = f"""
System: You are an AI Quiz Generator for government statistical training material.
Generate between 5 to 8 distinct multiple-choice questions (MCQs) based STRICTLY on the provided learning content text.
The questions MUST be specifically tailored to the subjects, keywords, and facts mentioned in the text.
Do NOT use generic boilerplate questions.

Content Text:
\"\"\"{content_text}\"\"\"

Return ONLY a valid JSON array of question objects matching this exact structure:
[
  {{
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "Detailed explanation here."
  }}
]
Do NOT include markdown formatting or extra commentary.
"""
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

        # Try Gemini API
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

        # Try Claude API
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

        # Dynamic fallback quiz generator tailored to text subject
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
        lowered = text.lower()

        # Subject Specific Fallbacks
        if "python" in lowered or "pandas" in lowered or "numpy" in lowered:
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

        # Generic Statistical Fallback
        topic = text[:40].strip("- *•") if text else "Statistical Concepts"
        return [
            QuizQuestion(
                question=f"1. According to the material on '{topic}', what is essential for statistical survey validity?",
                options=[
                    "Adherence to standardized sampling frames and validation protocols",
                    "Manual omission of field survey outliers",
                    "Replacing primary field collection with estimates",
                    "Restricting survey access to single departments"
                ],
                correct_index=0,
                explanation="Standardized sampling frames and audit protocols ensure statistical validity across official surveys."
            ),
            QuizQuestion(
                question=f"2. What is the primary objective of data quality frameworks regarding '{topic}'?",
                options=[
                    "Ensuring accuracy, timeliness, and public credibility of indicators",
                    "Slowing down report publication cycles",
                    "Restricting open data sharing with researchers",
                    "Eliminating the need for periodic revisions"
                ],
                correct_index=0,
                explanation="Quality frameworks (e.g. UN NQAF) safeguard accuracy, timeliness, and user credibility."
            ),
            QuizQuestion(
                question="3. How does stratified sampling improve estimation over simple random sampling?",
                options=[
                    "By reducing sampling variance across heterogeneous sub-groups",
                    "By eliminating non-sampling errors completely",
                    "By doubling the required total sample size",
                    "By removing the need for weighting factors"
                ],
                correct_index=0,
                explanation="Stratification groups homogeneous sub-populations, reducing overall sampling variance."
            ),
            QuizQuestion(
                question="4. Which metric best measures sampling precision in official sample surveys?",
                options=[
                    "Standard error and coefficient of variation (CV)",
                    "Number of survey enumerator pages",
                    "Total budget allocated for field travel",
                    "Font size used in official questionnaires"
                ],
                correct_index=0,
                explanation="Standard error and coefficient of variation quantify sampling precision."
            ),
            QuizQuestion(
                question="5. What is the primary role of National Accounts aggregates like GDP and GVA?",
                options=[
                    "Measuring national economic performance and sectoral output",
                    "Tracking individual household income receipts",
                    "Setting retail prices for agricultural commodities",
                    "Managing local municipal tax collection"
                ],
                correct_index=0,
                explanation="GVA and GDP measure national and sectoral macroeconomic performance."
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
