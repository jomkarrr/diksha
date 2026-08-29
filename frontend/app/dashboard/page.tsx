"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { CompetencyRadar } from "@/components/charts/CompetencyRadar";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { fetchRoadmap } from "@/lib/api/roadmap";
import {
  demoLearner,
  demoRoadmap,
  competencyCatalogue,
  learningResources,
  levelScore,
} from "@/lib/mock/data";
import { getDomainRadarData, getOverallReadiness } from "@/lib/utils/chartData";
import type { RoadmapItem } from "@/lib/types/contracts";

export default function DashboardPage() {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(demoRoadmap);
  const [status, setStatus] = useState<"loading" | "ready" | "demo">("loading");

  useEffect(() => {
    const profileId = window.localStorage.getItem("diksha_profile_id") || "demo-profile";
    fetchRoadmap({ profile_id: profileId, job_role: demoLearner.job_role })
      .then((data) => {
        setRoadmap(data.roadmap.length ? data.roadmap : demoRoadmap);
        setStatus("ready");
      })
      .catch(() => {
        setRoadmap(demoRoadmap);
        setStatus("demo");
      });
  }, []);

  // Derived metrics from the catalogue
  const overallReadiness = useMemo(() => getOverallReadiness(competencyCatalogue), []);
  const radarData = useMemo(() => getDomainRadarData(competencyCatalogue), []);
  const highPriorityGapCount = useMemo(() => {
    return competencyCatalogue.filter((c) => c.gap_severity === "high").length;
  }, []);

  // Top high priority gap for AI insight
  const topHighGap = useMemo(() => {
    return (
      competencyCatalogue.find((c) => c.gap_severity === "high") ||
      competencyCatalogue[0]
    );
  }, []);

  const topGapImpactPct = useMemo(() => {
    const current = levelScore[topHighGap.current_level] || 0;
    const required = levelScore[topHighGap.required_level] || 3;
    return Math.round(((required - current) / required) * 100);
  }, [topHighGap]);

  // Next active learning resource
  const activeCourse = useMemo(() => {
    return learningResources[0];
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Learner Overview"
        title={`Good morning, ${demoLearner.name.split(" ")[0]}. Your competency development overview`}
        description="AI-powered readiness, learning priorities, and next actions for Official Statistics."
        action={status === "demo" ? <Badge tone="warning">Demo data</Badge> : <Badge tone="success">Backend connected</Badge>}
      />

      <StaggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <MetricCard
            label="Competency readiness"
            value={`${overallReadiness}%`}
            detail="Aggregate across official catalogue"
            icon="trending_up"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Learning active"
            value={String(roadmap.length)}
            detail="Targeted modules in roadmap"
            icon="menu_book"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Priority gaps"
            value={String(highPriorityGapCount)}
            detail="High severity items flagged"
            icon="warning"
            tone="danger"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Catalogued Nodes"
            value={String(competencyCatalogue.length)}
            detail="Mapped to role profile"
            icon="task_alt"
            tone="neutral"
          />
        </StaggerItem>
      </StaggerChildren>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <FadeIn delay={0.15}>
          <section className="card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Icon name="radar" className="text-primary" />
                <h2 className="text-xl font-semibold">Domain Capability Profile</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Aggregated 4-domain readiness derived directly from official competency level scores.
              </p>
              <div className="mt-2">
                <CompetencyRadar data={radarData} />
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between">
              <Link href="/competencies" className="text-sm font-semibold text-[#F4511E] inline-flex items-center gap-1">
                View Full Competency Matrix <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Competency Overview</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Calculated current vs required coverage</p>
              </div>
              <Link href="/competencies" className="text-sm font-semibold text-[#F4511E]">View all</Link>
            </div>
            <div className="mt-5 space-y-4">
              {competencyCatalogue.slice(0, 4).map((item) => {
                const current = levelScore[item.current_level] || 0;
                const required = levelScore[item.required_level] || 3;
                const pct = Math.round((current / required) * 100);
                return (
                  <AnimatedProgressBar
                    key={item.node_id}
                    value={pct}
                    label={
                      <div className="flex items-center justify-between w-full pr-2">
                        <span className="font-medium text-on-surface">{item.name}</span>
                        <span className="text-xs capitalize text-on-surface-variant">
                          {item.current_level} / {item.required_level}
                        </span>
                      </div>
                    }
                  />
                );
              })}
            </div>
            <div className="mt-6 rounded-lg bg-surface p-3.5 border border-slate-200">
              <div className="flex items-center gap-2">
                <Icon name="smart_toy" className="text-primary text-[18px]" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">AI Recommendation</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                Your highest-priority gap is <strong>{topHighGap.name}</strong> ({topHighGap.current_level} &rarr; {topHighGap.required_level}). Addressing this gap addresses {topGapImpactPct}% of unfulfilled requirements in this competency.
              </p>
            </div>
          </section>
        </FadeIn>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <FadeIn>
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-xl font-semibold">Priority Skill Gaps</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Ordered by sequence and prerequisite logic</p>
              </div>
              <Link href="/roadmap" className="text-sm font-semibold text-[#F4511E]">Open roadmap</Link>
            </div>
            {status === "loading" ? (
              <div className="p-5">
                <LoadingSkeleton count={3} />
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {roadmap.slice(0, 4).map((item) => (
                  <Link key={item.node_id} href="/roadmap" className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 text-sm capitalize text-on-surface-variant">
                        Level {item.current_level} &rarr; Target {item.required_level}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge severity={item.gap_severity}>{item.gap_severity}</Badge>
                      <Icon name="arrow_forward_ios" className="text-[16px] text-on-surface-variant" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section className="card p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <div className="mt-4 rounded-lg border border-slate-200 bg-surface p-4">
                <Badge tone="primary">{activeCourse.provider}</Badge>
                <h3 className="mt-3 font-semibold text-base">{activeCourse.title}</h3>
                <p className="mt-2 text-sm text-on-surface-variant">{activeCourse.reason}</p>
                <div className="mt-4">
                  <AnimatedProgressBar value={activeCourse.progress} label={`Course Progress (${activeCourse.duration})`} />
                </div>
              </div>
            </div>
            <Link
              href={`/resources/${activeCourse.id}`}
              className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F4511E] py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
            >
              Resume Course <Icon name="play_arrow" className="text-[18px]" />
            </Link>
          </section>
        </FadeIn>
      </div>
    </AppShell>
  );
}
