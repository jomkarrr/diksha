"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProfile } from "@/lib/api/profile";
import { AppShell } from "@/components/layout/AppShell";

export default function OnboardingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    designation: "Statistical Investigator Gr. II (NSSO / FOD)",
    department: "National Sample Survey Office (NSSO) - Field Operations Division",
    job_role: "Statistical Investigator",
    experience_years: 4,
    education: "M.Sc. Statistics",
    prior_trainings: ["Field Survey Sampling", "CAPI Protocol Standards", "Basic Python"],
    current_survey: "Periodic Labour Force Survey (PLFS) 80th Round",
    cadre_code: "SSS-JSO-0942"
  });

  const availableTrainings = [
    "Field Survey Sampling",
    "CAPI Protocol Standards",
    "Basic Python",
    "National Accounts & GVA",
    "Price Index Computation",
    "Data Quality Auditing (NQAF)",
    "DPDP Compliance & Privacy"
  ];

  const handleToggleTraining = (training: string) => {
    setFormData((prev) => {
      const exists = prev.prior_trainings.includes(training);
      return {
        ...prev,
        prior_trainings: exists
          ? prev.prior_trainings.filter((t) => t !== training)
          : [...prev.prior_trainings, training]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Call POST /api/profile
      const result = await createProfile({
        designation: formData.designation,
        department: formData.department,
        job_role: formData.job_role,
        experience_years: Number(formData.experience_years),
        education: formData.education,
        prior_trainings: formData.prior_trainings
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("diksha_profile_id", result.profile_id);
        localStorage.setItem("diksha_job_role", formData.job_role);
      }
    } catch {
      // Offline fallback: persist local profile
      if (typeof window !== "undefined") {
        localStorage.setItem("diksha_profile_id", "prof_demo");
        localStorage.setItem("diksha_job_role", formData.job_role);
      }
    } finally {
      router.push("/onboarding/analyzing");
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Title & Subheading */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-domain-statistical mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Official MoSPI Cadre Profiling Wizard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Let&apos;s build your competency profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Tell us about your cadre role, operational division, and statistical background. DIKSHA will evaluate your baseline across the 18-Node FRAC Framework and construct your topological learning roadmap.
          </p>
        </div>

        {/* 3-Step Progress Stepper */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />

            {/* Step 1: Active */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold text-sm flex items-center justify-center shadow-md ring-4 ring-orange-100">
                01
              </div>
              <span className="text-xs font-bold text-secondary mt-2 tracking-wide uppercase">
                Step 01: Profile
              </span>
              <span className="text-[11px] text-slate-500 font-medium">(Active Step)</span>
            </div>

            {/* Step 2: Upcoming */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-semibold text-sm flex items-center justify-center">
                02
              </div>
              <span className="text-xs font-semibold text-slate-600 mt-2 tracking-wide uppercase">
                Step 02: Analysis
              </span>
              <span className="text-[11px] text-slate-400 font-medium">(Kahn DAG)</span>
            </div>

            {/* Step 3: Upcoming */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-semibold text-sm flex items-center justify-center">
                03
              </div>
              <span className="text-xs font-semibold text-slate-600 mt-2 tracking-wide uppercase">
                Step 03: Roadmap
              </span>
              <span className="text-[11px] text-slate-400 font-medium">(iGOT Path)</span>
            </div>
          </div>
        </div>

        {/* Cadre Onboarding Form Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-9 shadow-sm max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Cadre &amp; Official Designation Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm your current MoSPI posting and statistical duties to calibrate FRAC nodes.
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="font-semibold">DigiLocker Cadre Link Active</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="designation">
                    Official Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-lg border-slate-300 bg-slate-50/50 p-2.5 focus:bg-white focus:border-secondary focus:ring-secondary"
                  >
                    <option>Statistical Investigator Gr. II (NSSO / FOD)</option>
                    <option>Statistical Investigator Gr. I (NSSO / SDRD)</option>
                    <option>Junior Statistical Officer (JSO) - MoSPI Cadre</option>
                    <option>Senior Statistical Officer (SSO) - MoSPI Cadre</option>
                    <option>Assistant Director (ISS Cadre)</option>
                    <option>Director / Joint Director (CSO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="department">
                    Department / Attached Office <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-lg border-slate-300 bg-slate-50/50 p-2.5 focus:bg-white focus:border-secondary focus:ring-secondary"
                  >
                    <option>National Sample Survey Office (NSSO) - Field Operations Division</option>
                    <option>National Sample Survey Office (NSSO) - Survey Design and Research Division</option>
                    <option>National Accounts Division (NAD) - MoSPI</option>
                    <option>Price Statistics Division (PSD) - MoSPI</option>
                    <option>Data Quality &amp; Analytics Division (DQAD)</option>
                    <option>Coordination &amp; Administration Division (CAD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="job-role">
                    Primary Job Role (FRAC Role Map) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="job-role"
                    value={formData.job_role}
                    onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-lg border-slate-300 bg-slate-50/50 p-2.5 focus:bg-white focus:border-secondary focus:ring-secondary"
                  >
                    <option value="Statistical Investigator">Statistical Investigator (Field &amp; Analysis)</option>
                    <option value="Data Analyst">Data Analyst (Analytics &amp; Python)</option>
                    <option value="Director / Senior Statistical Officer">Director / Senior Statistical Officer</option>
                    <option value="Field Officer">Field Officer (Price &amp; Primary Surveys)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="experience">
                    Years of Statistical Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="experience"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                    className="w-full text-xs sm:text-sm rounded-lg border-slate-300 bg-slate-50/50 p-2.5 focus:bg-white focus:border-secondary focus:ring-secondary"
                  >
                    <option value={1}>0 - 2 Years (Probationary / Entry Grade)</option>
                    <option value={4}>3 - 6 Years (Investigator Grade II)</option>
                    <option value={8}>7 - 10 Years (Senior Cadre Officer)</option>
                    <option value={14}>11+ Years (Supervisory &amp; Direction)</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="education">
                    Highest Educational Qualification <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="education"
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="e.g. M.Sc. Statistics / B.Sc. Mathematics"
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 p-2.5 focus:border-secondary focus:ring-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="current-survey">
                    Current Survey Assignment / Posting
                  </label>
                  <input
                    id="current-survey"
                    type="text"
                    value={formData.current_survey}
                    onChange={(e) => setFormData({ ...formData, current_survey: e.target.value })}
                    placeholder="e.g. Periodic Labour Force Survey (PLFS) 80th Round"
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 p-2.5 focus:border-secondary focus:ring-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Prior Training &amp; Certifications
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableTrainings.map((training) => {
                      const checked = formData.prior_trainings.includes(training);
                      return (
                        <label
                          key={training}
                          onClick={() => handleToggleTraining(training)}
                          className={`flex items-center space-x-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                            checked
                              ? "border-secondary bg-orange-50 text-secondary font-semibold"
                              : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            className="rounded text-secondary focus:ring-secondary"
                          />
                          <span>{training}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/dashboard"
                className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Return to Dashboard
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-secondary hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Analyzing Cadre Standards...</span>
                  </>
                ) : (
                  <>
                    <span>Generate AI Competency Diagnostic</span>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
