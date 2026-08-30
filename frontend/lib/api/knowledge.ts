import { API_BASE_URL, apiFetch, ApiError } from "./client";
import type { KnowledgeDocument, KnowledgeDocumentListResponse } from "@/lib/types/contracts";

export async function uploadKnowledgeDocument(file: File): Promise<KnowledgeDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/knowledge/upload`, {
    method: "POST",
    body: formData
    // Note: Do NOT set Content-Type header so the browser sets the boundary automatically
  });

  if (!response.ok) {
    let message = `Upload failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        message = data.detail;
      }
    } catch {
      // Keep default message
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<KnowledgeDocument>;
}

export function fetchKnowledgeDocuments(): Promise<KnowledgeDocumentListResponse> {
  return apiFetch<KnowledgeDocumentListResponse>("/knowledge/documents");
}
