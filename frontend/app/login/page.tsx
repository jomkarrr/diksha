"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OFFICIAL_CADRES, type OfficerPersona } from "@/lib/mock/data";

export default function LoginPage() {
  const router = useRouter();
  const [showParichayModal, setShowParichayModal] = useState(false);
  const [selectedCadre, setSelectedCadre] = useState<string>("prof_demo");
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("rajesh.kumar@gov.in");
  const [passwordInput, setPasswordInput] = useState("••••••••••••");

  const handleSelectCadre = (cadre: OfficerPersona) => {
    setSelectedCadre(cadre.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("diksha_profile_id", cadre.id);
      localStorage.setItem("diksha_job_role", cadre.job_role);
    }
    router.push("/dashboard");
  };

  const handleParichayLogin = () => {
    // Default to the primary demo persona prof_demo
    if (typeof window !== "undefined") {
      localStorage.setItem("diksha_profile_id", "prof_demo");
      localStorage.setItem("diksha_job_role", "Statistical Investigator");
    }
    setShowParichayModal(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* 3px Sovereign Tricolor Band */}
      <div className="tricolor-stripe w-full" />

      {/* Top Accessibility & Government Utility Bar */}
      <header className="w-full bg-slate-900 text-white text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3 text-slate-300 font-medium">
            <span>भारत सरकार | Government of India</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-semibold tracking-wide">
              सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <span className="text-white font-semibold underline decoration-amber-500 underline-offset-2">
              English
            </span>
            <span className="text-slate-600">/</span>
            <span className="hover:text-amber-300 cursor-pointer">हिन्दी</span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Two-Column Responsive Grid */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 mesh-subtle">
        {/* Prominent Center Hero Presentation */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 mb-4 flex items-center justify-center">
            <Image
              src="/diksha-logo.png"
              alt="DIKSHA MoSPI Project Logo"
              width={96}
              height={96}
              priority
              className="h-full w-full object-contain select-none drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B365D] tracking-tight">
            DIKSHA Official Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-md mx-auto leading-relaxed">
            AI-Enabled Capacity Building &amp; Competency Intelligence Platform for India&apos;s Official Statistical System
          </p>
        </div>

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column - Branding, Institutional Narrative & MeriPehchan SSO */}
          <section className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Header Lockup */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-semibold text-domain-statistical uppercase tracking-wider">
                  Official Capacity Building Portal • iGOT Karmayogi
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                  <Image
                    src="/diksha-logo.png"
                    alt="DIKSHA MoSPI Official Platform Logo"
                    width={56}
                    height={56}
                    priority
                    className="h-full w-full object-contain select-none drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold tracking-tight text-primary">DIKSHA</span>
                    <span className="text-xs font-bold text-secondary bg-orange-100 px-2 py-0.5 rounded">
                      MoSPI AI Layer
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 tracking-wide uppercase mt-0.5">
                    Adaptive Skill Intelligence for Official Statistics
                  </p>
                </div>
              </div>
            </div>

            {/* Headline & Description */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Build verified competencies for your role in{" "}
                <span className="text-domain-statistical">India&apos;s Official Statistical System</span>.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Empowering the Indian Statistical Service (ISS), Subordinate Statistical Service (SSS), and field officers across data collection cycles (PLFS, ASI, HCES, ASUSE) with automated competency diagnostic mapping.
              </p>
            </div>

            {/* Capability Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-domain-statistical flex items-center justify-center mb-2 font-semibold">
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800">Adaptive Diagnostic</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  FRAC 18-node competency matrix mapping for precision cadre fit.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-secondary flex items-center justify-center mb-2 font-semibold">
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800">Knowledge Retention</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Kahn&apos;s DAG prerequisites coupled with SM-2 algorithmic memory.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 font-semibold">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800">MoSPI Manual AI</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Live synthesis of official survey instructions &amp; methodological circulars.
                </p>
              </div>
            </div>

            {/* Compliance & Accreditation Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">verified</span>
                <span className="font-medium text-slate-700">GIGW 3.0 &amp; WCAG 2.1 AA Compliant</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <span>Data Sovereignty:</span>
                <span className="font-semibold text-slate-700">NIC MeghRaj Cloud</span>
              </div>
            </div>
          </section>

          {/* Right Column - Official Login & 4-Cadre Demo Switcher */}
          <section className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-7 relative overflow-hidden">
              {/* Sovereign Gradient Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-domain-statistical to-secondary" />

              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-primary shadow-inner mb-2">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to DIKSHA</h2>
                <p className="text-xs text-slate-500 mt-0.5">Official MoSPI Employee &amp; Cadre Access</p>
              </div>

              {/* Standard Email / Password Form */}
              <form onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="employee-id">
                    Official Email / Cadre ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="employee-id"
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g., rajesh.kumar@gov.in or SI-9842"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-domain-statistical"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-domain-statistical"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Sign In to DIKSHA</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Government SSO Divider */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white px-2 text-slate-400 font-bold tracking-wider">or verify via SSO</span>
                  </div>
                </div>

                {/* Jan Parichay SSO Button */}
                <button
                  type="button"
                  onClick={() => setShowParichayModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">badge</span>
                  <span>Continue with MeriPehchan / Parichay</span>
                </button>
              </form>

              {/* Onboarding Link */}
              <div className="pt-3 text-center border-t border-slate-100 mt-4">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center text-xs font-semibold text-secondary hover:text-orange-700 transition-colors"
                >
                  <span>New to DIKSHA MoSPI Cadre? Complete your profile</span>
                  <span className="ml-1 font-bold">→</span>
                </Link>
              </div>
            </div>

            {/* Quick-Switch Demo Cadres Box (For Evaluation & Hackathon Judges) */}
            <div className="bg-white rounded-2xl border border-border-subtle p-4 sm:p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-domain-statistical">group</span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Quick-Switch Demo Cadres
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  4 Official Personas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OFFICIAL_CADRES.map((cadre) => (
                  <button
                    key={cadre.id}
                    type="button"
                    onClick={() => handleSelectCadre(cadre)}
                    className="p-3 rounded-xl border border-slate-200 text-left hover:border-secondary hover:bg-orange-50/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-domain-statistical bg-blue-50 px-1.5 py-0.5 rounded">
                          {cadre.cadreCode}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-secondary transition-colors">
                          Switch →
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-primary leading-snug">
                        {cadre.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                        {cadre.designation}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                      {cadre.department}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Jan Parichay / MeriPehchan Official SSO Modal Dialog */}
      {showParichayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative overflow-hidden">
            <div className="tricolor-stripe absolute top-0 left-0 right-0" />
            <div className="flex items-center justify-between mb-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white grid place-items-center font-bold text-xs">
                  MP
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">MeriPehchan (National SSO)</h3>
                  <p className="text-[10px] text-slate-500">Government of India e-Pramaan Gateway</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowParichayModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Authenticated Cadre:</span>
                <span className="font-bold text-slate-800">Rajesh Kumar</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Govt ID:</span>
                <span className="font-bold text-slate-800">GOV-IN-9842-NSSO</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Security Clearance:</span>
                <span className="font-bold text-emerald-600">Level 2 (Active)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mb-4">
              By continuing, you agree to federated session authorization under the National Informatics Centre (NIC) access framework.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowParichayModal(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleParichayLogin}
                className="flex-1 py-2 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-orange-700 transition-colors"
              >
                Confirm &amp; Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Footer */}
      <footer className="w-full bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <p className="text-slate-300 font-medium">
              Government of India • Ministry of Statistics &amp; Programme Implementation (MoSPI)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Integrated with iGOT Karmayogi National Civil Services Capacity Building Platform
            </p>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <Link href="/knowledge" className="hover:text-amber-400 transition-colors">
              Official Guidelines
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/data-practice" className="hover:text-amber-400 transition-colors">
              Survey Repository
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
