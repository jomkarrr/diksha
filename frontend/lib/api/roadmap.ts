import { apiFetch } from "./client";
import type { RoadmapRequest, RoadmapResponse } from "@/lib/types/contracts";

export function fetchRoadmap(payload: RoadmapRequest) {
  return apiFetch<RoadmapResponse>("/roadmap", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
