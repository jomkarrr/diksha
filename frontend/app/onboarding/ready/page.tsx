"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function CompetencyProfileReadyPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Success Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-navy-hero-end p-6 sm:p-8 text-white shadow-lg border border-slate-700/30">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Baseline Competency Analysis Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Your competency profile is ready
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              DIKSHA has calibrated your role as <span className="text-amber-300 font-semibold">Statistical Investigator Gr. II</span> against the 18-Node MoSPI FRAC Framework. Your baseline Competency Passport and prerequisite-ordered roadmap are now active.
            </p>
          </div>
          <div className="hidden lg:block absolute -right-6 -bottom-8 opacity-15">
            <span className="material-symbols-outlined text-[200px] text-white">verified_user</span>
          </div>
        </section>

        {/* 4-Metric Profile Synthesis Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Designation &amp; Cadre</span>
              <div className="p-1.5 bg-blue-50 text-domain-statistical rounded-lg">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
            </div>
            <p className="mt-2 text-base font-bold text-slate-900 leading-snug">Statistical Investigator Gr. II</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Subordinate Statistical Service, NSSO</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FRAC Nodes Mapped</span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">hub</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-primary">18</span>
              <span className="text-xs font-semibold text-slate-600">Nodes Total</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Across 4 official MoSPI domains</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority Competency Gaps</span>
              <div className="p-1.5 bg-red-50 text-status-gap-high rounded-lg">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-status-gap-high">3</span>
              <span className="text-xs font-semibold text-status-gap-high">Actionable Gaps</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Targeted for immediate upskilling</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Courses</span>
              <div className="p-1.5 bg-emerald-50 text-status-mastered rounded-lg">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-primary">4</span>
              <span className="text-xs font-semibold text-slate-600">iGOT Courses</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-1">NSSTA accredited syllabus</p>
          </div>
        </section>

        {/* Highest Priority Competency Gaps Identified */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-lg font-bold text-primary">Highest Priority Competency Gaps Identified</h2>
              <p className="text-xs text-slate-500 font-medium">
                Critical proficiencies required for your cadre promotion, survey audit accuracy, and PLFS operations.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto">
              3 Crucial Gaps Displayed
            </span>
          </div>

          {/* Gap Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Gap Card 1: Sampling Techniques */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Statistical Domain
                  </span>
                  <span className="inline-flex items-center text-[11px] font-bold text-status-gap-high bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-gap-high mr-1.5 animate-pulse" />
                    High Priority Gap
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  Sampling Techniques &amp; Survey Design
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  Essential for upcoming PLFS 80th Round urban cluster frame allocation and multiplier weights.
                </p>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">Current: <strong className="text-slate-800">Basic (42%)</strong></span>
                    <span className="text-slate-500 font-medium">Required: <strong className="text-primary">Advanced (80%)</strong></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-primary z-10" title="Target Benchmark: 80%" />
                    <div className="h-full bg-status-gap-high rounded-full" style={{ width: "42%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                    <span>Novice</span>
                    <span className="text-status-gap-high font-bold">Basic</span>
                    <span>Interm.</span>
                    <span className="text-primary font-bold">Advanced</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Gap Delta: <strong className="text-status-gap-high">-38%</strong></span>
                <span className="text-slate-400 text-[11px]">Mandatory for Cycle 2025</span>
              </div>
            </div>

            {/* Gap Card 2: Python for Statistical Analysis */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Technical Domain
                  </span>
                  <span className="inline-flex items-center text-[11px] font-bold text-status-gap-high bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-gap-high mr-1.5 animate-pulse" />
                    High Priority Gap
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  Python for Statistical Analysis
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  Required for automated microdata wrangling, Pandas vectorization, and CAPI error flagging.
                </p>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">Current: <strong className="text-slate-800">Basic (30%)</strong></span>
                    <span className="text-slate-500 font-medium">Required: <strong className="text-primary">Intermediate (65%)</strong></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-[65%] w-0.5 bg-primary z-10" title="Target Benchmark: 65%" />
                    <div className="h-full bg-status-gap-high rounded-full" style={{ width: "30%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                    <span>Novice</span>
                    <span className="text-status-gap-high font-bold">Basic</span>
                    <span className="text-primary font-bold">Interm.</span>
                    <span>Advanced</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Gap Delta: <strong className="text-status-gap-high">-35%</strong></span>
                <span className="text-slate-400 text-[11px]">CAPI Automation Track</span>
              </div>
            </div>

            {/* Gap Card 3: Data Quality Frameworks */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Statistical Domain
                  </span>
                  <span className="inline-flex items-center text-[11px] font-bold text-status-in-progress bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-in-progress mr-1.5" />
                    Medium Gap
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  Data Quality Frameworks (UN NQAF)
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  Required for validating administrative records and auditing statistical registries against national standards.
                </p>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">Current: <strong className="text-slate-800">None (20%)</strong></span>
                    <span className="text-slate-500 font-medium">Required: <strong className="text-primary">Intermediate (60%)</strong></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-primary z-10" title="Target Benchmark: 60%" />
                    <div className="h-full bg-status-in-progress rounded-full" style={{ width: "20%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                    <span className="text-status-in-progress font-bold">Novice</span>
                    <span>Basic</span>
                    <span className="text-primary font-bold">Interm.</span>
                    <span>Advanced</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Gap Delta: <strong className="text-status-in-progress">-40%</strong></span>
                <span className="text-slate-400 text-[11px]">Survey Quality Assurance</span>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Actions CTA Panel */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-4">
          <div className="max-w-xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-primary">Ready to proceed to your verified credentials?</h3>
            <p className="text-xs text-slate-500">
              Explore your complete 18-node passport or jump directly into your recommended courses on iGOT Karmayogi.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href="/competencies"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-secondary hover:bg-orange-600 text-white font-semibold text-sm rounded-lg shadow-md transition-all"
            >
              <span>View My Competency Passport</span>
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </Link>
            <Link
              href="/roadmap"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-primary font-semibold text-sm rounded-lg transition-colors"
            >
              <span>Launch Learning Roadmap</span>
              <span className="material-symbols-outlined text-[18px]">route</span>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
