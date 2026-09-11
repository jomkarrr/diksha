"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Icon } from "@/components/ui/Icon";
import { PLFS_STATEMENT_3_4, PLFSStatementRow } from "@/lib/mock/data";
import { apiFetch } from "@/lib/api/client";
import type { PracticeDatasetResponse } from "@/lib/types/contracts";

export default function PLFSPracticeWorkspacePage() {
  // Live API dataset state with fallback to mock data
  const [datasetMeta, setDatasetMeta] = useState<PracticeDatasetResponse | null>(null);
  const [rawRecords, setRawRecords] = useState<any[]>([]);
  const [tableRows, setTableRows] = useState<PLFSStatementRow[]>(PLFS_STATEMENT_3_4);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [apiSource, setApiSource] = useState<"api" | "fallback">("fallback");

  // Scrutiny validation state
  const [activeTab, setActiveTab] = useState<"statement" | "microdata">("statement");
  const [validatedRecordIds, setValidatedRecordIds] = useState<Set<string>>(new Set());
  const [flaggedIssueIds, setFlaggedIssueIds] = useState<Set<string>>(new Set());
  const [validationFilter, setValidationFilter] = useState<"all" | "suspect" | "flagged">("all");

  useEffect(() => {
    let isMounted = true;
    async function loadDataset() {
      try {
        const data = await apiFetch<PracticeDatasetResponse>("/practice/plfs");
        if (isMounted && data && data.records && data.records.length > 0) {
          setDatasetMeta(data);
          setRawRecords(data.records);
          const extractedRows: PLFSStatementRow[] = data.records
            .slice(0, 10)
            .map((r: any) => r.statement_row)
            .filter(Boolean);
          if (extractedRows.length > 0) {
            setTableRows(extractedRows);
          }
          setApiSource("api");
        }
      } catch (err) {
        console.warn("Using local fallback mock dataset for PLFS practice:", err);
        setApiSource("fallback");
      } finally {
        if (isMounted) setIsApiLoading(false);
      }
    }
    loadDataset();
    return () => {
      isMounted = false;
    };
  }, []);

  // Console filter states
  const [surveyYear, setSurveyYear] = useState("2023-24 (Annual Round)");
  const [stateZone, setStateZone] = useState("West Bengal (NSSO FOD Eastern Zone)");
  const [indicator, setIndicator] = useState("Worker Population Ratio (WPR)");
  const [sectorGender, setSectorGender] = useState("Rural & Urban Combined (M/F)");
  const [samplePartition, setSamplePartition] = useState("Full Sample (Sub 1 + Sub 2)");

  // Interactive computation states
  const [isComputing, setIsComputing] = useState(false);
  const [computedNotice, setComputedNotice] = useState<string | null>(null);

  function handleRunAnalysis() {
    setIsComputing(true);
    setComputedNotice(null);
    setTimeout(() => {
      setIsComputing(false);
      setComputedNotice(
        "Microdata Tabulation Generated: Standard error computed under circular systematic sampling. 18,460 weighted records extracted successfully."
      );
    }, 700);
  }

  function handleResetFilters() {
    setSurveyYear("2023-24 (Annual Round)");
    setStateZone("West Bengal (NSSO FOD Eastern Zone)");
    setIndicator("Worker Population Ratio (WPR)");
    setSectorGender("Rural & Urban Combined (M/F)");
    setSamplePartition("Full Sample (Sub 1 + Sub 2)");
    setComputedNotice(null);
  }

  function handleExport() {
    alert("Statement 3.4 export initialized: NSSO_PLFS_2023-24_WB_Aggregate.xlsx has been queued for download.");
  }

  function handleStartChallenge() {
    alert("Initializing Sandboxed NSSO Kernel: Loading 2023-24 Kolkata Urban Frame blocks into temporary memory space. +25 FRAC tracking active.");
  }

  function handleOpenJupyter() {
    alert("Launching secure NSSO JupyterLab kernel instance (Docker sandbox container isolated via NIC).");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Breadcrumb & Metadata Trail */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Link href="/knowledge" className="hover:text-primary transition-colors">
              Knowledge Repository
            </Link>
            <Icon name="chevron_right" className="text-[12px] text-text-tertiary" />
            <Link href="/data-practice" className="hover:text-primary transition-colors">
              Official Data Practice
            </Link>
            <Icon name="chevron_right" className="text-[12px] text-text-tertiary" />
            <span className="text-primary font-bold">Periodic Labour Force Survey (PLFS)</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
            Live Sovereign Sandbox Enclave
          </div>
        </div>

        {/* Hero Lockup Panel with Sovereign Azure Gradient */}
        <section className="relative rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-[#002046] via-[#1b365d] to-[#0B5C9E] text-white p-6 sm:p-8">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-action-saffron-light text-xs font-bold tracking-wider uppercase">
                <Icon name="verified_user" className="text-[16px]" />
                Official MoSPI Microdata Practice Sandbox
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display-hero">
                PLFS — Periodic Labour Force Survey
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Official Microdata Analysis &amp; Survey Practice Workspace • Ministry of Statistics and Programme Implementation. Precision computing sandbox for Statistical Officers, Investigators, and Research Analysts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-max">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <div className="w-9 h-9 rounded-full bg-action-saffron-light/20 flex items-center justify-center text-action-saffron-light">
                  <Icon name="analytics" className="text-[20px]" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold leading-tight">418,290 Records</div>
                  <div className="text-[11px] text-slate-300">2023-24 Consolidated Sample</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-[#138808]">
                  <Icon name="lock_clock" className="text-[20px] text-emerald-400" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold leading-tight">CWS &amp; Usual Status (ps+ss)</div>
                  <div className="text-[11px] text-slate-300">Full Multiplier Applied</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none text-white">
            <Icon name="hub" className="text-[180px]" />
          </div>
        </section>

        {/* Technical Specs & Overview Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Overview & 6 Metadata Tiles */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 rounded-xl bg-white shadow-sm border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h2 className="text-base font-bold text-[#002046] flex items-center gap-2">
                  <Icon name="menu_book" className="text-[#1B4CA1] text-[20px]" />
                  Survey Architecture &amp; Methodology
                </h2>
                <span className="text-xs text-slate-500 font-medium">NSS Report No. 592/79th Round</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                The Periodic Labour Force Survey (PLFS) is designed to estimate key employment and unemployment indicators (UR, WPR, LFPR) in short intervals of 3 months for urban areas under Current Weekly Status (CWS), and annually for both rural and urban areas under Usual Status (ps+ss). The data pipeline incorporates rotational panel designs for urban blocks and independent annual rural samples.
              </p>
            </div>

            {/* 6 Key Metadata Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Geographic Coverage
                </span>
                <div className="text-sm font-bold text-[#002046] mt-0.5">Pan-India</div>
                <span className="text-xs text-slate-500">All 28 States &amp; 8 UTs</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Frequency
                </span>
                <div className="text-sm font-bold text-[#002046] mt-0.5">Dual Cadence</div>
                <span className="text-xs text-slate-500">Quarterly Urban | Annual R+U</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Reference Window
                </span>
                <div className="text-sm font-bold text-[#002046] mt-0.5">July 2023 – June 2024</div>
                <span className="text-xs text-slate-500">Latest Released Series</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Historical Archive
                </span>
                <div className="text-sm font-bold text-[#002046] mt-0.5">7 Annual Rounds</div>
                <span className="text-xs text-slate-500">2017-18 to 2023-24 Online</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Primary Indicators
                </span>
                <div className="text-sm font-bold text-[#002046] mt-0.5">LFPR, WPR, UR</div>
                <span className="text-xs text-slate-500">Informal % &amp; Industry (NIC)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Sampling Design
                </span>
                <div className="text-sm font-bold text-[#002046] mt-0.5">Stratified Two-Stage</div>
                <span className="text-xs text-slate-500">FSUs: UFS Blocks / SSUs: Households</span>
              </div>
            </div>

            {/* Related Competencies Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Competencies Exercised:
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1B4CA1] text-xs font-semibold">
                <Icon name="stacked_line_chart" className="text-[14px]" /> Labour Statistics
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0D9488] text-xs font-semibold">
                <Icon name="scatter_plot" className="text-[14px]" /> Sampling Techniques &amp; Weighting
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-semibold">
                <Icon name="code" className="text-[14px]" /> Python Microdata Wrangling
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#D97706] text-xs font-semibold">
                <Icon name="fact_check" className="text-[14px]" /> Field Data QA
              </span>
            </div>
          </div>

          {/* Right 4 Cols: Quick Microdata Spec & Documentation Card */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-xl bg-white shadow-sm border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-[#002046] flex items-center gap-2">
                  <Icon name="folder_special" className="text-[#D97706] text-[20px]" />
                  Official Artefacts
                </h3>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                  PDF / CSV
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Authentic instructions to field staff, household schedules (Schedule 10.4), and raw layout specifications published by SDRD, Kolkata.
              </p>

              <div className="space-y-2">
                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Downloading NSSO Official Handbook: Instructions_to_Field_Staff_Vol_I.pdf");
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon name="description" className="text-[#1B4CA1] text-[20px]" />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">Instructions to Field Staff (Vol-I)</div>
                      <div className="text-[11px] text-slate-500">Concepts, Definitions &amp; Codes • 14.8 MB</div>
                    </div>
                  </div>
                  <Icon name="download" className="text-slate-400 group-hover:text-[#002046] transition-colors text-[18px]" />
                </a>

                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Downloading Layout Specification: PLFS_Microdata_Layout_Block4_5.csv");
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon name="table_view" className="text-[#1B4CA1] text-[20px]" />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">PLFS Microdata Layout &amp; Multipliers</div>
                      <div className="text-[11px] text-slate-500">Record structure for Block 4 &amp; 5.1 • CSV</div>
                    </div>
                  </div>
                  <Icon name="download" className="text-slate-400 group-hover:text-[#002046] transition-colors text-[18px]" />
                </a>
              </div>
            </div>

            {/* Sparkline Widget: Annual WPR Trend */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  National All-India WPR Trend
                </span>
                <span className="text-xs font-bold text-[#1B873F] flex items-center gap-1">
                  <Icon name="trending_up" className="text-[14px]" /> 56.0% (+2.2%)
                </span>
              </div>
              <svg className="w-full h-10 text-[#1B4CA1]" fill="none" viewBox="0 0 240 40">
                <path d="M0 32 L40 28 L80 25 L120 20 L160 16 L200 11 L240 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                <circle cx="240" cy="6" fill="#1B873F" r="3.5" />
                <circle cx="200" cy="11" fill="currentColor" r="2" />
                <circle cx="160" cy="16" fill="currentColor" r="2" />
                <circle cx="120" cy="20" fill="currentColor" r="2" />
                <circle cx="80" cy="25" fill="currentColor" r="2" />
                <circle cx="40" cy="28" fill="currentColor" r="2" />
                <circle cx="0" cy="32" fill="currentColor" r="2" />
              </svg>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>2017-18</span>
                <span>2020-21</span>
                <span>2023-24</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Practice Controls Console */}
        <section className="rounded-xl bg-white shadow-sm p-6 border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#002046] text-white flex items-center justify-center">
                <Icon name="tune" className="text-[18px]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#002046]">
                  Microdata Extraction &amp; Practice Console
                </h2>
                <p className="text-xs text-slate-500">
                  Configure stratifications, apply multipliers (MLT), and produce official MoSPI survey aggregates
                </p>
              </div>
            </div>
          </div>

          {/* Dropdown Selectors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Survey Year / Round
              </label>
              <select
                value={surveyYear}
                onChange={(e) => setSurveyYear(e.target.value)}
                className="w-full h-10 px-3 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#002046]"
              >
                <option>2023-24 (Annual Round)</option>
                <option>2022-23 (Annual Round)</option>
                <option>2021-22 (Annual Round)</option>
                <option>2020-21 (Annual Round)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                State / UT (Zone)
              </label>
              <select
                value={stateZone}
                onChange={(e) => setStateZone(e.target.value)}
                className="w-full h-10 px-3 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#002046]"
              >
                <option>West Bengal (NSSO FOD Eastern Zone)</option>
                <option>Maharashtra (NSSO FOD Western Zone)</option>
                <option>Uttar Pradesh (NSSO FOD Northern Zone)</option>
                <option>Tamil Nadu (NSSO FOD Southern Zone)</option>
                <option>All-India Aggregate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Key Indicator
              </label>
              <select
                value={indicator}
                onChange={(e) => setIndicator(e.target.value)}
                className="w-full h-10 px-3 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#002046]"
              >
                <option>Worker Population Ratio (WPR)</option>
                <option>Labour Force Participation Rate (LFPR)</option>
                <option>Unemployment Rate (UR - Usual Status)</option>
                <option>Distribution of Workers by Broad Industry (NIC)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sector &amp; Gender
              </label>
              <select
                value={sectorGender}
                onChange={(e) => setSectorGender(e.target.value)}
                className="w-full h-10 px-3 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#002046]"
              >
                <option>Rural &amp; Urban Combined (M/F)</option>
                <option>Rural Only (Male + Female)</option>
                <option>Urban Only (Male + Female)</option>
                <option>Disaggregated by Gender (Male/Female/Trans)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sample Partition
              </label>
              <select
                value={samplePartition}
                onChange={(e) => setSamplePartition(e.target.value)}
                className="w-full h-10 px-3 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#002046]"
              >
                <option>Full Sample (Sub 1 + Sub 2)</option>
                <option>Sub-Sample 1 (Central Sample)</option>
                <option>Sub-Sample 2 (State Sample Matching)</option>
              </select>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Icon name="info" className="text-[16px] text-[#0D9488]" />
              <span>Weights automatically adjusted for NSS 79th Round post-stratification ratios.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-sm"
              >
                Reset Filters
              </button>
              <button
                onClick={handleExport}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#002046] text-xs font-bold transition shadow-sm flex items-center gap-1"
              >
                <Icon name="file_download" className="text-[16px]" />
                Export Tabulation (CSV)
              </button>
              <button
                onClick={handleRunAnalysis}
                disabled={isComputing}
                className="px-4 py-2 rounded-lg bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 disabled:opacity-60"
              >
                <Icon
                  name={isComputing ? "progress_activity" : "play_arrow"}
                  className={`text-[18px] text-[#FFA730] ${isComputing ? "animate-spin" : ""}`}
                />
                {isComputing ? "Computing Estimates..." : "Run Analysis & Extract Microdata"}
              </button>
            </div>
          </div>

          {computedNotice && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <Icon name="check_circle" className="text-[16px] text-emerald-600" />
              <span>{computedNotice}</span>
            </div>
          )}
        </section>

        {/* Dataset Preview & Scrutiny Lab: Dual Aggregated & Microdata Mode */}
        <section className="rounded-xl bg-white shadow-sm p-6 border border-slate-200 space-y-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#002046]">
                  {activeTab === "statement" ? "Statement 3.4: Labour Indicators by Sector & Domain" : "NSS Schedule 10.4: Household-Level Microdata Scrutiny"}
                </h3>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1B4CA1] text-[10px] font-bold">
                  {apiSource === "api" ? "Live API Dataset (50 Records)" : "Local Simulation Fallback"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Principal &amp; Subsidiary Status (ps+ss) • NSSO FOD Field Unit Validated • DPDP &amp; Statistics Act Anonymized
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
              <button
                onClick={() => setActiveTab("statement")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                  activeTab === "statement"
                    ? "bg-white text-[#002046] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Statement 3.4
              </button>
              <button
                onClick={() => setActiveTab("microdata")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "microdata"
                    ? "bg-[#002046] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon name="biotech" className="text-[14px]" />
                <span>Microdata Scrutiny Lab</span>
                {datasetMeta && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FE8028] text-white text-[10px]">
                    {datasetMeta.total_records}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeTab === "statement" ? (
            /* TAB 1: STATEMENT 3.4 TABLE */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[#002046] font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3">S.No</th>
                    <th className="py-2.5 px-3">Stratum / Zone</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3">Gender</th>
                    <th className="py-2.5 px-3 text-right">Sample Households (n)</th>
                    <th className="py-2.5 px-3 text-right">Sample Persons (N)</th>
                    <th className="py-2.5 px-3 text-right">LFPR (ps+ss %)</th>
                    <th className="py-2.5 px-3 text-right">WPR (ps+ss %)</th>
                    <th className="py-2.5 px-3 text-right">UR (%)</th>
                    <th className="py-2.5 px-3 text-right">Multiplier (MLT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableRows.map((row) => (
                    <tr key={row.sNo} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{row.sNo}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#002046]">{row.zone}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.sector === "Urban"
                              ? "bg-blue-50 text-[#1B4CA1]"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {row.sector}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{row.gender}</td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-700">
                        {row.sampleHouseholds.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-700">
                        {row.samplePersons.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-700">
                        {row.lfpr.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right font-bold text-[#1B4CA1]">
                        {row.wpr.toFixed(1)}%
                      </td>
                      <td
                        className={`py-2.5 px-3 font-mono text-right font-semibold ${
                          row.ur > 5 ? "text-[#C2410C]" : "text-[#1B873F]"
                        }`}
                      >
                        {row.ur.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-500">
                        {row.multiplier.toFixed(2)}
                      </td>
                    </tr>
                  ))}

                  {/* Weighted Aggregate Row */}
                  <tr className="bg-slate-100 font-bold text-[#002046]">
                    <td className="py-2.5 px-3 font-mono">--</td>
                    <td className="py-2.5 px-3">West Bengal State Weighted Aggregate</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#002046] text-white text-[10px]">
                        R+U All
                      </span>
                    </td>
                    <td className="py-2.5 px-3">Total</td>
                    <td className="py-2.5 px-3 font-mono text-right">18,460</td>
                    <td className="py-2.5 px-3 font-mono text-right">77,536</td>
                    <td className="py-2.5 px-3 font-mono text-right">55.1%</td>
                    <td className="py-2.5 px-3 font-mono text-right text-[#002046] font-bold">52.8%</td>
                    <td className="py-2.5 px-3 font-mono text-right text-[#D97706] font-bold">4.2%</td>
                    <td className="py-2.5 px-3 font-mono text-right text-slate-500">Pooled (W)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            /* TAB 2: GRANULAR MICRODATA SCRUTINY LAB */
            <div className="space-y-4">
              {/* Scrutiny Controls & Metric Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-[#002046] flex items-center gap-1.5 text-sm">
                    <Icon name="search_check" className="text-[18px] text-[#1B4CA1]" />
                    <span>Officer Scrutiny &amp; Validation Protocol</span>
                  </div>
                  <p className="text-slate-600">
                    Inspect individual household schedules for statutory compliance: Underage labour rules, NIC/NCO coding consistency, and non-zero survey expansion weights.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Filter View:
                  </span>
                  <button
                    onClick={() => setValidationFilter("all")}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      validationFilter === "all" ? "bg-[#002046] text-white" : "bg-white border text-slate-600"
                    }`}
                  >
                    All ({rawRecords.length})
                  </button>
                  <button
                    onClick={() => setValidationFilter("suspect")}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      validationFilter === "suspect" ? "bg-amber-600 text-white" : "bg-white border text-slate-600"
                    }`}
                  >
                    Flagged by AI ({rawRecords.filter(r => r.is_quality_issue).length})
                  </button>
                </div>
              </div>

              {/* Granular Microdata Table */}
              <div className="overflow-x-auto max-h-[460px] border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 z-10">
                    <tr className="text-[#002046] font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2.5 px-3">Record ID</th>
                      <th className="py-2.5 px-3">FSU / State</th>
                      <th className="py-2.5 px-3">Age / Sex</th>
                      <th className="py-2.5 px-3">Activity Status</th>
                      <th className="py-2.5 px-3">NIC 2008</th>
                      <th className="py-2.5 px-3 text-right">Hours/Week</th>
                      <th className="py-2.5 px-3 text-right">Multiplier</th>
                      <th className="py-2.5 px-3 text-center">Officer Scrutiny</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {rawRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          <Icon name="cloud_off" className="text-[24px] text-slate-400 mx-auto mb-1" />
                          <div className="font-semibold text-slate-700">Microdata not loaded from backend API</div>
                          <div className="text-[11px] text-slate-400">
                            Start the FastAPI backend server on port 5001 to enable live unit-level scrutiny.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      (validationFilter === "suspect"
                        ? rawRecords.filter(r => r.is_quality_issue)
                        : rawRecords.slice(0, 20)
                      ).map((rec: any) => {
                      const isInspected = validatedRecordIds.has(rec.record_id);
                      const isFlagged = flaggedIssueIds.has(rec.record_id);

                      return (
                        <tr
                          key={rec.record_id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isInspected
                              ? rec.is_quality_issue
                                ? "bg-amber-50/70"
                                : "bg-emerald-50/40"
                              : ""
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-[#002046]">
                            {rec.record_id}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-800">{rec.state_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">FSU: {rec.fsu_id}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-700">{rec.age} yrs</span> • {rec.gender}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono font-bold text-[#002046]">
                              Code {rec.usual_principal_activity}
                            </span>
                            <div className="text-[10px] text-slate-500">
                              {rec.usual_principal_activity === 31
                                ? "Regular Wage / Salaried"
                                : rec.usual_principal_activity === 11
                                ? "Own Account Enterprise"
                                : rec.usual_principal_activity === 81
                                ? "Unemployed (Seeking Work)"
                                : "Out of Labour Force"}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            {rec.nic_2008_5digit}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-right text-slate-700">
                            {rec.hours_worked_last_7days}h
                          </td>
                          <td className="py-2.5 px-3 font-mono text-right text-slate-600">
                            {rec.subsample_multiplier.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {!isInspected ? (
                              <button
                                onClick={() => {
                                  const nextSet = new Set(validatedRecordIds);
                                  nextSet.add(rec.record_id);
                                  setValidatedRecordIds(nextSet);
                                  if (rec.is_quality_issue) {
                                    const nextIssues = new Set(flaggedIssueIds);
                                    nextIssues.add(rec.record_id);
                                    setFlaggedIssueIds(nextIssues);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#002046] hover:text-white text-[#002046] font-bold text-[11px] transition shadow-xs"
                              >
                                Run Scrutiny
                              </button>
                            ) : rec.is_quality_issue ? (
                              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                                <Icon name="warning" className="text-[12px] text-amber-600" />
                                <span>{rec.quality_issue_type?.replace(/_/g, " ")}</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <Icon name="check_circle" className="text-[12px] text-emerald-600" />
                                <span>Verified Valid</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>

              {/* Scrutiny Status Summary Footer */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Icon name="psychology" className="text-[16px] text-[#1B4CA1]" />
                  <span>
                    Officer Scrutinized: <strong>{validatedRecordIds.size}</strong> of {rawRecords.length} records • Anomalies Detected: <strong className="text-amber-700">{flaggedIssueIds.size}</strong>
                  </span>
                </div>
                <button
                  onClick={() => {
                    const allIds = new Set<string>(rawRecords.map(r => r.record_id));
                    setValidatedRecordIds(allIds);
                    const issueIds = new Set<string>(rawRecords.filter(r => r.is_quality_issue).map(r => r.record_id));
                    setFlaggedIssueIds(issueIds);
                  }}
                  className="px-3 py-1 rounded bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-xs shadow transition"
                >
                  Run Batch AI Scrutiny
                </button>
              </div>
            </div>
          )}

          {/* Table Footer Note */}
          <div className="mt-2 p-3 rounded bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              {datasetMeta ? datasetMeta.source_note : "Formula Note: WPR = (Total Estimated Employed Persons / Total Estimated Population) × 100."}
            </div>
            <div className="flex items-center gap-1 text-slate-800 font-medium">
              <Icon name="check_circle" className="text-[14px] text-[#138808]" />
              <span>Standard Error (RSE) &lt; 2.5% for all stratum estimates</span>
            </div>
          </div>
        </section>

        {/* Bottom Dedicated Cadre Practice Challenge Card with Saffron Accents */}
        <section className="rounded-xl bg-white shadow-lg p-6 sm:p-8 border border-slate-200 relative overflow-hidden">
          {/* Sovereign Saffron Left Accent Band */}
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#FF9933]" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-2">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFA730]/20 text-[#612900] text-xs font-bold">
                  <Icon name="military_tech" className="text-[16px] text-[#fe8028]" />
                  OFFICER PRACTICE CHALLENGE
                </span>
                <span className="px-2.5 py-0.5 rounded bg-slate-100 text-[#1B4CA1] text-xs font-bold">
                  Intermediate • 30 Minutes
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-[#138808] text-xs font-bold flex items-center gap-1">
                  <Icon name="stars" className="text-[14px]" />
                  +25 FRAC Competency Points
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#002046] tracking-tight font-headline-lg">
                Estimating Urban Female WPR Variance in First Stage Units
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Using the 2023-24 PLFS Urban Frame microdata for Kolkata zone, calculate the design effect (DEFF) under Circular Systematic Sampling versus Simple Random Sampling without replacement. Identify whether second-stage household non-response introduces systematic clustering bias.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Icon name="check" className="text-[16px] text-[#0D9488]" />
                  Auto-graded by DIKSHA AI Kernel
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="school" className="text-[16px] text-[#1B4CA1]" />
                  Statistical Investigator Gr. I Benchmark
                </span>
              </div>
            </div>

            {/* Challenge Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-max">
              <button
                onClick={handleStartChallenge}
                className="px-5 py-2.5 rounded-lg bg-[#FE8028] hover:bg-[#9a4600] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Icon name="rocket_launch" className="text-[18px]" />
                Start Guided Practice Lab
              </button>
              <button
                onClick={handleOpenJupyter}
                className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#002046] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="terminal" className="text-[18px] text-[#1B4CA1]" />
                Open Jupyter / Python Sandbox
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
