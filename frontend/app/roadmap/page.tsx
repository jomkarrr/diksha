"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { fetchRoadmap } from "@/lib/api/roadmap";
import { demoRoadmap, demoLearner, levelScore } from "@/lib/mock/data";
import type { RoadmapItem } from "@/lib/types/contracts";

export default function LearningRoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>(demoRoadmap);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profileId =
      typeof window !== "undefined"
        ? localStorage.getItem("diksha_profile_id") || "prof_demo"
        : "prof_demo";
    const jobRole =
      typeof window !== "undefined"
        ? localStorage.getItem("diksha_job_role") || demoLearner.job_role
        : demoLearner.job_role;

    fetchRoadmap({ profile_id: profileId, job_role: jobRole })
      .then((data) => {
        if (data?.roadmap?.length) {
          setItems(data.roadmap);
        } else {
          setItems(demoRoadmap);
        }
      })
      .catch(() => {
        setItems(demoRoadmap);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedDomain !== "all" && item.domain !== selectedDomain) return false;
      return true;
    });
  }, [items, selectedDomain]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Executive Title & Framework Context */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-domain-statistical bg-blue-50 px-2 py-0.5 rounded">
                MoSPI Cadre Competency Matrix
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Cadre: Statistical Investigator Gr. II</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Personalized Learning Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Gap-scored, prerequisite-ordered learning path calibrated against the 18-Node MoSPI FRAC Framework.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 self-start lg:self-auto shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-domain-statistical">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Milestones</span>
              <span className="text-xs text-primary font-bold">{items.length} Modules</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Next Review</span>
              <span className="text-xs text-status-gap-high font-bold">Recommended</span>
            </div>
          </div>
        </div>

        {/* Domain Filters Strip */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1">Domain:</span>
            <button
              type="button"
              onClick={() => setSelectedDomain("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedDomain === "all"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:text-primary"
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedDomain("statistical")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedDomain === "statistical"
                  ? "bg-domain-statistical text-white"
                  : "bg-slate-100 text-slate-600 hover:text-primary"
              }`}
            >
              Statistical
            </button>
            <button
              type="button"
              onClick={() => setSelectedDomain("technical")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedDomain === "technical"
                  ? "bg-domain-technical text-white"
                  : "bg-slate-100 text-slate-600 hover:text-primary"
              }`}
            >
              Technical
            </button>
            <button
              type="button"
              onClick={() => setSelectedDomain("digital_governance")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedDomain === "digital_governance"
                  ? "bg-domain-governance text-white"
                  : "bg-slate-100 text-slate-600 hover:text-primary"
              }`}
            >
              Digital Governance
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="material-symbols-outlined text-[16px] text-secondary">swap_vert</span>
            <span>Kahn&apos;s Linearized Rank (L0 ➔ L4)</span>
          </div>
        </div>

        {/* Topological Kahn Dependency Graph Sequence */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-primary">Topological Prerequisite Sequence</h2>
                <p className="text-xs text-slate-500">
                  Prerequisites are unlocked sequentially before dependent advanced modules
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600">
              <span className="w-2 h-2 rounded-full bg-status-mastered" />
              <span>Foundation Verified</span>
              <span className="text-slate-300">•</span>
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              <span>Current Target</span>
            </div>
          </div>

          {/* Stepper / Node Timeline Structure */}
          <div className="relative flex flex-col space-y-8">
            {filteredItems.map((item, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isCompleted = item.current_level === "advanced";
              const isHigh = item.gap_severity === "high";

              const statusColor = isCompleted
                ? "bg-status-mastered"
                : isHigh
                ? "bg-secondary pulse-amber"
                : "bg-domain-statistical";

              const matchedCourse = item.matched_courses?.[0] || {
                course_id: "igot-stat-104",
                title: "Advanced Stratified Sampling in Field Surveys: Multi-Stage Cluster Modeling",
                duration_hours: 16
              };

              return (
                <div key={item.node_id} className="relative flex items-start gap-4 sm:gap-6">
                  {/* Vertical Connector Column */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-9 h-9 rounded-full ${statusColor} text-white flex items-center justify-center shadow-sm z-10`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isCompleted ? "check" : isSecond ? "pending" : "school"}
                      </span>
                    </div>
                    {index < filteredItems.length - 1 && (
                      <div className="w-0.5 h-full min-h-[100px] bg-slate-200 mt-2" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-slate-50/60 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-domain-statistical bg-blue-50 px-2 py-0.5 rounded">
                            {item.domain.replace("_", " ")}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            Rank #{index + 1}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.gap_severity === "high"
                                ? "bg-red-50 text-status-gap-high"
                                : item.gap_severity === "medium"
                                ? "bg-amber-50 text-status-in-progress"
                                : "bg-emerald-50 text-status-mastered"
                            }`}
                          >
                            Gap Severity: {item.gap_severity.toUpperCase()}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-primary">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Current proficiency: <strong className="text-slate-800">{item.current_level}</strong> ➔ Target requirement: <strong className="text-primary">{item.required_level}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-semibold block">Topological Status</span>
                        <span className="text-xs font-bold text-primary">
                          {isCompleted ? "Acquired" : "Prerequisite Ready"}
                        </span>
                      </div>
                    </div>

                    {/* Matched iGOT Karmayogi Course Tile */}
                    <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-secondary bg-orange-50 px-2 py-0.5 rounded">
                            iGOT Karmayogi Course
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            ⏱️ {matchedCourse.duration_hours} Hours
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                          {matchedCourse.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Accredited by National Statistical Systems Training Academy (NSSTA)
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/resources/${matchedCourse.course_id}`}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          Curriculum
                        </Link>
                        <Link
                          href={`/assessments?node_id=${item.node_id}&topic=${encodeURIComponent(item.name)}`}
                          className="px-3.5 py-1.5 rounded-lg bg-secondary hover:bg-orange-600 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                        >
                          <span>Start Quiz</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
