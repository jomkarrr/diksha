"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { fetchEmployeeDashboard } from "@/lib/api/dashboard";
import type { EmployeeDashboard } from "@/lib/types/contracts";
import {
  competencyCatalogue,
  domainLabels,
  learningResources,
  levelScore,
} from "@/lib/mock/data";

export default function CompetencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [dashboardData, setDashboardData] = useState<EmployeeDashboard | null>(null);

  useEffect(() => {
    const profileId =
      typeof window !== "undefined"
        ? localStorage.getItem("diksha_profile_id") || "prof_demo"
        : "prof_demo";
    fetchEmployeeDashboard(profileId)
      .then((data) => setDashboardData(data))
      .catch(() => {});
  }, []);

  const baseCompetency = competencyCatalogue.find((c) => c.node_id === id);

  if (!baseCompetency) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Competency Registry"
          title="Competency Not Found"
          description="The requested competency identifier does not exist in the official statistical capability catalogue."
        />
        <div className="mt-6">
          <EmptyState
            icon="search_off"
            title="Unknown Competency ID"
            description={`Could not find any official competency definition mapped to "${id}". Please return to the competency index.`}
          />
          <div className="mt-6 text-center">
            <Link
              href="/competencies"
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
            >
              <Icon name="arrow_back" /> Back to Competency Matrix
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const liveSummary = dashboardData?.competency_summary?.find((s) => s.node_id === id);
  let liveLevel = baseCompetency.current_level;
  let liveMastery = baseCompetency.mastery;

  if (liveSummary?.mastery !== undefined) {
    liveMastery = Math.round(liveSummary.mastery);
    if (liveSummary.mastery >= 81) liveLevel = "advanced";
    else if (liveSummary.mastery >= 56) liveLevel = "intermediate";
    else if (liveSummary.mastery >= 26) liveLevel = "basic";
    else liveLevel = "none";
  }

  const currentScore = levelScore[liveLevel] || 0;
  const requiredScore = levelScore[baseCompetency.required_level] || 3;
  const progressPct = Math.round((currentScore / requiredScore) * 100);

  const competency = {
    ...baseCompetency,
    current_level: liveLevel,
    mastery: liveMastery,
    gap_severity: (currentScore >= requiredScore ? "low" : requiredScore - currentScore >= 2 ? "high" : "medium") as any
  };

  const matchedCourse =
    learningResources.find(
      (r) =>
        r.competency.toLowerCase() === competency.name.toLowerCase() ||
        r.id.includes(competency.node_id.replace("-101", ""))
    ) || learningResources[0];

  const relatedCompetencies = (competency.related_node_ids || [])
    .map((relId) => competencyCatalogue.find((c) => c.node_id === relId))
    .filter(Boolean);

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Competency Detail · ${domainLabels[competency.domain]}`}
        title={competency.name}
        description={`Official ID: ${competency.node_id} · Priority: ${competency.priority}`}
        action={
          <Link
            href="/competencies"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase text-on-surface-variant hover:bg-surface-container-high transition"
          >
            <Icon name="arrow_back" className="text-[16px]" /> All Competencies
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
        <FadeIn>
          <section className="card border-l-4 border-l-[#F4511E] p-5">
            <div className="flex items-center justify-between">
              <Badge tone="primary">{domainLabels[competency.domain]}</Badge>
              <Badge tone={competency.gap_severity === "high" ? "danger" : competency.gap_severity === "medium" ? "warning" : "success"}>
                {competency.gap_severity.toUpperCase()} GAP
              </Badge>
            </div>

            <h2 className="mt-4 text-2xl font-bold font-sans">{competency.name}</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{competency.description}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-surface p-4">
                <div className="flex items-center gap-2">
                  <Icon name="verified" className="text-secondary text-[18px]" />
                  <p className="label text-on-surface-variant">Current Demonstrated Capability</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-on-surface">
                  {competency.current_description}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-surface p-4">
                <div className="flex items-center gap-2">
                  <Icon name="target" className="text-primary text-[18px]" />
                  <p className="label text-on-surface-variant">Target Role Expectation</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-on-surface">
                  {competency.required_description}
                </p>
              </div>
            </div>

            <h2 className="mt-6 text-xl font-semibold">Recommended Learning Path</h2>
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-on-surface">{matchedCourse.title}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {matchedCourse.provider} · {matchedCourse.duration} · {matchedCourse.difficulty}
                  </p>
                  <p className="mt-2 text-xs text-on-surface-variant">{matchedCourse.reason}</p>
                </div>
                <Badge tone="primary">{matchedCourse.provider}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <Link
                  href={`/resources/${matchedCourse.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                >
                  Open Course <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
                <Link
                  href={`/assessments?node_id=${competency.node_id}&topic=${encodeURIComponent(competency.name)}`}
                  className="text-xs font-semibold uppercase text-primary hover:underline"
                >
                  Take Practice Quiz &rarr;
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.15}>
          <aside className="space-y-6">
            <section className="card p-5">
              <h2 className="text-xl font-semibold">Competency Readiness</h2>
              <div className="mt-4 space-y-4">
                <AnimatedProgressBar
                  value={progressPct}
                  label={
                    <span className="font-semibold text-on-surface">
                      Coverage: {competency.current_level} / {competency.required_level}
                    </span>
                  }
                />
                <div className="rounded-lg bg-surface p-3 border border-slate-200 text-xs text-on-surface-variant space-y-1.5">
                  <div className="flex justify-between">
                    <span>Domain:</span>
                    <strong className="text-on-surface">{domainLabels[competency.domain]}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Severity Weight:</span>
                    <strong className="text-on-surface uppercase">{competency.gap_severity}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assessment Readiness:</span>
                    <strong className="text-on-surface">{progressPct >= 66 ? "Prepared" : "Requires Module"}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="card p-5">
              <h2 className="text-xl font-semibold">Related Competencies</h2>
              <p className="mt-1 text-xs text-on-surface-variant">Prerequisites and complementary skill nodes</p>
              <StaggerChildren className="mt-4 flex flex-wrap gap-2">
                {relatedCompetencies.map((rel) => (
                  <StaggerItem key={rel!.node_id}>
                    <Link href={`/competencies/${rel!.node_id}`}>
                      <Badge tone="primary">
                        {rel!.name} &rarr;
                      </Badge>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </section>
          </aside>
        </FadeIn>
      </div>
    </AppShell>
  );
}
