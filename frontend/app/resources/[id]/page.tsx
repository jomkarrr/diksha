"use client";

import { use, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { learningResources } from "@/lib/mock/data";

export default function CourseDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const resource =
    learningResources.find((item) => item.id === resolvedParams.id) ||
    learningResources[0];

  const [downloaded, setDownloaded] = useState(false);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider"
        >
          <Link href="/knowledge" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">folder_open</span>
            <span>Knowledge Repository</span>
          </Link>
          <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
          <Link href="/resources" className="hover:text-primary transition-colors">
            Courses &amp; Training
          </Link>
          <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
          <span className="text-primary font-bold truncate max-w-md">{resource.title}</span>
        </nav>

        {/* Course Hero Section (Tier 4 Deep Gradient) */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary-container to-navy-hero-end text-white shadow-xl p-6 sm:p-8 border border-slate-700/30">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Hero Details (8 cols) */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              {/* Badges Strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-action-saffron-light">terminal</span>
                  <span>Course Code: {resource.code || "NSSTA-STAT-302"}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-slate-200 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-action-saffron-light">domain</span>
                  <span>{resource.provider}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 text-action-saffron-light font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">star</span>
                  <span>{resource.rating || "4.8/5"}</span>
                  <span className="text-white/70 font-normal">({resource.reviewsCount || "1,240 Reviews"})</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {resource.title}
              </h1>

              {/* 4 Key Metadata Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur flex flex-col">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> Duration
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white mt-1">{resource.duration}</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur flex flex-col">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">stairs</span> Difficulty
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white mt-1">{resource.difficulty}</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur flex flex-col">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span> Accreditation
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white mt-1">MoSPI Official Cert.</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur flex flex-col">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">groups</span> Cadre Reach
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white mt-1">{resource.cadreReach || "12,400 Civil Servants"}</span>
                </div>
              </div>
            </div>

            {/* Right Action Box Card (4 cols) */}
            <div className="lg:col-span-4 bg-white text-slate-900 rounded-2xl p-6 shadow-xl flex flex-col space-y-3.5">
              <Link
                href="/quiz"
                className="w-full py-3 px-4 rounded-xl bg-secondary hover:bg-orange-600 text-white font-bold text-sm text-center transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                <span>Start Learning on iGOT</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setDownloaded(true);
                  setTimeout(() => setDownloaded(false), 3000);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-primary font-semibold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>{downloaded ? "Syllabus Downloaded!" : "Download Syllabus & Manual (PDF)"}</span>
              </button>

              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-500">Overall Progress</span>
                  <span className="text-primary font-bold">0% Completed</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-container h-full w-0" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>Est. 4 Weeks</span>
                  <span className="text-domain-technical font-bold">SM-2 Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competency Alignment & Diagnostic Gap Callout Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-border-subtle p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-status-gap-high via-secondary to-amber-400" />
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pl-2">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-amber-500">psychology</span>
                  Why this is recommended for you
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-50 text-status-gap-high text-[10px] font-bold border border-red-200">
                  Skill-Gap Severity: High Priority
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {resource.reason}
              </p>
            </div>

            <div className="w-full lg:w-80 bg-slate-50 rounded-xl p-4 border border-slate-200 shrink-0 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Assessed Baseline:</span>
                <span className="font-bold text-status-gap-high">Basic (42%)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Cadre Benchmark:</span>
                <span className="font-bold text-primary">Advanced (80%)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div className="bg-status-gap-high h-full" style={{ width: "42%" }} />
                <div className="bg-secondary/40 h-full" style={{ width: "38%" }} />
              </div>
              <span className="text-[10px] font-bold text-status-gap-high block text-right">
                Deficit: -38% Gap
              </span>
            </div>
          </div>
        </section>

        {/* Curriculum Syllabus */}
        <section className="bg-white rounded-2xl shadow-sm border border-border-subtle p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-primary">Curriculum Syllabus &amp; Modules</h2>
              <p className="text-xs text-slate-500">Accredited by National Statistical Systems Training Academy</p>
            </div>
            <Link
              href="/quiz"
              className="px-4 py-2 rounded-lg bg-secondary hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Take Module Assessment</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="space-y-4">
            {(resource.syllabus || [
              {
                title: "Module 1: Foundations of Multi-Stage Stratified Sampling",
                duration: "4 Hours",
                description: "SRSWOR vs. Stratified Random Sampling. Allocations (Neyman & Proportional) for official NSS frames."
              },
              {
                title: "Module 2: Probability Proportional to Size (PPS) & Cluster Selection",
                duration: "4 Hours",
                description: "Selection with PPS Systematic Sampling. Handling oversized and zero-measure blocks in urban and rural sectors."
              },
              {
                title: "Module 3: Non-Sampling Errors, Non-Response & Weighting",
                duration: "4 Hours",
                description: "Quantifying enumerator bias, household non-contact protocols, and multiplier post-stratification."
              },
              {
                title: "Module 4: Complex Variance Estimation & Sub-Sample Matching",
                duration: "4 Hours",
                description: "Jackknife and Balanced Repeated Replication (BRR) for PLFS and ASI estimates."
              }
            ]).map((mod, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800">{mod.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 pl-7">{mod.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 pl-7 sm:pl-0">
                  <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                    ⏱️ {mod.duration}
                  </span>
                  <Link
                    href="/quiz"
                    className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-semibold transition-colors"
                  >
                    Assess
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
