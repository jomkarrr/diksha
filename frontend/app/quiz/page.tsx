"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { MetricCard } from "@/components/ui/MetricCard";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { generateQuiz } from "@/lib/api/quiz";
import type { QuizQuestion } from "@/lib/types/contracts";

type UserAnswerRecord = {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
};

const SAMPLE_MATERIALS = [
  {
    title: "Stratified Sampling",
    text: "Stratified random sampling is a probability sampling technique wherein the total population is divided into homogeneous, mutually exclusive subgroups known as strata before sampling. Independent random samples are then selected from each stratum. This technique reduces overall sampling error, ensures representation of key sub-domains, and allows for variance estimation with optimal stratum allocations such as Neyman allocation."
  },
  {
    title: "NQAF Data Quality",
    text: "The United Nations National Quality Assurance Framework (UN NQAF) provides a structured mechanism for statistical agencies to ensure data accuracy, timeliness, accessibility, coherence, and comparability. Core dimensions include institutional integrity, sound statistical methodology, adequate resources, and strict adherence to confidentiality protocols under official statistics legislation."
  },
  {
    title: "Survey Variance & Clustering",
    text: "In complex multistage survey designs, clustering often increases the design effect (Deff), leading to higher standard errors compared to simple random sampling. To compute valid confidence intervals, survey analysts must apply Taylor series linearization or replication methods such as Jackknife and Balanced Repeated Replication (BRR) to account for strata and primary sampling unit (PSU) cluster correlations."
  }
];

export default function QuizPage() {
  // Phase state: 'input' | 'quiz' | 'result'
  const [phase, setPhase] = useState<"input" | "quiz" | "result">("input");

  // Learning material input state
  const [contentText, setContentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);

  // Word and character counts
  const wordCount = useMemo(() => {
    const trimmed = contentText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [contentText]);

  const charCount = contentText.length;

  // Defensively validate backend questions
  function sanitizeQuestions(rawList: any[]): QuizQuestion[] {
    if (!Array.isArray(rawList)) return [];

    return rawList
      .filter((q) => q && typeof q.question === "string" && Array.isArray(q.options) && q.options.length > 0)
      .map((q) => ({
        question: String(q.question),
        options: q.options.map((opt: any) => String(opt)),
        correct_index:
          typeof q.correct_index === "number" && q.correct_index >= 0 && q.correct_index < q.options.length
            ? q.correct_index
            : 0,
        explanation: typeof q.explanation === "string" ? q.explanation : "No specific explanation provided for this question."
      }));
  }

  // Handle Quiz Generation
  async function handleGenerateQuiz(event?: React.FormEvent) {
    if (event) event.preventDefault();
    const trimmed = contentText.trim();

    if (!trimmed) {
      setErrorMessage("Please paste some learning material first.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await generateQuiz(trimmed);
      const validQuestions = sanitizeQuestions(response.questions);

      if (validQuestions.length === 0) {
        throw new Error("No valid questions could be generated from this text. Try providing more comprehensive material.");
      }

      setQuestions(validQuestions);
      setCurrentIndex(0);
      setSelectedOption(null);
      setUserAnswers([]);
      setPhase("quiz");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to generate the quiz. Please verify the backend service is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // Handle Answer Selection
  function handleSelectOption(optionIndex: number) {
    if (selectedOption !== null) return; // Locked once answered

    const currentQuestion = questions[currentIndex];
    const isCorrect = optionIndex === currentQuestion.correct_index;

    setSelectedOption(optionIndex);
    setUserAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentIndex,
        selectedOptionIndex: optionIndex,
        isCorrect
      }
    ]);
  }

  // Proceed to next question or result
  function handleNextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setPhase("result");
    }
  }

  // Retake same quiz without re-calling backend
  function handleRetakeQuiz() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setPhase("quiz");
  }

  // Generate a new quiz from fresh material
  function handleGenerateNew() {
    setPhase("input");
    setSelectedOption(null);
    setUserAnswers([]);
    setErrorMessage(null);
  }

  // Score calculations
  const totalQuestions = questions.length;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const incorrectCount = userAnswers.length - correctCount;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const currentQuestion = questions[currentIndex];

  return (
    <AppShell>
      {/* PHASE 1: INPUT STATE */}
      {phase === "input" && (
        <>
          <PageHeader
            eyebrow="Assessment Engine"
            title="AI Quiz Generator"
            description="Paste official training manuals, survey guidelines, or course content to automatically generate dynamic multiple-choice competency checks."
            action={<Badge tone="primary">POST /api/quiz</Badge>}
          />

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <FadeIn>
              <section className="card p-6">
                <form onSubmit={handleGenerateQuiz} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-on-surface">
                      Source Learning Material
                    </label>
                    <span className="text-xs text-on-surface-variant font-mono">
                      {wordCount} words · {charCount} chars
                    </span>
                  </div>

                  <textarea
                    value={contentText}
                    onChange={(e) => {
                      setContentText(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    disabled={loading}
                    placeholder="Paste learning notes, survey guidelines, methodology explanations, or official handbook excerpts here..."
                    rows={10}
                    className="focus-ring w-full rounded-lg border border-slate-200 p-4 text-sm leading-6 placeholder:text-slate-400 disabled:bg-slate-50"
                  />

                  {errorMessage && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                      <Icon name="error" className="text-[18px]" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-on-surface-variant">
                      AI will extract key concepts and generate 5 to 8 targeted assessment questions.
                    </span>

                    <button
                      type="submit"
                      disabled={loading || !contentText.trim()}
                      className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-[#F4511E] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60 hover:bg-[#d84315] transition shrink-0"
                    >
                      {loading ? (
                        <>
                          <Icon name="hub" className="animate-spin text-[18px]" />
                          <span>Generating your personalized quiz...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate Quiz</span>
                          <Icon name="arrow_forward" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>
            </FadeIn>

            {/* Quick Sample Chips and Instructions */}
            <FadeIn delay={0.1}>
              <aside className="space-y-6">
                <section className="card p-5">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Icon name="lightbulb" className="text-[20px]" />
                    <h2 className="text-base">Sample Topics for Quick Testing</h2>
                  </div>
                  <p className="mt-1 text-xs text-on-surface-variant leading-5">
                    Click any sample below to automatically load statistical material for testing the AI generation endpoint:
                  </p>
                  <div className="mt-4 space-y-2.5">
                    {SAMPLE_MATERIALS.map((sample) => (
                      <button
                        key={sample.title}
                        type="button"
                        onClick={() => {
                          setContentText(sample.text);
                          setErrorMessage(null);
                        }}
                        className="focus-ring w-full text-left rounded-lg border border-slate-200 bg-surface p-3 transition hover:border-[#F4511E] hover:bg-slate-50"
                      >
                        <span className="block font-semibold text-xs text-primary">{sample.title}</span>
                        <span className="block text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                          {sample.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="card p-5 bg-surface-container-low/40">
                  <h3 className="text-sm font-semibold text-on-surface">Assessment Guidelines</h3>
                  <ul className="mt-3 space-y-2 text-xs text-on-surface-variant leading-5 list-disc list-inside">
                    <li>Supports any official statistics curriculum or handbook text.</li>
                    <li>Questions test factual retention, conceptual reasoning, and methodology.</li>
                    <li>Explanations are immediately provided after each response.</li>
                  </ul>
                </section>
              </aside>
            </FadeIn>
          </div>
        </>
      )}

      {/* PHASE 2: QUESTION-BY-QUESTION QUIZ VIEW */}
      {phase === "quiz" && currentQuestion && (
        <>
          <PageHeader
            eyebrow={`AI Competency Assessment · Question ${currentIndex + 1} of ${totalQuestions}`}
            title="Statistical Knowledge Assessment"
            description="Select the most accurate response for each question. Explanations will appear upon answer selection."
            action={
              <div className="flex items-center gap-2">
                <Badge tone="primary">Question {currentIndex + 1}/{totalQuestions}</Badge>
                <button
                  onClick={handleGenerateNew}
                  className="text-xs font-semibold text-on-surface-variant hover:text-[#F4511E] underline ml-2"
                >
                  Exit Quiz
                </button>
              </div>
            }
          />

          <div className="mx-auto max-w-3xl space-y-6">
            {/* Progress Bar */}
            <div className="card p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant mb-2">
                <span>Progress: Question {currentIndex + 1} of {totalQuestions}</span>
                <span>{Math.round(((currentIndex + (selectedOption !== null ? 1 : 0)) / totalQuestions) * 100)}% Completed</span>
              </div>
              <AnimatedProgressBar
                value={Math.round(((currentIndex + (selectedOption !== null ? 1 : 0)) / totalQuestions) * 100)}
              />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="card p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-container text-xs font-bold text-on-primary-container shrink-0 mt-0.5">
                    Q{currentIndex + 1}
                  </span>
                  <h2 className="text-lg font-semibold leading-7 text-on-surface">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Options List */}
                <StaggerChildren className="mt-6 space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrectAnswer = index === currentQuestion.correct_index;
                    const hasAnswered = selectedOption !== null;

                    let optionStyle = "border-slate-200 bg-white hover:bg-slate-50 text-on-surface";
                    let badgeStyle = "border-slate-300 bg-slate-100 text-slate-700";

                    if (hasAnswered) {
                      if (isCorrectAnswer) {
                        optionStyle = "border-green-500 bg-green-50/80 text-green-900 font-medium";
                        badgeStyle = "border-green-500 bg-green-600 text-white";
                      } else if (isSelected && !isCorrectAnswer) {
                        optionStyle = "border-red-500 bg-red-50/80 text-red-900 font-medium";
                        badgeStyle = "border-red-500 bg-red-600 text-white";
                      } else {
                        optionStyle = "border-slate-200 bg-slate-50/50 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <StaggerItem key={option}>
                        <button
                          type="button"
                          onClick={() => handleSelectOption(index)}
                          disabled={hasAnswered}
                          className={`focus-ring flex w-full items-start gap-3.5 rounded-lg border p-4 text-left text-sm transition ${optionStyle}`}
                        >
                          <span
                            className={`grid h-6 w-6 place-items-center rounded-full border text-xs font-bold shrink-0 transition ${badgeStyle}`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1 leading-6">{option}</span>
                          {hasAnswered && isCorrectAnswer && (
                            <Icon name="check_circle" className="text-green-600 text-[20px] shrink-0" />
                          )}
                          {hasAnswered && isSelected && !isCorrectAnswer && (
                            <Icon name="cancel" className="text-red-600 text-[20px] shrink-0" />
                          )}
                        </button>
                      </StaggerItem>
                    );
                  })}
                </StaggerChildren>

                {/* Explanation Reveal */}
                <AnimatePresence>
                  {selectedOption !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div
                        className={`rounded-lg border p-4 text-xs leading-6 ${
                          selectedOption === currentQuestion.correct_index
                            ? "border-green-200 bg-green-50/70 text-green-950"
                            : "border-amber-200 bg-amber-50/70 text-amber-950"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold mb-1.5">
                          <Icon
                            name={selectedOption === currentQuestion.correct_index ? "check_circle" : "info"}
                            className="text-[18px]"
                          />
                          <span>
                            {selectedOption === currentQuestion.correct_index
                              ? "Correct Response"
                              : `Incorrect (Correct Option: ${String.fromCharCode(65 + currentQuestion.correct_index)})`}
                          </span>
                        </div>
                        <p>{currentQuestion.explanation}</p>
                      </div>

                      {/* Next / Submit Button */}
                      <div className="mt-5 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] transition"
                        >
                          <span>
                            {currentIndex < totalQuestions - 1 ? "Next Question" : "Complete Assessment"}
                          </span>
                          <Icon name="arrow_forward" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}

      {/* PHASE 3: RESULT STATE */}
      {phase === "result" && (
        <>
          <PageHeader
            eyebrow="Assessment Summary"
            title="Assessment Complete"
            description="Detailed review of your comprehension score, answer evaluations, and AI explanations."
            action={<Badge tone={scorePercentage >= 75 ? "success" : "warning"}>{scorePercentage}% Overall Score</Badge>}
          />

          <StaggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StaggerItem>
              <MetricCard
                label="Comprehension Score"
                value={`${scorePercentage}%`}
                detail="Calculated from your responses"
                icon="military_tech"
                tone={scorePercentage >= 75 ? "primary" : "neutral"}
              />
            </StaggerItem>
            <StaggerItem>
              <MetricCard
                label="Correct Answers"
                value={`${correctCount}`}
                detail={`Out of ${totalQuestions} items`}
                icon="check_circle"
              />
            </StaggerItem>
            <StaggerItem>
              <MetricCard
                label="Incorrect Answers"
                value={`${incorrectCount}`}
                detail="Review recommended"
                icon="cancel"
                tone={incorrectCount > 0 ? "danger" : "neutral"}
              />
            </StaggerItem>
            <StaggerItem>
              <MetricCard
                label="Proficiency Signal"
                value={scorePercentage >= 75 ? "Proficient" : "Developing"}
                detail="Official methodology benchmark"
                icon="trending_up"
              />
            </StaggerItem>
          </StaggerChildren>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* Detailed Question Review */}
            <FadeIn delay={0.1}>
              <section className="card p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h2 className="text-xl font-semibold">Question Breakdown</h2>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {correctCount} of {totalQuestions} correct
                  </span>
                </div>

                <div className="space-y-6">
                  {questions.map((q, qIndex) => {
                    const userAns = userAnswers.find((a) => a.questionIndex === qIndex);
                    const isCorrect = userAns?.isCorrect;

                    return (
                      <div
                        key={qIndex}
                        className={`rounded-lg border p-4 text-xs space-y-3 ${
                          isCorrect ? "border-green-200 bg-green-50/20" : "border-red-200 bg-red-50/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-sm text-on-surface">
                            Q{qIndex + 1}: {q.question}
                          </span>
                          <Badge tone={isCorrect ? "success" : "danger"}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>

                        <div className="space-y-1.5 text-on-surface-variant">
                          <div>
                            <span>Your Answer: </span>
                            <strong className={isCorrect ? "text-green-800" : "text-red-800"}>
                              {userAns !== undefined && q.options[userAns.selectedOptionIndex]
                                ? `${String.fromCharCode(65 + userAns.selectedOptionIndex)}. ${q.options[userAns.selectedOptionIndex]}`
                                : "Unanswered"}
                            </strong>
                          </div>
                          {!isCorrect && (
                            <div>
                              <span>Correct Answer: </span>
                              <strong className="text-green-800">
                                {String.fromCharCode(65 + q.correct_index)}. {q.options[q.correct_index]}
                              </strong>
                            </div>
                          )}
                        </div>

                        <div className="rounded border border-slate-200 bg-surface p-2.5 text-on-surface leading-5">
                          <span className="font-semibold block text-[11px] text-primary">Explanation:</span>
                          <p className="mt-0.5">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </FadeIn>

            {/* Actions & Feedback */}
            <FadeIn delay={0.15}>
              <aside className="space-y-6">
                <section className="card p-5 space-y-4">
                  <h2 className="text-xl font-semibold">Assessment Actions</h2>
                  <p className="text-xs text-on-surface-variant leading-5">
                    Choose an action to reinforce your comprehension or test new methodology material:
                  </p>
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={handleRetakeQuiz}
                      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#F4511E] bg-white py-3 text-xs font-semibold uppercase tracking-wide text-[#F4511E] hover:bg-[#F4511E]/5 transition"
                    >
                      <Icon name="replay" /> Retake This Quiz
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateNew}
                      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F4511E] py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] transition"
                    >
                      <Icon name="add" /> Generate New Quiz
                    </button>
                    <Link
                      href="/roadmap"
                      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-surface py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant hover:bg-surface-container-high transition"
                    >
                      <Icon name="route" /> Back to Roadmap
                    </Link>
                  </div>
                </section>
              </aside>
            </FadeIn>
          </div>
        </>
      )}
    </AppShell>
  );
}
