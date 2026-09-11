import { apiFetch } from "./client";
import { Employee, MOCK_EMPLOYEES } from "@/lib/auth/employee";

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const data = await apiFetch<any[]>("/employees");
    if (Array.isArray(data) && data.length > 0) {
      return data.map((raw) => {
        const local = MOCK_EMPLOYEES.find((m) => m.id === raw.profile_id);
        return {
          id: raw.profile_id,
          profile_id: raw.profile_id,
          name: raw.name,
          designation: raw.designation,
          department: raw.department,
          job_role: raw.job_role,
          experience_years: raw.experience_years,
          education: raw.education,
          prior_trainings: raw.prior_trainings || [],
          initials: local?.initials || raw.name.split(" ").map((w: string) => w[0]).join(""),
          cadreCode: local?.cadreCode || "MoSPI Cadre",
          employeeCode: local?.employeeCode || raw.profile_id.toUpperCase(),
          email: local?.email || `${raw.name.toLowerCase().replace(" ", ".")}@gov.in`,
          location: local?.location || "MoSPI HQ, New Delhi"
        };
      });
    }
  } catch {
    // Graceful fallback to static mock definitions
  }
  return MOCK_EMPLOYEES;
}

export async function fetchEmployeeById(profileId: string): Promise<Employee> {
  const local = MOCK_EMPLOYEES.find((m) => m.id === profileId || m.profile_id === profileId);
  try {
    const raw = await apiFetch<any>(`/employees/${encodeURIComponent(profileId)}`);
    if (raw && raw.profile_id) {
      return {
        id: raw.profile_id,
        profile_id: raw.profile_id,
        name: raw.name,
        designation: raw.designation,
        department: raw.department,
        job_role: raw.job_role,
        experience_years: raw.experience_years,
        education: raw.education,
        prior_trainings: raw.prior_trainings || [],
        initials: local?.initials || raw.name.split(" ").map((w: string) => w[0]).join(""),
        cadreCode: local?.cadreCode || "MoSPI Cadre",
        employeeCode: local?.employeeCode || raw.profile_id.toUpperCase(),
        email: local?.email || `${raw.name.toLowerCase().replace(" ", ".")}@gov.in`,
        location: local?.location || "MoSPI HQ, New Delhi"
      };
    }
  } catch {
    // Graceful fallback
  }
  return local || MOCK_EMPLOYEES[0];
}
