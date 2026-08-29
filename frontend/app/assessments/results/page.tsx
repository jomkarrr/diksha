"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

type QuizResultData = {
  score_pct: number;
  correct_count: number;
  total_questions: number;
  mastery_updates: Array<{
    node_id: string;
    mastery: number;
    current_level: string;
    last_reviewed: string;
  }>;
  timestamp: string;
};

export default function AssessmentResultsPage() {
  const [result, setResult] = useState<QuizResultData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.sessionStorage.getItem("diksha_quiz_result");
      if (raw) {
        try {
          setResult(JSON.parse(raw));
        } catch {
          // Keep default
        }
      }
    }
  }, []);

  const scorePct = result ? result.score_pct : 80;
  const correctCount = result ? result.correct_count : 4;
  const totalQuestions = result ? result.total_questions : 5;
  const updatedLevel = result && result.mastery_updates.length ? result.mastery_updates[0].current_level : "intermediate";

  return (
    <AppShell>
      <PageHeader
        eyebrow="Assessment Results"
        title="Competency Assessment Feedback"
        description="Real-time feedback and mastery calculations persisted to your official profile."
        action={<Badge tone="success">Persisted to Profile</Badge>}
      />
      <StaggerChildren className="grid gap-4 md:grid-cols-3">
        <StaggerItem>
          <MetricCard label="Score" value={`${scorePct}%`} detail={`${correctCount} of ${totalQuestions} correct`} icon="military_tech" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Previous level" value="Basic" detail="Before assessment" icon="history" tone="neutral" />
        </StaggerItem>
        <StaggerItem>
          <MetricCard label="Updated level" value={updatedLevel.toUpperCase()} detail="Live mastery update" icon="trending_up" />
        </StaggerItem>
      </StaggerChildren>
      <FadeIn delay={0.2}>
        <section className="card mt-6 p-5">
          <h2 className="text-xl font-semibold">AI Mastery Feedback</h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            {scorePct >= 70
              ? `Excellent performance! You scored ${scorePct}% and demonstrated solid domain knowledge. Your competency mastery has been updated to ${updatedLevel.toUpperCase()}.`
              : `You scored ${scorePct}%. Review the core concepts and complete recommended revision modules on your roadmap to boost your mastery.`}
          </p>
          <div className="mt-5 max-w-xl">
            <AnimatedProgressBar value={scorePct} label="Competency mastery score" />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Link href="/progress" className="inline-flex rounded-lg bg-[#F4511E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">
              View Spaced Repetition Progress
            </Link>
            <Link href="/roadmap" className="inline-flex rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-on-surface">
              Continue Roadmap
            </Link>
          </div>
        </section>
      </FadeIn>
    </AppShell>
  );
}
