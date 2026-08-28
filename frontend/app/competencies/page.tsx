import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CompetencyTable } from "@/components/competency/CompetencyTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function CompetenciesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="My Competencies"
        title="Review your current skill levels against role requirements"
        description="Competency levels combine profile analysis, learning progress, and assessment readiness for the current demo state."
        action={<Link href="/competencies/stat-sampling-101" className="focus-ring rounded-lg border border-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#F4511E]">Export Report</Link>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Statistical" value="68%" detail="Core domain readiness" icon="monitoring" />
        <MetricCard label="Technical" value="54%" detail="Automation and analysis" icon="terminal" />
        <MetricCard label="Governance" value="61%" detail="Compliance readiness" icon="verified_user" tone="neutral" />
        <MetricCard label="Behavioural" value="74%" detail="Reporting and leadership" icon="groups" tone="neutral" />
      </div>
      <section className="card mt-6 p-5">
        <h2 className="text-xl font-semibold">Capability Overview</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {["Survey Design", "Sampling", "Python", "Data Privacy", "Communication"].map((label, index) => (
            <ProgressBar key={label} value={[80, 42, 55, 38, 72][index]} label={label} />
          ))}
        </div>
      </section>
      <div className="mt-6">
        <CompetencyTable />
      </div>
    </AppShell>
  );
}
