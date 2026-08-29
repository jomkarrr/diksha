"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

export default function KnowledgeHubPage() {
  const documents = [
    ["Survey Sampling Methods.pdf", "Ready", "PDF", "02 Aug 2026"],
    ["National Accounts Handbook.pptx", "Processing", "PPTX", "Today"],
    ["Data_Description_Template.docx", "Draft", "DOCX", "Today"]
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Knowledge Hub"
        title="Upload and manage learning materials"
        description="UI prepared for document ingestion and AI indexing. Upload/RAG backend endpoints are still required."
        action={<Badge tone="warning">Upload mock only</Badge>}
      />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <FadeIn from="left">
          <section className="card p-5">
            <div className="grid min-h-[220px] place-items-center rounded-lg border border-dashed border-outline-variant bg-white text-center">
              <div>
                <Icon name="cloud_upload" className="text-4xl text-primary" />
                <h2 className="mt-3 font-semibold">Upload Documents</h2>
                <p className="mt-1 text-sm text-on-surface-variant">PDF, PPT/PPTX, DOC/DOCX, TXT</p>
                <button className="focus-ring mt-4 rounded-lg bg-[#F4511E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
                  Select Files
                </button>
              </div>
            </div>
            <div className="mt-5">
              <p className="label text-on-surface-variant">Storage Quota</p>
              <div className="mt-3"><AnimatedProgressBar value={63} label="6.3 GB used" /></div>
            </div>
          </section>
        </FadeIn>
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <h2 className="text-xl font-semibold">Document Repository</h2>
            <input className="focus-ring h-9 rounded-full border border-slate-200 bg-surface px-4 text-sm" placeholder="Search knowledge base..." />
          </div>
          <StaggerChildren className="divide-y divide-slate-100">
            {documents.map(([name, status, type, date]) => (
              <StaggerItem key={name}>
                <div className="grid gap-3 p-5 md:grid-cols-[1fr_120px_90px_120px] md:items-center">
                  <div className="flex items-center gap-3">
                    <Icon name={type === "PDF" ? "picture_as_pdf" : "description"} className="text-primary" />
                    <span className="font-semibold">{name}</span>
                  </div>
                  <Badge tone={status === "Ready" ? "success" : status === "Processing" ? "primary" : "neutral"}>{status}</Badge>
                  <span className="text-sm text-on-surface-variant">{type}</span>
                  <span className="text-sm text-on-surface-variant">{date}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      </div>
    </AppShell>
  );
}
