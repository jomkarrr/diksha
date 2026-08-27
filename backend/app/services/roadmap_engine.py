from typing import Dict, List, Any
from app.services.data_loader import DataLoader
from app.schemas.contracts import RoadmapNode, MatchedCourse, GapSeverity, CompetencyLevel, RequiredLevel, DomainType

LEVEL_VAL = {
    "none": 0,
    "basic": 1,
    "intermediate": 2,
    "advanced": 3
}

VAL_LEVEL = {0: "none", 1: "basic", 2: "intermediate", 3: "advanced"}

class RoadmapEngine:

    @classmethod
    def calculate_roadmap(cls, competencies: List[Dict[str, Any]], job_role: str) -> List[RoadmapNode]:
        nodes_list = DataLoader.get_nodes()
        nodes_by_id = {node["id"]: node for node in nodes_list}
        courses_list = DataLoader.get_courses()
        job_reqs = DataLoader.get_job_requirements(job_role)

        # Build current level map
        current_map: Dict[str, str] = {comp["node_id"]: comp["current_level"] for comp in competencies}

        # Determine target required level per node
        required_map: Dict[str, str] = {}

        # 1. Add explicitly required nodes for the job role
        for req in job_reqs:
            required_map[req["node_id"]] = req["required_level"]

        # 2. Add prerequisites if target node requires them
        for node_id, req_lvl in list(required_map.items()):
            node = nodes_by_id.get(node_id)
            if node and node.get("prerequisites"):
                for prereq_id in node["prerequisites"]:
                    if prereq_id not in required_map:
                        # Default prerequisite level to basic if not explicitly defined
                        required_map[prereq_id] = "basic"

        roadmap_items: List[Dict[str, Any]] = []

        for node_id, req_lvl_str in required_map.items():
            node = nodes_by_id.get(node_id)
            if not node:
                continue

            curr_lvl_str = current_map.get(node_id, "none")
            curr_val = LEVEL_VAL.get(curr_lvl_str, 0)
            req_val = LEVEL_VAL.get(req_lvl_str, 1)

            # Skip if user already meets or exceeds required level
            if curr_val >= req_val:
                continue

            gap_diff = req_val - curr_val
            if gap_diff >= 2:
                gap_severity: GapSeverity = "high"
            elif gap_diff == 1 and req_val >= 2:
                gap_severity = "medium"
            else:
                gap_severity = "low"

            # Find matching courses from catalog
            matched: List[MatchedCourse] = []
            for course in courses_list:
                if node_id in course.get("node_ids", []):
                    matched.append(
                        MatchedCourse(
                            course_id=course["course_id"],
                            title=course["title"],
                            duration_hours=float(course["duration_hours"])
                        )
                    )

            roadmap_items.append({
                "node_id": node_id,
                "name": node["name"],
                "domain": node["domain"],
                "current_level": curr_lvl_str,
                "required_level": req_lvl_str,
                "gap_severity": gap_severity,
                "prerequisites": node.get("prerequisites", []),
                "matched_courses": matched[:2]  # top 1-2 matched courses
            })

        # Topological sort based on prerequisite dependency graph
        sorted_nodes = cls._topological_sort(roadmap_items)

        # Convert to RoadmapNode objects
        result: List[RoadmapNode] = []
        for item in sorted_nodes:
            result.append(
                RoadmapNode(
                    node_id=item["node_id"],
                    name=item["name"],
                    domain=item["domain"],
                    current_level=item["current_level"],
                    required_level=item["required_level"],
                    gap_severity=item["gap_severity"],
                    matched_courses=item["matched_courses"]
                )
            )

        return result

    @classmethod
    def _topological_sort(cls, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        item_map = {item["node_id"]: item for item in items}
        visited = set()
        temp_visited = set()
        order = []

        def visit(node_id: str):
            if node_id in temp_visited:
                return  # Handle cycle gracefully
            if node_id not in visited:
                temp_visited.add(node_id)
                item = item_map.get(node_id)
                if item:
                    for prereq_id in item.get("prerequisites", []):
                        if prereq_id in item_map:
                            visit(prereq_id)
                temp_visited.remove(node_id)
                visited.add(node_id)
                if item:
                    order.append(item)

        for item in items:
            if item["node_id"] not in visited:
                visit(item["node_id"])

        return order
