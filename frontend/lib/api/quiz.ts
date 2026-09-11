import { apiFetch } from "./client";
import type { QuizResponse, QuizSubmitResponse, QuizAnswerItem } from "@/lib/types/contracts";

export function generateQuiz(param: string | { content_text?: string; node_id?: string }) {
  const payload = typeof param === "string" ? { content_text: param } : param;
  return apiFetch<QuizResponse>("/quiz", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function submitQuizAnswers(profileId: string, answers: QuizAnswerItem[], nodeId?: string) {
  return apiFetch<QuizSubmitResponse>("/quiz/submit", {
    method: "POST",
    body: JSON.stringify({ profile_id: profileId, answers, node_id: nodeId })
  });
}
