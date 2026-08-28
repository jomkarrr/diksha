import type {
  AdminDashboard,
  CompetencyLevel,
  DomainType,
  GapSeverity,
  ProfileRequest,
  QuizQuestion,
  RoadmapItem
} from "@/lib/types/contracts";

export const demoLearner: ProfileRequest & { name: string; current_assignment: string } = {
  name: "Rajesh Kumar",
  designation: "Statistical Investigator Grade II",
  department: "National Sample Survey Office",
  job_role: "Statistical Investigator",
  experience_years: 8,
  education: "M.Sc. Statistics",
  prior_trainings: ["Survey Sampling Methods", "Basic Python", "Official Statistics Foundation"],
  current_assignment: "Household Survey Quality Review"
};

export const domainLabels: Record<DomainType, string> = {
  statistical: "Statistical",
  technical: "Technical",
  digital_governance: "Digital Governance",
  behavioural: "Behavioural"
};

export const levelScore: Record<CompetencyLevel, number> = {
  none: 0,
  basic: 1,
  intermediate: 2,
  advanced: 3
};

export const competencyCatalogue = [
  {
    node_id: "stat-survey-design-101",
    name: "Survey Design",
    domain: "statistical" as const,
    current_level: "intermediate" as const,
    required_level: "advanced" as const,
    gap_severity: "medium" as const,
    priority: "Core field methodology"
  },
  {
    node_id: "stat-sampling-101",
    name: "Sampling Techniques",
    domain: "statistical" as const,
    current_level: "basic" as const,
    required_level: "advanced" as const,
    gap_severity: "high" as const,
    priority: "Immediate learning need"
  },
  {
    node_id: "stat-data-quality-101",
    name: "Data Quality Frameworks",
    domain: "statistical" as const,
    current_level: "basic" as const,
    required_level: "intermediate" as const,
    gap_severity: "medium" as const,
    priority: "Survey validation"
  },
  {
    node_id: "tech-python-101",
    name: "Python for Data Analysis",
    domain: "technical" as const,
    current_level: "basic" as const,
    required_level: "intermediate" as const,
    gap_severity: "medium" as const,
    priority: "Automation readiness"
  },
  {
    node_id: "tech-sql-101",
    name: "SQL & Relational Databases",
    domain: "technical" as const,
    current_level: "basic" as const,
    required_level: "basic" as const,
    gap_severity: "low" as const,
    priority: "Maintained"
  },
  {
    node_id: "gov-data-privacy-101",
    name: "Data Privacy & Governance",
    domain: "digital_governance" as const,
    current_level: "none" as const,
    required_level: "basic" as const,
    gap_severity: "low" as const,
    priority: "Compliance"
  },
  {
    node_id: "mgr-communication-101",
    name: "Effective Communication",
    domain: "behavioural" as const,
    current_level: "basic" as const,
    required_level: "intermediate" as const,
    gap_severity: "medium" as const,
    priority: "Reporting clarity"
  }
];

export const demoRoadmap: RoadmapItem[] = [
  {
    node_id: "stat-sampling-101",
    name: "Sampling Techniques",
    domain: "statistical",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    matched_courses: [
      {
        course_id: "igot-stat-104",
        title: "Complex Sampling & Variance Estimation in Official Surveys",
        duration_hours: 16
      }
    ]
  },
  {
    node_id: "tech-python-101",
    name: "Python for Data Analysis",
    domain: "technical",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    matched_courses: [
      {
        course_id: "igot-tech-202",
        title: "Data Wrangling with Pandas & NumPy",
        duration_hours: 15
      }
    ]
  },
  {
    node_id: "stat-data-quality-101",
    name: "Data Quality Frameworks",
    domain: "statistical",
    current_level: "none",
    required_level: "intermediate",
    gap_severity: "high",
    matched_courses: [
      {
        course_id: "igot-stat-110",
        title: "UN NQAF Data Quality Assurance & Auditing",
        duration_hours: 10
      }
    ]
  }
];

export const learningResources = [
  {
    id: "igot-stat-104",
    title: "Complex Sampling & Variance Estimation in Official Surveys",
    provider: "iGOT Karmayogi",
    domain: "Statistical",
    competency: "Sampling Techniques",
    difficulty: "Intermediate",
    duration: "16 hours",
    progress: 0,
    reason: "Recommended because Sampling Techniques is your highest priority gap."
  },
  {
    id: "nssta-data-quality",
    title: "Official Statistics Data Quality Assurance",
    provider: "NSSTA",
    domain: "Statistical",
    competency: "Data Quality Frameworks",
    difficulty: "Intermediate",
    duration: "10 hours",
    progress: 35,
    reason: "Builds validation and audit practices for survey outputs."
  },
  {
    id: "tpac-python-dashboards",
    title: "Dashboards for Statistical Review Meetings",
    provider: "TPAC Recommended",
    domain: "Technical",
    competency: "Data Visualization",
    difficulty: "Basic",
    duration: "8 hours",
    progress: 64,
    reason: "Supports faster reporting for field monitoring."
  }
];

export const demoQuizQuestions: QuizQuestion[] = [
  {
    question: "Which principle is essential when conducting stratified sampling?",
    options: [
      "Partitioning the population into non-overlapping homogeneous strata",
      "Selecting every unit from the same district",
      "Ignoring stratum-level variance",
      "Replacing random selection with convenience interviews"
    ],
    correct_index: 0,
    explanation: "Stratified sampling depends on clear strata and valid random selection within them."
  },
  {
    question: "What is the main objective of a data quality framework in official statistics?",
    options: [
      "Reduce documentation",
      "Improve accuracy, timeliness, coherence, and credibility",
      "Avoid validation checks",
      "Replace sampling plans"
    ],
    correct_index: 1,
    explanation: "Quality frameworks protect trust in official indicators and survey releases."
  }
];

export const mockAdminDashboard: AdminDashboard = {
  employees: [
    {
      profile_id: "emp-101",
      name: "Rajesh Kumar",
      department: "National Sample Survey Office",
      avg_gap_severity: "medium",
      top_gaps: ["Sampling Techniques", "Python for Data Analysis"]
    },
    {
      profile_id: "emp-102",
      name: "Priya Sharma",
      department: "Central Statistics Office",
      avg_gap_severity: "high",
      top_gaps: ["National Accounts", "AI/ML in Official Statistics"]
    },
    {
      profile_id: "emp-103",
      name: "Amitabh Verma",
      department: "MoSPI",
      avg_gap_severity: "low",
      top_gaps: ["Data Privacy & Governance"]
    }
  ]
};

export function severityClass(severity: GapSeverity) {
  if (severity === "high") {
    return "bg-red-50 text-red-700 border-red-100";
  }
  if (severity === "medium") {
    return "bg-yellow-50 text-yellow-700 border-yellow-100";
  }
  return "bg-green-50 text-green-700 border-green-100";
}
