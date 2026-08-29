export type CompetencyLevel = "none" | "basic" | "intermediate" | "advanced";
export type RequiredLevel = "basic" | "intermediate" | "advanced";
export type DomainType = "statistical" | "technical" | "digital_governance" | "behavioural";
export type GapSeverity = "low" | "medium" | "high";

export type ProfileRequest = {
  designation: string;
  department: string;
  job_role: string;
  experience_years: number;
  education: string;
  prior_trainings: string[];
};

export type Competency = {
  node_id: string;
  current_level: CompetencyLevel;
};

export type ProfileResponse = {
  profile_id: string;
  competencies: Competency[];
};

export type RoadmapRequest = {
  profile_id: string;
  job_role: string;
};

export type Course = {
  course_id: string;
  title: string;
  duration_hours: number;
};

export type RoadmapItem = {
  node_id: string;
  name: string;
  domain: DomainType;
  current_level: CompetencyLevel;
  required_level: RequiredLevel;
  gap_severity: GapSeverity;
  matched_courses: Course[];
};

export type RoadmapResponse = {
  roadmap: RoadmapItem[];
};

export type QuizQuestion = {
  node_id?: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export type QuizResponse = {
  questions: QuizQuestion[];
};

export type QuizAnswerItem = {
  node_id: string;
  is_correct: boolean;
};

export type QuizSubmitRequest = {
  profile_id: string;
  answers: QuizAnswerItem[];
};

export type MasteryUpdateItem = {
  node_id: string;
  mastery: number;
  current_level: CompetencyLevel;
  last_reviewed: string;
};

export type QuizSubmitResponse = {
  profile_id: string;
  mastery_updates: MasteryUpdateItem[];
};

export type CompetencySummaryItem = {
  node_id: string;
  name: string;
  mastery: number;
  last_reviewed: string;
};

export type RevisionSuggestion = {
  node_id: string;
  name: string;
  reason: string;
};

export type EmployeeDashboard = {
  profile_id: string;
  competency_summary: CompetencySummaryItem[];
  learning_hours_logged: number;
  overall_progress_pct: number;
  revision_suggestions: RevisionSuggestion[];
};

export type AdminEmployee = {
  profile_id: string;
  name: string;
  department: string;
  avg_gap_severity: GapSeverity;
  top_gaps: string[];
};

export type AdminDashboard = {
  employees: AdminEmployee[];
};
