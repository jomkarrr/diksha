"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { fetchAdminDashboard } from "@/lib/api/dashboard";
import { mockAdminDashboard } from "@/lib/mock/data";
import type { AdminDashboard } from "@/lib/types/contracts";

export default function WorkforceAnalyticsPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard>(mockAdminDashboard);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    fetchAdminDashboard()
      .then((data) => setDashboard(data))
      .catch(() => {
        setDashboard(mockAdminDashboard);
        setDemo(true);
      });
  }, []);

  const highCount = dashboard.employees.filter((employee) => employee.avg_gap_severity === "high").length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workforce Analytics"
        title="Workforce Competency Overview"
        description="Supervisor analytics for official statistics readiness, high-priority gaps, and learning completion."
        action={<Badge tone={demo ? "warning" : "success"}>{demo ? "Mock fallback" : "Backend data"}</Badge>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Officials assessed" value={String(dashboard.employees.length)} detail="Current backend roster" icon="groups" />
        <MetricCard label="Average readiness" value="76%" detail="Target: 85%" icon="monitoring" />
        <MetricCard label="High-priority gaps" value={String(highCount)} detail="Need intervention" icon="warning" tone="danger" />
        <MetricCard label="Completion rate" value="91%" detail="Personalized modules" icon="task_alt" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-xl font-semibold">Competency Distribution by Domain</h2>
          <div className="mt-6 flex h-72 items-end gap-5">
            {[45, 62, 88, 56, 38].map((height, index) => (
              <div key={height} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-[#F4511E]" style={{ height: `${height}%`, opacity: 0.35 + index * 0.12 }} />
                <span className="text-xs text-on-surface-variant">{["Field", "Data", "Leadership", "Digital", "Ethics"][index]}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-xl font-semibold">Top Organizational Gaps</h2>
          <div className="mt-5 space-y-5">
            <ProgressBar value={84} label="Advanced Sampling" />
            <ProgressBar value={71} label="AI/ML in Statistics" />
            <ProgressBar value={63} label="Cloud Infrastructure" />
            <ProgressBar value={52} label="Open Data APIs" />
          </div>
        </section>
      </div>
      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-xl font-semibold">Employee Readiness Roster</h2>
          <input className="focus-ring h-9 rounded-full border border-slate-200 bg-surface px-4 text-sm" placeholder="Search employees..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 text-on-surface-variant">
              <tr>
                <th className="label px-5 py-3">Official</th>
                <th className="label px-5 py-3">Department</th>
                <th className="label px-5 py-3">Avg Gap</th>
                <th className="label px-5 py-3">Top Gaps</th>
                <th className="label px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.employees.map((employee) => (
                <tr key={employee.profile_id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold">{employee.name}</td>
                  <td className="px-5 py-4 text-on-surface-variant">{employee.department}</td>
                  <td className="px-5 py-4"><Badge severity={employee.avg_gap_severity}>{employee.avg_gap_severity}</Badge></td>
                  <td className="px-5 py-4 text-on-surface-variant">{employee.top_gaps.join(", ")}</td>
                  <td className="px-5 py-4"><Link href={`/admin/employees/${employee.profile_id}`} className="font-semibold text-[#F4511E]">Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
