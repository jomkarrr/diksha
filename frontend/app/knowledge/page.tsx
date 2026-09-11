"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { fetchKnowledgeDocuments, uploadKnowledgeDocument } from "@/lib/api/knowledge";
import type { KnowledgeDocument } from "@/lib/types/contracts";
import { formatLongDate } from "@/lib/utils/date";

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(isoString: string): string {
  return formatLongDate(isoString);
}

export default function KnowledgePage() {
  const router = useRouter();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterPill, setActiveFilterPill] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Backend Documents State
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load backend documents
  async function loadDocuments() {
    setDocsLoading(true);
    setDocsError(null);
    try {
      const data = await fetchKnowledgeDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setDocsError(err instanceof Error ? err.message : "Failed to load documents from repository.");
    } finally {
      setDocsLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    fetchKnowledgeDocuments()
      .then((data) => {
        if (!ignore) {
          setDocuments(data.documents || []);
          setDocsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setDocsError(err instanceof Error ? err.message : "Failed to load documents from repository.");
          setDocsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Drag and drop handlers
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
    if (file.size > 15 * 1024 * 1024) {
      setUploadStatus("error");
      setStatusMessage("File exceeds the maximum limit of 15MB.");
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
    setStatusMessage("Persisting document to sovereign repository storage...");

    try {
      const uploadedDoc = await uploadKnowledgeDocument(selectedFile);
      setUploadStatus("success");
      setStatusMessage(`"${uploadedDoc.filename}" uploaded successfully and indexed.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadDocuments();
      setTimeout(() => {
        setIsUploadOpen(false);
        setUploadStatus("idle");
        setStatusMessage(null);
      }, 1500);
    } catch (err) {
      setUploadStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Upload failed. Verify backend server is active.");
    }
  }

  // Quick Action: Generate Quiz from Document
  function handleGenerateQuizFromDoc(doc: KnowledgeDocument) {
    const topic = doc.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    router.push(`/quiz?topic=${encodeURIComponent(topic)}`);
  }

  // Storage Quota
  const totalBytes = documents.reduce((acc, doc) => acc + (doc.size_bytes || 0), 0);
  const quotaMaxBytes = 100 * 1024 * 1024; // 100 MB quota
  const quotaPct = Math.min(100, Math.round((totalBytes / quotaMaxBytes) * 100));

  const filteredDocs = documents.filter((d) =>
    d.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Breadcrumb Section */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Knowledge Repository
            </Link>
            <Icon name="chevron_right" className="text-[14px] text-text-tertiary" />
            <span className="text-primary font-bold">Resource Discovery &amp; Official Manuals</span>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#002046] hover:bg-[#1B365D] text-white font-semibold text-xs transition shadow-sm"
          >
            <Icon name="cloud_upload" className="text-[16px] text-action-saffron-light" />
            Upload Official Circular / Manual
          </button>
        </div>

        {/* Hero & Search Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#002046] via-[#1B365D] to-[#0B5C9E] text-white p-6 sm:p-10 shadow-md">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
          <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-[#FFA730]/10 pointer-events-none blur-3xl" />
          
          <div className="relative z-10 max-w-4xl space-y-3">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-headline-lg leading-snug">
              Knowledge Repository &amp; Official Cadre Archives
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
              Curated learning resources, NSSTA specialized modules, MoSPI survey manuals, and accredited statistical curricula engineered to close field cadre gaps across National Sample Surveys.
            </p>

            {/* Search Input Container */}
            <div className="pt-3">
              <div className="relative flex items-center shadow-lg rounded-xl bg-white text-slate-800">
                <Icon name="search" className="absolute left-4 text-slate-400 text-[24px]" />
                <input
                  id="repository-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 1,400+ resources, survey instructions, circulars, or analytical packages..."
                  className="w-full pl-14 pr-32 py-3.5 rounded-xl bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  <span className="hidden sm:inline-block px-2 py-1 bg-slate-100 text-slate-500 rounded text-[11px] font-mono">
                    ⌘K
                  </span>
                  <button
                    onClick={() => {}}
                    className="px-4 py-2 rounded-lg bg-[#FE8028] hover:bg-[#9a4600] text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    Find
                  </button>
                </div>
              </div>

              {/* Filter Pill Chips */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setActiveFilterPill("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition ${
                    activeFilterPill === "all"
                      ? "bg-[#FFA730] text-[#002046]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  All Resources (1,420)
                </button>
                <button
                  onClick={() => setActiveFilterPill("training")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition ${
                    activeFilterPill === "training"
                      ? "bg-[#FFA730] text-[#002046]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Training Programmes (42)
                </button>
                <button
                  onClick={() => setActiveFilterPill("igot")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition ${
                    activeFilterPill === "igot"
                      ? "bg-[#FFA730] text-[#002046]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  iGOT Courses (180)
                </button>
                <button
                  onClick={() => setActiveFilterPill("manuals")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition ${
                    activeFilterPill === "manuals"
                      ? "bg-[#FFA730] text-[#002046]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Official Documents &amp; Manuals (890)
                </button>
                <button
                  onClick={() => setActiveFilterPill("videos")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition ${
                    activeFilterPill === "videos"
                      ? "bg-[#FFA730] text-[#002046]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Instructional Videos (210)
                </button>
                <Link
                  href="/data-practice"
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold whitespace-nowrap transition inline-flex items-center gap-1"
                >
                  Statistical Data Practice (98)
                  <Icon name="arrow_forward" className="text-[12px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended for You Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Icon name="recommend" className="text-[#FE8028] text-[24px]" />
                <h2 className="text-xl font-bold text-[#002046] tracking-tight">
                  Recommended for You
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C2410C]/10 text-[#C2410C] text-[10px] font-bold uppercase">
                  Cadre Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Targeted interventions synthesized from your NSSO FOD (Field Operations Division) competency telemetry.
              </p>
            </div>
            <span className="text-xs text-slate-500 self-start sm:self-auto">
              Profile Match: <strong className="text-slate-800">Investigator Gr. II (PLFS Squad 07)</strong>
            </span>
          </div>

          {/* Recommendations Grid (3 Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <article className="card flex flex-col justify-between overflow-hidden group border border-slate-200 hover:shadow-md transition-all">
              <div className="h-1.5 w-full bg-[#C2410C]" />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#1B4CA1] text-[11px] font-semibold">
                      NSSTA • Specialized Module
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      High Priority Gap
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug">
                    Advanced Stratified Sampling in Field Surveys
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Icon name="schedule" className="text-[15px] text-slate-400" />
                    16 Hours • 4 Modules • Self-Paced Practicum
                  </p>
                </div>

                {/* Competency Progress Gauge */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">Sampling Techniques</span>
                    <span className="text-[#C2410C] font-bold">Gap: -38%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-[#C2410C] h-full" style={{ width: "42%" }} />
                    <div className="bg-[#FE8028]/40 h-full" style={{ width: "38%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Current: <strong className="text-slate-800">Basic (42%)</strong></span>
                    <span>Target: <strong className="text-slate-800">Advanced (80%)</strong></span>
                  </div>
                </div>

                {/* Rationale */}
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 italic border border-slate-100">
                  &ldquo;Directly resolves critical skill gap flagged in your NSSO Field Operations Division profile for upcoming PLFS quarterly round.&rdquo;
                </div>

                {/* Action */}
                <Link
                  href="/resources/igot-stat-104"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#FE8028] hover:bg-[#9a4600] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>View Course</span>
                  <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
              </div>
            </article>

            {/* Card 2 */}
            <article className="card flex flex-col justify-between overflow-hidden group border border-slate-200 hover:shadow-md transition-all">
              <div className="h-1.5 w-full bg-[#C2410C]" />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0D9488] text-[11px] font-semibold">
                      iGOT Karmayogi Bharat
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      High Priority Gap
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug">
                    Applied Python &amp; Vectorized Survey Analytics
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Icon name="schedule" className="text-[15px] text-slate-400" />
                    22 Hours • 6 Modules • Jupyter Sandbox
                  </p>
                </div>

                {/* Competency Progress Gauge */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">Data Wrangling &amp; Python</span>
                    <span className="text-[#C2410C] font-bold">Gap: -65%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-[#FE8028]/40 h-full" style={{ width: "65%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Current: <strong className="text-slate-800">None (0%)</strong></span>
                    <span>Target: <strong className="text-slate-800">Intermediate (65%)</strong></span>
                  </div>
                </div>

                {/* Rationale */}
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 italic border border-slate-100">
                  &ldquo;Mandatory cadre prerequisite for automated microdata cleansing &amp; tabulation scripts under NSSO Modernization Plan.&rdquo;
                </div>

                {/* Action */}
                <Link
                  href="/resources/igot-tech-202"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#FE8028] hover:bg-[#9a4600] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>View Course</span>
                  <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
              </div>
            </article>

            {/* Card 3 */}
            <article className="card flex flex-col justify-between overflow-hidden group border border-slate-200 hover:shadow-md transition-all">
              <div className="h-1.5 w-full bg-[#D97706]" />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#7C3AED] text-[11px] font-semibold">
                      MoSPI Training Division
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      Medium Gap
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug">
                    Periodic Labour Force Survey (PLFS): CAPI Validation
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Icon name="schedule" className="text-[15px] text-slate-400" />
                    12 Hours • 3 Modules • Field Simulation
                  </p>
                </div>

                {/* Competency Progress Gauge */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">Field Data Collection &amp; CAPI</span>
                    <span className="text-[#D97706] font-bold">Gap: -25%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-[#1B873F] h-full" style={{ width: "65%" }} />
                    <div className="bg-[#D97706]/40 h-full" style={{ width: "25%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Current: <strong className="text-slate-800">Intermediate (65%)</strong></span>
                    <span>Target: <strong className="text-slate-800">Advanced (90%)</strong></span>
                  </div>
                </div>

                {/* Rationale */}
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 italic border border-slate-100">
                  &ldquo;Prepares investigator for new CAPI multi-round household validation logic and second-stage unit listing.&rdquo;
                </div>

                {/* Action */}
                <Link
                  href="/resources/igot-gov-301"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#FE8028] hover:bg-[#9a4600] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>View Course</span>
                  <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* Official Documents Repository & Upload (API Integrated) */}
        <section className="card p-6 border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Icon name="library_books" className="text-[#1B365D] text-[22px]" />
                <h2 className="text-xl font-bold text-[#002046]">Official Document Repository &amp; Circulars</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official circulars, field manuals, and schedules persisted in backend repository storage.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                {documents.length} Files Active
              </span>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#F47920] hover:bg-[#d84315] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
              >
                <Icon name="upload" className="text-[16px]" />
                Upload New File
              </button>
            </div>
          </div>

          {/* Table of backend documents */}
          {docsLoading ? (
            <div className="py-12 text-center text-sm text-slate-500 space-y-2">
              <Icon name="hub" className="animate-spin text-2xl text-[#1B365D] mx-auto" />
              <p>Loading documents from backend...</p>
            </div>
          ) : docsError ? (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between">
              <span>Notice: {docsError} (Check backend connection)</span>
              <button onClick={loadDocuments} className="font-bold underline ml-3">Retry</button>
            </div>
          ) : documents.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm space-y-2">
              <Icon name="folder_open" className="text-4xl text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No custom documents uploaded yet</p>
              <p className="text-xs text-slate-400">Click &ldquo;Upload New File&rdquo; to add official circulars or PDF survey schedules.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Document</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Uploaded</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Cadre Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.document_id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                        <Icon name="description" className="text-[#1B4CA1] text-[18px]" />
                        <span className="truncate max-w-xs">{doc.filename}</span>
                      </td>
                      <td className="py-3 px-3 uppercase font-mono text-slate-600">
                        {doc.file_type}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {formatBytes(doc.size_bytes)}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {formatDate(doc.uploaded_at)}
                      </td>
                      <td className="py-3 px-3">
                        <Badge tone={doc.status === "ready" ? "success" : "primary"}>
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleGenerateQuizFromDoc(doc)}
                          className="px-2.5 py-1 rounded bg-[#002046] hover:bg-[#1B365D] text-white text-[11px] font-bold transition"
                        >
                          Generate Quiz
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Quota Progress */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Storage: {formatBytes(totalBytes)} of 100 MB used</span>
            <div className="w-48">
              <AnimatedProgressBar value={quotaPct} label={`${quotaPct}%`} />
            </div>
          </div>
        </section>

        {/* Main Content Layout: Sidebar Filters + Resource Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="card p-5 space-y-5 border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-sm font-bold text-[#002046] flex items-center gap-1.5">
                  <Icon name="filter_list" className="text-[18px]" /> Filters
                </span>
                <button
                  onClick={() => {
                    setSelectedDomain("all");
                    setSelectedType("all");
                  }}
                  className="text-xs text-[#1B4CA1] font-semibold hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Competency Categories */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Competency Domain
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#002046]" />
                      Statistical Theory &amp; Sampling
                    </span>
                    <span className="text-slate-400 font-mono">342</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#002046]" />
                      Labour &amp; Social Statistics
                    </span>
                    <span className="text-slate-400 font-mono">198</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-[#002046]" />
                      National Accounts (NAS)
                    </span>
                    <span className="text-slate-400 font-mono">124</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-[#002046]" />
                      Price Statistics &amp; CPI
                    </span>
                    <span className="text-slate-400 font-mono">86</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-[#002046]" />
                      Python &amp; Microdata Analytics
                    </span>
                    <span className="text-slate-400 font-mono">145</span>
                  </label>
                </div>
              </div>

              {/* Resource Type */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Resource Type
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#002046]" />
                      Interactive Courses
                    </span>
                    <span className="text-slate-400 font-mono">222</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#002046]" />
                      Official Circulars
                    </span>
                    <span className="text-slate-400 font-mono">412</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-[#002046]" />
                      Survey Schedules &amp; Manuals
                    </span>
                    <span className="text-slate-400 font-mono">478</span>
                  </label>
                </div>
              </div>

              {/* Accredited Provider */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Accredited Provider
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#002046]">
                    <input type="checkbox" defaultChecked className="rounded text-[#002046]" />
                    NSSTA Training Academy
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#002046]">
                    <input type="checkbox" defaultChecked className="rounded text-[#002046]" />
                    MoSPI Official Division
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#002046]">
                    <input type="checkbox" defaultChecked className="rounded text-[#002046]" />
                    iGOT Karmayogi Bharat
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Help Card */}
            <div className="rounded-xl bg-surface-container-high p-4 text-[#002046] border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="help_outline" className="text-[20px] text-[#1B4CA1]" />
                <span className="font-bold text-sm">Need Cadre Support?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                NSSTA trainers host daily office hours on Teams for CAPI script queries and sampling deviations.
              </p>
              <button
                onClick={() => alert("Joining NSSTA daily Q&A desk session...")}
                className="text-xs font-bold text-[#1B4CA1] hover:underline flex items-center gap-1"
              >
                Join 4:00 PM Q&amp;A Desk
                <Icon name="arrow_forward" className="text-[14px]" />
              </button>
            </div>
          </aside>

          {/* Right Grid of Resources (6 Cards) */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#002046]">Repository Catalog</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  Showing 6 of 1,420
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <label>Sort by:</label>
                <select className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-medium text-slate-800 focus:outline-none cursor-pointer">
                  <option>Cadre Gap Priority (High to Low)</option>
                  <option>Recently Added to MoSPI</option>
                  <option>Most Enrolled by Investigators</option>
                </select>
              </div>
            </div>

            {/* 6 Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Card 1 */}
              <article className="card flex flex-col justify-between p-5 border border-slate-200 hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#1B4CA1] text-[10px] font-bold">
                      MoSPI Manual
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Icon name="menu_book" className="text-[14px]" /> 8 Modules
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug line-clamp-2">
                    Consumer Price Index (CPI) Formulation &amp; Laspeyres Index Weighting
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Methodological guidelines on market item specification, base year chaining adjustments, and missing quotation imputations under CPI (Rural/Urban/Combined).
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-medium">
                    Price Statistics
                  </span>
                  <Link
                    href="/resources/igot-stat-104"
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#002046] text-xs font-bold transition"
                  >
                    Access Manual
                  </Link>
                </div>
              </article>

              {/* Card 2 */}
              <article className="card flex flex-col justify-between p-5 border border-slate-200 hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#7C3AED] text-[10px] font-bold">
                      NSSTA Masterclass
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Icon name="timer" className="text-[14px]" /> 20 Hours
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug line-clamp-2">
                    National Accounts Statistics (NAS): Base Year Revision &amp; SUTS
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Rigorous immersion into Supply and Use Tables (SUT), Gross Value Added (GVA) rebenchmarking, and compilation metrics for official GDP aggregates.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-medium">
                    National Accounts
                  </span>
                  <Link
                    href="/resources/igot-gov-301"
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#002046] text-xs font-bold transition"
                  >
                    Enroll Class
                  </Link>
                </div>
              </article>

              {/* Card 3 */}
              <article className="card flex flex-col justify-between p-5 border border-slate-200 hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#D97706] text-[10px] font-bold">
                      iGOT Module
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Icon name="timer" className="text-[14px]" /> 6 Hours
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug line-clamp-2">
                    DPDP Act 2023 Compliance &amp; Statistical Confidentiality
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Mandatory civil services privacy module outlining legal bounds for personal data fiduciary protocols and anonymization standards in household surveys.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-medium">
                    Digital Governance
                  </span>
                  <Link
                    href="/resources/igot-gov-301"
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#002046] text-xs font-bold transition"
                  >
                    Launch iGOT
                  </Link>
                </div>
              </article>

              {/* Card 4 */}
              <article className="card flex flex-col justify-between p-5 border border-slate-200 hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0D9488] text-[10px] font-bold">
                      MoSPI Guidelines
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Icon name="timer" className="text-[14px]" /> 14 Hours
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug line-clamp-2">
                    Annual Survey of Industries (ASI): Electronic Schedule Scrubbing
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Factory audit procedures, capital expenditure reconciliation, and balance sheet mapping for manufacturing establishments reporting on the ASI web portal.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-medium">
                    Industrial Statistics
                  </span>
                  <Link
                    href="/data-practice"
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#002046] text-xs font-bold transition"
                  >
                    View Guide
                  </Link>
                </div>
              </article>

              {/* Card 5 */}
              <article className="card flex flex-col justify-between p-5 border border-slate-200 hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0D9488] text-[10px] font-bold">
                      NSSTA Laboratory
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Icon name="timer" className="text-[14px]" /> 18 Hours
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug line-clamp-2">
                    QGIS &amp; Geospatial Verification of Urban Frame Survey Blocks
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Hands-on lab training on boundary delineation, satellite overlay ground-truthing, and block subdivision digitization for NSSO geospatial cadres.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-medium">
                    Technical Domain
                  </span>
                  <Link
                    href="/resources/igot-tech-202"
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#002046] text-xs font-bold transition"
                  >
                    Open Lab
                  </Link>
                </div>
              </article>

              {/* Card 6 */}
              <article className="card flex flex-col justify-between p-5 border border-slate-200 hover:shadow-md transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#1B4CA1] text-[10px] font-bold">
                      MoSPI Handbook
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Icon name="picture_as_pdf" className="text-[14px]" /> 45 Pages PDF
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#002046] group-hover:text-[#1B4CA1] transition-colors leading-snug line-clamp-2">
                    Standard Operating Procedure for NSSO Tablet Data Sync
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Step-by-step resolution protocol for offline CAPI database corruption, encrypted token regeneration, and regional server sync verification.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-medium">
                    Field Operations
                  </span>
                  <button
                    onClick={() => alert("Downloading NSSO SOP Manual: NSSO_Tablet_Sync_SOP_2024.pdf")}
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#002046] text-xs font-bold transition"
                  >
                    Download PDF
                  </button>
                </div>
              </article>
            </div>
          </main>
        </div>

        {/* Bottom Banner: Official Statistical Data Practice Ecosystem */}
        <section className="rounded-xl bg-gradient-to-r from-[#1b365d] via-[#1B4CA1] to-[#002046] text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-1.5 text-action-saffron-light text-xs font-bold uppercase tracking-wider">
              <Icon name="dataset" className="text-[18px]" />
              Microdata Sandbox &amp; Survey Sandbox Labs
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-headline-md">
              Official Statistical Data Practice Ecosystem
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Explore sanitized raw and synthetic MoSPI survey datasets across <strong>PLFS, ASI, HCES, and ASUSE</strong> to hone your analytical scripting, tabulation procedures, and variance estimations in real-world scenarios.
            </p>
          </div>
          <Link
            href="/data-practice"
            className="z-10 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FFA730] hover:bg-[#FF9933] text-[#002046] text-sm font-bold transition shadow-md whitespace-nowrap shrink-0"
          >
            <span>Explore Data Practice</span>
            <Icon name="open_in_new" className="text-[18px]" />
          </Link>
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
            <Icon name="analytics" className="text-[180px] text-white" />
          </div>
        </section>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Icon name="cloud_upload" className="text-[#F47920] text-[22px]" />
                <h3 className="text-base font-bold text-[#002046]">Upload Knowledge Material</h3>
              </div>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setSelectedFile(null);
                  setUploadStatus("idle");
                  setStatusMessage(null);
                }}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>

            {/* Hidden Input */}
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
              className={`grid min-h-[180px] place-items-center rounded-xl border-2 border-dashed p-6 text-center transition ${
                isDragging
                  ? "border-[#F47920] bg-[#F47920]/5 scale-[1.01]"
                  : selectedFile
                  ? "border-[#002046]/40 bg-slate-50"
                  : "border-slate-300 bg-white hover:border-[#F47920]/60 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-[#F47920]">
                  <Icon
                    name={uploadStatus === "uploading" ? "hub" : "cloud_upload"}
                    className={`text-2xl ${uploadStatus === "uploading" ? "animate-spin" : ""}`}
                  />
                </div>

                {selectedFile ? (
                  <div className="mt-3 space-y-1">
                    <p className="font-bold text-sm text-slate-900 truncate max-w-xs mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                  </div>
                ) : (
                  <>
                    <h4 className="mt-3 font-semibold text-sm text-slate-800">
                      {isDragging ? "Drop file here" : "Click to browse or drag & drop"}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Supports PDF, TXT, MD, DOCX (Max 15MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Status alerts */}
            {statusMessage && (
              <div
                className={`rounded-lg p-3 text-xs leading-relaxed ${
                  uploadStatus === "success"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : uploadStatus === "error"
                    ? "bg-rose-50 text-rose-900 border border-rose-200"
                    : "bg-blue-50 text-blue-900 border border-blue-200"
                }`}
              >
                {statusMessage}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsUploadOpen(false);
                  setSelectedFile(null);
                  setUploadStatus("idle");
                  setStatusMessage(null);
                }}
                disabled={uploadStatus === "uploading"}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploadStatus === "uploading"}
                  className="px-4 py-2 rounded-lg bg-[#002046] hover:bg-[#1B365D] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {uploadStatus === "uploading" ? "Uploading..." : "Upload Document"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
