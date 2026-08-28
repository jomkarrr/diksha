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
        # Try Claude API first if key available
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
                print(f"[LLMService] Claude API failed: {e}. Falling back...")

        # Try Gemini API if key available
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                res = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                parsed = cls._extract_json(res.text)
                if isinstance(parsed, list):
                    return parsed
            except Exception as e:
                print(f"[LLMService] Gemini API failed: {e}. Falling back...")

        # Heuristic deterministic parser fallback
        return cls._heuristic_profile_parse(request, nodes)

    @classmethod
    def generate_quiz(cls, content_text: str) -> List[QuizQuestion]:
        prompt = f"""
System: You are an AI Quiz Generator for government statistical training material.
Generate between 5 to 8 distinct multiple-choice questions (MCQs) based on the provided learning content text.
The input content may be a dense technical paragraph, a bulleted list of rules, or a document summary.

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
        # Try Claude API first
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

        # Try Gemini API
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                res = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                parsed = cls._extract_json(res.text)
                if isinstance(parsed, list) and len(parsed) >= 3:
                    return [QuizQuestion(**q) for q in parsed]
            except Exception as e:
                print(f"[LLMService] Gemini API quiz failed: {e}. Falling back...")

        # Heuristic fallback quiz generator
        return cls._fallback_quiz_generate(content_text)

    @classmethod
    def _heuristic_profile_parse(cls, req: ProfileRequest, nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        text_corpus = f"{req.designation} {req.department} {req.job_role} {req.education} {' '.join(req.prior_trainings)}".lower()

        # Edge case check: Sparse profile (no prior training, < 1 year experience)
        is_sparse = (req.experience_years < 1.0) and (not req.prior_trainings)
        # Edge case check: Senior official (8+ years experience)
        is_senior = req.experience_years >= 8.0

        for node in nodes:
            node_id = node["id"]
            node_name = node["name"].lower()
            domain = node["domain"]

            level = "none"

            if is_sparse:
                # Sparse profiles start with "none" or "basic" if education strongly matches
                if any(term in text_corpus for term in node_name.split()):
                    level = "basic"
                else:
                    level = "none"
            elif is_senior:
                # Senior officials have at least basic/intermediate on domain nodes
                if any(term in text_corpus for term in node_name.split()) or any(tr.lower() in text_corpus for tr in req.prior_trainings):
                    level = "advanced"
                elif domain in ["statistical", "behavioural"]:
                    level = "intermediate"
                else:
                    level = "basic"
            else:
                # Mid-level profiles (1-7 years experience)
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
        lines = [line.strip("- *•") for line in text.split("\n") if line.strip()]
        topic = lines[0][:50] if lines else "Official Statistical Methodology"

        questions = [
            QuizQuestion(
                question=f"1. According to the content on '{topic}', what is the core requirement for statistical validity?",
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
                question="2. What is the primary objective of establishing data quality frameworks in official statistics?",
                options=[
                    "Slowing down report publication cycles",
                    "Ensuring accuracy, timeliness, and public credibility of indicators",
                    "Restricting open data sharing with researchers",
                    "Eliminating the need for periodic revisions"
                ],
                correct_index=1,
                explanation="Quality frameworks (e.g. UN NQAF) safeguard accuracy, timeliness, and user credibility."
            ),
            QuizQuestion(
                question="3. When handling micro-data under the DPDP Act guidelines, which practice is mandatory?",
                options=[
                    "Publishing un-anonymized household identifiers",
                    "Storing raw survey data on non-encrypted public drives",
                    "Applying strict anonymization techniques and role-based access control",
                    "Disabling security logging"
                ],
                correct_index=2,
                explanation="DPDP Act guidelines mandate data anonymization and role-based access control for micro-data."
            ),
            QuizQuestion(
                question="4. Which metric best measures sampling precision in large-scale sample surveys?",
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
                question="5. How does stratified sampling improve estimation over simple random sampling?",
                options=[
                    "By eliminating non-sampling errors completely",
                    "By reducing sampling variance across heterogeneous sub-groups",
                    "By doubling the required total sample size",
                    "By removing the need for weighting factors"
                ],
                correct_index=1,
                explanation="Stratification groups homogeneous sub-populations, reducing overall sampling variance."
            ),
            QuizQuestion(
                question="6. What is the primary role of National Accounts aggregates like Gross Value Added (GVA)?",
                options=[
                    "Tracking individual household income receipts",
                    "Measuring economic performance and sectoral output across the nation",
                    "Setting retail prices for agricultural commodities",
                    "Managing local municipal tax collection"
                ],
                correct_index=1,
                explanation="GVA and GDP measure national and sectoral macroeconomic performance."
            )
        ]
        return questions

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
