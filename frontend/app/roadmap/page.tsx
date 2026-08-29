"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { fetchRoadmap } from "@/lib/api/roadmap";
import { demoLearner, demoRoadmap } from "@/lib/mock/data";
import type { RoadmapItem } from "@/lib/types/contracts";
import { FadeIn } from "@/components/motion/FadeIn";

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>(demoRoadmap);
  const [status, setStatus] = useState<"loading" | "ready" | "demo" | "empty">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    const profileId = window.localStorage.getItem("diksha_profile_id");
    const jobRole = window.localStorage.getItem("diksha_job_role") || demoLearner.job_role;
    const queryProfileId = profileId || "demo-profile";

    fetchRoadmap({ profile_id: queryProfileId, job_role: jobRole })
      .then((data) => {
        setHasProfile(Boolean(profileId));
        if (data && Array.isArray(data.roadmap)) {
          setItems(data.roadmap);
          setStatus(data.roadmap.length > 0 ? "ready" : "empty");
          setErrorMessage(null);
        } else {
          setItems(demoRoadmap);
          setStatus("demo");
        }
      })
      .catch((err) => {
        setHasProfile(Boolean(profileId));
        setItems(demoRoadmap);
        setStatus("demo");
        setErrorMessage(err instanceof Error ? err.message : "Failed to load live backend roadmap.");
      });
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Learning Roadmap"
        title="Personalized Learning Roadmap"
        description="A prerequisite-aware sequence from competency gap to recommended learning, practice, assessment, and improvement."
        action={
          status === "demo" ? (
            <Badge tone="warning">Mock fallback</Badge>
          ) : status === "loading" ? (
            <Badge>Loading</Badge>
          ) : (
            <Badge tone="success">Backend data ({items.length} nodes)</Badge>
          )
        }
      />

      {/* Notice banner if fallback is active */}
      {status === "demo" && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Icon name="info" className="text-amber-700 text-[18px]" />
            <span>
              {errorMessage
                ? `Notice: Backend connection failed (${errorMessage}). Displaying verified fallback roadmap.`
                : "Notice: Backend returned fallback dataset. Displaying offline roadmap."}
            </span>
          </div>
          {!hasProfile && (
            <Link
              href="/profile"
              className="font-semibold text-amber-900 underline hover:text-amber-950"
            >
              Analyze Profile &rarr;
            </Link>
          )}
        </div>
      )}

      {status === "loading" ? (
        <FadeIn>
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Icon name="hub" className="animate-spin text-[18px]" />
              <span>Generating personalized roadmap from AI assessment...</span>
            </div>
            <div className="shimmer h-2 rounded-full w-full" />
            <div className="grid gap-3 pt-2">
              <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </FadeIn>
      ) : status === "empty" ? (
        <FadeIn>
          <EmptyState
            icon="task_alt"
            title="No Competency Gaps Identified"
            description="The AI assessment determined that all competency requirements for your official job role are currently satisfied."
          />
        </FadeIn>
      ) : (
        <RoadmapTimeline items={items} />
      )}
    </AppShell>
  );
}
