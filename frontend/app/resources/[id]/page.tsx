"use client";

import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { learningResources } from "@/lib/mock/data";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const resource = learningResources.find((item) => item.id === id) || learningResources[0];

  return (
    <AppShell>
      <section className="card overflow-hidden">
        <div className="relative border-b border-slate-200 bg-surface-container-low p-6 md:p-8">
          <FadeIn>
            <div className="absolute inset-0 w-2/3 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <Badge>{resource.domain} Domain</Badge>
                <Badge tone="primary">{resource.provider}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-10">{resource.title}</h1>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{resource.reason}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1"><Icon name="schedule" className="text-[16px]" /> {resource.duration}</span>
                <span className="flex items-center gap-1"><Icon name="school" className="text-[16px]" /> {resource.difficulty}</span>
                <span className="flex items-center gap-1"><Icon name="verified" className="text-[16px]" /> Mock catalogue</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/assessments?topic=${encodeURIComponent(`${resource.title}. ${resource.reason || ""}`.trim())}`}
                  className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] transition"
                >
                  Start Learning <Icon name="play_arrow" />
                </Link>
                <button className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[#F4511E] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#F4511E]">
                  <Icon name="bookmark_border" /> Save for Later
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
        <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              This resource strengthens statistical methodology, applied reasoning, and practice readiness for official statistical assignments.
            </p>
            <h2 className="mt-6 text-xl font-semibold">Learning Objectives</h2>
            <ul className="mt-3 space-y-3 text-sm text-on-surface-variant">
              <li>Apply the relevant methodology in official survey contexts.</li>
              <li>Interpret results for policy and administrative reporting.</li>
              <li>Prepare for AI-generated competency assessment.</li>
            </ul>
          </div>
          <aside className="rounded-lg border border-slate-200 bg-surface p-5">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <div className="mt-4">
              <AnimatedProgressBar value={resource.progress} label={`${resource.progress}% complete`} />
            </div>
            <StaggerChildren className="mt-5 space-y-3">
              {["Module 1: Concepts", "Module 2: Official application", "Module 3: Practice assessment"].map((module, index) => (
                <StaggerItem key={module}>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                    <Icon name={index === 0 ? "task_alt" : "radio_button_unchecked"} className={index === 0 ? "text-[#F4511E]" : "text-on-surface-variant"} />
                    <span className="text-sm">{module}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
