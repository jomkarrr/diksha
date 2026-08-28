import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Employee Detail"
        title="Rajesh Kumar"
        description={`Profile ${id}. Detailed analytics are demo-only until backend employee detail endpoints exist.`}
        action={<Badge tone="warning">Mock detail</Badge>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Readiness" value="72%" detail="Current role fit" icon="monitoring" />
        <MetricCard label="Open gaps" value="3" detail="One high priority" icon="warning" tone="danger" />
        <MetricCard label="Trajectory" value="+11%" detail="Last 60 days" icon="trending_up" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="card p-5">
          <h2 className="text-xl font-semibold">Competency Readiness</h2>
          <div className="mt-5 space-y-5">
            <ProgressBar value={82} label="Survey Design" />
            <ProgressBar value={46} label="Sampling Techniques" />
            <ProgressBar value={57} label="Python for Data Analysis" />
            <ProgressBar value={69} label="Data Quality Frameworks" />
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-xl font-semibold">Recommended Interventions</h2>
          <div className="mt-4 space-y-3">
            {["Assign advanced sampling module", "Schedule mentor review", "Retest after practice assessment"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-surface p-3 text-sm font-semibold">{item}</div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
