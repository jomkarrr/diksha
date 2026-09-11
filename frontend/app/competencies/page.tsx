"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { formatDisplayDate } from "@/lib/utils/date";
import { fetchEmployeeDashboard } from "@/lib/api/dashboard";
import type { EmployeeDashboard } from "@/lib/types/contracts";
import {
  competencyCatalogue,
  getCompetencyLevel5,
  OFFICIAL_CADRES,
  levelScore,
  type CompetencyDetailItem
} from "@/lib/mock/data";

export default function CompetencyPassportPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [exported, setExported] = useState(false);
  const [dashboardData, setDashboardData] = useState<EmployeeDashboard | null>(null);

  const officer = useMemo(() => {
    const pId =
      typeof window !== "undefined"
        ? localStorage.getItem("diksha_profile_id") || "prof_demo"
        : "prof_demo";
    return OFFICIAL_CADRES.find((c) => c.id === pId) || OFFICIAL_CADRES[0];
  }, []);

  const loadData = () => {
    const profileId =
      typeof window !== "undefined"
        ? localStorage.getItem("diksha_profile_id") || "prof_demo"
        : "prof_demo";
    fetchEmployeeDashboard(profileId)
      .then((data) => setDashboardData(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
    window.addEventListener("diksha_cadre_change", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("diksha_cadre_change", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const liveCatalogue = useMemo(() => {
    if (!dashboardData?.competency_summary?.length) return competencyCatalogue;

    const masteryMap = new Map<string, { mastery: number; last_reviewed: string }>();
    dashboardData.competency_summary.forEach((item) => {
      masteryMap.set(item.node_id, {
        mastery: item.mastery,
        last_reviewed: item.last_reviewed
      });
    });

    return competencyCatalogue.map((node) => {
      if (masteryMap.has(node.node_id)) {
        const m = masteryMap.get(node.node_id)!;
        let currentLevel: "none" | "basic" | "intermediate" | "advanced" = "none";
        if (m.mastery >= 81) currentLevel = "advanced";
        else if (m.mastery >= 56) currentLevel = "intermediate";
        else if (m.mastery >= 26) currentLevel = "basic";

        const reqScore = levelScore[node.required_level] || 2;
        const curScore = levelScore[currentLevel] || 0;
        const gapSeverity: "low" | "medium" | "high" =
          curScore >= reqScore
            ? "low"
            : reqScore - curScore >= 2
            ? "high"
            : "medium";

        return {
          ...node,
          mastery: Math.round(m.mastery),
          current_level: currentLevel,
          gap_severity: gapSeverity,
          last_assessed: m.last_reviewed
        };
      }
      return node;
    });
  }, [dashboardData]);

  const domainCounts = useMemo(() => {
    return {
      all: liveCatalogue.length,
      statistical: liveCatalogue.filter((c) => c.domain === "statistical").length,
      technical: liveCatalogue.filter((c) => c.domain === "technical").length,
      digital_governance: liveCatalogue.filter((c) => c.domain === "digital_governance").length,
      behavioural: liveCatalogue.filter((c) => c.domain === "behavioural").length
    };
  }, [liveCatalogue]);

  const filteredNodes = useMemo(() => {
    return liveCatalogue.filter((node) => {
      const matchDomain = selectedDomain === "all" || node.domain === selectedDomain;
      const matchSearch =
        search === "" ||
        node.name.toLowerCase().includes(search.toLowerCase()) ||
        node.description.toLowerCase().includes(search.toLowerCase());
      return matchDomain && matchSearch;
    });
  }, [liveCatalogue, selectedDomain, search]);

  const benchmarkMetCount = useMemo(() => {
    return liveCatalogue.filter((c) => c.gap_severity === "low" || c.mastery >= 70).length;
  }, [liveCatalogue]);

  const overallIndex = useMemo(() => {
    return dashboardData?.overall_progress_pct !== undefined
      ? Math.round(dashboardData.overall_progress_pct)
      : 68;
  }, [dashboardData]);

  const handleExportPDF = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Sovereign Metadata Strip & Header Title Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              <span className="material-symbols-outlined text-[16px] text-action-saffron-light">
                verified_user
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                iGOT Karmayogi Bharat • Capacity Building Commission (CBC)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              MoSPI FRAC Competency Passport
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Official 18-Node Statistical Matrix • Framework for Roles, Activities and Competencies (FRAC)
            </p>
          </div>

          {/* Action Group: DigiLocker & PDF Export */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="material-symbols-outlined text-[20px] text-status-mastered">verified</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold leading-none">Official Status</span>
                <span className="text-xs text-primary font-bold">DigiLocker Verified</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>{exported ? "Passport Downloaded!" : "Export Official Passport PDF"}</span>
            </button>
          </div>
        </div>

        {/* Officer Summary Banner (Bento Metric Layout) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-50/50 rounded-full pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Officer Profile Identity */}
            <div className="md:col-span-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-black shadow-inner shrink-0">
                {officer.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-primary truncate">{officer.name}</span>
                  <span className="material-symbols-outlined text-[16px] text-domain-statistical" title="Verified MoSPI Personnel">
                    verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{officer.designation}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-primary">
                    Cadre: SSS-Gr.II
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                    RO: Kolkata HQ
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 1: Overall Competency Index with Radial Indicator */}
            <div className="md:col-span-4 flex items-center gap-4 bg-canvas-slate/80 p-4 rounded-xl border border-slate-200/80">
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-action-saffron-light"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${overallIndex}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-primary">{overallIndex}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Role Index</span>
                <div className="text-lg font-extrabold text-primary">
                  {overallIndex} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Competency readiness score</p>
              </div>
            </div>

            {/* Metric 2: Compliance Target Metric */}
            <div className="md:col-span-4 flex items-center justify-between bg-canvas-slate/80 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">FRAC Benchmark Met</span>
                <div className="text-lg font-extrabold text-status-mastered flex items-center gap-2">
                  <span>{benchmarkMetCount} / 18</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600">
                    {Math.round((benchmarkMetCount / 18) * 100)}% complete
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  {18 - benchmarkMetCount} nodes require scheduled upskilling
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-xs text-domain-statistical">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Filter Bar with Search and Count Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedDomain("all")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedDomain === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-primary"
              }`}
            >
              <span>All Nodes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {domainCounts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain("statistical")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedDomain === "statistical"
                  ? "bg-domain-statistical text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-primary"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-domain-statistical" />
              <span>Statistical</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                {domainCounts.statistical}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain("technical")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedDomain === "technical"
                  ? "bg-domain-technical text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-primary"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-domain-technical" />
              <span>Technical</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                {domainCounts.technical}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain("digital_governance")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedDomain === "digital_governance"
                  ? "bg-domain-governance text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-primary"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-domain-governance" />
              <span>Digital Governance</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                {domainCounts.digital_governance}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain("behavioural")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedDomain === "behavioural"
                  ? "bg-domain-behavioural text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-primary"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-domain-behavioural" />
              <span>Behavioural</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                {domainCounts.behavioural}
              </span>
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search nodes..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-domain-statistical"
            />
          </div>
        </div>

        {/* 18-Node Competency Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredNodes.map((node) => {
            const levelInfo = getCompetencyLevel5(node.current_level, node.mastery);
            const isMet = node.gap_severity === "low" || node.mastery >= 70;

            const domainBg =
              node.domain === "statistical"
                ? "bg-blue-50 text-domain-statistical"
                : node.domain === "technical"
                ? "bg-teal-50 text-domain-technical"
                : node.domain === "digital_governance"
                ? "bg-purple-50 text-domain-governance"
                : "bg-amber-50 text-domain-behavioural";

            return (
              <div
                key={node.node_id}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${domainBg}`}>
                      {node.domain.replace("_", " ")}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                        isMet
                          ? "bg-emerald-50 text-status-mastered"
                          : "bg-red-50 text-status-gap-high"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isMet ? "check_circle" : "warning"}
                      </span>
                      {isMet ? "Role Met" : "Gap Alert"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-primary mb-1 line-clamp-1">{node.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>

                  {/* 5-Step Visual Progression Track */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span>Level: <strong className="text-primary">{levelInfo.label}</strong></span>
                      <span className="font-semibold text-slate-700">Mastery: {node.mastery}%</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 relative">
                      {[1, 2, 3, 4, 5].map((tier) => (
                        <div
                          key={tier}
                          className={`h-2 rounded-full transition-colors ${
                            tier <= levelInfo.tier
                              ? levelInfo.tier === 5
                                ? "bg-status-mastered"
                                : tier <= 2
                                ? "bg-status-gap-high"
                                : tier <= 4
                                ? "bg-domain-statistical"
                                : "bg-status-mastered"
                              : "bg-slate-100"
                          }`}
                          title={`Level ${tier}`}
                        />
                      ))}
                    </div>

                    <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase mt-1">
                      <span>Novice</span>
                      <span>Basic</span>
                      <span>Interm</span>
                      <span>Adv</span>
                      <span>Master</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Last review: {formatDisplayDate(node.last_reviewed)}
                  </span>
                  <Link
                    href={`/assessments?node_id=${node.node_id}&topic=${encodeURIComponent(node.name)}`}
                    className="font-bold text-domain-statistical hover:text-primary flex items-center gap-0.5"
                  >
                    <span>Assess</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
