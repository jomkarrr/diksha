"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { EmptyState } from "@/components/ui/EmptyState";
import { learningResources } from "@/lib/mock/data";

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedCompetency, setSelectedCompetency] = useState("all");

  const domains = useMemo(() => {
    return Array.from(new Set(learningResources.map((r) => r.domain)));
  }, []);

  const difficulties = useMemo(() => {
    return Array.from(new Set(learningResources.map((r) => r.difficulty)));
  }, []);

  const providers = useMemo(() => {
    return Array.from(new Set(learningResources.map((r) => r.provider)));
  }, []);

  const competencies = useMemo(() => {
    return Array.from(new Set(learningResources.map((r) => r.competency)));
  }, []);

  const filteredResources = useMemo(() => {
    return learningResources.filter((resource) => {
      const query = search.toLowerCase();
      const matchesSearch =
        resource.title.toLowerCase().includes(query) ||
        resource.competency.toLowerCase().includes(query) ||
        resource.reason.toLowerCase().includes(query);
      const matchesDomain =
        selectedDomain === "all" || resource.domain === selectedDomain;
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
      <PageHeader
        eyebrow="Learning Resources"
        title="Discover recommended learning resources"
        description="Browse iGOT Karmayogi, NSSTA, and TPAC recommended courses mapped to official statistics competencies."
        action={
          <span className="text-xs font-semibold text-on-surface-variant">
            {filteredResources.length} of {learningResources.length} courses
          </span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <FadeIn from="left">
          <aside className="card h-fit p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Refine View</h2>
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase">
                Search
              </label>
              <div className="relative mt-1.5">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="focus-ring h-9 w-full rounded-lg border border-slate-200 bg-surface pl-9 pr-3 text-xs"
                />
              </div>
            </div>

            {/* Domain Filter */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase">
                Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="focus-ring mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
              >
                <option value="all">All Domains</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Competency Filter */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase">
                Target Competency
              </label>
              <select
                value={selectedCompetency}
                onChange={(e) => setSelectedCompetency(e.target.value)}
                className="focus-ring mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
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
              <label className="block text-xs font-semibold text-on-surface-variant uppercase">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="focus-ring mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
              >
                <option value="all">All Difficulties</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Provider Filter */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase">
                Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="focus-ring mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
              >
                <option value="all">All Providers</option>
                {providers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </aside>
        </FadeIn>

        <div>
          {filteredResources.length === 0 ? (
            <EmptyState
              icon="menu_book"
              title="No Learning Resources Match Your Filters"
              description="Try clearing your search query or selecting a broader provider/domain category."
            />
          ) : (
            <StaggerChildren className="grid gap-4 lg:grid-cols-2">
              {filteredResources.map((resource) => (
                <StaggerItem key={resource.id}>
                  <Link
                    href={`/resources/${resource.id}`}
                    className="card block p-5 transition hover:shadow-panel hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Badge tone="primary">{resource.provider}</Badge>
                      <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <Icon name="schedule" className="text-[16px]" /> {resource.duration}
                      </span>
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-on-surface hover:text-[#F4511E] transition">
                      {resource.title}
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-on-surface-variant">{resource.reason}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge>{resource.domain}</Badge>
                      <Badge>{resource.competency}</Badge>
                      <Badge>{resource.difficulty}</Badge>
                    </div>
                    <div className="mt-5 border-t border-slate-100 pt-3">
                      <AnimatedProgressBar value={resource.progress} label="Module Progress" />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </div>
    </AppShell>
  );
}
