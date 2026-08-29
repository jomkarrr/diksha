import json
import math
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional
from pathlib import Path
from app.services.data_loader import DataLoader
from app.schemas.contracts import (
    QuizAnswerItem, MasteryUpdateItem, EmployeeDashboardResponse,
    CompetencySummaryItem, RevisionSuggestion, CompetencyLevel
)

ATTEMPTS_DIR = Path(__file__).parent.parent.parent / "data" / "attempts"

def get_level_from_mastery(score: float) -> CompetencyLevel:
    if score >= 81.0:
        return "advanced"
    elif score >= 56.0:
        return "intermediate"
    elif score >= 26.0:
        return "basic"
    else:
        return "none"

def get_initial_mastery(level: str) -> float:
    mapping = {"none": 10.0, "basic": 40.0, "intermediate": 70.0, "advanced": 90.0}
    return mapping.get(level, 10.0)

class MasteryEngine:

    @classmethod
    def process_quiz_submission(cls, profile_id: str, answers: List[QuizAnswerItem]) -> List[MasteryUpdateItem]:
        profile = DataLoader.get_profile(profile_id)
        now_str = datetime.now(timezone.utc).isoformat()

        if not profile:
            # Create default profile state if profile_id not cached
            profile = {
                "profile_id": profile_id,
                "job_role": "Statistical Investigator",
                "competencies": [{"node_id": n["id"], "current_level": "basic"} for n in DataLoader.get_nodes()]
            }

        # Build in-memory mastery map
        mastery_map: Dict[str, Dict[str, Any]] = profile.get("mastery_map", {})
        if not mastery_map:
            for comp in profile.get("competencies", []):
                node_id = comp["node_id"]
                lvl = comp.get("current_level", "none")
                mastery_map[node_id] = {
                    "mastery": get_initial_mastery(lvl),
                    "current_level": lvl,
                    "last_reviewed": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
                }

        updates: List[MasteryUpdateItem] = []

        for ans in answers:
            node_id = ans.node_id
            curr = mastery_map.get(node_id, {
                "mastery": 10.0,
                "current_level": "none",
                "last_reviewed": now_str
            })

            old_mastery = curr["mastery"]
            if ans.is_correct:
                new_mastery = min(100.0, old_mastery + 15.0)
            else:
                new_mastery = max(0.0, old_mastery - 10.0)

            new_level = get_level_from_mastery(new_mastery)

            mastery_map[node_id] = {
                "mastery": new_mastery,
                "current_level": new_level,
                "last_reviewed": now_str
            }

            updates.append(
                MasteryUpdateItem(
                    node_id=node_id,
                    mastery=round(new_mastery, 1),
                    current_level=new_level,
                    last_reviewed=now_str
                )
            )

        # Update profile state in DataLoader
        profile["mastery_map"] = mastery_map
        # Update competencies array
        profile["competencies"] = [
            {"node_id": nid, "current_level": data["current_level"]}
            for nid, data in mastery_map.items()
        ]
        DataLoader.save_profile(profile_id, profile)

        # Persist attempt log to data/attempts/{profile_id}.json
        cls._persist_attempt_log(profile_id, answers, now_str)

        return updates

    @classmethod
    def get_employee_dashboard(cls, profile_id: str) -> EmployeeDashboardResponse:
        nodes = DataLoader.get_nodes()
        nodes_by_id = {n["id"]: n["name"] for n in nodes}
        profile = DataLoader.get_profile(profile_id)

        now = datetime.now(timezone.utc)
        now_str = now.isoformat()

        if not profile:
            # Fallback for un-assessed profile
            mastery_map = {
                n["id"]: {
                    "mastery": get_initial_mastery("basic" if "101" in n["id"] else "none"),
                    "current_level": "basic" if "101" in n["id"] else "none",
                    "last_reviewed": (now - timedelta(days=3)).isoformat()
                }
                for n in nodes
            }
        else:
            mastery_map = profile.get("mastery_map", {})
            if not mastery_map:
                mastery_map = {
                    comp["node_id"]: {
                        "mastery": get_initial_mastery(comp.get("current_level", "none")),
                        "current_level": comp.get("current_level", "none"),
                        "last_reviewed": (now - timedelta(days=2)).isoformat()
                    }
                    for comp in profile.get("competencies", [])
                }

        summary_items: List[CompetencySummaryItem] = []
        total_mastery = 0.0

        for node_id, data in mastery_map.items():
            name = nodes_by_id.get(node_id, node_id)
            m_score = data.get("mastery", 0.0)
            total_mastery += m_score
            summary_items.append(
                CompetencySummaryItem(
                    node_id=node_id,
                    name=name,
                    mastery=round(m_score, 1),
                    last_reviewed=data.get("last_reviewed", now_str)
                )
            )

        avg_progress = (total_mastery / (len(summary_items) * 100.0)) * 100.0 if summary_items else 50.0

        # Attempts & learning hours
        attempts_count = cls._get_attempts_count(profile_id)
        learning_hours = round(attempts_count * 1.5 + 8.0, 1)

        # Forgetting-curve Spaced Repetition Revisions
        suggestions = cls._calculate_revision_suggestions(mastery_map, nodes_by_id)

        return EmployeeDashboardResponse(
            profile_id=profile_id,
            competency_summary=summary_items,
            learning_hours_logged=learning_hours,
            overall_progress_pct=round(avg_progress, 1),
            revision_suggestions=suggestions
        )

    @classmethod
    def _calculate_revision_suggestions(
        cls, mastery_map: Dict[str, Dict[str, Any]], nodes_by_id: Dict[str, str]
    ) -> List[RevisionSuggestion]:
        now = datetime.now(timezone.utc)
        priorities: List[Dict[str, Any]] = []

        for node_id, data in mastery_map.items():
            mastery = data.get("mastery", 0.0)
            if mastery <= 0:
                continue

            last_rev_str = data.get("last_reviewed", now.isoformat())
            try:
                last_rev = datetime.fromisoformat(last_rev_str)
                days_since = max(0, (now - last_rev).days)
            except Exception:
                days_since = 3

            # Forgetting curve decay priority formula
            decay_priority = (days_since * 15.0) / ((mastery / 25.0) + 1.0)
            name = nodes_by_id.get(node_id, node_id)

            if days_since >= 4 and mastery < 80.0:
                reason = f"Not reviewed in {days_since} days, moderate mastery ({int(mastery)}%)"
            elif mastery < 45.0:
                reason = f"Shaky foundation (mastery {int(mastery)}%), review recommended"
            elif days_since >= 7:
                reason = f"Spaced repetition due ({days_since} days since last attempt)"
            else:
                reason = f"Scheduled practice for target role mastery ({int(mastery)}%)"

            priorities.append({
                "node_id": node_id,
                "name": name,
                "priority": decay_priority,
                "reason": reason
            })

        # Sort by decay priority descending
        priorities.sort(key=lambda x: x["priority"], reverse=True)

        return [
            RevisionSuggestion(
                node_id=item["node_id"],
                name=item["name"],
                reason=item["reason"]
            )
            for item in priorities[:4]  # Surface top 3-5 recommendations
        ]

    @classmethod
    def _persist_attempt_log(cls, profile_id: str, answers: List[QuizAnswerItem], timestamp: str):
        ATTEMPTS_DIR.mkdir(parents=True, exist_ok=True)
        file_path = ATTEMPTS_DIR / f"{profile_id}.json"

        history = []
        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    history = json.load(f)
            except Exception:
                history = []

        record = {
            "timestamp": timestamp,
            "answers": [ans.model_dump() for ans in answers]
        }
        history.append(record)

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)

    @classmethod
    def _get_attempts_count(cls, profile_id: str) -> int:
        file_path = ATTEMPTS_DIR / f"{profile_id}.json"
        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return len(data)
            except Exception:
                pass
        return 2  # Default baseline attempts
