"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { fetchKnowledgeDocuments, uploadKnowledgeDocument } from "@/lib/api/knowledge";
import type { KnowledgeDocument } from "@/lib/types/contracts";

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Recent";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return "Recent";
  }
}

export default function KnowledgeHubPage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function reloadDocuments() {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchKnowledgeDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load documents from repository.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    fetchKnowledgeDocuments()
      .then((data) => {
        if (!ignore) {
          setDocuments(data.documents || []);
          setLoading(false);
          setFetchError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setFetchError(err instanceof Error ? err.message : "Failed to load documents from repository.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  function handleFileSelection(file: File) {
    const allowed = [".pdf", ".txt", ".md", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowed.includes(ext)) {
      setUploadStatus("error");
      setStatusMessage(`Unsupported file format. Allowed: ${allowed.join(", ")}.`);
      return;
    }

    if (file.size === 0) {
      setUploadStatus("error");
      setStatusMessage("Selected file is empty (0 bytes).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      setStatusMessage("File exceeds the maximum limit of 10MB.");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("idle");
    setStatusMessage(null);
  }

  function handleNativeInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  }

  // Drag and Drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setStatusMessage("Uploading document to repository...");

    try {
      const uploadedDoc = await uploadKnowledgeDocument(selectedFile);
      setUploadStatus("success");
      setStatusMessage(`"${uploadedDoc.filename}" uploaded successfully.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Refresh documents from backend
      await reloadDocuments();
    } catch (err) {
      setUploadStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  }

  function handleCancelSelection() {
    setSelectedFile(null);
    setUploadStatus("idle");
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Calculate storage quota from document list
  const totalBytes = documents.reduce((acc, doc) => acc + (doc.size_bytes || 0), 0);
  const quotaMaxBytes = 100 * 1024 * 1024; // 100 MB quota
  const quotaPct = Math.min(100, Math.round((totalBytes / quotaMaxBytes) * 100));

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Knowledge Hub"
        title="Upload and manage learning materials"
        description="Upload official statistical circulars, survey guidelines, and methodology handbooks."
        action={
          <Badge tone={documents.length > 0 ? "success" : "neutral"}>
            {documents.length} Documents Active
          </Badge>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <FadeIn from="left">
          <section className="card p-5 space-y-4">
            <h2 className="text-base font-semibold text-on-surface">Upload Documents</h2>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleNativeInputChange}
              accept=".pdf,.txt,.md,.docx"
              className="hidden"
            />

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (uploadStatus !== "uploading" && !selectedFile) {
                  fileInputRef.current?.click();
                }
              }}
              className={`grid min-h-[220px] place-items-center rounded-lg border-2 border-dashed p-4 text-center transition ${
                isDragging
                  ? "border-[#F4511E] bg-[#F4511E]/5 scale-[1.01]"
                  : selectedFile
                  ? "border-primary/40 bg-surface"
                  : "border-slate-300 bg-white hover:border-[#F4511E]/60 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-[#F4511E]">
                  <Icon name={uploadStatus === "uploading" ? "hub" : "cloud_upload"} className={`text-3xl ${uploadStatus === "uploading" ? "animate-spin" : ""}`} />
                </div>

                {selectedFile ? (
                  <div className="mt-3 space-y-1">
                    <p className="font-semibold text-sm text-on-surface truncate max-w-[260px] mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {formatBytes(selectedFile.size)}
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="mt-3 font-semibold text-sm text-on-surface">
                      {isDragging ? "Drop file here" : "Click to select or drag and drop"}
                    </h3>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      Supports PDF, TXT, MD, DOCX (Max 10MB)
                    </p>
                  </>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {selectedFile ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpload();
                        }}
                        disabled={uploadStatus === "uploading"}
                        className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] disabled:opacity-60 transition"
                      >
                        {uploadStatus === "uploading" ? "Uploading..." : "Upload Document"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelSelection();
                        }}
                        disabled={uploadStatus === "uploading"}
                        className="focus-ring rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase text-on-surface-variant hover:bg-slate-50 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] transition"
                    >
                      <Icon name="attach_file" className="text-[16px]" /> Select Files
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Status alerts */}
            {statusMessage && (
              <div
                className={`rounded-lg border p-3 text-xs leading-5 ${
                  uploadStatus === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : uploadStatus === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-900"
                    : "border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                {statusMessage}
              </div>
            )}

            {/* Storage Quota */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="label text-on-surface-variant">Storage Quota</span>
                <span className="font-semibold text-on-surface">{formatBytes(totalBytes)} / 100 MB</span>
              </div>
              <div className="mt-2">
                <AnimatedProgressBar value={quotaPct} label={`${quotaPct}% used`} />
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Document Repository */}
        <section className="card overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 p-5">
            <div>
              <h2 className="text-xl font-semibold text-on-surface">Document Repository</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Official learning materials persisted in repository storage.
              </p>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus-ring h-9 w-full sm:w-64 rounded-lg border border-slate-200 bg-surface px-3 text-xs"
              placeholder="Search documents by name..."
            />
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-on-surface-variant">
              <Icon name="hub" className="animate-spin text-2xl text-primary mx-auto mb-2" />
              Loading repository documents...
            </div>
          ) : fetchError ? (
            <div className="p-12 text-center space-y-3">
              <Icon name="cloud_off" className="text-4xl text-rose-500 mx-auto" />
              <p className="font-semibold text-sm text-on-surface">Unable to load repository</p>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">{fetchError}</p>
              <button
                type="button"
                onClick={reloadDocuments}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#d84315] transition"
              >
                <Icon name="refresh" className="text-[16px]" /> Retry
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Icon name="folder_open" className="text-4xl text-slate-400 mx-auto" />
              <p className="font-semibold text-sm text-on-surface">No learning documents uploaded yet</p>
              <p className="text-xs text-on-surface-variant">
                Upload official circulars, manuals, or training notes using the upload panel.
              </p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Icon name="search_off" className="text-4xl text-slate-400 mx-auto" />
              <p className="font-semibold text-sm text-on-surface">No documents matching &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-on-surface-variant">
                Try searching with a different filename or keyword.
              </p>
            </div>
          ) : (
            <StaggerChildren className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => {
                const isPdf = doc.file_type === "PDF";
                const isDocx = doc.file_type === "DOCX";
                const isMd = doc.file_type === "MD";

                return (
                  <StaggerItem key={doc.document_id}>
                    <div className="grid gap-3 p-5 md:grid-cols-[1fr_110px_90px_110px] md:items-center hover:bg-slate-50/60 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-primary">
                          <Icon
                            name={isPdf ? "picture_as_pdf" : isDocx ? "description" : isMd ? "code" : "article"}
                            className="text-[20px]"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-on-surface truncate">
                            {doc.filename}
                          </p>
                          <p className="text-[11px] text-on-surface-variant">
                            {formatBytes(doc.size_bytes)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Badge tone={doc.status === "ready" ? "success" : "primary"}>
                          {doc.status === "ready" ? "Ready" : doc.status}
                        </Badge>
                      </div>

                      <span className="text-xs font-semibold text-on-surface-variant uppercase">
                        {doc.file_type}
                      </span>

                      <span className="text-xs text-on-surface-variant">
                        {formatDate(doc.uploaded_at)}
                      </span>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          )}
        </section>
      </div>
    </AppShell>
  );
}
