"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { AnimatedProgressBar } from "@/components/motion/AnimatedProgressBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { submitProfile } from "@/lib/api/profile";
import { demoLearner } from "@/lib/mock/data";
import type { ProfileResponse } from "@/lib/types/contracts";

export default function ProfilePage() {
  const router = useRouter();
  const [result, setResult] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const designation = String(form.get("designation") || "").trim();
    const department = String(form.get("department") || "").trim();
    const jobRole = String(form.get("job_role") || "").trim();
    const experienceYears = Number(form.get("experience_years")) || 0;
    const education = String(form.get("education") || "").trim();
    const priorTrainings = String(form.get("prior_trainings") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const response = await submitProfile({
        designation,
        department,
        job_role: jobRole,
        experience_years: experienceYears,
        education,
        prior_trainings: priorTrainings
      });

      if (response && response.profile_id) {
        window.localStorage.setItem("diksha_profile_id", response.profile_id);
        window.localStorage.setItem("diksha_job_role", jobRole);
        if (Array.isArray(response.competencies)) {
          window.localStorage.setItem(
            "diksha_profile_competencies",
            JSON.stringify(response.competencies)
          );
        }
        setResult(response);
        // Navigate to personalized roadmap upon successful profile parsing
        router.push("/roadmap");
      } else {
        throw new Error("Invalid response format received from profile API.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="My Profile"
        title="Official Profile"
        description="Complete profile data to run AI competency assessment and generate a personalized roadmap."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <FadeIn>
          <section className="card p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-surface-container-high text-2xl font-bold text-primary">RK</div>
              <div>
                <h2 className="text-xl font-semibold">{demoLearner.name}</h2>
                <p className="text-sm text-on-surface-variant">{demoLearner.designation}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{demoLearner.department}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 py-2"><span>Experience</span><strong>{demoLearner.experience_years} years</strong></div>
              <div className="flex justify-between border-b border-slate-100 py-2"><span>Education</span><strong>{demoLearner.education}</strong></div>
              <div className="flex justify-between border-b border-slate-100 py-2"><span>Assignment</span><strong>{demoLearner.current_assignment}</strong></div>
            </div>
            <div className="mt-6">
              <p className="label text-on-surface-variant">Role competency requirements map</p>
              <div className="mt-3 space-y-3">
                <AnimatedProgressBar value={82} label="Current readiness score" />
                <AnimatedProgressBar value={54} label="Target role coverage" />
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section className="card p-5">
            <form onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold">
                  Designation
                  <input
                    name="designation"
                    defaultValue={demoLearner.designation}
                    disabled={loading}
                    required
                    className="focus-ring mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm disabled:bg-slate-50"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Department
                  <input
                    name="department"
                    defaultValue={demoLearner.department}
                    disabled={loading}
                    required
                    className="focus-ring mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm disabled:bg-slate-50"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Job Role
                  <select
                    name="job_role"
                    defaultValue={demoLearner.job_role}
                    disabled={loading}
                    className="focus-ring mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm disabled:bg-slate-50"
                  >
                    <option>Statistical Investigator</option>
                    <option>Data Analyst</option>
                    <option>Director / Senior Statistical Officer</option>
                    <option>Field Officer</option>
                  </select>
                </label>
                <label className="text-sm font-semibold">
                  Experience (Years)
                  <input
                    name="experience_years"
                    type="number"
                    min="0"
                    max="50"
                    defaultValue={demoLearner.experience_years}
                    disabled={loading}
                    required
                    className="focus-ring mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm disabled:bg-slate-50"
                  />
                </label>
                <label className="text-sm font-semibold md:col-span-2">
                  Education
                  <input
                    name="education"
                    defaultValue={demoLearner.education}
                    disabled={loading}
                    required
                    className="focus-ring mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm disabled:bg-slate-50"
                  />
                </label>
                <label className="text-sm font-semibold md:col-span-2">
                  Previous Training (Comma-separated)
                  <textarea
                    name="prior_trainings"
                    defaultValue={demoLearner.prior_trainings.join(", ")}
                    disabled={loading}
                    rows={3}
                    className="focus-ring mt-2 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60 hover:bg-[#d84315] transition"
              >
                {loading ? "Analyzing Profile & Generating Competencies..." : "Run AI Assessment"} <Icon name="arrow_forward" />
              </button>
            </form>
            {error ? (
              <p className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <AnimatePresence>
              {result ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="mt-5 rounded-lg border border-slate-200 bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Profile analyzed</p>
                      <Badge tone="success">{result.profile_id}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      {result.competencies.length} competency nodes returned by backend. Redirecting to roadmap...
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>
        </FadeIn>
      </div>
    </AppShell>
  );
}
