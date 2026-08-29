import { apiFetch } from "./client";
import type { QuizResponse, QuizSubmitResponse, QuizAnswerItem } from "@/lib/types/contracts";

export function generateQuiz(contentText: string) {
  return apiFetch<QuizResponse>("/quiz", {
    method: "POST",
    body: JSON.stringify({ content_text: contentText })
  });
}

export function submitQuizAnswers(profileId: string, answers: QuizAnswerItem[]) {
  return apiFetch<QuizSubmitResponse>("/quiz/submit", {
    method: "POST",
    body: JSON.stringify({ profile_id: profileId, answers })
  });
}
