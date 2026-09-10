"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default function AnalyzingProcessingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPct, setProgressPct] = useState(25);

  useEffect(() => {
    // Progressive state machine stepping through the 4 phases
    const t1 = setTimeout(() => {
      setCurrentStep(2);
      setProgressPct(50);
    }, 1200);

    const t2 = setTimeout(() => {
      setCurrentStep(3);
      setProgressPct(78);
    }, 2400);

    const t3 = setTimeout(() => {
      setCurrentStep(4);
      setProgressPct(100);
    }, 3800);

    const t4 = setTimeout(() => {
      router.push("/onboarding/ready");
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [router]);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/40 p-6 sm:p-10 relative overflow-hidden">
          {/* Top Subtle Background Decoration */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-blue-50 rounded-full blur-2xl pointer-events-none" />

          {/* System Engine Status Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-domain-statistical">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              <span>MoSPI DIKSHA AI Synthesis Engine Active</span>
            </div>
          </div>

          {/* Section: Title & Narrative */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Building your competency profile
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              DIKSHA is synthesizing your cadre parameters, applying Kahn&apos;s topological sort to resolve prerequisite trees, and identifying priority training interventions.
            </p>
          </div>

          {/* Sequential 4-Step Progress List */}
          <div className="space-y-4 mb-8">
            {/* Step 1: Profile Ingest */}
            <div
              className={`flex items-start space-x-3.5 p-3.5 rounded-xl border transition-all ${
                currentStep >= 1
                  ? "bg-emerald-50/70 border-emerald-200/80"
                  : "bg-slate-50/60 border-slate-200/60 opacity-60"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-status-mastered text-white flex items-center justify-center text-xs">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-bold text-emerald-950">
                    Profile Information Ingested
                  </h2>
                  <span className="text-[11px] font-semibold text-status-mastered bg-emerald-100/70 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Officer details matched against Subordinate Statistical Service cadre records.
                </p>
              </div>
            </div>

            {/* Step 2: Cadre Standards Match */}
            <div
              className={`flex items-start space-x-3.5 p-3.5 rounded-xl border transition-all ${
                currentStep >= 2
                  ? "bg-emerald-50/70 border-emerald-200/80"
                  : "bg-slate-50/60 border-slate-200/60 opacity-60"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <div
                  className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs ${
                    currentStep >= 2 ? "bg-status-mastered" : "bg-slate-300 text-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {currentStep >= 2 ? "check" : "more_horiz"}
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                    Cadre Benchmarks Loaded
                  </h2>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      currentStep >= 2
                        ? "text-status-mastered bg-emerald-100/70"
                        : "text-slate-400 bg-slate-100"
                    }`}
                  >
                    {currentStep >= 2 ? "Indexed" : "Queued"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Loaded MoSPI FRAC Standards Framework across 18 competency target nodes.
                </p>
              </div>
            </div>

            {/* Step 3: Kahn DAG Prerequisite Resolution */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                currentStep === 3
                  ? "bg-orange-50/60 border-orange-200/90 shadow-sm"
                  : currentStep > 3
                  ? "bg-emerald-50/70 border-emerald-200/80"
                  : "bg-slate-50/60 border-slate-200/60 opacity-60"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="shrink-0 mt-0.5">
                  <div
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs ${
                      currentStep > 3
                        ? "bg-status-mastered"
                        : currentStep === 3
                        ? "bg-secondary pulse-amber"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {currentStep > 3 ? "check" : "hub"}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      Kahn DAG Prerequisite Resolution
                      {currentStep === 3 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                      )}
                    </h2>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        currentStep > 3
                          ? "text-status-mastered bg-emerald-100/70"
                          : "text-secondary bg-orange-100"
                      }`}
                    >
                      {currentStep > 3 ? "Resolved" : `${progressPct}% Analyzed`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-normal">
                    Evaluating directed dependencies: Survey Design ➔ Sampling ➔ Python Data Wrangling.
                  </p>

                  {/* Shimmer Bar */}
                  <div className="mt-3 w-full bg-orange-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full shimmer-bar transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Roadmap Assembly */}
            <div
              className={`flex items-start space-x-3.5 p-3.5 rounded-xl border transition-all ${
                currentStep >= 4
                  ? "bg-emerald-50/70 border-emerald-200/80"
                  : "bg-slate-50/60 border-slate-200/60 opacity-60"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <div
                  className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs ${
                    currentStep >= 4 ? "bg-status-mastered" : "bg-slate-300 text-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {currentStep >= 4 ? "check" : "route"}
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-medium text-slate-800">
                    Roadmap &amp; iGOT Course Synchronization
                  </h2>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      currentStep >= 4
                        ? "text-status-mastered bg-emerald-100/70 font-bold"
                        : "text-slate-400 bg-slate-100"
                    }`}
                  >
                    {currentStep >= 4 ? "Ready" : "Queued"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pairing highest severity gaps with NSSTA-accredited curriculum modules.
                </p>
              </div>
            </div>
          </div>

          {/* Supporting Footnote */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
              This one-time automated calibration establishes your persistent{" "}
              <strong className="text-slate-700 font-semibold">Competency Passport</strong> and synchronizes your learning roadmap.
            </p>
            <button
              type="button"
              onClick={() => router.push("/onboarding/ready")}
              className="mt-3 text-xs font-bold text-domain-statistical hover:text-secondary underline transition-colors"
            >
              Skip directly to results →
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
