import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { learningResources } from "@/lib/mock/data";

export default function ResourcesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Learning Resources"
        title="Discover recommended learning resources"
        description="Browse iGOT Karmayogi, NSSTA, and TPAC recommended learning mapped to official statistics competencies."
      />
      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-4">
          <h2 className="text-lg font-semibold">Refine View</h2>
          {["Domain", "Competency", "Difficulty", "Provider", "Duration"].map((filter) => (
            <label key={filter} className="mt-4 block text-sm font-semibold">
              {filter}
              <select className="focus-ring mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                <option>All {filter}s</option>
              </select>
            </label>
          ))}
        </aside>
        <div className="grid gap-4 lg:grid-cols-2">
          {learningResources.map((resource) => (
            <Link key={resource.id} href={`/resources/${resource.id}`} className="card block p-5 transition hover:shadow-panel">
              <div className="flex items-start justify-between gap-4">
                <Badge tone="primary">{resource.provider}</Badge>
                <span className="flex items-center gap-1 text-sm text-on-surface-variant"><Icon name="schedule" className="text-[16px]" /> {resource.duration}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{resource.title}</h2>
              <p className="mt-2 text-sm text-on-surface-variant">{resource.reason}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{resource.domain}</Badge>
                <Badge>{resource.competency}</Badge>
                <Badge>{resource.difficulty}</Badge>
              </div>
              <div className="mt-5">
                <ProgressBar value={resource.progress} label="Progress" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
