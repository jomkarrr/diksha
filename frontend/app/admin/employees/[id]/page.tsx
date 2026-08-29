"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { mockAdminDashboard, competencyCatalogue, levelScore } from "@/lib/mock/data";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const employee = useMemo(() => {
    return mockAdminDashboard.employees.find(
      (emp) => emp.profile_id.toLowerCase() === id.toLowerCase()
    );
  }, [id]);

  // Find competencies related to this employee's top gaps
  const relatedCompetencies = useMemo(() => {
    if (!employee) return [];
    return competencyCatalogue.filter((c) =>
      employee.top_gaps.some(
        (gap) => gap.toLowerCase() === c.name.toLowerCase()
      )
    );
  }, [employee]);

  // Fallback to top catalogue items if no exact name match
  const displayCompetencies = useMemo(() => {
    return relatedCompetencies.length > 0
      ? relatedCompetencies
      : competencyCatalogue.slice(0, 3);
  }, [relatedCompetencies]);

  // Calculate actual mathematically derived role fit percentage
  const roleFitPct = useMemo(() => {
    if (displayCompetencies.length === 0) return 0;
    const currentTotal = displayCompetencies.reduce(
      (acc, c) => acc + (levelScore[c.current_level] || 0),
      0
    );
    const reqTotal = displayCompetencies.reduce(
      (acc, c) => acc + (levelScore[c.required_level] || 3),
      0
    );
    return reqTotal > 0 ? Math.round((currentTotal / reqTotal) * 100) : 0;
  }, [displayCompetencies]);

  if (!employee) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Workforce Directory"
          title="Official Record Not Found"
          description="The requested employee record could not be found in the current cadre database."
        />
        <div className="mt-6">
          <EmptyState
            icon="person_off"
            title="Unknown Profile Identifier"
            description={`Could not find any official mapped to profile ID "${id}".`}
          />
          <div className="mt-6 text-center">
            <Link
              href="/admin/analytics"
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
            >
              <Icon name="arrow_back" /> Back to Workforce Analytics
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Cadre Review · ${employee.department}`}
        title={employee.name}
        description={`Profile ID: ${employee.profile_id} · Average Gap Severity: ${employee.avg_gap_severity.toUpperCase()}`}
        action={
          <div className="flex items-center gap-3">
            <Badge severity={employee.avg_gap_severity}>
              {employee.avg_gap_severity} Gap Profile
            </Badge>
            <Link
              href="/admin/analytics"
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase text-on-surface-variant hover:bg-surface-container-high transition"
            >
              <Icon name="arrow_back" className="text-[16px]" /> All Officials
            </Link>
          </div>
        }
      />

      <StaggerChildren className="grid gap-4 md:grid-cols-3">
        <StaggerItem>
          <MetricCard
            label="Current Role Fit"
            value={`${roleFitPct}%`}
            detail="Calculated from flagged competencies"
            icon="monitoring"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Identified Gaps"
            value={String(employee.top_gaps.length)}
            detail={employee.top_gaps[0] || "Competencies flagged"}
            icon="warning"
            tone={employee.avg_gap_severity === "high" ? "danger" : "neutral"}
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Flagged Nodes"
            value={String(displayCompetencies.length)}
            detail="Active review subjects"
            icon="trending_up"
          />
        </StaggerItem>
      </StaggerChildren>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <FadeIn delay={0.1}>
          <section className="card p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-semibold">Priority Competency Assessment</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Targeted competencies flagged for supervisory learning intervention
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-5">
              {displayCompetencies.map((comp) => {
                const currentScore = levelScore[comp.current_level] || 0;
                const reqScore = levelScore[comp.required_level] || 3;
                const pct = Math.round((currentScore / reqScore) * 100);

                return (
                  <div key={comp.node_id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <Link
                        href={`/competencies/${comp.node_id}`}
                        className="font-semibold text-on-surface hover:text-[#F4511E] hover:underline"
                      >
                        {comp.name}
                      </Link>
                      <span className="capitalize text-on-surface-variant">
                        Current: {comp.current_level} &rarr; Target: {comp.required_level} ({pct}%)
                      </span>
                    </div>
                    <AnimatedProgressBar value={pct} />
                  </div>
                );
              })}
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.15}>
          <section className="card p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recommended Supervisor Interventions</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                AI-suggested workforce upskilling actions for {employee.name}
              </p>
              <StaggerChildren className="mt-4 space-y-3">
                <StaggerItem>
                  <div className="rounded-lg border border-slate-200 bg-surface p-3.5 text-xs">
                    <div className="flex items-center justify-between font-semibold text-on-surface">
                      <span>Assign iGOT Mandatory Module</span>
                      <Badge tone="primary">High Priority</Badge>
                    </div>
                    <p className="mt-1 text-on-surface-variant">
                      Enroll official in &ldquo;{employee.top_gaps[0] || "Advanced Methodology"}&rdquo; for next quarterly cycle.
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="rounded-lg border border-slate-200 bg-surface p-3.5 text-xs">
                    <div className="flex items-center justify-between font-semibold text-on-surface">
                      <span>Schedule Senior Officer Review</span>
                      <Badge tone="neutral">Mentorship</Badge>
                    </div>
                    <p className="mt-1 text-on-surface-variant">
                      Pair with Senior Statistical Officer at {employee.department} for verification practice.
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="rounded-lg border border-slate-200 bg-surface p-3.5 text-xs">
                    <div className="flex items-center justify-between font-semibold text-on-surface">
                      <span>Post-Learning Assessment</span>
                      <Badge tone="neutral">Validation</Badge>
                    </div>
                    <p className="mt-1 text-on-surface-variant">
                      Trigger automated DIKSHA competency quiz upon module completion.
                    </p>
                  </div>
                </StaggerItem>
              </StaggerChildren>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
              <button className="focus-ring rounded-lg bg-[#F4511E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] transition">
                Authorize Learning Plan
              </button>
            </div>
          </section>
        </FadeIn>
      </div>
    </AppShell>
  );
}
