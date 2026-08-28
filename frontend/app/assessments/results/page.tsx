import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function AssessmentResultsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Assessment Results"
        title="Sampling Techniques assessment feedback"
        description="Demo result state. Backend scoring, persistence, and competency update endpoints are still required."
        action={<Badge tone="warning">Not persisted</Badge>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Score" value="82%" detail="4 of 5 correct" icon="military_tech" />
        <MetricCard label="Previous level" value="Basic" detail="Before learning" icon="history" tone="neutral" />
        <MetricCard label="Updated level" value="Intermediate" detail="Demo-only update" icon="trending_up" />
      </div>
      <section className="card mt-6 p-5">
        <h2 className="text-xl font-semibold">AI Feedback</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          You correctly identified when stratification improves representation. Review variance estimation for unequal stratum sizes before
          attempting the advanced assessment.
        </p>
        <div className="mt-5 max-w-xl">
          <ProgressBar value={82} label="Competency improvement signal" />
        </div>
        <Link href="/roadmap" className="mt-6 inline-flex rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
          Continue Roadmap
        </Link>
      </section>
    </AppShell>
  );
}
