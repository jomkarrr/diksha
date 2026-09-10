"use client";

import { useEffect, useState, useMemo } from "react";
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
import { MetricCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { CompetencyDistribution } from "@/components/charts/CompetencyDistribution";
import { GapSeverityPie } from "@/components/charts/GapSeverityPie";
import { fetchAdminDashboard } from "@/lib/api/dashboard";
import { mockAdminDashboard, competencyCatalogue, levelScore } from "@/lib/mock/data";
import {
  getCompetencyDistributionByDomain,
  getEmployeeGapDistribution,
  getOverallReadiness,
} from "@/lib/utils/chartData";
import type { AdminDashboard } from "@/lib/types/contracts";

export default function WorkforceAnalyticsPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard>(mockAdminDashboard);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  useEffect(() => {
    fetchAdminDashboard()
      .then((data) => {
        setDashboard(data);
        setDemo(false);
        setApiError(null);
      })
      .catch((err) => {
        setDashboard(mockAdminDashboard);
        setDemo(true);
        setApiError(err instanceof Error ? err.message : "Using offline mock dataset");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filtered employee roster (single source of truth for roster & employee analytics)
  const filteredEmployees = useMemo(() => {
    return dashboard.employees.filter((emp) => {
      const q = search.toLowerCase();
      const matchesSearch =
        emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.top_gaps.some((g) => g.toLowerCase().includes(q));
      const matchesSeverity =
        severityFilter === "all" || emp.avg_gap_severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [dashboard.employees, search, severityFilter]);

  // Dynamic Chart Datasets directly derived from source of truth
  const domainDistributionData = useMemo(() => {
    return getCompetencyDistributionByDomain(competencyCatalogue);
  }, []);

  // Employee pie chart reactively updates with filtered roster
  const employeePieData = useMemo(() => {
    return getEmployeeGapDistribution(filteredEmployees);
  }, [filteredEmployees]);

  // Overall readiness score
  const overallReadiness = useMemo(() => {
    return getOverallReadiness(competencyCatalogue);
  }, []);

  // Target role coverage percentage from catalogue
  const targetRoleCoverage = useMemo(() => {
    if (competencyCatalogue.length === 0) return 0;
    const fulfilledCount = competencyCatalogue.filter(
      (c) => (levelScore[c.current_level] || 0) >= (levelScore[c.required_level] || 3)
    ).length;
    return Math.round((fulfilledCount / competencyCatalogue.length) * 100);
  }, []);

  // Top high-priority gaps from the catalogue
  const topOrganizationalGaps = useMemo(() => {
    return competencyCatalogue
      .filter((c) => c.gap_severity === "high" || c.gap_severity === "medium")
      .map((c) => {
        const currentScore = levelScore[c.current_level] || 0;
        const reqScore = levelScore[c.required_level] || 3;
        return {
          node_id: c.node_id,
          name: c.name,
          progress: Math.round((currentScore / reqScore) * 100),
          gap_severity: c.gap_severity,
        };
      });
  }, []);

  const highCount = useMemo(() => {
    return filteredEmployees.filter((emp) => emp.avg_gap_severity === "high").length;
  }, [filteredEmployees]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workforce Analytics"
        title="Workforce Competency Overview"
        description="Supervisor analytics for official statistics readiness, high-priority gaps, and learning completion across departments."
      />

      {/* KPI Cards */}
      {loading ? (
        <MetricCardSkeleton />
      ) : (
        <StaggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StaggerItem>
            <MetricCard
              label="Officials Filtered"
              value={String(filteredEmployees.length)}
              detail={`Of ${dashboard.employees.length} total cadre roster`}
              icon="groups"
            />
          </StaggerItem>
          <StaggerItem>
            <MetricCard
              label="Average Readiness"
              value={`${overallReadiness}%`}
              detail="Across statistical cadres"
              icon="monitoring"
            />
          </StaggerItem>
          <StaggerItem>
            <MetricCard
              label="High-Priority Gaps"
              value={String(highCount)}
              detail="Requires immediate training"
              icon="warning"
              tone="danger"
            />
          </StaggerItem>
          <StaggerItem>
            <MetricCard
              label="Target Role Coverage"
              value={`${targetRoleCoverage}%`}
              detail="iGOT curriculum aligned"
              icon="task_alt"
            />
          </StaggerItem>
        </StaggerChildren>
      )}

      {/* Recharts Row 1: Competency Distribution & Gap Severity Donut */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Competency Distribution by Domain</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Calculated mean readiness percentage across official domains
              </p>
            </div>
            <Badge tone="primary">Recharts</Badge>
          </div>
          <div className="mt-4">
            <CompetencyDistribution data={domainDistributionData} />
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Employee Gap Severity Breakdown</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Distribution of {filteredEmployees.length} officials by skill gap severity
              </p>
            </div>
            <Badge tone="neutral">Cadre Analysis</Badge>
          </div>
          <div className="mt-4">
            <GapSeverityPie data={employeePieData} />
          </div>
        </section>
      </div>

      {/* Recharts Row 2: Top Organizational Gaps & Learning Interventions */}
      <div className="mt-6">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Top Priority Institutional Competency Gaps</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Competencies with High and Medium gap severity requiring department-level training prioritization
              </p>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">
              {topOrganizationalGaps.length} critical focus areas
            </span>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {topOrganizationalGaps.map((gap) => (
              <div key={gap.node_id} className="rounded-lg bg-surface p-3.5 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-on-surface">{gap.name}</span>
                  <Badge severity={gap.gap_severity}>{gap.gap_severity} Gap</Badge>
                </div>
                <AnimatedProgressBar value={gap.progress} label="Cadre Readiness" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Interactive Employee Readiness Roster */}
      <FadeIn delay={0.15}>
        <section className="card mt-6 overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Employee Readiness Roster</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Showing {filteredEmployees.length} of {dashboard.employees.length} registered officials
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="focus-ring h-9 rounded-full border border-slate-200 bg-surface pl-9 pr-4 text-xs"
                  placeholder="Search officials or departments..."
                />
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="focus-ring h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium"
              >
                <option value="all">All Severities</option>
                <option value="high">High Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="low">Low Severity</option>
              </select>
              {(search !== "" || severityFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSeverityFilter("all");
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon="person_search"
                title="No Officials Match Your Filters"
                description="Try clearing your search query or adjusting the gap severity filter."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-200 text-on-surface-variant">
                  <tr>
                    <th className="label px-5 py-3">Official</th>
                    <th className="label px-5 py-3">Department</th>
                    <th className="label px-5 py-3">Avg Gap</th>
                    <th className="label px-5 py-3">Top Identified Gaps</th>
                    <th className="label px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.profile_id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4 font-semibold text-on-surface">{employee.name}</td>
                      <td className="px-5 py-4 text-on-surface-variant">{employee.department}</td>
                      <td className="px-5 py-4">
                        <Badge severity={employee.avg_gap_severity}>
                          {employee.avg_gap_severity}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs text-on-surface-variant">
                        {employee.top_gaps.join(", ")}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/employees/${employee.profile_id}`}
                          className="font-semibold text-xs text-[#F4511E] uppercase hover:underline"
                        >
                          Review &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </FadeIn>
    </AppShell>
  );
}
