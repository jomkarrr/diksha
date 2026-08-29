import { apiFetch } from "./client";
import type { AdminDashboard, EmployeeDashboard } from "@/lib/types/contracts";

export function fetchAdminDashboard() {
  return apiFetch<AdminDashboard>("/dashboard/admin");
}

export function fetchEmployeeDashboard(profileId: string) {
  return apiFetch<EmployeeDashboard>(`/dashboard/employee?profile_id=${encodeURIComponent(profileId)}`);
}
