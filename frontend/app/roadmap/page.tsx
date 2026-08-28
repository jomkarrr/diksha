"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchRoadmap } from "@/lib/api/roadmap";
import { demoLearner, demoRoadmap } from "@/lib/mock/data";
import type { RoadmapItem } from "@/lib/types/contracts";

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>(demoRoadmap);
  const [status, setStatus] = useState<"loading" | "ready" | "demo" | "empty">("loading");

  useEffect(() => {
    const profileId = window.localStorage.getItem("diksha_profile_id") || "demo-profile";
    fetchRoadmap({ profile_id: profileId, job_role: demoLearner.job_role })
      .then((data) => {
        setItems(data.roadmap);
        setStatus(data.roadmap.length ? "ready" : "empty");
      })
      .catch(() => {
        setItems(demoRoadmap);
        setStatus("demo");
      });
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Learning Roadmap"
        title="Personalized Learning Roadmap"
        description="A prerequisite-aware sequence from competency gap to recommended learning, practice, assessment, and improvement."
        action={status === "demo" ? <Badge tone="warning">Mock fallback</Badge> : status === "loading" ? <Badge>Loading</Badge> : <Badge tone="success">Backend data</Badge>}
      />
      {status === "loading" ? (
        <div className="card p-6">
          <p className="font-semibold">Generating personalized roadmap...</p>
          <div className="shimmer mt-4 h-2 rounded-full" />
        </div>
      ) : status === "empty" ? (
        <EmptyState icon="task_alt" title="No competency gaps identified" description="The backend returned an empty roadmap for this profile and role." />
      ) : (
        <RoadmapTimeline items={items} />
      )}
    </AppShell>
  );
}
