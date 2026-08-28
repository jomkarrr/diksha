import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";

export default function ProgressPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Learning Progress"
        title="Track learning hours, assessments, and competency improvement"
        description="Progress metrics are demo state until backend learning history and assessment persistence are added."
        action={<Badge tone="warning">Demo state</Badge>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Learning hours" value="28" detail="This quarter" icon="schedule" />
        <MetricCard label="Courses completed" value="4" detail="Across 3 domains" icon="school" />
        <MetricCard label="Assessments" value="7" detail="2 this week" icon="quiz" tone="neutral" />
        <MetricCard label="Improvements" value="3" detail="Competencies advanced" icon="trending_up" />
      </div>
      <section className="card mt-6 p-5">
        <h2 className="text-xl font-semibold">Competency Trajectory</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ProgressBar value={82} label="Survey Design" />
          <ProgressBar value={58} label="Sampling Techniques" />
          <ProgressBar value={64} label="Python for Data Analysis" />
          <ProgressBar value={72} label="Effective Communication" />
        </div>
      </section>
      <section className="card mt-6 overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {["Completed Survey Design module", "Generated Sampling assessment", "Asked AI Assistant about stratification"].map((activity) => (
            <div key={activity} className="flex items-center justify-between gap-4 p-5">
              <span className="font-semibold">{activity}</span>
              <span className="text-sm text-on-surface-variant">Today</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
