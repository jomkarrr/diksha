"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { ProgressTrajectory } from "@/components/charts/ProgressTrajectory";
import { fetchEmployeeDashboard } from "@/lib/api/dashboard";
import { learningResources, demoProgressHistory } from "@/lib/mock/data";
import { getProgressTrajectoryData } from "@/lib/utils/chartData";
import type { EmployeeDashboard } from "@/lib/types/contracts";

export default function ProgressPage() {
  const [data, setData] = useState<EmployeeDashboard | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "demo">("loading");

  useEffect(() => {
    const profileId = typeof window !== "undefined" ? window.localStorage.getItem("diksha_profile_id") || "prof_demo" : "prof_demo";
    fetchEmployeeDashboard(profileId)
      .then((res) => {
        setData(res);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("demo");
      });
  }, []);

  const trajectoryData = useMemo(() => {
    return getProgressTrajectoryData(learningResources);
  }, []);

  const learningHours = data ? data.learning_hours_logged : 14.5;
  const progressPct = data ? data.overall_progress_pct : 68.0;
  const summaryItems = data ? data.competency_summary : [];
  const revisionSuggestions = data ? data.revision_suggestions : [
    { node_id: "stat-sampling-101", name: "Sampling Techniques", reason: "Not reviewed in 4 days, moderate mastery (60%)" },
    { node_id: "tech-python-101", name: "Python for Data Analysis", reason: "Shaky foundation (mastery 35%), review recommended" }
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Adaptive Learning Progress"
        title="Track learning hours, mastery scores, and SM-2 spaced repetition"
        description="Monitor individual skill trajectory across active iGOT modules and official competency standards."
        action={<Badge tone={status === "ready" ? "success" : "warning"}>{status === "ready" ? "Backend Spaced Repetition Live" : "Simulated Telemetry"}</Badge>}
      />

      <StaggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <MetricCard
            label="Total Learning Hours"
            value={`${learningHours}h`}
            detail="Logged training time"
            icon="schedule"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Overall Progress"
            value={`${progressPct}%`}
            detail="Role target mastery"
            icon="trending_up"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Mastery Nodes Tracked"
            value={String(summaryItems.length || 18)}
            detail="Competency node graph"
            icon="task_alt"
            tone="neutral"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Revision Due"
            value={String(revisionSuggestions.length)}
            detail="SM-2 forgetting curve flags"
            icon="warning"
            tone="danger"
          />
        </StaggerItem>
      </StaggerChildren>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <FadeIn delay={0.1}>
          <section className="card p-5">
            <h2 className="text-xl font-semibold">What to Revise Next (SM-2 Spaced Repetition)</h2>
            <p className="mt-1 text-xs text-on-surface-variant">Adaptive memory decay suggestions based on days since last review and current mastery.</p>
            <div className="mt-4 space-y-3">
              {revisionSuggestions.map((item) => (
                <div key={item.node_id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-surface p-4">
                  <div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="mt-1 text-xs text-on-surface-variant">{item.reason}</p>
                  </div>
                  <Link href="/assessments" className="focus-ring rounded-lg bg-[#F4511E] px-3 py-1.5 text-xs font-semibold uppercase text-white">
                    Revise Now
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.15}>
          <section className="card p-5">
            <h2 className="text-xl font-semibold font-sans">Active Competency Mastery</h2>
            <p className="mt-1 text-xs text-on-surface-variant">Live mastery percentages updated dynamically by quiz submissions.</p>
            <div className="mt-4 space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {summaryItems.slice(0, 6).map((item) => (
                <AnimatedProgressBar
                  key={item.node_id}
                  value={item.mastery}
                  label={
                    <div className="flex items-center justify-between w-full pr-2 text-xs">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-on-surface-variant font-semibold">{item.mastery}%</span>
                    </div>
                  }
                />
              ))}
            </div>
          </section>
        </FadeIn>
      </div>

      <div className="mt-6">
        <FadeIn delay={0.2}>
          <section className="card p-5">
            <h2 className="text-xl font-semibold">Skill Acquisition Trajectory</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Cumulative learning hours and milestone checks completed over time.</p>
            <div className="mt-4">
              <ProgressTrajectory data={trajectoryData} />
            </div>
          </section>
        </FadeIn>
      </div>
    </AppShell>
  );
}
