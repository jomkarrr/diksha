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
Generate 3 distinct multiple-choice questions (MCQs) based on the provided text.

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
                    max_tokens=2048,
                    messages=[{"role": "user", "content": prompt}]
                )
                parsed = cls._extract_json(res.content[0].text)
                if isinstance(parsed, list):
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
                if isinstance(parsed, list):
                    return [QuizQuestion(**q) for q in parsed]
            except Exception as e:
                print(f"[LLMService] Gemini API quiz failed: {e}. Falling back...")

        # Heuristic fallback quiz generator
        return cls._fallback_quiz_generate(content_text)

    @classmethod
    def _heuristic_profile_parse(cls, req: ProfileRequest, nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        text_corpus = f"{req.designation} {req.department} {req.job_role} {req.education} {' '.join(req.prior_trainings)}".lower()

        for node in nodes:
            node_id = node["id"]
            node_name = node["name"].lower()
            domain = node["domain"]

            level = "none"

            # Check matching keywords in profile
            if any(term in text_corpus for term in node_name.split()) or any(tr.lower() in text_corpus for tr in req.prior_trainings):
                if req.experience_years >= 5:
                    level = "intermediate"
                elif req.experience_years >= 2:
                    level = "basic"
                else:
                    level = "basic"
            elif domain == "statistical" and ("stat" in text_corpus or "investigator" in text_corpus):
                level = "basic" if req.experience_years < 3 else "intermediate"
            elif domain == "behavioural" and req.experience_years >= 3:
                level = "basic"

            results.append({"node_id": node_id, "current_level": level})

        return results

    @classmethod
    def _fallback_quiz_generate(cls, text: str) -> List[QuizQuestion]:
        topic = text[:40].strip() if text else "Statistical Concepts"
        return [
            QuizQuestion(
                question=f"Based on the training content regarding '{topic}...', which principle is essential?",
                options=[
                    "Adherence to standard statistical methodology & data validation",
                    "Ignoring sampling error bounds during estimation",
                    "Manual override of automated quality checks",
                    "Elimination of survey documentation"
                ],
                correct_index=0,
                explanation="Standard statistical methodology and data validation ensure reliable national indicators."
            ),
            QuizQuestion(
                question="What is the primary objective of data quality frameworks in official statistics?",
                options=[
                    "Reducing data collection speed",
                    "Ensuring accuracy, timeliness, and credibility of metrics",
                    "Limiting public access to statistical reports",
                    "Replacing field surveys with assumptions"
                ],
                correct_index=1,
                explanation="Quality frameworks (like UN NQAF) ensure data accuracy, timeliness, and user trust."
            ),
            QuizQuestion(
                question="Which practice enhances security when handling official survey datasets?",
                options=[
                    "Storing unencrypted raw data on public drives",
                    "Sharing administrative credentials across departments",
                    "Applying data anonymization and encryption protocols",
                    "Disabling firewall protections"
                ],
                correct_index=2,
                explanation="Data anonymization and encryption safeguard sensitive personal information under DPDP guidelines."
            )
        ]

    @classmethod
    def _extract_json(cls, raw_text: str) -> Any:
        try:
            # Strip markdown code fencing if present
            cleaned = re.sub(r"```json\s*", "", raw_text)
            cleaned = re.sub(r"```\s*", "", cleaned).strip()
            return json.loads(cleaned)
        except Exception:
            # Try regex to locate json array
            match = re.search(r"\[.*\]", raw_text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except Exception:
                    pass
            return None
