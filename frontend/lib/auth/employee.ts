"use client";

import { useSyncExternalStore } from "react";

export interface Employee {
  id: string;
  profile_id: string;
  name: string;
  designation: string;
  department: string;
  job_role: string;
  experience_years: number;
  education: string;
  prior_trainings: string[];
  initials: string;
  cadreCode: string;
  employeeCode: string;
  email: string;
  location: string;
  badge?: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp-101",
    profile_id: "emp-101",
    name: "Rajesh Kumar",
    designation: "Statistical Investigator Grade II",
    department: "National Sample Survey Office (NSSO)",
    job_role: "Statistical Investigator",
    experience_years: 1.5,
    education: "B.Sc. Statistics",
    prior_trainings: ["Field Survey Basics"],
    initials: "RK",
    cadreCode: "JSO / SSS",
    employeeCode: "SI-9842",
    email: "rajesh.kumar@gov.in",
    location: "Kolkata Regional Office",
    badge: "Active Cadre Investigator"
  },
  {
    id: "emp-102",
    profile_id: "emp-102",
    name: "Priya Sharma",
    designation: "Senior Statistical Officer",
    department: "Central Statistics Office (CSO)",
    job_role: "Director / Senior Statistical Officer",
    experience_years: 8.0,
    education: "M.Sc. Mathematical Statistics",
    prior_trainings: ["National Accounts", "SNA 2008 Framework"],
    initials: "PS",
    cadreCode: "SSO / SSS",
    employeeCode: "SSO-4412",
    email: "priya.sharma@gov.in",
    location: "New Delhi HQ",
    badge: "Macroeconomic Statistics"
  },
  {
    id: "emp-103",
    profile_id: "emp-103",
    name: "Amitabh Verma",
    designation: "Data Analyst",
    department: "Data Quality & Analytics Division",
    job_role: "Data Analyst",
    experience_years: 3.0,
    education: "B.Tech. Computer Science",
    prior_trainings: ["Python Programming", "SQL Database Management"],
    initials: "AV",
    cadreCode: "ISS / DQAD",
    employeeCode: "DA-7721",
    email: "amitabh.verma@gov.in",
    location: "New Delhi HQ",
    badge: "Analytics & Systems"
  },
  {
    id: "emp-104",
    profile_id: "emp-104",
    name: "Sunita Patel",
    designation: "Field Officer",
    department: "Price Statistics Wing",
    job_role: "Field Officer",
    experience_years: 0.5,
    education: "B.A. Economics",
    prior_trainings: [],
    initials: "SP",
    cadreCode: "FOD / SSS",
    employeeCode: "FO-3109",
    email: "sunita.patel@gov.in",
    location: "Ahmedabad Regional Office",
    badge: "Price Collection & Field Operations"
  },
  {
    id: "emp-105",
    profile_id: "emp-105",
    name: "Vikram Singh",
    designation: "Assistant Director",
    department: "Labour Statistics Division",
    job_role: "Statistical Investigator",
    experience_years: 6.0,
    education: "M.A. Economics",
    prior_trainings: ["PLFS Survey Design", "Basic R"],
    initials: "VS",
    cadreCode: "AD / ISS",
    employeeCode: "AD-5182",
    email: "vikram.singh@gov.in",
    location: "Chandigarh Regional Office",
    badge: "Survey Methodology"
  },
  {
    id: "emp-106",
    profile_id: "emp-106",
    name: "Ananya Roy",
    designation: "IT & Governance Lead",
    department: "MoSPI Digital Governance Cell",
    job_role: "Data Analyst",
    experience_years: 5.0,
    education: "M.Tech. Data Science",
    prior_trainings: ["Cybersecurity Guidelines", "DPDP Compliance"],
    initials: "AR",
    cadreCode: "IT-GOV / Cell",
    employeeCode: "IT-8804",
    email: "ananya.roy@gov.in",
    location: "New Delhi HQ",
    badge: "Digital Governance & Privacy"
  }
];

const DEFAULT_EMPLOYEE_ID = "emp-101";

/**
 * Normalizes aliases such as 'prof_demo' to standard employee IDs
 */
function normalizeEmployeeId(rawId: string | null | undefined): string {
  if (!rawId) return DEFAULT_EMPLOYEE_ID;
  const clean = rawId.trim().toLowerCase();
  if (clean === "prof_demo" || clean === "demo") return "emp-101";
  const found = MOCK_EMPLOYEES.find(
    (e) => e.id.toLowerCase() === clean || e.profile_id.toLowerCase() === clean
  );
  return found ? found.id : DEFAULT_EMPLOYEE_ID;
}

export function getActiveEmployeeId(): string {
  if (typeof window === "undefined") {
    return DEFAULT_EMPLOYEE_ID;
  }
  try {
    const active =
      window.localStorage.getItem("activeEmployeeId") ||
      window.localStorage.getItem("diksha_profile_id");
    return normalizeEmployeeId(active);
  } catch {
    return DEFAULT_EMPLOYEE_ID;
  }
}

export function setActiveEmployeeId(employeeId: string): void {
  if (typeof window === "undefined") return;
  const normalizedId = normalizeEmployeeId(employeeId);
  const employee = getEmployeeById(normalizedId);

  try {
    window.localStorage.setItem("activeEmployeeId", normalizedId);
    window.localStorage.setItem("diksha_profile_id", normalizedId);
    if (employee) {
      window.localStorage.setItem("diksha_job_role", employee.job_role);
    }
    // Dispatch events for intra-tab and cross-component reactivity
    window.dispatchEvent(new Event("diksha_employee_change"));
    window.dispatchEvent(new Event("diksha_cadre_change"));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Failed to set active employee in localStorage:", err);
  }
}

export function clearActiveEmployee(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("activeEmployeeId");
    window.localStorage.removeItem("diksha_profile_id");
    window.localStorage.removeItem("diksha_job_role");
    window.dispatchEvent(new Event("diksha_employee_change"));
    window.dispatchEvent(new Event("diksha_cadre_change"));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Failed to clear active employee from localStorage:", err);
  }
}

export function getEmployeeById(employeeId: string): Employee | undefined {
  const norm = normalizeEmployeeId(employeeId);
  return MOCK_EMPLOYEES.find((e) => e.id === norm || e.profile_id === norm);
}

export function getActiveEmployee(): Employee {
  const activeId = getActiveEmployeeId();
  return getEmployeeById(activeId) || MOCK_EMPLOYEES[0];
}

export function getAllEmployees(): Employee[] {
  return MOCK_EMPLOYEES;
}

/**
 * Deterministically maps login credentials (email or username) to an employee ID
 */
export function mapCredentialToEmployeeId(credential: string): string {
  if (!credential) return DEFAULT_EMPLOYEE_ID;
  const clean = credential.trim().toLowerCase();

  // Direct match by email
  const byEmail = MOCK_EMPLOYEES.find((e) => e.email.toLowerCase() === clean);
  if (byEmail) return byEmail.id;

  // Match by code/id
  const byId = MOCK_EMPLOYEES.find(
    (e) => e.id.toLowerCase() === clean || e.employeeCode.toLowerCase() === clean
  );
  if (byId) return byId.id;

  // Match by first name / keywords
  if (clean.includes("rajesh")) return "emp-101";
  if (clean.includes("priya")) return "emp-102";
  if (clean.includes("amitabh")) return "emp-103";
  if (clean.includes("sunita")) return "emp-104";
  if (clean.includes("vikram")) return "emp-105";
  if (clean.includes("ananya")) return "emp-106";

  return DEFAULT_EMPLOYEE_ID;
}

function subscribeEmployeeChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("diksha_employee_change", callback);
  window.addEventListener("diksha_cadre_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("diksha_employee_change", callback);
    window.removeEventListener("diksha_cadre_change", callback);
  };
}

/**
 * React hook using useSyncExternalStore for reactive active employee subscription
 */
export function useActiveEmployee(): {
  employee: Employee;
  employeeId: string;
  setEmployeeId: (id: string) => void;
  allEmployees: Employee[];
} {
  const employeeId = useSyncExternalStore(
    subscribeEmployeeChange,
    () => getActiveEmployeeId(),
    () => DEFAULT_EMPLOYEE_ID
  );

  const employee = getEmployeeById(employeeId) || MOCK_EMPLOYEES[0];

  return {
    employee,
    employeeId,
    setEmployeeId: setActiveEmployeeId,
    allEmployees: MOCK_EMPLOYEES
  };
}
