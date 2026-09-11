"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Icon } from "@/components/ui/Icon";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { OFFICIAL_DATASETS } from "@/lib/mock/data";
import { apiFetch } from "@/lib/api/client";
import type { PracticeDatasetResponse } from "@/lib/types/contracts";

export default function DataPracticePage() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [workstation, setWorkstation] = useState<"jupyter" | "rstudio">("jupyter");

  // Interactive Live Dataset Inspector Modal / Drawer
  const [inspectingDomain, setInspectingDomain] = useState<string | null>(null);
  const [inspectedData, setInspectedData] = useState<PracticeDatasetResponse | null>(null);
  const [isLoadingInspection, setIsLoadingInspection] = useState(false);
  const [inspectionError, setInspectionError] = useState<string | null>(null);
  const [scannedIssueKeys, setScannedIssueKeys] = useState<Set<number>>(new Set());

  async function handleInspectDataset(domainKey: string) {
    setInspectingDomain(domainKey);
    setIsLoadingInspection(true);
    setInspectedData(null);
    setInspectionError(null);
    setScannedIssueKeys(new Set());
    try {
      const res = await apiFetch<PracticeDatasetResponse>(`/practice/${domainKey}`);
      setInspectedData(res);
    } catch (err) {
      console.error(`Failed to fetch practice dataset for ${domainKey}:`, err);
      setInspectionError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoadingInspection(false);
    }
  }

  const filteredDatasets = useMemo(() => {
    return OFFICIAL_DATASETS.filter((ds) => {
      const q = search.toLowerCase();
      const matchesSearch =
        ds.name.toLowerCase().includes(q) ||
        ds.abbreviation.toLowerCase().includes(q) ||
        ds.division.toLowerCase().includes(q) ||
        ds.description.toLowerCase().includes(q);

      const matchesDomain =
        selectedDomain === "all" || ds.category === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [search, selectedDomain]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Lab Workspace Head & Sovereign Context */}
        <div className="w-full flex flex-col gap-4">
          {/* Breadcrumb & Regulatory Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Link href="/knowledge" className="hover:text-primary transition-colors">
                Knowledge Repository
              </Link>
              <Icon name="chevron_right" className="text-[14px] text-text-tertiary" />
              <span className="text-primary font-bold">Official Data Practice Lab</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#1B4CA1] text-xs font-semibold">
              <Icon name="verified" className="text-[14px] text-[#138808]" />
              NIC Isolated Microdata Enclave
            </div>
          </div>

          {/* Title & Purpose Statement */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-4xl space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#002046] font-headline-lg">
                Official Statistical Data Practice
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Hands-on data exploration, microdata analysis, and survey validation lab designed for Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) cadres.
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-4 shrink-0 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Datasets
                </span>
                <span className="text-2xl font-bold text-[#002046] font-mono">
                  07
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Validated Microdata
                </span>
                <span className="text-2xl font-bold text-[#0D9488] font-mono">
                  2.9M+
                </span>
              </div>
            </div>
          </div>

          {/* Sovereign Microdata Notice Banner */}
          <div className="w-full bg-[#eff4ff] rounded-xl p-4 shadow-sm relative overflow-hidden border border-blue-100">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#fe8028]" />
            <div className="flex items-start gap-3 pl-1">
              <div className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center shrink-0 text-[#002046]">
                <Icon name="verified_user" className="text-[22px]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#002046] uppercase tracking-wider">
                  Sovereign Microdata Sandbox
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  All datasets are hosted in a secure, anonymized research environment compliant with the{" "}
                  <strong className="text-slate-900">Collection of Statistics Act, 2008</strong> and{" "}
                  <strong className="text-slate-900">DPDP Act 2023</strong>. Unscheduled extraction or unmasking of household coordinates is strictly audited via NIC telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Query Module */}
        <div className="w-full bg-white rounded-xl shadow-sm p-4 border border-slate-200 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search official survey datasets, unit-level microdata, schedule types..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 font-medium text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white border border-slate-200 transition-all"
              />
            </div>

            {/* Cadre / Mode Fast Toggles */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pr-1">
                Workstation:
              </span>
              <button
                onClick={() => setWorkstation("jupyter")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  workstation === "jupyter"
                    ? "bg-[#002046] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon name="terminal" className="text-[16px]" />
                JupyterLab
              </button>
              <button
                onClick={() => setWorkstation("rstudio")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  workstation === "rstudio"
                    ? "bg-[#002046] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon name="code_blocks" className="text-[16px]" />
                R-Studio Web
              </button>
            </div>
          </div>

          {/* Domain Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedDomain("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedDomain === "all"
                  ? "bg-[#002046] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Datasets ({OFFICIAL_DATASETS.length})
            </button>
            <button
              onClick={() => setSelectedDomain("labour")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedDomain === "labour"
                  ? "bg-[#002046] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Labour &amp; Employment
            </button>
            <button
              onClick={() => setSelectedDomain("industrial")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedDomain === "industrial"
                  ? "bg-[#002046] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Industrial &amp; Economic
            </button>
            <button
              onClick={() => setSelectedDomain("household")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedDomain === "household"
                  ? "bg-[#002046] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Household Expenditure
            </button>
            <button
              onClick={() => setSelectedDomain("price")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedDomain === "price"
                  ? "bg-[#002046] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Price &amp; Indices
            </button>
            <button
              onClick={() => setSelectedDomain("macro")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedDomain === "macro"
                  ? "bg-[#002046] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Macroeconomic &amp; Accounts
            </button>
          </div>
        </div>

        {/* Datasets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: PLFS Featured Hero Card across full width */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Visual & Agency Strip */}
              <div className="w-full lg:w-72 shrink-0 flex flex-col justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Survey Division:
                  </span>
                  <div className="text-sm font-bold text-[#002046] leading-snug">
                    Survey Design &amp; Research (SDRD) &amp; FOD
                  </div>
                </div>

                <div className="pt-4">
                  {/* Inline Mini Sparkline of Quarterly Rounds */}
                  <div className="text-[11px] text-slate-400 font-semibold mb-1">
                    Rounds Sampling Integrity
                  </div>
                  <svg className="w-full h-10 text-[#1B4CA1] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 25">
                    <path d="M0,20 Q12,12 25,16 T50,8 T75,14 T100,5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <circle className="fill-[#FFA730]" cx="100" cy="5" r="3.5" />
                  </svg>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>Q1 2017</span>
                    <span className="font-bold text-[#002046]">Q4 2024</span>
                  </div>
                </div>
              </div>

              {/* Details & Metadata */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1B4CA1] text-[10px] font-bold uppercase">
                      Labour Statistics &amp; Social Welfare
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                      Schedule 10.4 (CAPI)
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#002046] tracking-tight flex items-center gap-1.5">
                    PLFS — Periodic Labour Force Survey
                    <Icon name="stars" className="text-[20px] text-[#FFA730]" />
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Continuous nationwide survey measuring labour force participation rate (LFPR), worker population ratio (WPR), and unemployment rate (UR) across rural and urban domains with high-frequency quarterly Computer-Assisted Personal Interview (CAPI) validation cycles.
                  </p>
                </div>

                {/* Competencies Required */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Associated Competencies:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#002046] text-[10px] font-medium">
                      Sampling Techniques (Multi-stage Stratified)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#002046] text-[10px] font-medium">
                      Labour Force Classification
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-[#0D9488] text-[10px] font-medium">
                      Python Microdata Wrangling
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-[#7C3AED] text-[10px] font-medium">
                      CAPI Protocol QA
                    </span>
                  </div>
                </div>

                {/* Metrics Footer Strip */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Icon name="schedule" className="text-[15px] text-[#002046]" />
                      Freq: <strong>Quarterly (Urban) / Annual (R+U)</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Icon name="history" className="text-[15px] text-[#002046]" />
                      Rounds: <strong>2017-18 to 2023-24</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Icon name="map" className="text-[15px] text-[#002046]" />
                      Coverage: <strong>All States &amp; UTs</strong>
                    </span>
                  </div>
                  <Link
                    href="/data-practice/plfs"
                    className="px-4 py-2 rounded-lg bg-[#FE8028] hover:bg-[#9a4600] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all shrink-0"
                  >
                    <span>Explore Dataset &amp; Practice Lab</span>
                    <Icon name="arrow_forward" className="text-[16px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: ASI - Annual Survey of Industries */}
          <article className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[#1B4CA1] text-[10px] uppercase font-bold">
                    Industrial Statistics Wing (CSO)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                    NIC-2008 Codebase
                  </span>
                </div>
                <Icon name="factory" className="text-slate-400 text-[22px]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#002046]">
                  ASI — Annual Survey of Industries
                </h3>
                <span className="text-[11px] text-[#1B4CA1] font-semibold uppercase">
                  Manufacturing &amp; Economic Indicators
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Principal source of industrial statistics in India, capturing factory-sector gross output, invested capital, employment, and gross value added (GVA) across NIC codes.
              </p>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Competency Nodes:
                </span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    Industrial Classifications (NIC)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    National Accounts Integration
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-50 text-[10px] text-[#0D9488]">
                    Data Quality Assurance
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
                <strong>Frequency:</strong> Annual • Registered Factory Sector • Census + Sample Sector
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleInspectDataset("asi")}
                  className="flex-1 py-2 rounded-lg bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="biotech" className="text-[16px] text-[#FFA730]" />
                  <span>Inspect Microdata</span>
                </button>
                <Link
                  href="/data-practice/plfs"
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Practice</span>
                  <Icon name="chevron_right" className="text-[16px]" />
                </Link>
              </div>
            </div>
          </article>

          {/* Card 3: HCES - Household Consumption Expenditure */}
          <article className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[#1B4CA1] text-[10px] uppercase font-bold">
                    NSSO (Survey Division)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                    Schedule 1.0
                  </span>
                </div>
                <Icon name="home_work" className="text-slate-400 text-[22px]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#002046]">
                  HCES — Household Consumption Expenditure
                </h3>
                <span className="text-[11px] text-[#1B4CA1] font-semibold uppercase">
                  Living Standards &amp; Poverty Estimation
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Information on consumption patterns of rural and urban households, generating monthly per capita consumption expenditure (MPCE) for poverty lines and CPI weighting.
              </p>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Competency Nodes:
                </span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    Consumer Economics
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    Survey Sampling
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-50 text-[10px] text-[#0D9488]">
                    Weighting &amp; Multiplier Estimation
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
                <strong>Frequency:</strong> 5-Yearly Quinquennial • Rural &amp; Urban Stratified
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleInspectDataset("hces")}
                  className="flex-1 py-2 rounded-lg bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="biotech" className="text-[16px] text-[#FFA730]" />
                  <span>Inspect Microdata</span>
                </button>
                <Link
                  href="/data-practice/plfs"
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Practice</span>
                  <Icon name="chevron_right" className="text-[16px]" />
                </Link>
              </div>
            </div>
          </article>

          {/* Card 4: ASUSE */}
          <article className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0D9488] text-[10px] uppercase font-bold">
                    Economic Statistics Division (ESD)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                    Schedule 2.0
                  </span>
                </div>
                <Icon name="storefront" className="text-slate-400 text-[22px]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#002046]">
                  ASUSE — Unincorporated Sector Enterprises
                </h3>
                <span className="text-[11px] text-[#0D9488] font-semibold uppercase">
                  Informal Sector &amp; Microenterprise Economics
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Economic and operational characteristics of non-agricultural unincorporated enterprises in manufacturing, trade, and other services across rural and urban India.
              </p>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Competency Nodes:
                </span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    Informal Sector Metrics
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    GVA Estimation
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
                <strong>Frequency:</strong> Annual • Enterprise Frame Sampling
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleInspectDataset("asuse")}
                  className="flex-1 py-2 rounded-lg bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="biotech" className="text-[16px] text-[#FFA730]" />
                  <span>Inspect Microdata</span>
                </button>
                <Link
                  href="/data-practice/plfs"
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Practice</span>
                  <Icon name="chevron_right" className="text-[16px]" />
                </Link>
              </div>
            </div>
          </article>

          {/* Card 5: CPI */}
          <article className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[#D97706] text-[10px] uppercase font-bold">
                    Price Statistics Division (PSD)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                    Base 2012=100
                  </span>
                </div>
                <Icon name="trending_up" className="text-slate-400 text-[22px]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#002046]">
                  CPI — Consumer Price Index (Rural/Urban/Combined)
                </h3>
                <span className="text-[11px] text-[#D97706] font-semibold uppercase">
                  Inflation Dynamics &amp; Basket Weights
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Headline inflation tracking capturing 299 goods and services across 1,181 rural villages and 1,114 urban markets nationwide via monthly price collection.
              </p>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Competency Nodes:
                </span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    Index Number Formulation (Laspeyres)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    Price Quote Imputation
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
                <strong>Frequency:</strong> Monthly Series • Headline Retail Price Metrics
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleInspectDataset("cpi")}
                  className="flex-1 py-2 rounded-lg bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="biotech" className="text-[16px] text-[#FFA730]" />
                  <span>Inspect Microdata</span>
                </button>
                <Link
                  href="/data-practice/plfs"
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Practice</span>
                  <Icon name="chevron_right" className="text-[16px]" />
                </Link>
              </div>
            </div>
          </article>
        </div>

        {/* Live Microdata Inspection Drawer / Modal */}
        {inspectingDomain && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-[#002046] to-[#0B5C9E] text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Icon name="verified" className="text-[18px] text-[#FFA730]" />
                    <h3 className="text-base font-bold tracking-tight">
                      {inspectedData?.survey_name || `Inspecting ${inspectingDomain.toUpperCase()}`}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-200">
                    {inspectedData?.source_note || "Loading sovereign statistical dataset..."}
                  </p>
                </div>
                <button
                  onClick={() => setInspectingDomain(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                >
                  <Icon name="close" className="text-[18px]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {isLoadingInspection ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Icon name="progress_activity" className="text-[32px] text-[#002046] animate-spin" />
                    <span className="text-xs text-slate-500 font-semibold">
                      Retrieving authentic synthetic microdata from backend...
                    </span>
                  </div>
                ) : inspectedData ? (
                  <>
                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total Records</span>
                        <div className="text-lg font-bold text-[#002046]">{inspectedData.total_records}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Linked Competency</span>
                        <div className="text-xs font-mono font-bold text-[#1B4CA1] truncate">
                          {inspectedData.linked_competency_node || "General"}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Target Role</span>
                        <div className="text-xs font-bold text-slate-700 truncate">
                          {inspectedData.target_job_role || "Statistical Investigator"}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Scrutiny Issues</span>
                        <div className="text-lg font-bold text-amber-600">
                          {scannedIssueKeys.size} <span className="text-xs text-slate-400 font-normal">found</span>
                        </div>
                      </div>
                    </div>

                    {/* Records Preview Table */}
                    <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-80">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 sticky top-0">
                          <tr className="border-b border-slate-200 text-[#002046] font-bold">
                            <th className="py-2 px-3">#</th>
                            {inspectedData.records[0] &&
                              Object.keys(inspectedData.records[0])
                                .filter(k => !["statement_row", "is_quality_issue", "quality_issue_type"].includes(k))
                                .slice(0, 5)
                                .map(col => (
                                  <th key={col} className="py-2 px-3 uppercase text-[10px]">
                                    {col.replace(/_/g, " ")}
                                  </th>
                                ))}
                            <th className="py-2 px-3 text-center">QA Audit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {inspectedData.records.slice(0, 15).map((rec, i) => {
                            const isAudited = scannedIssueKeys.has(i);
                            return (
                              <tr
                                key={i}
                                className={`hover:bg-slate-50 transition ${
                                  isAudited && rec.is_quality_issue ? "bg-amber-50" : ""
                                }`}
                              >
                                <td className="py-2 px-3 font-mono text-slate-400">{i + 1}</td>
                                {Object.keys(rec)
                                  .filter(k => !["statement_row", "is_quality_issue", "quality_issue_type"].includes(k))
                                  .slice(0, 5)
                                  .map(col => (
                                    <td key={col} className="py-2 px-3 text-slate-700 truncate max-w-[140px]">
                                      {typeof rec[col] === "number" ? rec[col].toLocaleString() : String(rec[col])}
                                    </td>
                                  ))}
                                <td className="py-2 px-3 text-center">
                                  {!isAudited ? (
                                    <button
                                      onClick={() => {
                                        const next = new Set(scannedIssueKeys);
                                        next.add(i);
                                        setScannedIssueKeys(next);
                                      }}
                                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-[#002046] hover:text-white text-[#002046] font-bold text-[10px] transition"
                                    >
                                      Check
                                    </button>
                                  ) : rec.is_quality_issue ? (
                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                      Flag: {rec.quality_issue_type?.replace(/_/g, " ")}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      Valid
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                      <Icon name="warning" className="text-[24px]" />
                    </div>
                    <div className="space-y-1 max-w-md mx-auto">
                      <div className="text-sm font-bold text-slate-800">
                        Unable to Retrieve Dataset
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {inspectionError || "Failed to load dataset records. Please verify that the DIKSHA API server is running and reachable."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (inspectedData) {
                      const allIndices = new Set<number>(inspectedData.records.map((_, i) => i));
                      setScannedIssueKeys(allIndices);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold transition shadow-sm"
                >
                  Run Full Audit on All Rows
                </button>
                <button
                  onClick={() => setInspectingDomain(null)}
                  className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
