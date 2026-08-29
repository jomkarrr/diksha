"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CompetencyTable } from "@/components/competency/CompetencyTable";
import { MetricCard } from "@/components/ui/MetricCard";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { Icon } from "@/components/ui/Icon";
import { competencyCatalogue, domainLabels, levelScore } from "@/lib/mock/data";
import { getDomainStats } from "@/lib/utils/chartData";

export default function CompetenciesPage() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const filteredItems = useMemo(() => {
    return competencyCatalogue.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.priority.toLowerCase().includes(search.toLowerCase());
      const matchesDomain =
        selectedDomain === "all" || item.domain === selectedDomain;
      const matchesLevel =
        selectedLevel === "all" || item.current_level === selectedLevel;
      const matchesSeverity =
        selectedSeverity === "all" || item.gap_severity === selectedSeverity;

      return matchesSearch && matchesDomain && matchesLevel && matchesSeverity;
    });
  }, [search, selectedDomain, selectedLevel, selectedSeverity]);

  // Compute live domain stats derived directly from the filtered set
  const domainStats = useMemo(() => {
    return getDomainStats(filteredItems);
  }, [filteredItems]);

  const hasActiveFilters =
    search !== "" ||
    selectedDomain !== "all" ||
    selectedLevel !== "all" ||
    selectedSeverity !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedDomain("all");
    setSelectedLevel("all");
    setSelectedSeverity("all");
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="My Competencies"
        title="Review your current skill levels against role requirements"
        description="Competency levels combine profile analysis, learning progress, and assessment readiness for the official statistical framework."
        action={
          <span className="text-xs font-semibold text-on-surface-variant">
            {filteredItems.length} of {competencyCatalogue.length} competencies listed
          </span>
        }
      />

      {/* Dynamic KPI Cards calculated from filtered data */}
      <StaggerChildren className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <MetricCard
            label="Statistical"
            value={`${domainStats.statistical.readiness}%`}
            detail={`${domainStats.statistical.count} active ${domainStats.statistical.count === 1 ? 'node' : 'nodes'}`}
            icon="monitoring"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Technical"
            value={`${domainStats.technical.readiness}%`}
            detail={`${domainStats.technical.count} active ${domainStats.technical.count === 1 ? 'node' : 'nodes'}`}
            icon="terminal"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Digital Governance"
            value={`${domainStats.digital_governance.readiness}%`}
            detail={`${domainStats.digital_governance.count} active ${domainStats.digital_governance.count === 1 ? 'node' : 'nodes'}`}
            icon="verified_user"
            tone="neutral"
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="Behavioural"
            value={`${domainStats.behavioural.readiness}%`}
            detail={`${domainStats.behavioural.count} active ${domainStats.behavioural.count === 1 ? 'node' : 'nodes'}`}
            icon="groups"
            tone="neutral"
          />
        </StaggerItem>
      </StaggerChildren>

      {/* Interactive Search and Filter Controls */}
      <FadeIn delay={0.1}>
        <section className="card mt-6 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search competencies by name or priority..."
                className="focus-ring h-10 w-full rounded-lg border border-slate-200 bg-surface pl-10 pr-4 text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Domain Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-on-surface-variant">Domain:</span>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="focus-ring h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="all">All Domains</option>
                  <option value="statistical">Statistical</option>
                  <option value="technical">Technical</option>
                  <option value="digital_governance">Digital Governance</option>
                  <option value="behavioural">Behavioural</option>
                </select>
              </div>

              {/* Current Level Filter (Separated from severity) */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-on-surface-variant">Current Level:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="focus-ring h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="all">All Levels</option>
                  <option value="none">None</option>
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Gap Severity Filter (Separated from level) */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-on-surface-variant">Gap Severity:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="focus-ring h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High Gap</option>
                  <option value="medium">Medium Gap</option>
                  <option value="low">Low Gap</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="h-9 px-3 text-xs font-semibold text-primary hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Capability Overview based on active filtered items */}
      <FadeIn delay={0.15}>
        <section className="card mt-6 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Capability Overview</h2>
            <span className="text-xs text-on-surface-variant font-medium">
              {filteredItems.length} matching {filteredItems.length === 1 ? 'competency' : 'competencies'}
            </span>
          </div>
          {filteredItems.length === 0 ? (
            <p className="mt-4 text-xs text-on-surface-variant">No competencies match the current filter selection.</p>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {filteredItems.map((item) => {
                const currentScore = levelScore[item.current_level] || 0;
                const requiredScore = levelScore[item.required_level] || 3;
                const pct = Math.round((currentScore / requiredScore) * 100);

                return (
                  <AnimatedProgressBar
                    key={item.node_id}
                    value={pct}
                    label={
                      <div className="flex justify-between items-center w-full pr-2">
                        <Link
                          href={`/competencies/${item.node_id}`}
                          className="font-medium text-on-surface hover:text-[#F4511E] hover:underline"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs text-on-surface-variant capitalize">
                          {item.current_level} &rarr; {item.required_level} ({pct}%)
                        </span>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
      </FadeIn>

      {/* Competency Table with Filtered Results */}
      <div className="mt-6">
        <CompetencyTable items={filteredItems} />
      </div>
    </AppShell>
  );
}
