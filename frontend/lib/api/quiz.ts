import { apiFetch } from "./client";
import type { QuizResponse } from "@/lib/types/contracts";

export function generateQuiz(contentText: string) {
  return apiFetch<QuizResponse>("/quiz", {
    method: "POST",
    body: JSON.stringify({ content_text: contentText })
  });
}
