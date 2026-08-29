"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { ProgressTrajectory } from "@/components/charts/ProgressTrajectory";
import {
  learningResources,
  competencyCatalogue,
  levelScore,
  demoProgressHistory,
} from "@/lib/mock/data";
import { getProgressTrajectoryData, getOverallReadiness } from "@/lib/utils/chartData";

export default function ProgressPage() {
  const trajectoryData = useMemo(() => {
    return getProgressTrajectoryData(learningResources);
  }, []);

  const totalLearningHours = useMemo(() => {
    return learningResources.reduce((acc, r) => {
      const hrs = parseInt(r.duration) || 0;
      return acc + hrs;
    }, 0);
  }, []);

  const completedCourses = useMemo(() => {
    return learningResources.filter((r) => r.progress === 100).length;
  }, []);

  const totalAssessmentsPassed = useMemo(() => {
    return demoProgressHistory.reduce((acc, h) => acc + h.assessmentsPassed, 0);
  }, []);

  const activeCompetenciesCount = useMemo(() => {
    return competencyCatalogue.filter((c) => levelScore[c.current_level] > 0).length;
  }, []);

  const overallReadiness = useMemo(() => {
    return getOverallReadiness(competencyCatalogue);
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Learning Progress"
        title="Track learning hours, assessments, and competency improvement"
        description="Monitor individual skill trajectory across active iGOT modules and official competency standards."
        action={<Badge tone="warning">Simulated telemetry</Badge>}
      />

      <StaggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <MetricCard
            label="Total Course Hours"
            value={`${totalLearningHours}h`}
            detail="Across active curriculum"
            icon="schedule"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Enrolled Courses"
            value={String(learningResources.length)}
            detail={`${completedCourses} completed`}
            icon="school"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Assessments Attempted"
            value={String(totalAssessmentsPassed)}
            detail="Validated milestone checks"
            icon="quiz"
            tone="neutral"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Active Competencies"
            value={String(activeCompetenciesCount)}
            detail={`Of ${competencyCatalogue.length} role catalogue nodes`}
            icon="trending_up"
          />
        </StaggerItem>
      </StaggerChildren>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Module Completion Trajectory Chart */}
        <FadeIn delay={0.1}>
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Active Module Completion</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Live completion percentages derived from active {learningResources.length} iGOT Karmayogi courses
                </p>
              </div>
              <Badge tone="primary">Live State</Badge>
            </div>
            <div className="mt-4">
              <ProgressTrajectory data={trajectoryData} />
            </div>
          </section>
        </FadeIn>

        {/* Competency Readiness Trajectory */}
        <FadeIn delay={0.15}>
          <section className="card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Competency Trajectory</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Current readiness vs target level from catalogue
                  </p>
                </div>
                <Badge tone="neutral">Catalogue</Badge>
              </div>
              <div className="mt-5 space-y-4">
                {competencyCatalogue.slice(0, 4).map((item) => {
                  const currentScore = levelScore[item.current_level] || 0;
                  const reqScore = levelScore[item.required_level] || 3;
                  const pct = Math.round((currentScore / reqScore) * 100);

                  return (
                    <AnimatedProgressBar
                      key={item.node_id}
                      value={pct}
                      label={
                        <div className="flex justify-between items-center w-full pr-2">
                          <span className="font-medium text-on-surface">{item.name}</span>
                          <span className="text-xs text-on-surface-variant capitalize">
                            {item.current_level} / {item.required_level} ({pct}%)
                          </span>
                        </div>
                      }
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-surface p-3 border border-slate-200 text-xs text-on-surface-variant flex items-center justify-between">
              <span>Overall Average Competency Coverage:</span>
              <strong className="text-primary font-semibold">{overallReadiness}%</strong>
            </div>
          </section>
        </FadeIn>
      </div>

      {/* Historical Simulation Disclaimer Banner & Milestone History */}
      <FadeIn delay={0.2}>
        <section className="card mt-6 p-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Quarterly Milestone Telemetry</h2>
                <Badge tone="warning">Prototype Demo Data</Badge>
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">
                Historical telemetry simulation for demonstrating learner development trends before official backend logging integration.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {demoProgressHistory.map((history) => (
              <div key={history.month} className="rounded-lg border border-slate-200 bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="label text-primary">{history.month} 2026</span>
                  <Badge tone="neutral">Avg: {history.avgScore}%</Badge>
                </div>
                <div className="mt-3 space-y-1 text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Hours Logged:</span>
                    <strong className="text-on-surface">{history.completedHours} hrs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Passed Quizzes:</span>
                    <strong className="text-on-surface">{history.assessmentsPassed}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      <section className="card mt-6 overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-semibold">Recent Learning Events</h2>
        </div>
        <StaggerChildren className="divide-y divide-slate-100">
          {learningResources.map((resource) => (
            <StaggerItem key={resource.id}>
              <div className="flex items-center justify-between gap-4 p-5 text-sm">
                <div>
                  <span className="font-semibold text-on-surface">{resource.title}</span>
                  <p className="text-xs text-on-surface-variant mt-0.5">{resource.competency} · {resource.provider}</p>
                </div>
                <Badge tone={resource.progress >= 50 ? "success" : "neutral"}>
                  {resource.progress}% Complete
                </Badge>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>
    </AppShell>
  );
}
