"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { EmptyState } from "@/components/ui/EmptyState";
import { learningResources } from "@/lib/mock/data";
import { fetchEmployeeDashboard } from "@/lib/api/dashboard";
import type { EmployeeDashboard } from "@/lib/types/contracts";

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedCompetency, setSelectedCompetency] = useState("all");
  const [dashboardData, setDashboardData] = useState<EmployeeDashboard | null>(null);

  useEffect(() => {
    const profileId =
      typeof window !== "undefined"
        ? localStorage.getItem("diksha_profile_id") || "prof_demo"
        : "prof_demo";
    fetchEmployeeDashboard(profileId)
      .then((data) => setDashboardData(data))
      .catch(() => {});
  }, []);

  const resources = useMemo(() => {
    const progressMap = new Map<string, number>();
    dashboardData?.active_courses?.forEach((c) => {
      progressMap.set(c.course_id, c.progress_pct);
    });

    return learningResources.map((res) => ({
      ...res,
      progress: progressMap.has(res.id) ? Math.round(progressMap.get(res.id)!) : res.progress
    }));
  }, [dashboardData]);

  const domains = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.domain)));
  }, [resources]);

  const difficulties = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.difficulty)));
  }, [resources]);

  const providers = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.provider)));
  }, [resources]);

  const competencies = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.competency)));
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const query = search.toLowerCase();
      const matchesSearch =
        resource.title.toLowerCase().includes(query) ||
        resource.competency.toLowerCase().includes(query) ||
        resource.reason.toLowerCase().includes(query) ||
        resource.code.toLowerCase().includes(query);
      const matchesDomain =
        selectedDomain === "all" || resource.domain.toLowerCase() === selectedDomain.toLowerCase();
      const matchesDifficulty =
        selectedDifficulty === "all" || resource.difficulty === selectedDifficulty;
      const matchesProvider =
        selectedProvider === "all" || resource.provider === selectedProvider;
      const matchesCompetency =
        selectedCompetency === "all" || resource.competency === selectedCompetency;

      return (
        matchesSearch &&
        matchesDomain &&
        matchesDifficulty &&
        matchesProvider &&
        matchesCompetency
      );
    });
  }, [search, selectedDomain, selectedDifficulty, selectedProvider, selectedCompetency]);

  const hasActiveFilters =
    search !== "" ||
    selectedDomain !== "all" ||
    selectedDifficulty !== "all" ||
    selectedProvider !== "all" ||
    selectedCompetency !== "all";

  const handleReset = () => {
    setSearch("");
    setSelectedDomain("all");
    setSelectedDifficulty("all");
    setSelectedProvider("all");
    setSelectedCompetency("all");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary uppercase tracking-wider">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Icon name="chevron_right" className="text-[14px] text-text-tertiary" />
          <span className="text-primary font-bold">iGOT Karmayogi &amp; NSSTA Learning Catalog</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#002046] via-[#1B365D] to-[#0B5C9E] text-white p-6 sm:p-8 shadow-md">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
          <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-[#FFA730]/10 pointer-events-none blur-3xl" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-action-saffron-light">
              <Icon name="school" className="text-[16px]" />
              iGOT-FRAC Aligned MoSPI Curriculum
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-headline-lg">
              Official Statistical Learning Catalog
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              Targeted accredited modules from NSSTA, iGOT Karmayogi Bharat, and MoSPI Training Division designed to close verified competency gaps.
            </p>

            {/* Fast Search */}
            <div className="pt-2">
              <div className="relative flex items-center shadow-lg rounded-xl bg-white text-slate-800 max-w-xl">
                <Icon name="search" className="absolute left-3.5 text-slate-400 text-[20px]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by module title, course code (e.g. NSSTA-STAT), or competency..."
                  className="w-full pl-10 pr-24 py-3 rounded-xl bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-12 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
                <span className="absolute right-3 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 font-mono">
                  ⌘K
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Domain Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedDomain("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shadow-sm ${
              selectedDomain === "all"
                ? "bg-[#002046] text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Domains ({learningResources.length})
          </button>
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d.toLowerCase())}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shadow-sm ${
                selectedDomain === d.toLowerCase()
                  ? "bg-[#002046] text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Main Grid: Sidebar + Cards */}
        <div className="grid gap-6 xl:grid-cols-[280px_1fr] items-start">
          {/* Sidebar Filters */}
          <FadeIn from="left">
            <aside className="card p-5 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-sm font-bold text-[#002046] flex items-center gap-1.5">
                  <Icon name="filter_list" className="text-[18px]" /> Refine Filters
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold text-[#F47920] hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Competency Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Competency Node
                </label>
                <select
                  value={selectedCompetency}
                  onChange={(e) => setSelectedCompetency(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#002046]"
                >
                  <option value="all">All Competencies</option>
                  {competencies.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Proficiency Tier
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#002046]"
                >
                  <option value="all">All Levels</option>
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              {/* Provider Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Accredited Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#002046]"
                >
                  <option value="all">All Providers</option>
                  {providers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Info Box */}
              <div className="rounded-lg bg-surface-container-low p-3.5 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-[#002046] flex items-center gap-1">
                  <Icon name="verified" className="text-[#138808] text-[16px]" />
                  Mandatory MoSPI Hours
                </div>
                <p className="leading-relaxed">
                  Every SSS / ISS officer must log at least 20 hours annually on iGOT Karmayogi or NSSTA modules.
                </p>
              </div>
            </aside>
          </FadeIn>

          {/* Cards Area */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500">
                Showing {filteredResources.length} of {learningResources.length} accredited courses
              </span>
            </div>

            {filteredResources.length === 0 ? (
              <EmptyState
                icon="menu_book"
                title="No Courses Match Your Criteria"
                description="Try clearing your search keyword or switching to 'All Domains' to discover other accredited modules."
              />
            ) : (
              <StaggerChildren className="grid gap-4 md:grid-cols-2">
                {filteredResources.map((resource) => {
                  const isStatistical = resource.domain.toLowerCase() === "statistical";
                  const isTechnical = resource.domain.toLowerCase() === "technical";
                  const isGovernance = resource.domain.toLowerCase() === "digital governance";

                  const tagColor = isStatistical
                    ? "bg-[#1B4CA1]/10 text-[#1B4CA1]"
                    : isTechnical
                    ? "bg-[#0D9488]/10 text-[#0D9488]"
                    : isGovernance
                    ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                    : "bg-[#D97706]/10 text-[#D97706]";

                  return (
                    <StaggerItem key={resource.id}>
                      <article className="card flex flex-col justify-between p-5 hover:shadow-md transition-all group border border-slate-200">
                        <div className="space-y-3">
                          {/* Top Row: Code & Duration */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {resource.code}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Icon name="schedule" className="text-[15px] text-slate-400" />
                              {resource.duration}
                            </span>
                          </div>

                          {/* Title */}
                          <Link href={`/resources/${resource.id}`}>
                            <h2 className="text-base font-bold text-[#002046] group-hover:text-[#F47920] transition-colors leading-snug line-clamp-2">
                              {resource.title}
                            </h2>
                          </Link>

                          {/* Rationale / Summary */}
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {resource.reason}
                          </p>

                          {/* Meta Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${tagColor}`}>
                              {resource.domain}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                              {resource.competency}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                              {resource.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Card Footer: Progress & Action */}
                        <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-medium text-slate-700">{resource.provider}</span>
                            <span className="font-semibold text-slate-900">{resource.progress}% Completed</span>
                          </div>
                          <AnimatedProgressBar value={resource.progress} />

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-400">
                              {resource.syllabus?.length || 4} syllabus modules
                            </span>
                            <Link
                              href={`/resources/${resource.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#F47920] hover:text-[#d84315] transition"
                            >
                              Explore Course
                              <Icon name="arrow_forward" className="text-[15px]" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    </StaggerItem>
                  );
                })}
              </StaggerChildren>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
