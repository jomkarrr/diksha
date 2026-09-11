"use client";

import { useEffect, useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { fetchRoadmap } from "@/lib/api/roadmap";
import { fetchEmployeeDashboard } from "@/lib/api/dashboard";
import { CompetencyRadar } from "@/components/charts/CompetencyRadar";
import {
  demoRoadmap,
  competencyCatalogue,
  learningResources,
  OFFICIAL_CADRES,
  type OfficerPersona
} from "@/lib/mock/data";
import { getDomainRadarData } from "@/lib/utils/chartData";
import type { RoadmapItem, EmployeeDashboard, RevisionSuggestion } from "@/lib/types/contracts";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("diksha_cadre_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("diksha_cadre_change", callback);
  };
}

function useDashboardCadre() {
  const profileId = useSyncExternalStore(
    subscribeStorage,
    () => localStorage.getItem("diksha_profile_id") || "prof_demo",
    () => "prof_demo"
  );
  return useMemo<OfficerPersona>(() => {
    return OFFICIAL_CADRES.find((c) => c.id === profileId) || OFFICIAL_CADRES[0];
  }, [profileId]);
}

export default function DashboardPage() {
  const officer = useDashboardCadre();
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(demoRoadmap);
  const [dashboardData, setDashboardData] = useState<EmployeeDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profileId =
      typeof window !== "undefined"
        ? localStorage.getItem("diksha_profile_id") || "prof_demo"
        : "prof_demo";

    const jobRole =
      typeof window !== "undefined"
        ? localStorage.getItem("diksha_job_role") || officer.job_role
        : officer.job_role;

    Promise.allSettled([
      fetchRoadmap({ profile_id: profileId, job_role: jobRole }),
      fetchEmployeeDashboard(profileId)
    ]).then(([roadmapRes, dashRes]) => {
      if (roadmapRes.status === "fulfilled" && roadmapRes.value?.roadmap?.length) {
        setRoadmap(roadmapRes.value.roadmap);
      } else {
        setRoadmap(demoRoadmap);
      }

      if (dashRes.status === "fulfilled" && dashRes.value) {
        setDashboardData(dashRes.value);
      }
      setLoading(false);
    });
  }, [officer.id, officer.job_role]);

  const radarData = useMemo(() => getDomainRadarData(competencyCatalogue), []);

  const topRevision = useMemo<RevisionSuggestion>(() => {
    if (dashboardData?.revision_suggestions?.length) {
      return dashboardData.revision_suggestions[0];
    }
    return {
      node_id: "tech-python-101",
      name: "Python for Data Analysis (Survey Analytics)",
      reason: "Retention estimated at 30% (decay interval reached). Review recommended."
    };
  }, [dashboardData]);

  const activeCourse = useMemo(() => {
    if (dashboardData?.active_courses?.length) {
      const c = dashboardData.active_courses[0];
      return {
        id: c.course_id,
        course_id: c.course_id,
        title: c.title,
        reason: c.reason || "High-priority recommended module to bridge competency gap.",
        duration: c.duration || "16 Hours (Self-paced)",
        progress_pct: c.progress_pct,
        completed_modules: c.completed_modules,
        total_modules: c.total_modules
      };
    }
    return {
      ...learningResources[0],
      course_id: learningResources[0].id,
      progress_pct: (learningResources[0] as any).progress || 0,
      completed_modules: 1,
      total_modules: 4
    };
  }, [dashboardData]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-container via-primary to-navy-hero-end p-6 md:p-8 text-white shadow-lg border border-slate-700/30">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" height="100%" width="100%">
              <defs>
                <pattern id="hero-mesh" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="20" cy="20" r="3" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-mesh)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 backdrop-blur text-secondary-fixed text-xs font-semibold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-tricolor-saffron animate-pulse" />
                <span suppressHydrationWarning>{officer.cadreCode} Capacity Building Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" suppressHydrationWarning>
                Welcome, {officer.name}
              </h1>
              <p className="text-sm sm:text-base text-on-primary-container font-normal" suppressHydrationWarning>
                {officer.department}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-container-high pt-1">
                <span className="flex items-center gap-1" suppressHydrationWarning>
                  <span className="material-symbols-outlined text-[16px] text-action-saffron-light">badge</span>
                  Cadre: {officer.designation}
                </span>
                <span className="text-surface-variant/40">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-action-saffron-light">tag</span>
                  Employee Code: SI-9842
                </span>
                <span className="text-surface-variant/40">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-action-saffron-light">location_on</span>
                  Regional Office (Kolkata)
                </span>
              </div>
            </div>

            {/* Radial Readiness Gauge Container */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 self-start lg:self-auto shadow-sm">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#FFA730"
                    strokeDasharray="251.2"
                    strokeDashoffset="80.3"
                    strokeLinecap="round"
                    strokeWidth="8"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-white leading-none">
                    {dashboardData?.overall_progress_pct ? Math.round(dashboardData.overall_progress_pct) : 68}
                    <span className="text-sm font-normal text-action-saffron-light">%</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-surface-container-high mt-0.5">Readiness</span>
                </div>
              </div>
              <div className="flex flex-col justify-center pr-2">
                <span className="text-sm text-white font-semibold">Promotion Eligibility</span>
                <span className="text-xs text-surface-container-highest">Target: 85% for Cadre Upgrade</span>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-action-saffron-light bg-primary/40 px-2 py-0.5 rounded w-fit">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  <span>Gap: 17% (2 Modules Left)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Metric Karmayogi Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-surface-white rounded-lg p-4 shadow-sm border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Learning Logged</span>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-domain-statistical">
                <span className="material-symbols-outlined text-[20px]">pace</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-primary">
                {dashboardData?.learning_hours_logged ?? 14.5}{" "}
                <span className="text-sm font-normal text-text-secondary">/ 20 hrs</span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-domain-statistical h-full rounded-full" style={{ width: "72.5%" }} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
              <span>Quarter Target</span>
              <span className="text-status-mastered font-semibold">72.5% Completed</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-white rounded-lg p-4 shadow-sm border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Role Readiness</span>
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  {dashboardData?.overall_progress_pct ? Math.round(dashboardData.overall_progress_pct) : 68}%
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-status-mastered bg-emerald-50 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>+4%
                </span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-secondary-container h-full rounded-full" style={{ width: "68%" }} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
              <span>Monthly Velocity</span>
              <span className="text-primary font-semibold">+1 Competency Node</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-white rounded-lg p-4 shadow-sm border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Modules</span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-domain-governance">
                <span className="material-symbols-outlined text-[20px]">route</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-primary">
                {roadmap.length}{" "}
                <span className="text-sm font-normal text-text-secondary">Modules</span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-domain-governance h-full rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
              <span>Enrolled Roadmaps</span>
              <span className="text-domain-governance font-semibold">3 In-Progress</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-white rounded-lg p-4 shadow-sm border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Priority Gaps</span>
              <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-status-gap-high">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-status-gap-high">
                {roadmap.filter((r) => r.gap_severity === "high").length || 2} High Gaps
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-status-gap-high h-full rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
              <span className="text-status-gap-high font-semibold">Action Required</span>
              <span className="text-text-secondary">Survey Analytics, CAPI</span>
            </div>
          </div>
        </div>

        {/* SM-2 Spaced Repetition Cadence Alert Banner */}
        <section
          id="revision-cadence"
          className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-4 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container" />
          <div className="flex items-start gap-4 pl-2">
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[24px]">history_edu</span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary-container/20 px-2 py-0.5 rounded">
                  SM-2 Revision Cadence
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-error font-medium">
                  <span className="material-symbols-outlined text-[15px]">timer</span> Overdue by 3 days
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-primary">
                {topRevision.name}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                Memory retention estimated at <span className="font-semibold text-status-gap-high">30%</span> (decay interval reached). Complete a 5-minute booster session to reinforce statistical formulas and survey workflows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pl-2 md:pl-0 shrink-0 w-full sm:w-auto">
            <Link
              href="/quiz"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Take 5-min Booster Quiz</span>
            </Link>
          </div>
        </section>

        {/* Main 2-Column Grid (60% / 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4-Domain Competency Matrix */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-primary">4-Domain Competency Matrix</h2>
                  <p className="text-xs text-slate-500">MoSPI Civil Services Capacity Framework</p>
                </div>
                <Link
                  href="/competencies"
                  className="text-xs font-bold text-domain-statistical hover:underline flex items-center gap-1"
                >
                  <span>View Full Passport</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Domain 1: Statistical */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-domain-statistical" />
                      <span className="text-xs font-bold text-primary">Statistical Domain</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-domain-statistical uppercase">
                      Intermediate
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline justify-between mb-1 text-xs">
                      <span className="text-slate-500 font-medium">Mastery</span>
                      <span className="font-bold text-primary">74%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-domain-statistical h-full rounded-full" style={{ width: "74%" }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Stratified sampling, index numbers &amp; NSS variance computation.
                  </p>
                </div>

                {/* Domain 2: Technical */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-domain-technical" />
                      <span className="text-xs font-bold text-primary">Technical Domain</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-status-gap-high uppercase">
                      Basic
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline justify-between mb-1 text-xs">
                      <span className="text-slate-500 font-medium">Mastery</span>
                      <span className="font-bold text-primary">42%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-domain-technical h-full rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    CAPI mobile synchronization, Python scripting, validation rules.
                  </p>
                </div>

                {/* Domain 3: Digital Governance */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-domain-governance" />
                      <span className="text-xs font-bold text-primary">Digital Governance</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-status-mastered uppercase">
                      Advanced
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline justify-between mb-1 text-xs">
                      <span className="text-slate-500 font-medium">Mastery</span>
                      <span className="font-bold text-primary">85%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-domain-governance h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    e-Office workflow, Collection of Statistics Act, DPDP compliance.
                  </p>
                </div>

                {/* Domain 4: Behavioural */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-domain-behavioural" />
                      <span className="text-xs font-bold text-primary">Behavioural Domain</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-status-in-progress uppercase">
                      Basic
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="flex items-baseline justify-between mb-1 text-xs">
                      <span className="text-slate-500 font-medium">Mastery</span>
                      <span className="font-bold text-primary">58%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-domain-behavioural h-full rounded-full" style={{ width: "58%" }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Field team leadership, survey conflict mediation, reporting.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Learning Track Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-domain-statistical bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  Active Enrollment • iGOT Karmayogi
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Module {activeCourse.completed_modules + 1} of {activeCourse.total_modules}
                </span>
              </div>
              <h3 className="text-base font-bold text-primary">
                {activeCourse.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeCourse.reason}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Progress: {Math.round(activeCourse.progress_pct)}%</span>
                    <span className="font-semibold text-primary">{activeCourse.duration}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary-container h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, Math.round(activeCourse.progress_pct)))}%` }}
                    />
                  </div>
                </div>
                <Link
                  href={`/resources/${activeCourse.id}`}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Resume Course</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Domain Radar Visualization Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                  Competency Radar Assessment
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Target vs. Current</span>
              </div>
              <div className="h-64 flex items-center justify-center">
                <CompetencyRadar data={radarData} />
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-2">
                Evaluated against the official 18-node MoSPI Competency Dictionary.
              </p>
            </div>

            {/* Quick Practice Sandbox Launcher */}
            <div className="bg-gradient-to-br from-slate-900 to-primary text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-[20px]">terminal</span>
                  <span className="text-xs font-bold uppercase tracking-wider">MoSPI Data Practice</span>
                </div>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-semibold">
                  7 Datasets Online
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                Periodic Labour Force Survey (PLFS) Practice Workspace
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Run simulated unit-level microdata queries, inspect statement 3.4 LFPR aggregates, and test survey multipliers.
              </p>
              <Link
                href="/data-practice/plfs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Launch PLFS Console</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
