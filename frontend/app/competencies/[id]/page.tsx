import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function CompetencyDetailPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Competency Detail"
        title="Sampling Techniques"
        description="Understand the current gap, role expectation, and recommended learning sequence for official survey work."
      />
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
        <section className="card border-l-4 border-l-[#F4511E] p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">Current: Basic</Badge>
            <Badge tone="primary">Required: Advanced</Badge>
            <Badge severity="high">High Gap</Badge>
          </div>
          <h2 className="mt-5 text-xl font-semibold">Why this matters</h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Sampling decisions affect estimation accuracy, survey cost, field design, and public trust in official statistical outputs.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-surface p-4">
              <p className="label text-on-surface-variant">Current capability</p>
              <p className="mt-2 text-sm leading-6">Understands basic survey sampling terms and simple field applications.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-surface p-4">
              <p className="label text-on-surface-variant">Required capability</p>
              <p className="mt-2 text-sm leading-6">Can evaluate stratified, cluster, and multistage designs with variance implications.</p>
            </div>
          </div>
          <h2 className="mt-6 text-xl font-semibold">Recommended Learning</h2>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-semibold">Complex Sampling & Variance Estimation in Official Surveys</p>
            <p className="mt-1 text-sm text-on-surface-variant">iGOT Karmayogi · 16 hours · Intermediate</p>
            <Link href="/resources/igot-stat-104" className="mt-4 inline-flex rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">Open Course</Link>
          </div>
        </section>
        <aside className="space-y-6">
          <section className="card p-5">
            <h2 className="text-xl font-semibold">Assessment History</h2>
            <div className="mt-4 space-y-4">
              <ProgressBar value={42} label="Baseline" />
              <ProgressBar value={58} label="Practice Test" />
            </div>
          </section>
          <section className="card p-5">
            <h2 className="text-xl font-semibold">Related Competencies</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>Survey Design</Badge>
              <Badge>Data Quality</Badge>
              <Badge>Python</Badge>
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
