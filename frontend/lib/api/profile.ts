import { apiFetch } from "./client";
import type { ProfileRequest, ProfileResponse } from "@/lib/types/contracts";

export function submitProfile(payload: ProfileRequest) {
  return apiFetch<ProfileResponse>("/profile", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export const createProfile = submitProfile;

