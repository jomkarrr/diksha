"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { fetchRoadmap } from "@/lib/api/roadmap";
import { demoLearner, demoRoadmap, competencyCatalogue } from "@/lib/mock/data";
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

  return (
    <AppShell>
      <PageHeader
        eyebrow="Learner Overview"
        title="Good morning, Rajesh. Your competency development overview"
        description="AI-powered readiness, learning priorities, and next actions for Official Statistics."
        action={status === "demo" ? <Badge tone="warning">Demo data</Badge> : <Badge tone="success">Backend connected</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Competency readiness" value="72%" detail="+7% this quarter" icon="trending_up" />
        <MetricCard label="Learning active" value="3" detail="courses in progress" icon="menu_book" />
        <MetricCard label="Priority gaps" value={String(roadmap.length)} detail="recommended actions" icon="warning" tone="danger" />
        <MetricCard label="Assessment streak" value="12" detail="days active" icon="task_alt" tone="neutral" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_1.4fr]">
        <section className="card p-5">
          <div className="flex items-center gap-3">
            <Icon name="smart_toy" className="text-primary" />
            <h2 className="text-xl font-semibold">AI Insight</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Your highest-priority gap is Sampling Techniques. Completing variance estimation practice before the next assessment will
            improve readiness for survey design review work.
          </p>
          <Link href="/assistant" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#F4511E]">
            Ask DIKSHA Assistant <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Competency Overview</h2>
            <Link href="/competencies" className="text-sm font-semibold text-[#F4511E]">View all</Link>
          </div>
          <div className="mt-5 space-y-4">
            {competencyCatalogue.slice(0, 4).map((item) => (
              <ProgressBar
                key={item.node_id}
                value={item.current_level === "intermediate" ? 68 : item.current_level === "basic" ? 42 : 18}
                label={<span>{item.name}</span>}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <h2 className="text-xl font-semibold">Priority Skill Gaps</h2>
            <Link href="/roadmap" className="text-sm font-semibold text-[#F4511E]">Open roadmap</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {roadmap.slice(0, 4).map((item) => (
              <Link key={item.node_id} href="/roadmap" className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm capitalize text-on-surface-variant">
                    {item.current_level} to {item.required_level}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge severity={item.gap_severity}>{item.gap_severity}</Badge>
                  <Icon name="arrow_forward_ios" className="text-[16px] text-on-surface-variant" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <div className="mt-4 rounded-lg border border-slate-200 bg-surface p-4">
            <Badge tone="primary">iGOT Course</Badge>
            <h3 className="mt-3 font-semibold">Complex Sampling & Variance Estimation</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Next module: Estimator variance under stratified design.</p>
            <ProgressBar value={35} />
            <Link href="/resources/igot-stat-104" className="mt-4 inline-flex rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
              Resume
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
