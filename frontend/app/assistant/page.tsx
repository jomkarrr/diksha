"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

export default function AssistantPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Assistant"
        title="Statistical Methodology Assistant"
        description="Prototype UI for context-aware learning help. RAG backend endpoints are not available yet, so the response shown here is demo-only."
        action={<Badge tone="warning">Mock adapter</Badge>}
      />
      <div className="grid min-h-[640px] gap-6 xl:grid-cols-[1fr_320px]">
        <section className="card flex flex-col overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <p className="text-sm font-semibold">Sampling Techniques · Learning context</p>
          </div>
          <StaggerChildren className="flex-1 space-y-5 overflow-auto bg-surface p-5">
            <StaggerItem>
              <div className="ml-auto max-w-[640px] rounded-lg bg-surface-container-high p-4 text-sm">
                Explain stratified sampling with a simple example.
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="max-w-[760px] rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded bg-primary-container text-white"><Icon name="smart_toy" className="text-[16px]" /></span>
                  <strong>DIKSHA Assistant</strong>
                </div>
                <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                  Stratified sampling divides the population into meaningful groups such as rural and urban households, then selects a
                  random sample from each group. This improves representation when groups differ in ways that affect the final estimate.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-surface p-3">
                    <p className="label text-primary">Source</p>
                    <p className="mt-1 text-sm">Sampling Methodology Manual</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-surface p-3">
                    <p className="label text-primary">Related competency</p>
                    <p className="mt-1 text-sm">Sampling Techniques</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>
          <div className="border-t border-slate-200 bg-white p-4">
            <StaggerChildren className="mb-3 flex flex-wrap gap-2">
              {["Explain simply", "Give an example", "Test me", "Summarize"].map((prompt) => (
                <StaggerItem key={prompt}>
                  <button className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-sm text-on-surface-variant">{prompt}</button>
                </StaggerItem>
              ))}
            </StaggerChildren>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-surface p-2">
              <button className="focus-ring rounded-lg p-2 text-on-surface-variant"><Icon name="attach_file" /></button>
              <input className="focus-ring min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" placeholder="Ask about your current learning material..." />
              <button className="focus-ring grid h-9 w-9 place-items-center rounded-lg bg-[#F4511E] text-white"><Icon name="send" /></button>
            </div>
          </div>
        </section>
        <aside className="card h-fit p-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold"><Icon name="source" className="text-primary" /> Active Sources</h2>
          <StaggerChildren className="mt-4 space-y-3">
            {["Sampling Methodology Manual.pdf", "Field Survey Procedures.docx"].map((source) => (
              <StaggerItem key={source}>
                <div className="rounded-lg border border-slate-200 bg-surface p-3">
                  <p className="font-semibold">{source}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">Demo source · page citation pending backend RAG.</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </aside>
      </div>
    </AppShell>
  );
}
