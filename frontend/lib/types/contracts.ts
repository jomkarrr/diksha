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
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export type QuizResponse = {
  questions: QuizQuestion[];
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
