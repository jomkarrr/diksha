import type {
  AdminDashboard,
  CompetencyLevel,
  DomainType,
  GapSeverity,
  ProfileRequest,
  QuizQuestion,
  RoadmapItem
} from "@/lib/types/contracts";

export interface OfficerPersona {
  id: string;
  cadreCode: string;
  title: string;
  name: string;
  designation: string;
  department: string;
  job_role: string;
  experience_years: number;
  education: string;
  prior_trainings: string[];
  initials: string;
  badge: string;
}

export const OFFICIAL_CADRES: OfficerPersona[] = [
  {
    id: "prof_demo",
    cadreCode: "JSO / SSS",
    title: "Junior Statistical Officer (JSO)",
    name: "Rajesh Kumar",
    designation: "Statistical Investigator Gr. II",
    department: "NSSO • Field Operations Division (FOD)",
    job_role: "Statistical Investigator",
    experience_years: 4.5,
    education: "B.Sc. Statistics",
    prior_trainings: ["Field Survey Basics", "Sampling Frames"],
    initials: "RK",
    badge: "Active Hackathon Demo Profile"
  },
  {
    id: "emp-102",
    cadreCode: "SSO / SSS",
    title: "Senior Statistical Officer (SSO)",
    name: "Priya Sharma",
    designation: "Senior Statistical Officer",
    department: "National Accounts Division (NAD)",
    job_role: "Director / Senior Statistical Officer",
    experience_years: 8.0,
    education: "M.Sc. Mathematical Statistics",
    prior_trainings: ["National Accounts", "SNA 2008 Framework"],
    initials: "PS",
    badge: "Macroeconomic Statistics"
  },
  {
    id: "emp-103",
    cadreCode: "ISS Cadre",
    title: "Director (ISS Cadre)",
    name: "Dr. Amitabh Verma",
    designation: "Director",
    department: "Central Statistics Office (CSO)",
    job_role: "Director / Senior Statistical Officer",
    experience_years: 14.0,
    education: "Ph.D. Statistics & Econometrics",
    prior_trainings: ["Policy Formulation", "Strategic Leadership"],
    initials: "AV",
    badge: "Senior Executive Cadre"
  },
  {
    id: "emp-104",
    cadreCode: "FOD / SSS",
    title: "Field Investigator",
    name: "Sunita Patel",
    designation: "Field Officer",
    department: "Price Statistics Wing (PSD)",
    job_role: "Field Officer",
    experience_years: 2.0,
    education: "B.A. Economics",
    prior_trainings: ["CPI Rural Basket Collection"],
    initials: "SP",
    badge: "Field Operations & Data Collection"
  }
];

export const demoLearner: ProfileRequest & { name: string; current_assignment: string } = {
  name: "Rajesh Kumar",
  designation: "Statistical Investigator Grade II",
  department: "National Sample Survey Office (NSSO)",
  job_role: "Statistical Investigator",
  experience_years: 4.5,
  education: "B.Sc. Statistics",
  prior_trainings: ["Survey Sampling Methods", "Basic Python", "Official Statistics Foundation"],
  current_assignment: "PLFS 80th Round Urban Cluster Frame Audit"
};

export const domainLabels: Record<DomainType, string> = {
  statistical: "Statistical Domain",
  technical: "Technical Domain",
  digital_governance: "Digital Governance",
  behavioural: "Behavioural Domain"
};

export const levelScore: Record<CompetencyLevel, number> = {
  none: 0,
  basic: 1,
  intermediate: 2,
  advanced: 3
};

// 5-Level Adapter rule mapping 4-level scale to 5 visual tiers
export function getCompetencyLevel5(level: CompetencyLevel, mastery: number): {
  tier: number;
  label: string;
  isMaster: boolean;
} {
  if (mastery >= 85) return { tier: 5, label: "Level 5 (Master)", isMaster: true };
  if (level === "advanced" || mastery >= 70) return { tier: 4, label: "Level 4 (Advanced)", isMaster: false };
  if (level === "intermediate" || mastery >= 45) return { tier: 3, label: "Level 3 (Intermediate)", isMaster: false };
  if (level === "basic" || mastery >= 20) return { tier: 2, label: "Level 2 (Basic)", isMaster: false };
  return { tier: 1, label: "Level 1 (Novice)", isMaster: false };
}

export interface CompetencyDetailItem {
  node_id: string;
  name: string;
  domain: DomainType;
  current_level: CompetencyLevel;
  required_level: "basic" | "intermediate" | "advanced";
  gap_severity: GapSeverity;
  mastery: number;
  priority: string;
  description: string;
  current_description: string;
  required_description: string;
  related_node_ids: string[];
  last_reviewed: string;
}

// Master 18 Official MoSPI Nodes Catalogue
export const competencyCatalogue: CompetencyDetailItem[] = [
  // Statistical Domain (7 Nodes)
  {
    node_id: "stat-survey-design-101",
    name: "Survey Design & Methodology",
    domain: "statistical",
    current_level: "intermediate",
    required_level: "advanced",
    gap_severity: "medium",
    mastery: 74,
    priority: "Core Field Methodology",
    description: "Principles of designing national statistical surveys, questionnaire formulation, and field methodology.",
    current_description: "Applies standard questionnaire templates and validates field schedule flows for national rounds.",
    required_description: "Designs multi-domain stratified schedules and conducts pilot testing with cognitive validation.",
    related_node_ids: ["stat-sampling-101", "stat-data-quality-101", "tech-python-101"],
    last_reviewed: "2026-09-02T10:00:00Z"
  },
  {
    node_id: "stat-sampling-101",
    name: "Sampling Techniques",
    domain: "statistical",
    current_level: "basic",
    required_level: "advanced",
    gap_severity: "high",
    mastery: 42,
    priority: "Immediate Learning Need",
    description: "Simple random sampling, stratified sampling, cluster sampling, frame estimation, and sampling error calculation.",
    current_description: "Understands basic survey sampling terms and simple random field applications.",
    required_description: "Evaluates stratified, cluster, and multistage designs with complex variance estimation implications.",
    related_node_ids: ["stat-survey-design-101", "stat-data-quality-101", "tech-python-101"],
    last_reviewed: "2026-09-01T14:30:00Z"
  },
  {
    node_id: "stat-national-accounts-101",
    name: "National Accounts & GDP Estimation",
    domain: "statistical",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "low",
    mastery: 50,
    priority: "Macro Calibration",
    description: "System of National Accounts (SNA), gross value added, GDP compilation, and macroeconomic metrics.",
    current_description: "Familiar with macro aggregates and sectoral gross value addition fundamentals.",
    required_description: "Integrates establishment survey data into supply-use tables and double deflation routines.",
    related_node_ids: ["stat-price-stats-101", "stat-labour-stats-101"],
    last_reviewed: "2026-08-25T09:15:00Z"
  },
  {
    node_id: "stat-price-stats-101",
    name: "Price Statistics & Index Numbers",
    domain: "statistical",
    current_level: "intermediate",
    required_level: "intermediate",
    gap_severity: "low",
    mastery: 88,
    priority: "Role Met",
    description: "Consumer Price Index (CPI), Wholesale Price Index (WPI), inflation indices, and basket weighting.",
    current_description: "Computes Laspeyres/Paasche formulations and validates retail quote anomalies.",
    required_description: "Maintains urban/rural commodity baskets and applies chain-linking methodology.",
    related_node_ids: ["stat-survey-design-101", "stat-national-accounts-101"],
    last_reviewed: "2026-08-28T16:00:00Z"
  },
  {
    node_id: "stat-labour-stats-101",
    name: "Labour & Employment Statistics",
    domain: "statistical",
    current_level: "intermediate",
    required_level: "advanced",
    gap_severity: "medium",
    mastery: 65,
    priority: "Survey Priority",
    description: "Periodic Labour Force Survey (PLFS), workforce participation rate, activity status classification.",
    current_description: "Applies Principal and Subsidiary Status (ps+ss) criteria to classify respondent hours.",
    required_description: "Calculates Current Weekly Status (CWS) aggregates and evaluates rotational sampling biases.",
    related_node_ids: ["stat-survey-design-101", "stat-sampling-101"],
    last_reviewed: "2026-08-30T11:45:00Z"
  },
  {
    node_id: "stat-sdg-indicators-101",
    name: "SDG Indicators & Monitoring",
    domain: "statistical",
    current_level: "basic",
    required_level: "basic",
    gap_severity: "low",
    mastery: 60,
    priority: "Benchmark Aligned",
    description: "National Indicator Framework (NIF) for Sustainable Development Goals, target metrics, and tracking.",
    current_description: "Maps ministry survey data to national SDG goals and targets.",
    required_description: "Coordinates inter-ministerial data harmonization for global SDG reporting.",
    related_node_ids: ["stat-national-accounts-101", "stat-labour-stats-101"],
    last_reviewed: "2026-08-15T10:00:00Z"
  },
  {
    node_id: "stat-data-quality-101",
    name: "Data Quality Frameworks",
    domain: "statistical",
    current_level: "none",
    required_level: "intermediate",
    gap_severity: "high",
    mastery: 20,
    priority: "Critical Gap",
    description: "UN National Quality Assurance Framework (NQAF), validation rules, outlier detection, and data auditing.",
    current_description: "Limited exposure to institutional validation matrices beyond basic boundary checks.",
    required_description: "Executes end-to-end quality audit routines across digital survey collection instruments.",
    related_node_ids: ["stat-survey-design-101", "gov-data-privacy-101", "tech-sql-101"],
    last_reviewed: "2026-08-10T14:00:00Z"
  },

  // Technical Domain (5 Nodes)
  {
    node_id: "tech-python-101",
    name: "Python for Data Analysis",
    domain: "technical",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    mastery: 30,
    priority: "SM-2 Review Due",
    description: "Data manipulation using Pandas, NumPy, statistical computations, and automated data pipelines.",
    current_description: "Writes basic Python scripts for file reading, Pandas filtering, and descriptive stats.",
    required_description: "Builds reproducible data pipelines, complex merging routines, and automated report generators.",
    related_node_ids: ["tech-sql-101", "stat-sampling-101"],
    last_reviewed: "2026-09-04T12:00:00Z"
  },
  {
    node_id: "tech-sql-101",
    name: "SQL & Relational Databases",
    domain: "technical",
    current_level: "basic",
    required_level: "basic",
    gap_severity: "low",
    mastery: 55,
    priority: "Role Met",
    description: "Relational data modeling, SQL queries, aggregations, joins, window functions, and database management.",
    current_description: "Writes standard SELECT queries with JOINs and aggregation filters on administrative tables.",
    required_description: "Optimizes indexing and queries large historical microdata tables in PostgreSQL.",
    related_node_ids: ["tech-python-101", "gov-data-privacy-101"],
    last_reviewed: "2026-08-22T15:30:00Z"
  },
  {
    node_id: "tech-data-vis-101",
    name: "Data Visualization & Dashboards",
    domain: "technical",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    mastery: 45,
    priority: "Field Reporting",
    description: "Interactive data visualization using Matplotlib, Seaborn, PowerBI, and web-based dashboarding.",
    current_description: "Produces standard line graphs and bar charts for internal review meetings.",
    required_description: "Constructs thematic executive dashboards and publishes accessible interactive charts.",
    related_node_ids: ["tech-python-101", "tech-gis-101"],
    last_reviewed: "2026-08-19T11:00:00Z"
  },
  {
    node_id: "tech-gis-101",
    name: "GIS & Spatial Analytics",
    domain: "technical",
    current_level: "none",
    required_level: "basic",
    gap_severity: "low",
    mastery: 15,
    priority: "Upcoming",
    description: "Geographical Information Systems, spatial data mapping, geo-tagging survey data, and QGIS.",
    current_description: "Basic knowledge of district boundaries and census enumeration block layouts.",
    required_description: "Performs polygon overlay analysis and geo-verifies enumeration sample frames.",
    related_node_ids: ["tech-sql-101", "stat-sampling-101"],
    last_reviewed: "2026-08-05T09:00:00Z"
  },
  {
    node_id: "tech-ai-ml-101",
    name: "AI/ML in Official Statistics",
    domain: "technical",
    current_level: "none",
    required_level: "basic",
    gap_severity: "low",
    mastery: 10,
    priority: "Innovation Track",
    description: "Machine learning algorithms, predictive analytics, automated classification, and LLM applications for statistics.",
    current_description: "Understands conceptual differences between supervised learning and traditional regression.",
    required_description: "Applies automated text classification for National Industrial Classification (NIC) coding.",
    related_node_ids: ["tech-python-101", "tech-sql-101"],
    last_reviewed: "2026-08-01T14:00:00Z"
  },

  // Digital Governance Domain (3 Nodes)
  {
    node_id: "gov-cybersecurity-101",
    name: "Government Cybersecurity Fundamentals",
    domain: "digital_governance",
    current_level: "intermediate",
    required_level: "basic",
    gap_severity: "low",
    mastery: 82,
    priority: "Role Met",
    description: "Government security guidelines, password policy, secure data transmission, and phishing defense.",
    current_description: "Adheres to NIC email protocols, multi-factor authentication, and safe network practices.",
    required_description: "Conducts data classification audits and implements CERT-In vulnerability advisories.",
    related_node_ids: ["gov-data-privacy-101", "gov-cloud-101"],
    last_reviewed: "2026-08-27T10:30:00Z"
  },
  {
    node_id: "gov-data-privacy-101",
    name: "Data Privacy & Governance (DPDP Act)",
    domain: "digital_governance",
    current_level: "intermediate",
    required_level: "intermediate",
    gap_severity: "low",
    mastery: 85,
    priority: "Certified",
    description: "Adheres to India's DPDP Act guidelines and statistical disclosure control protocols for public microdata releases.",
    current_description: "Applies cell suppression, perturbation, and compliance checklists prior to data dissemination.",
    required_description: "Designs institutional anonymization workflows across large public microdata portals.",
    related_node_ids: ["stat-data-quality-101", "gov-cybersecurity-101"],
    last_reviewed: "2026-08-29T16:20:00Z"
  },
  {
    node_id: "gov-cloud-101",
    name: "MeghRaj & Government Cloud Infrastructure",
    domain: "digital_governance",
    current_level: "basic",
    required_level: "basic",
    gap_severity: "low",
    mastery: 60,
    priority: "Role Met",
    description: "National Cloud (MeghRaj), cloud security, scalable data storage, and government API integration.",
    current_description: "Accesses government cloud storage and executes secure file transfers via NIC portal.",
    required_description: "Configures containerized data pipelines deployed on MeghRaj virtual machines.",
    related_node_ids: ["gov-cybersecurity-101", "tech-sql-101"],
    last_reviewed: "2026-08-18T13:00:00Z"
  },

  // Behavioural & Managerial Domain (3 Nodes)
  {
    node_id: "mgr-communication-101",
    name: "Effective Communication & Reporting",
    domain: "behavioural",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    mastery: 52,
    priority: "Leadership Track",
    description: "Communicates complex statistical insights effectively to policy makers, media, and civil administration.",
    current_description: "Drafts basic descriptive bullet points and standard statistical bulletins.",
    required_description: "Presents policy-oriented statistical briefs with high contextual clarity and data storytelling.",
    related_node_ids: ["stat-survey-design-101", "tech-data-vis-101"],
    last_reviewed: "2026-08-24T11:15:00Z"
  },
  {
    node_id: "mgr-leadership-101",
    name: "Statistical Team Leadership",
    domain: "behavioural",
    current_level: "basic",
    required_level: "basic",
    gap_severity: "low",
    mastery: 58,
    priority: "Role Met",
    description: "Leading field survey teams, conflict resolution, mentoring junior investigators, and task allocation.",
    current_description: "Coordinates field squads during multi-district survey enumeration visits.",
    required_description: "Conducts cadre performance reviews and resolves operational bottlenecks in survey schedules.",
    related_node_ids: ["mgr-communication-101", "mgr-project-mgmt-101"],
    last_reviewed: "2026-08-20T14:40:00Z"
  },
  {
    node_id: "mgr-project-mgmt-101",
    name: "Project Management in Government",
    domain: "behavioural",
    current_level: "basic",
    required_level: "intermediate",
    gap_severity: "medium",
    mastery: 48,
    priority: "Operations Track",
    description: "Planning survey timelines, budget tracking, resource allocation, and milestone monitoring in e-Office.",
    current_description: "Tracks survey timeline milestones and submits weekly progress reports.",
    required_description: "Manages annual survey budgets and mitigates field operational risks proactively.",
    related_node_ids: ["mgr-leadership-101", "mgr-communication-101"],
    last_reviewed: "2026-08-16T15:00:00Z"
  }
];

export const demoRoadmap: RoadmapItem[] = [
  {
    node_id: "stat-survey-design-101",
    name: "Survey Design & Methodology",
    domain: "statistical",
    current_level: "intermediate",
    required_level: "advanced",
    gap_severity: "medium",
    matched_courses: [
      {
        course_id: "igot-stat-101",
        title: "Modern Survey Sampling & Questionnaire Design",
        duration_hours: 12
      }
    ]
  },
  {
    node_id: "stat-sampling-101",
    name: "Sampling Techniques",
    domain: "statistical",
    current_level: "basic",
    required_level: "advanced",
    gap_severity: "high",
    matched_courses: [
      {
        course_id: "igot-stat-104",
        title: "Complex Sampling & Variance Estimation in Official Surveys",
        duration_hours: 16
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
  }
];

export const learningResources = [
  {
    id: "igot-stat-104",
    title: "Advanced Stratified Sampling in Field Surveys: Multi-Stage Cluster & PPS Modeling",
    code: "NSSTA-STAT-302",
    provider: "NSSTA & iGOT Karmayogi",
    domain: "Statistical",
    competency: "Sampling Techniques",
    difficulty: "Intermediate to Advanced",
    duration: "16 Hours (Self-paced)",
    progress: 0,
    rating: "4.8/5",
    reviewsCount: "1,240 Reviews",
    cadreReach: "12,400 Civil Servants",
    reason: "Your assessed proficiency in Sampling Techniques is at Basic (42%), whereas your cadre requirement is Advanced (80%). Completing this module will bridge the 38% deficit.",
    syllabus: [
      {
        title: "Module 1: Foundations of Multi-Stage Stratified Sampling",
        duration: "4 Hours",
        description: "Review of SRSWOR vs. Stratified Random Sampling. Allocations (Neyman & Proportional) for official NSS frames."
      },
      {
        title: "Module 2: Probability Proportional to Size (PPS) & Cluster Selection",
        duration: "4 Hours",
        description: "Selection with PPS Systematic Sampling. Handling oversized and zero-measure blocks in urban and rural sectors."
      },
      {
        title: "Module 3: Non-Sampling Errors, Non-Response & Substitution Bias",
        duration: "4 Hours",
        description: "Quantifying enumerator bias, household non-contact protocols, and weighting adjustments."
      },
      {
        title: "Module 4: Complex Variance Estimation & Sub-Sample Matching",
        duration: "4 Hours",
        description: "Jackknife and Balanced Repeated Replication (BRR) for PLFS and ASI estimates."
      }
    ]
  },
  {
    id: "igot-tech-202",
    title: "Python for Statistical Analysis & Microdata Wrangling",
    code: "NSSTA-TECH-204",
    provider: "MoSPI Training Division",
    domain: "Technical",
    competency: "Python for Data Analysis",
    difficulty: "Intermediate",
    duration: "15 Hours",
    progress: 10,
    rating: "4.7/5",
    reviewsCount: "860 Reviews",
    cadreReach: "8,900 Civil Servants",
    reason: "Required for automated microdata extraction and CAPI validation script writing.",
    syllabus: [
      {
        title: "Module 1: High-Performance Tabulation with Pandas",
        duration: "3.5 Hours",
        description: "Vectorized filtering, grouping, and multiplier application on million-row survey extracts."
      },
      {
        title: "Module 2: Handling Survey Missing Values & Imputation",
        duration: "4 Hours",
        description: "Hot-deck and regression imputation for household income and expenditure items."
      }
    ]
  },
  {
    id: "igot-stat-110",
    title: "UN NQAF Data Quality Assurance & Official Survey Auditing",
    code: "NSSTA-QUAL-101",
    provider: "Central Statistical Coordination Unit",
    domain: "Statistical",
    competency: "Data Quality Frameworks",
    difficulty: "Intermediate",
    duration: "10 Hours",
    progress: 0,
    rating: "4.9/5",
    reviewsCount: "430 Reviews",
    cadreReach: "4,200 Civil Servants",
    reason: "Critical capability gap flagged in your NSSO FOD review.",
    syllabus: [
      {
        title: "Module 1: Principles of UN National Quality Assurance Frameworks",
        duration: "3 Hours",
        description: "Relevance, accuracy, timeliness, accessibility, and coherence."
      }
    ]
  }
];

export const demoQuizQuestions: QuizQuestion[] = [
  {
    node_id: "stat-sampling-101",
    question: "In the context of the Periodic Labour Force Survey (PLFS), why is circular systematic sampling preferred over simple random sampling when selecting First Stage Units (FSUs) from the Urban Frame Survey (UFS) blocks?",
    options: [
      "It completely eliminates sampling variance without requiring frame stratifications",
      "It ensures equal probability of selection across all units while maintaining spatial distribution across the geographic boundary",
      "It allows arbitrary sample sizing without knowing the total population size N",
      "It replaces the requirement of second-stage household listing during field visits"
    ],
    correct_index: 1,
    explanation: "Circular Systematic Sampling provides an implicit stratification mechanism over the geographical sequence of UFS blocks. Unlike SRSWOR, it guarantees that FSUs are evenly spaced across the entire town area, guarding against spatial clustering while keeping selection probabilities equal."
  },
  {
    node_id: "stat-survey-design-101",
    question: "When conducting household socio-economic surveys in India, what defines a Second Stage Unit (SSU) in a two-stage stratified sampling design?",
    options: [
      "The entire sub-district or Tehsil administrative area",
      "The Census Village or Urban Frame Survey Block",
      "The individual household selected from the listing schedule of the FSU",
      "The individual respondent aged 15 years and above"
    ],
    correct_index: 2,
    explanation: "In official NSSO two-stage designs, First Stage Units (FSUs) are villages/blocks, and Second Stage Units (SSUs) are households selected after fresh listing in each selected FSU."
  },
  {
    node_id: "tech-python-101",
    question: "When computing weighted aggregates in Python Pandas from raw survey microdata containing an expansion factor column 'MLT', which formula accurately represents the total estimated characteristic?",
    options: [
      "df['VALUE'].mean() * len(df)",
      "(df['VALUE'] * df['MLT']).sum() / 100",
      "df['VALUE'].sum() * df['MLT'].sum()",
      "df['VALUE'].std() / df['MLT'].mean()"
    ],
    correct_index: 1,
    explanation: "In official MoSPI microdata files, multipliers (MLT) typically include two implied decimals or a scaling divisor (100). The estimated total is calculated as the sum product of the value and multiplier: Sum(Value * MLT) / 100."
  }
];

// Official MoSPI Statistical Datasets Catalog for Screen 10
export interface StatisticalDataset {
  id: string;
  name: string;
  abbreviation: string;
  domain: string;
  category: "labour" | "industrial" | "household" | "price" | "macro";
  division: string;
  roundsCount?: string;
  recordsCount?: string;
  latestYear?: string;
  frequency?: string;
  samplingDesign?: string;
  description: string;
  href?: string;
  apiDomain: string;
  isFeatured?: boolean;
}

export const OFFICIAL_DATASETS: StatisticalDataset[] = [
  {
    id: "plfs",
    apiDomain: "plfs",
    name: "Periodic Labour Force Survey",
    abbreviation: "PLFS",
    domain: "Labour & Employment Statistics",
    category: "labour",
    division: "Survey Design & Research (SDRD) & FOD",
    roundsCount: "7 Annual Rounds (2017-24)",
    recordsCount: "418,290 Records",
    latestYear: "July 2023 – June 2024",
    frequency: "Quarterly Urban | Annual Rural+Urban",
    samplingDesign: "Stratified Two-Stage (FSUs: UFS Blocks/Villages, SSUs: Households)",
    description: "Synthetic demonstration microdata measuring LFPR, WPR, Unemployment Rate, and worker activity under Usual Status and Current Weekly Status (CWS).",
    href: "/data-practice/plfs",
    isFeatured: true
  },
  {
    id: "asi",
    apiDomain: "asi",
    name: "Annual Survey of Industries",
    abbreviation: "ASI",
    domain: "Industrial & Economic Statistics",
    category: "industrial",
    division: "Industrial Statistics Wing (ISW), Kolkata",
    roundsCount: "12 Annual Rounds",
    recordsCount: "250,000+ Factories",
    latestYear: "2022-23 Released",
    frequency: "Annual",
    samplingDesign: "Census Sector (>100 workers) & Stratified Circular Sampling for Sample Sector",
    description: "Principal source of industrial statistics detailing registered manufacturing capital, output, GVA, and employment.",
    href: "/data-practice/plfs"
  },
  {
    id: "cpi",
    apiDomain: "cpi",
    name: "Consumer Price Index & Inflation Basket",
    abbreviation: "CPI",
    domain: "Price Statistics & Indices",
    category: "price",
    division: "Price Statistics Division (PSD)",
    roundsCount: "Monthly Releases (Base 2012=100)",
    recordsCount: "1,114 Urban & 1,181 Rural Markets",
    latestYear: "Current Monthly Series",
    frequency: "Monthly",
    samplingDesign: "Purposive Village/Market Selection with Price Quotes per Item",
    description: "Headline retail inflation tracking for Rural, Urban, and Combined series covering 299 goods and services.",
    href: "/data-practice/plfs"
  },
  {
    id: "iip",
    apiDomain: "iip",
    name: "Index of Industrial Production",
    abbreviation: "IIP",
    domain: "Industrial Production & Indices",
    category: "industrial",
    division: "Economic Statistics Division (ESD)",
    roundsCount: "Monthly Releases (Base 2011-12=100)",
    recordsCount: "407 Item Groups",
    latestYear: "Current Monthly Series",
    frequency: "Monthly",
    samplingDesign: "Establishment-based production reporting across Mining, Manufacturing, and Electricity sectors",
    description: "Key macroeconomic indicator tracking volume of physical production in registered mining, manufacturing, and electricity sectors.",
    href: "/data-practice/plfs"
  },
  {
    id: "hces",
    apiDomain: "hces",
    name: "Household Consumption Expenditure Survey",
    abbreviation: "HCES",
    domain: "Household Expenditure & Poverty",
    category: "household",
    division: "National Sample Survey Office (NSSO)",
    roundsCount: "Latest 2022-23 Series",
    recordsCount: "261,746 Households",
    latestYear: "2022-23 Validated",
    frequency: "Quinquennial (5-Yearly)",
    samplingDesign: "Stratified Multi-Stage with Food/Non-Food Splitting Schedules",
    description: "Generates Monthly Per Capita Consumption Expenditure (MPCE) and commodity consumption shares across rural and urban quintiles.",
    href: "/data-practice/plfs"
  },
  {
    id: "asuse",
    apiDomain: "asuse",
    name: "Annual Survey of Unincorporated Sector Enterprises",
    abbreviation: "ASUSE",
    domain: "Informal Economy & Enterprises",
    category: "industrial",
    division: "Economic Statistics Division (ESD)",
    roundsCount: "Rounds 2021-22 & 2022-23",
    recordsCount: "420,000+ Establishments",
    latestYear: "2022-23",
    frequency: "Annual",
    samplingDesign: "Area Frame & List Frame Stratification",
    description: "Economic and operational characteristics of non-agricultural unincorporated enterprises in manufacturing, trade, and other services.",
    href: "/data-practice/plfs"
  },
  {
    id: "nas",
    apiDomain: "nas",
    name: "Quarterly National Accounts & GDP Releases",
    abbreviation: "NAS",
    domain: "Macroeconomic & Accounts",
    category: "macro",
    division: "National Accounts Division (NAD)",
    roundsCount: "Quarterly Estimates Q1-Q4",
    recordsCount: "Institutional Sector Tables",
    latestYear: "2024-25 Q1/Q2",
    frequency: "Quarterly & Annual",
    samplingDesign: "National Accounts Benchmark Double Deflation",
    description: "Gross Value Added (GVA) at basic prices and Gross Domestic Product (GDP) with expenditure components.",
    href: "/data-practice/plfs"
  },
  {
    id: "nada",
    apiDomain: "nada",
    name: "National Data Archive Microdata Repository",
    abbreviation: "NADA",
    domain: "Open Data & Microdata Archival",
    category: "macro",
    division: "Computer Centre, MoSPI",
    roundsCount: "Multi-Survey Repository",
    recordsCount: "500+ Survey Archives",
    latestYear: "2024 Archival Series",
    frequency: "Continuous",
    samplingDesign: "Standardized DDI & Dublin Core Microdata Cataloging",
    description: "Central repository of electronic survey microdata, documentation, and metadata catalogs complying with international DDI standards.",
    href: "/data-practice/plfs"
  },
  {
    id: "nssta",
    apiDomain: "nssta",
    name: "NSSTA Statistical Training & Field Scrutiny Modules",
    abbreviation: "NSSTA",
    domain: "Capacity Building & Training",
    category: "labour",
    division: "National Statistical Systems Training Academy",
    roundsCount: "Annual Training Calendar",
    recordsCount: "120+ Cadre Modules",
    latestYear: "2024-25 Training Batch",
    frequency: "Semester & In-service",
    samplingDesign: "Curriculum-based competency evaluation & field scrutiny rubrics",
    description: "Training courses, survey scrutiny guidelines, and methodological exercises for ISS and SSS probationary officers.",
    href: "/data-practice/plfs"
  },
  {
    id: "igot",
    apiDomain: "igot",
    name: "iGOT Karmayogi Statistical Competency Courses",
    abbreviation: "iGOT",
    domain: "Civil Service Competencies",
    category: "labour",
    division: "Karmayogi Bharat & MoSPI Training Division",
    roundsCount: "Continuous Learning",
    recordsCount: "23 Aligned Courses",
    latestYear: "2024 Release",
    frequency: "On-demand Self-paced",
    samplingDesign: "FRAC Competency Framework Alignment",
    description: "Online civil service courses and competency assessments tailored to official statistics, survey operations, and data analysis.",
    href: "/data-practice/plfs"
  }
];

// PLFS Practice Workspace Statement 3.4 Microdata Preview
export interface PLFSStatementRow {
  sNo: string;
  zone: string;
  sector: "Rural" | "Urban" | "Combined";
  gender: "Male" | "Female" | "Combined";
  sampleHouseholds: number;
  samplePersons: number;
  lfpr: number;
  wpr: number;
  ur: number;
  multiplier: number;
}

export const PLFS_STATEMENT_3_4: PLFSStatementRow[] = [
  {
    sNo: "01",
    zone: "Kolkata Metropolitan Area (Synthetic Sample)",
    sector: "Urban",
    gender: "Combined",
    sampleHouseholds: 1124,
    samplePersons: 4482,
    lfpr: 48.6,
    wpr: 45.2,
    ur: 7.0,
    multiplier: 1842.3
  },
  {
    sNo: "02",
    zone: "North 24 Parganas Plain (Synthetic Sample)",
    sector: "Rural",
    gender: "Combined",
    sampleHouseholds: 1480,
    samplePersons: 6312,
    lfpr: 56.2,
    wpr: 54.1,
    ur: 3.7,
    multiplier: 2410.15
  },
  {
    sNo: "03",
    zone: "Howrah Urban Agglomeration (Synthetic Sample)",
    sector: "Urban",
    gender: "Combined",
    sampleHouseholds: 896,
    samplePersons: 3728,
    lfpr: 51.4,
    wpr: 48.9,
    ur: 4.9,
    multiplier: 1620.4
  },
  {
    sNo: "04",
    zone: "South 24 Parganas Delta (Synthetic Sample)",
    sector: "Rural",
    gender: "Combined",
    sampleHouseholds: 1320,
    samplePersons: 5890,
    lfpr: 54.8,
    wpr: 52.6,
    ur: 4.0,
    multiplier: 2280.6
  },
  {
    sNo: "05",
    zone: "Burdwan Industrial Coal Belt (Synthetic Sample)",
    sector: "Urban",
    gender: "Combined",
    sampleHouseholds: 940,
    samplePersons: 3980,
    lfpr: 53.1,
    wpr: 49.8,
    ur: 6.2,
    multiplier: 1750.8
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

export const demoProgressHistory = [
  { month: "Apr", completedHours: 4, assessmentsPassed: 1, avgScore: 65 },
  { month: "May", completedHours: 12, assessmentsPassed: 3, avgScore: 72 },
  { month: "Jun", completedHours: 20, assessmentsPassed: 5, avgScore: 78 },
  { month: "Jul", completedHours: 28, assessmentsPassed: 7, avgScore: 82 }
];

export function severityClass(severity: GapSeverity): string {
  if (severity === "high") {
    return "bg-red-50 text-red-700 border-red-100";
  }
  if (severity === "medium") {
    return "bg-yellow-50 text-yellow-700 border-yellow-100";
  }
  return "bg-green-50 text-green-700 border-green-100";
}

