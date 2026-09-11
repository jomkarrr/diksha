"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { AnimatePresence, motion } from "framer-motion";
import { generateQuiz, submitQuizAnswers } from "@/lib/api/quiz";
import { demoQuizQuestions } from "@/lib/mock/data";
import type { QuizQuestion, QuizSubmitResponse } from "@/lib/types/contracts";

const DEFAULT_CONTENT = "Stratified random sampling divides a population into homogeneous strata before random selection.";

function AssessmentRunner({ topic, nodeId }: { topic: string | null; nodeId: string | null }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(demoQuizQuestions);
  const [subtopicsTested, setSubtopicsTested] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Array<{ questionIndex: number; selectedOption: number; isCorrect: boolean; subtopic?: string }>>([]);
  const [content, setContent] = useState(topic || DEFAULT_CONTENT);
  const [status, setStatus] = useState<"demo" | "loading" | "ready">("demo");
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitResult, setSubmitResult] = useState<QuizSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (nodeId || topic) {
      loadQuiz();
    }
  }, [nodeId, topic]);

  async function loadQuiz() {
    setStatus("loading");
    setIsCompleted(false);
    setSubmitResult(null);
    setUserAnswers([]);
    setCurrent(0);
    setSelected(null);

    try {
      const data = await generateQuiz(nodeId ? { node_id: nodeId } : { content_text: content });
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setSubtopicsTested(data.subtopics_tested || []);
        setStatus("ready");
      } else {
        setQuestions(demoQuizQuestions);
        setStatus("demo");
      }
    } catch {
      setQuestions(demoQuizQuestions);
      setStatus("demo");
    }
  }

  function handleSelectOption(index: number) {
    if (selected !== null) return;
    setSelected(index);

    const currQ = questions[current];
    const isCorrect = index === currQ.correct_index;

    setUserAnswers((prev) => [
      ...prev.filter((a) => a.questionIndex !== current),
      {
        questionIndex: current,
        selectedOption: index,
        isCorrect,
        subtopic: currQ.subtopic
      }
    ]);
  }

  async function handleFinishAssessment() {
    setIsCompleted(true);
    setSubmitting(true);

    const profileId = typeof window !== "undefined" ? window.localStorage.getItem("diksha_profile_id") || "prof_demo" : "prof_demo";
    const answerItems = questions.map((q, idx) => {
      const ans = userAnswers.find((a) => a.questionIndex === idx);
      return {
        node_id: q.node_id || nodeId || "stat-sampling-101",
        is_correct: Boolean(ans?.isCorrect),
        subtopic: q.subtopic,
        user_answer: ans !== undefined ? q.options[ans.selectedOption] : undefined
      };
    });

    try {
      const res = await submitQuizAnswers(profileId, answerItems, nodeId || undefined);
      setSubmitResult(res);
    } catch (e) {
      console.error("Failed to evaluate objective coverage:", e);
    } finally {
      setSubmitting(false);
    }
  }

  const question = questions[current];
  const totalQuestions = questions.length;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Competency Assessment"
        title={topic ? `Assessment: ${topic}` : "Targeted Knowledge Assessment"}
        description="Verify comprehension of core competency subtopics and evaluate learning objective mastery."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/roadmap"
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-on-surface hover:bg-slate-50 transition"
            >
              <Icon name="route" className="text-[16px]" /> Back to Roadmap
            </Link>
            <Badge tone={status === "ready" ? "success" : "warning"}>
              {status === "ready" ? "AI Generated from Subtopics" : "Demo-ready"}
            </Badge>
          </div>
        }
      />

      {isCompleted ? (
        <FadeIn>
          <div className="space-y-6">
            {/* Objective Coverage & Mastery Summary */}
            <div className="card p-6 border-l-4 border-l-[#F4511E]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Badge tone={scorePct >= 70 ? "success" : "warning"}>
                    {submitResult?.objective_coverage_pct !== undefined
                      ? `${submitResult.objective_coverage_pct}% Objective Coverage`
                      : `${scorePct}% Accuracy`}
                  </Badge>
                  <h2 className="mt-2 text-2xl font-bold text-on-surface">Assessment Complete</h2>
                  <p className="mt-1 text-sm text-on-surface-variant max-w-2xl">
                    {submitResult?.feedback || "Your quiz responses have been analyzed by the LLM against the required competency curriculum."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={loadQuiz}
                    className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[#F4511E] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#F4511E] hover:bg-[#F4511E]/5 transition"
                  >
                    <Icon name="replay" /> Retake
                  </button>
                  <Link
                    href="/dashboard"
                    className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] transition"
                  >
                    View Mastery Dashboard <Icon name="arrow_forward" />
                  </Link>
                </div>
              </div>

              {/* Subtopic Coverage Breakdown */}
              {submitResult && (
                <div className="mt-6 pt-6 border-t border-slate-100 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-green-50/60 p-4 border border-green-200">
                    <div className="flex items-center gap-2 text-green-900 font-semibold text-xs">
                      <Icon name="check_circle" className="text-green-600 text-[18px]" />
                      <span>Covered Learning Objectives ({(submitResult.covered_subtopics || []).length})</span>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-xs text-green-950 list-disc list-inside">
                      {(submitResult.covered_subtopics || []).map((st) => (
                        <li key={st}>{st}</li>
                      ))}
                      {(submitResult.covered_subtopics || []).length === 0 && <li className="italic text-green-800">None completed yet.</li>}
                    </ul>
                  </div>

                  <div className="rounded-lg bg-amber-50/60 p-4 border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                      <Icon name="pending_actions" className="text-amber-600 text-[18px]" />
                      <span>Recommended for Revision ({(submitResult.missed_subtopics || []).length})</span>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-xs text-amber-950 list-disc list-inside">
                      {(submitResult.missed_subtopics || []).map((st) => (
                        <li key={st}>{st}</li>
                      ))}
                      {(submitResult.missed_subtopics || []).length === 0 && <li className="italic text-green-800">All objectives mastered!</li>}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Questions Detailed Breakdown */}
            <div className="card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-on-surface">Question Breakdown</h3>
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const ans = userAnswers.find((a) => a.questionIndex === idx);
                  const isCorrect = ans?.isCorrect;
                  return (
                    <div
                      key={idx}
                      className={`rounded-lg border p-4 text-xs space-y-2 ${
                        isCorrect ? "border-green-200 bg-green-50/20" : "border-red-200 bg-red-50/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-on-surface">
                          Q{idx + 1}: {q.question}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {q.subtopic && <Badge tone="neutral">{q.subtopic}</Badge>}
                          <Badge tone={isCorrect ? "success" : "danger"}>{isCorrect ? "Correct" : "Incorrect"}</Badge>
                        </div>
                      </div>
                      <p className="text-on-surface-variant">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeIn>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <FadeIn from="left">
            <section className="card h-fit p-5 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-on-surface">Target Competency</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Questions are generated directly from the curriculum subtopics for this node.
                </p>
              </div>

              {subtopicsTested.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-on-surface block">Subtopics Evaluated:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {subtopicsTested.map((st) => (
                      <span key={st} className="inline-block rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-on-surface block mb-1.5">Custom Learning Context (Optional):</label>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="focus-ring w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                  rows={4}
                  placeholder="Additional context or notes..."
                />
                <button
                  onClick={loadQuiz}
                  disabled={status === "loading"}
                  className="focus-ring mt-3 w-full rounded-lg bg-[#F4511E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60 hover:bg-[#d84315] transition"
                >
                  {status === "loading" ? "Regenerating..." : "Regenerate Quiz"}
                </button>
              </div>
            </section>
          </FadeIn>

          <section className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">
                  Question {current + 1} of {questions.length}
                </p>
                {question.subtopic && (
                  <p className="text-xs text-primary font-medium mt-0.5">Objective: {question.subtopic}</p>
                )}
              </div>
              <Badge tone="primary">In Progress</Badge>
            </div>
            <div className="mt-4">
              <AnimatedProgressBar value={Math.round(((current + (selected !== null ? 1 : 0)) / questions.length) * 100)} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="mt-6 text-lg font-semibold text-on-surface leading-7">{question.question}</h2>
                <StaggerChildren className="mt-5 space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selected === index;
                    const hasAnswered = selected !== null;
                    const isCorrect = index === question.correct_index;

                    let optionStyle = "border-slate-200 bg-white hover:bg-slate-50 text-on-surface";
                    if (hasAnswered) {
                      if (isCorrect) {
                        optionStyle = "border-green-500 bg-green-50/80 text-green-900 font-medium";
                      } else if (isSelected) {
                        optionStyle = "border-red-500 bg-red-50/80 text-red-900 font-medium";
                      } else {
                        optionStyle = "border-slate-200 bg-slate-50/50 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <StaggerItem key={option}>
                        <button
                          onClick={() => handleSelectOption(index)}
                          disabled={hasAnswered}
                          className={`focus-ring flex w-full items-start gap-3 rounded-lg border p-4 text-left text-sm transition ${optionStyle}`}
                        >
                          <span className="grid h-6 w-6 place-items-center rounded-full border border-slate-300 text-xs shrink-0 mt-0.5">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1 leading-6">{option}</span>
                          {hasAnswered && isCorrect && <Icon name="check_circle" className="text-green-600 text-[20px]" />}
                          {hasAnswered && isSelected && !isCorrect && <Icon name="cancel" className="text-red-600 text-[20px]" />}
                        </button>
                      </StaggerItem>
                    );
                  })}
                </StaggerChildren>

                {selected !== null && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-5">
                    <span className="font-semibold text-primary block mb-1">Explanation:</span>
                    <p className="text-on-surface">{question.explanation}</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setCurrent(Math.max(0, current - 1));
                  const prevAns = userAnswers.find((a) => a.questionIndex === current - 1);
                  setSelected(prevAns !== undefined ? prevAns.selectedOption : null);
                }}
                disabled={current === 0}
                className="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>

              {current === questions.length - 1 ? (
                <button
                  onClick={handleFinishAssessment}
                  disabled={selected === null || submitting}
                  className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] disabled:opacity-60 transition"
                >
                  {submitting ? "Evaluating..." : "Complete & Evaluate Coverage"} <Icon name="arrow_forward" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrent(Math.min(questions.length - 1, current + 1));
                    const nextAns = userAnswers.find((a) => a.questionIndex === current + 1);
                    setSelected(nextAns !== undefined ? nextAns.selectedOption : null);
                  }}
                  disabled={selected === null}
                  className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] disabled:opacity-60 transition"
                >
                  Next <Icon name="arrow_forward" />
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}

function AssessmentContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");
  const nodeIdParam = searchParams.get("node_id");

  return <AssessmentRunner key={nodeIdParam || topicParam || "default"} topic={topicParam} nodeId={nodeIdParam} />;
}

export default function AssessmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading assessment module...</div>}>
      <AssessmentContent />
    </Suspense>
  );
}
