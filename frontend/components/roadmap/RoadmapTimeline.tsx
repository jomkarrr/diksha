import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { RoadmapItem } from "@/lib/types/contracts";

type RoadmapTimelineProps = {
  items: RoadmapItem[];
};

const statusByIndex = ["In Progress", "Recommended", "Locked", "Locked"];

export function RoadmapTimeline({ items }: RoadmapTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="card border-l-4 border-l-[#F4511E] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="label text-on-surface-variant">Current competency state</p>
            <h2 className="mt-1 text-lg font-semibold">Role baseline captured</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Your official profile has been mapped against current role requirements.</p>
          </div>
          <Badge tone="success">Completed</Badge>
        </div>
      </div>

      {items.map((item, index) => {
        const status = statusByIndex[index] || "Recommended";
        const firstCourse = item.matched_courses[0];
        return (
          <div key={item.node_id} className="relative pl-7">
            <div className="absolute left-2 top-0 h-full w-px bg-slate-200" />
            <div className="absolute left-0 top-5 grid h-4 w-4 place-items-center rounded-full bg-[#F4511E] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
            <section className="card p-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge severity={item.gap_severity}>{item.gap_severity} gap</Badge>
                    <Badge tone="neutral">{status}</Badge>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    Move from <span className="font-semibold capitalize text-on-surface">{item.current_level}</span> to{" "}
                    <span className="font-semibold capitalize text-on-surface">{item.required_level}</span> through targeted learning,
                    practice, and assessment.
                  </p>
                  {firstCourse ? (
                    <div className="mt-4 rounded-lg border border-slate-200 bg-surface p-3">
                      <p className="label text-on-surface-variant">Recommended learning</p>
                      <p className="mt-1 font-semibold">{firstCourse.title}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-on-surface-variant">
                        <Icon name="schedule" className="text-[16px]" /> {firstCourse.duration_hours} hours
                      </p>
                    </div>
                  ) : null}
                </div>
                <Link
                  href={firstCourse ? `/resources/${firstCourse.course_id}` : "/resources"}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                >
                  View Resource <Icon name="arrow_forward" />
                </Link>
              </div>
            </section>
          </div>
        );
      })}

      <div className="relative pl-7">
        <div className="absolute left-0 top-5 grid h-4 w-4 place-items-center rounded-full border border-slate-300 bg-white" />
        <section className="card p-4 opacity-80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label text-on-surface-variant">Assessment</p>
              <h3 className="mt-1 text-lg font-semibold">AI-generated competency assessment</h3>
              <p className="mt-1 text-sm text-on-surface-variant">Validate improvement after learning completion.</p>
            </div>
            <Badge tone="neutral">Locked</Badge>
          </div>
        </section>
      </div>
    </div>
  );
}
