import { apiFetch } from "./client";
import type { AdminDashboard } from "@/lib/types/contracts";

export function fetchAdminDashboard() {
  return apiFetch<AdminDashboard>("/dashboard/admin");
}
