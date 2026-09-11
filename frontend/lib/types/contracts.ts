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
  subtopic?: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export type QuizResponse = {
  questions: QuizQuestion[];
  node_id?: string;
  subtopics_tested?: string[];
};

export type QuizAnswerItem = {
  node_id: string;
  is_correct: boolean;
  subtopic?: string;
  user_answer?: string;
};

export type QuizSubmitRequest = {
  profile_id: string;
  answers: QuizAnswerItem[];
  node_id?: string;
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
  objective_coverage_pct?: number;
  covered_subtopics?: string[];
  missed_subtopics?: string[];
  feedback?: string;
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

export type CourseProgressItem = {
  course_id: string;
  title: string;
  code?: string;
  provider?: string;
  domain?: string;
  competency?: string;
  difficulty?: string;
  duration?: string;
  progress_pct: number;
  completed_modules: number;
  total_modules: number;
  rating?: string;
  reason?: string;
};

export type EmployeeDashboard = {
  profile_id: string;
  competency_summary: CompetencySummaryItem[];
  learning_hours_logged: number;
  overall_progress_pct: number;
  readiness_score?: number;
  target_role_coverage?: number;
  revision_suggestions: RevisionSuggestion[];
  active_courses?: CourseProgressItem[];
};

export type AdminEmployee = {
  profile_id: string;
  name: string;
  department: string;
  avg_gap_severity: GapSeverity;
  top_gaps: string[];
};

export type AdminOrganizationalGapItem = {
  node_id: string;
  name: string;
  gap_severity: GapSeverity;
  progress: number;
};

export type AdminDashboard = {
  employees: AdminEmployee[];
  organizational_gaps?: AdminOrganizationalGapItem[];
};

export type KnowledgeDocument = {
  document_id: string;
  filename: string;
  file_type: string;
  size_bytes: number;
  uploaded_at: string;
  status: string;
};

export type KnowledgeDocumentListResponse = {
  documents: KnowledgeDocument[];
};

export type PracticeDatasetResponse = {
  dataset_name: string;
  data_type: string;
  source_note: string;
  survey_name: string;
  linked_competency_node?: string;
  target_job_role?: string;
  total_records: number;
  quality_issue_count: number;
  records: Record<string, any>[];
};

export interface EmployeeRecord {
  profile_id: string;
  name: string;
  designation: string;
  department: string;
  job_role: string;
  experience_years: number;
  education: string;
  prior_trainings: string[];
  initials?: string;
  cadreCode?: string;
  employeeCode?: string;
  email?: string;
  location?: string;
}



