"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { AnimatePresence, motion } from "framer-motion";
import { generateQuiz, submitQuizAnswers } from "@/lib/api/quiz";
import { demoQuizQuestions } from "@/lib/mock/data";
import type { QuizQuestion, QuizAnswerItem } from "@/lib/types/contracts";

export default function AssessmentsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>(demoQuizQuestions);
  const [current, setCurrent] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<number, number>>({});
  const [content, setContent] = useState("Stratified random sampling divides a population into homogeneous strata before random selection.");
  const [status, setStatus] = useState<"demo" | "loading" | "ready">("demo");
  const [submitting, setSubmitting] = useState(false);

  async function loadQuiz() {
    setStatus("loading");
    try {
      const data = await generateQuiz(content);
      setQuestions(data.questions.length ? data.questions : demoQuizQuestions);
      setCurrent(0);
      setUserSelections({});
      setStatus("ready");
    } catch {
      setQuestions(demoQuizQuestions);
      setStatus("demo");
    }
  }

  function handleSelectOption(optionIndex: number) {
    setUserSelections((prev) => ({ ...prev, [current]: optionIndex }));
  }

  async function handleSubmitQuiz() {
    setSubmitting(true);
    const profileId = typeof window !== "undefined" ? window.localStorage.getItem("diksha_profile_id") || "prof_demo" : "prof_demo";

    let correctCount = 0;
    const answerItems: QuizAnswerItem[] = [];

    questions.forEach((q, idx) => {
      const chosen = userSelections[idx];
      const isCorrect = chosen === q.correct_index;
      if (isCorrect) correctCount++;
      answerItems.push({
        node_id: q.node_id || "stat-sampling-101",
        is_correct: isCorrect
      });
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);

    try {
      const submitResult = await submitQuizAnswers(profileId, answerItems);
      const resultPayload = {
        score_pct: scorePct,
        correct_count: correctCount,
        total_questions: questions.length,
        mastery_updates: submitResult.mastery_updates,
        timestamp: new Date().toISOString()
      };
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("diksha_quiz_result", JSON.stringify(resultPayload));
      }
    } catch {
      const mockResultPayload = {
        score_pct: scorePct,
        correct_count: correctCount,
        total_questions: questions.length,
        mastery_updates: [
          { node_id: "stat-sampling-101", mastery: 75.0, current_level: "intermediate", last_reviewed: new Date().toISOString() }
        ],
        timestamp: new Date().toISOString()
      };
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("diksha_quiz_result", JSON.stringify(mockResultPayload));
      }
    } finally {
      setSubmitting(false);
      router.push("/assessments/results");
    }
  }

  const question = questions[current];
  const selected = userSelections[current];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Assessment"
        title="Competency Assessment: Sampling Techniques"
        description="Generate MCQs from pasted learning text using the live backend quiz endpoint."
        action={<Badge tone={status === "ready" ? "success" : "warning"}>{status === "ready" ? "Backend quiz" : "Demo-ready"}</Badge>}
      />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <FadeIn from="left">
          <section className="card h-fit p-5">
            <h2 className="text-xl font-semibold">Learning Material</h2>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} className="focus-ring mt-4 min-h-40 w-full rounded-lg border border-slate-200 p-3 text-sm" />
            <button onClick={loadQuiz} disabled={status === "loading"} className="focus-ring mt-4 w-full rounded-lg bg-[#F4511E] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60">
              {status === "loading" ? "Generating..." : "Generate Quiz"}
            </button>
          </section>
        </FadeIn>
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Question {current + 1} of {questions.length}</p>
            <Badge tone="primary">In Progress</Badge>
          </div>
          <div className="mt-4"><AnimatedProgressBar value={Math.round(((current + 1) / questions.length) * 100)} /></div>
          
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className="mt-8 text-xl font-semibold">{question.question}</h2>
              <StaggerChildren className="mt-5 space-y-3">
                {question.options.map((option, index) => (
                  <StaggerItem key={option}>
                    <button
                      onClick={() => handleSelectOption(index)}
                      className={`focus-ring flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm ${
                        selected === index ? "border-[#F4511E] bg-[#F4511E]/5" : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-300 text-xs">{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} className="focus-ring rounded-lg border border-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#F4511E]">
              Previous
            </button>
            {current === questions.length - 1 ? (
              <button onClick={handleSubmitQuiz} disabled={submitting} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit"} <Icon name="arrow_forward" />
              </button>
            ) : (
              <button onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))} className="focus-ring rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
                Next
              </button>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
