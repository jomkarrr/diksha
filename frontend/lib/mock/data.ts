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
  name: "Rajesh",
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

export interface CompetencyDetailItem {
  node_id: string;
  name: string;
  domain: DomainType;
  current_level: CompetencyLevel;
  required_level: "basic" | "intermediate" | "advanced";
  gap_severity: GapSeverity;
  priority: string;
  description: string;
  current_description: string;
  required_description: string;
  related_node_ids: string[];
}

export const competencyCatalogue: CompetencyDetailItem[] = [
  {
    node_id: "stat-survey-design-101",
    name: "Survey Design",
    domain: "statistical",
    current_level: "intermediate",
    required_level: "advanced",
    gap_severity: "medium",
    priority: "Core field methodology",
    description: "Designing robust socio-economic and establishment survey schedules, ensuring sampling coherence and minimal non-sampling bias.",
    current_description: "Applies standard questionnaire templates and validates field schedule flows for national rounds.",
    required_description: "Designs multi-domain stratified schedules and conducts pilot testing with cognitive validation.",
    related_node_ids: ["stat-sampling-101", "stat-data-quality-101", "tech-python-101"]
  },
  {
    node_id: "stat-sampling-101",
    name: "Sampling Techniques",
    domain: "statistical",
    current_level: "basic",
    required_level: "advanced",
    gap_severity: "high",
    priority: "Immediate learning need",
    description: "Sampling decisions affect estimation accuracy, survey cost, field design, and public trust in official statistical outputs.",
    current_description: "Understands basic survey sampling terms and simple random field applications.",
    required_description: "Can evaluate stratified, cluster, and multistage designs with complex variance estimation implications.",
    related_node_ids: ["stat-survey-design-101", "stat-data-quality-101", "tech-python-101"]
  },
  {
    node_id: "stat-data-quality-101",
    name: "Data Quality Frameworks",
    domain: "statistical",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    priority: "Survey validation",
    description: "Implements United Nations National Quality Assurance Frameworks (NQAF) for validating administrative and survey registries.",
    current_description: "Executes rule-based range checks and flag verifications on raw microdata files.",
    required_description: "Formulates comprehensive quality assessment audits and coherence checks against national accounts benchmarks.",
    related_node_ids: ["stat-survey-design-101", "gov-data-privacy-101", "tech-sql-101"]
  },
  {
    node_id: "tech-python-101",
    name: "Python for Data Analysis",
    domain: "technical",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    priority: "Automation readiness",
    description: "Automating data cleaning, tabular aggregation, and statistical testing using modern Python scientific libraries.",
    current_description: "Writes basic Python scripts for file reading, basic Pandas filtering, and descriptive stats.",
    required_description: "Builds reproducible data pipelines, complex merging routines, and automated report generation scripts.",
    related_node_ids: ["tech-sql-101", "stat-sampling-101", "mgr-communication-101"]
  },
  {
    node_id: "tech-sql-101",
    name: "SQL & Relational Databases",
    domain: "technical",
    current_level: "basic",
    required_level: "basic",
    gap_severity: "low",
    priority: "Maintained",
    description: "Querying government statistical repositories and executing relational data extractions safely.",
    current_description: "Writes standard SELECT queries with JOINs and aggregation filters on administrative tables.",
    required_description: "Optimizes indexing and queries large historical datasets across federated data warehouses.",
    related_node_ids: ["tech-python-101", "gov-data-privacy-101"]
  },
  {
    node_id: "gov-data-privacy-101",
    name: "Data Privacy & Governance",
    domain: "digital_governance",
    current_level: "none",
    required_level: "basic",
    gap_severity: "low",
    priority: "Compliance",
    description: "Adheres to India's DPDP Act guidelines and statistical disclosure control protocols for public microdata releases.",
    current_description: "Limited exposure to institutional de-identification and anonymization rules.",
    required_description: "Applies cell suppression, perturbation, and compliance checklists prior to data dissemination.",
    related_node_ids: ["stat-data-quality-101", "tech-sql-101"]
  },
  {
    node_id: "mgr-communication-101",
    name: "Effective Communication",
    domain: "behavioural",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    priority: "Reporting clarity",
    description: "Communicates complex statistical insights effectively to policy makers, media, and civil administration.",
    current_description: "Drafts basic descriptive bullet points and standard statistical bulletins.",
    required_description: "Presents policy-oriented statistical briefs with high contextual clarity and data storytelling.",
    related_node_ids: ["stat-survey-design-101", "tech-python-101"]
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
    competency: "Python for Data Analysis",
    difficulty: "Basic",
    duration: "8 hours",
    progress: 50,
    reason: "Supports faster reporting for field monitoring."
  },
  {
    id: "igot-tech-202",
    title: "Data Wrangling with Pandas & NumPy",
    provider: "iGOT Karmayogi",
    domain: "Technical",
    competency: "Python for Data Analysis",
    difficulty: "Intermediate",
    duration: "15 hours",
    progress: 10,
    reason: "Essential for automating large administrative survey data sets."
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
      name: "Rajesh",
      department: "National Sample Survey Office",
      avg_gap_severity: "medium",
      top_gaps: ["Sampling Techniques", "Python for Data Analysis"]
    },
    {
      profile_id: "emp-102",
      name: "Priya Sharma",
      department: "Central Statistics Office",
      avg_gap_severity: "high",
      top_gaps: ["Survey Design", "Data Quality Frameworks"]
    },
    {
      profile_id: "emp-103",
      name: "Amitabh Verma",
      department: "MoSPI Headquarters",
      avg_gap_severity: "low",
      top_gaps: ["Data Privacy & Governance"]
    },
    {
      profile_id: "emp-104",
      name: "Sunita Deshmukh",
      department: "National Statistical Systems Training Academy",
      avg_gap_severity: "medium",
      top_gaps: ["Effective Communication", "Python for Data Analysis"]
    }
  ]
};

/**
 * Explicit demo historical progress trajectory milestones.
 * NOTE: This is prototype simulation data for demonstrating visualization capabilities.
 */
export const demoProgressHistory = [
  { month: "Apr", completedHours: 4, assessmentsPassed: 1, avgScore: 65 },
  { month: "May", completedHours: 12, assessmentsPassed: 3, avgScore: 72 },
  { month: "Jun", completedHours: 20, assessmentsPassed: 5, avgScore: 78 },
  { month: "Jul", completedHours: 28, assessmentsPassed: 7, avgScore: 82 }
];

export function severityClass(severity: GapSeverity) {
  if (severity === "high") {
    return "bg-red-50 text-red-700 border-red-100";
  }
  if (severity === "medium") {
    return "bg-yellow-50 text-yellow-700 border-yellow-100";
  }
  return "bg-green-50 text-green-700 border-green-100";
}
