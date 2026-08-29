import type {
  CompetencyLevel,
  DomainType,
  GapSeverity,
  AdminEmployee,
} from "@/lib/types/contracts";
import { levelScore, domainLabels } from "@/lib/mock/data";

export interface CompetencyItemType {
  node_id: string;
  name: string;
  domain: DomainType;
  current_level: CompetencyLevel;
  required_level: "basic" | "intermediate" | "advanced";
  gap_severity: GapSeverity;
  priority: string;
}

export interface DomainStats {
  domain: DomainType;
  label: string;
  count: number;
  currentScore: number;
  maxScore: number;
  readiness: number;
}

/**
 * Calculates domain statistics and percentage readiness (0 - 100%) for each domain.
 */
export function getDomainStats(
  catalogue: CompetencyItemType[]
): Record<DomainType, DomainStats> {
  const domains: DomainType[] = [
    "statistical",
    "technical",
    "digital_governance",
    "behavioural",
  ];

  const stats: Record<DomainType, DomainStats> = {
    statistical: { domain: "statistical", label: domainLabels.statistical, count: 0, currentScore: 0, maxScore: 0, readiness: 0 },
    technical: { domain: "technical", label: domainLabels.technical, count: 0, currentScore: 0, maxScore: 0, readiness: 0 },
    digital_governance: { domain: "digital_governance", label: domainLabels.digital_governance, count: 0, currentScore: 0, maxScore: 0, readiness: 0 },
    behavioural: { domain: "behavioural", label: domainLabels.behavioural, count: 0, currentScore: 0, maxScore: 0, readiness: 0 },
  };

  catalogue.forEach((item) => {
    const current = levelScore[item.current_level] ?? 0;
    const required = levelScore[item.required_level] ?? 3;
    if (stats[item.domain]) {
      stats[item.domain].count += 1;
      stats[item.domain].currentScore += current;
      stats[item.domain].maxScore += required;
    }
  });

  domains.forEach((d) => {
    const s = stats[d];
    s.readiness = s.maxScore > 0 ? Math.round((s.currentScore / s.maxScore) * 100) : 0;
  });

  return stats;
}

/**
 * Percentage readiness for a given domain from a competency list.
 */
export function getDomainReadinessFromCatalogue(
  catalogue: CompetencyItemType[]
): Record<DomainType, number> {
  const stats = getDomainStats(catalogue);
  return {
    statistical: stats.statistical.readiness,
    technical: stats.technical.readiness,
    digital_governance: stats.digital_governance.readiness,
    behavioural: stats.behavioural.readiness,
  };
}

/**
 * Overall readiness percentage across all competencies in a list.
 */
export function getOverallReadiness(catalogue: CompetencyItemType[]): number {
  if (catalogue.length === 0) return 0;
  let totalCurrent = 0;
  let totalRequired = 0;
  catalogue.forEach((item) => {
    totalCurrent += levelScore[item.current_level] ?? 0;
    totalRequired += levelScore[item.required_level] ?? 3;
  });
  return totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : 0;
}

/**
 * Transforms competency catalogue into 4-domain aggregated radar chart data.
 */
export function getDomainRadarData(catalogue: CompetencyItemType[]) {
  const stats = getDomainStats(catalogue);
  const domains: DomainType[] = [
    "statistical",
    "technical",
    "digital_governance",
    "behavioural",
  ];
  return domains.map((domain) => ({
    subject: domainLabels[domain] || domain,
    readiness: stats[domain].readiness,
    fullMark: 100,
  }));
}

/**
 * Domain distribution readiness data for bar charts.
 */
export function getCompetencyDistributionByDomain(catalogue: CompetencyItemType[]) {
  const stats = getDomainStats(catalogue);
  const domains: DomainType[] = [
    "statistical",
    "technical",
    "digital_governance",
    "behavioural",
  ];
  return domains.map((domain) => ({
    domain: domainLabels[domain] || domain,
    readiness: stats[domain].readiness,
  }));
}

/**
 * Counts of gap severities in the catalogue for pie/donut charts.
 */
export function getGapSeverityBreakdown(catalogue: CompetencyItemType[]) {
  const counts: Record<GapSeverity, number> = { high: 0, medium: 0, low: 0 };
  catalogue.forEach((item) => {
    if (counts[item.gap_severity] !== undefined) {
      counts[item.gap_severity] += 1;
    }
  });

  return [
    { name: "High Gap", value: counts.high, color: "#ba1a1a" },
    { name: "Medium Gap", value: counts.medium, color: "#f59e0b" },
    { name: "Low Gap", value: counts.low, color: "#10b981" },
  ].filter((item) => item.value > 0);
}

/**
 * Counts of employee gap severities for admin dashboard.
 */
export function getEmployeeGapDistribution(employees: AdminEmployee[]) {
  const counts: Record<GapSeverity, number> = { high: 0, medium: 0, low: 0 };
  employees.forEach((emp) => {
    if (counts[emp.avg_gap_severity] !== undefined) {
      counts[emp.avg_gap_severity] += 1;
    }
  });

  return [
    { name: "High Severity", value: counts.high, color: "#ba1a1a" },
    { name: "Medium Severity", value: counts.medium, color: "#f59e0b" },
    { name: "Low Severity", value: counts.low, color: "#10b981" },
  ];
}

/**
 * Trajectory from learning resources progress.
 */
export function getProgressTrajectoryData(
  resources: { title: string; progress: number }[]
) {
  return resources.map((res) => ({
    name: res.title.length > 28 ? res.title.slice(0, 25) + "..." : res.title,
    progress: res.progress,
  }));
}
