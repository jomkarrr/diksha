"use client";

import { useEffect, useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";

interface OfficerInfo {
  profileId: string;
  name: string;
  designation: string;
  department: string;
  initials: string;
}

const CADRE_PERSONAS: Record<string, OfficerInfo> = {
  prof_demo: {
    profileId: "prof_demo",
    name: "Rajesh Kumar",
    designation: "Statistical Investigator Gr. II",
    department: "NSSO • Field Operations",
    initials: "RK"
  },
  "emp-101": {
    profileId: "emp-101",
    name: "Rajesh Kumar",
    designation: "Statistical Investigator Gr. II",
    department: "NSSO • Field Operations",
    initials: "RK"
  },
  "emp-102": {
    profileId: "emp-102",
    name: "Priya Sharma",
    designation: "Senior Statistical Officer",
    department: "National Accounts Division (NAD)",
    initials: "PS"
  },
  "emp-103": {
    profileId: "emp-103",
    name: "Dr. Amitabh Verma",
    designation: "Director",
    department: "Central Statistics Office (CSO)",
    initials: "AV"
  },
  "emp-104": {
    profileId: "emp-104",
    name: "Sunita Patel",
    designation: "Field Officer",
    department: "Price Statistics Wing (PSD)",
    initials: "SP"
  }
};

const navigationTabs = [
  { href: "/dashboard", label: "My Dashboard", icon: "dashboard" },
  { href: "/competencies", label: "Competency Passport", icon: "badge" },
  { href: "/roadmap", label: "Learning Roadmap", icon: "route" },
  { href: "/resources", label: "Learning Resources", icon: "menu_book" },
  { href: "/data-practice", label: "Data Practice Lab", icon: "terminal" },
  { href: "/assessments", label: "Assessments & Quiz", icon: "quiz" },
  { href: "/knowledge", label: "Knowledge Repository", icon: "library_books" },
  { href: "/admin/analytics", label: "MDO Workforce Analytics", icon: "analytics" }
];

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("diksha_cadre_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("diksha_cadre_change", callback);
  };
}

function useCadreStore() {
  const profileId = useSyncExternalStore(
    subscribeStorage,
    () => localStorage.getItem("diksha_profile_id") || "prof_demo",
    () => "prof_demo"
  );
  const jobRole = useSyncExternalStore(
    subscribeStorage,
    () => localStorage.getItem("diksha_job_role") || "",
    () => ""
  );

  return useMemo<OfficerInfo>(() => {
    const base = CADRE_PERSONAS[profileId] || CADRE_PERSONAS.prof_demo;
    return {
      ...base,
      profileId,
      designation: jobRole || base.designation
    };
  }, [profileId, jobRole]);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const officer = useCadreStore();
  const [activeLang, setActiveLang] = useState<"en" | "hi">("en");
  const [fontScale, setFontScale] = useState<"sm" | "md" | "lg">("md");
  const [searchQuery, setSearchQuery] = useState("");

  // Notify store when pathname changes so intra-app navigations update the cadre
  useEffect(() => {
    window.dispatchEvent(new Event("diksha_cadre_change"));
  }, [pathname]);

  // Handle accessibility font scaling
  const handleScaleChange = (scale: "sm" | "md" | "lg") => {
    setFontScale(scale);
    if (typeof document !== "undefined") {
      document.body.classList.remove("font-scale-sm", "font-scale-md", "font-scale-lg");
      document.body.classList.add(`font-scale-${scale}`);
    }
  };

  // Focus mode bypass for assessment arena
  const isFocusMode = pathname === "/quiz" || pathname === "/assessments/arena";

  // Login page has its own sovereign wrapper
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas-slate text-on-surface">
      {/* 1. Sovereign 3px Hairline Bar */}
      <div className="tricolor-stripe fixed top-0 left-0 right-0 z-50 h-[3px]" />

      {/* 2. Top GIGW Accessibility & Government Utility Bar (36px) */}
      {!isFocusMode && (
        <aside className="fixed top-[3px] left-0 right-0 z-40 bg-slate-900 text-slate-300 text-xs border-b border-slate-800 h-9">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            {/* Left: Sovereign Attribution */}
            <div className="flex items-center space-x-3 text-slate-300 font-medium truncate">
              <span className="text-white font-semibold">भारत सरकार | Government of India</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-amber-400 font-semibold tracking-wide hidden md:inline">
                सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)
              </span>
            </div>

            {/* Right: Accessibility Controls & Language Toggle */}
            <div className="flex items-center space-x-4 shrink-0">
              {/* Functional Font Scaler */}
              <div className="flex items-center space-x-1 border border-slate-700 rounded px-1.5 py-0.5 bg-slate-800/80">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => handleScaleChange("sm")}
                  title="Decrease Font Size"
                  className={`px-1 rounded text-[11px] font-bold transition-colors ${
                    fontScale === "sm" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  A-
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => handleScaleChange("md")}
                  title="Default Font Size"
                  className={`px-1 rounded text-[11px] font-bold transition-colors ${
                    fontScale === "md" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => handleScaleChange("lg")}
                  title="Increase Font Size"
                  className={`px-1 rounded text-[11px] font-bold transition-colors ${
                    fontScale === "lg" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  A+
                </button>
              </div>

              <span className="text-slate-700">|</span>

              {/* Language Selector Stub */}
              <div className="flex items-center space-x-1.5 text-xs">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setActiveLang("en")}
                  className={`transition-colors ${
                    activeLang === "en"
                      ? "text-white font-bold underline decoration-amber-500 underline-offset-2"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  English
                </button>
                <span className="text-slate-600">/</span>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setActiveLang("hi")}
                  className={`transition-colors ${
                    activeLang === "hi"
                      ? "text-white font-bold underline decoration-amber-500 underline-offset-2"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 3. Primary Authority Header (80px) */}
      {!isFocusMode ? (
        <header className="fixed top-[39px] left-0 right-0 z-40 bg-surface-white border-b border-border-subtle shadow-sm h-20">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">
            {/* Left Co-Branded Lockup */}
            <Link className="flex items-center gap-3.5 shrink-0 focus:outline-none group" href="/dashboard">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center">
                <Image
                  src="/diksha-logo.png"
                  alt="DIKSHA MoSPI Official Platform Logo"
                  width={56}
                  height={56}
                  priority
                  className="h-full w-full object-contain select-none drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                />
              </div>

              {/* Vertical Hairline Divider */}
              <div className="h-10 w-[1px] bg-slate-200 shrink-0" />

              {/* Typography Lockup & Subtitle Wrap */}
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl sm:text-2xl text-[#1B365D] tracking-tight leading-none">
                    DIKSHA
                  </span>
                  <span className="bg-[#F47920]/10 text-[#F47920] border border-[#F47920]/20 text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none whitespace-nowrap">
                    iGOT-FRAC Aligned
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-1 font-medium leading-tight whitespace-nowrap hidden md:block">
                  Capacity Building Layer for India&apos;s Official Statistical System
                </p>
              </div>
            </Link>

            {/* Center Universal Search with Keyboard Shortcut */}
            <div className="hidden lg:flex items-center relative w-72 xl:w-96">
              <span className="material-symbols-outlined absolute left-3 text-text-tertiary text-[18px]">
                search
              </span>
              <input
                type="text"
                suppressHydrationWarning
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search competency, circular... (Ctrl+K)"
                className="w-full h-9 pl-9 pr-12 text-xs bg-canvas-slate rounded-lg border border-border-subtle focus:border-domain-statistical focus:bg-surface-white focus:outline-none transition-all"
              />
              <span className="absolute right-2.5 text-[10px] font-bold text-text-tertiary bg-surface-white px-1.5 py-0.5 rounded border border-border-subtle">
                ⌘K
              </span>
            </div>

            {/* Right Officer Status Widget & Switch Cadre */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Notification Bell with SM-2 Alert */}
              <Link
                href="/dashboard#revision-cadence"
                title="SM-2 Revision Suggestions Due"
                className="relative p-2 text-text-secondary hover:text-primary rounded-lg hover:bg-canvas-slate transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary-container rounded-full ring-2 ring-white animate-pulse" />
              </Link>

              <div className="h-8 w-px bg-border-subtle hidden sm:block" />

              {/* Officer Profile Capsule */}
              <div className="flex items-center gap-2.5 bg-canvas-slate py-1 pl-1.5 pr-2.5 rounded-full border border-border-subtle">
                <div
                  suppressHydrationWarning
                  className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shadow-inner shrink-0"
                >
                  {officer.initials}
                </div>
                <div className="flex flex-col text-left hidden sm:block">
                  <span
                    suppressHydrationWarning
                    className="text-xs font-bold text-primary leading-tight"
                  >
                    {officer.name}
                  </span>
                  <span
                    suppressHydrationWarning
                    className="text-[10px] font-medium text-text-secondary leading-tight truncate max-w-[140px]"
                  >
                    {officer.designation}
                  </span>
                </div>
              </div>

              {/* Switch Cadre Action Button */}
              <Link
                href="/login"
                title="Switch Cadre Persona"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border-subtle bg-white hover:bg-slate-50 text-text-secondary hover:text-primary text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                <span className="hidden md:inline">Switch Cadre</span>
              </Link>
            </div>
          </div>
        </header>
      ) : (
        /* Focus Mode Header Bar (Clean & Focused) */
        <header className="fixed top-[3px] left-0 right-0 z-40 bg-surface-white border-b border-border-subtle shadow-sm h-14">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary text-white text-[11px] font-bold uppercase tracking-wider">
                Focus Mode
              </span>
              <span className="text-sm font-bold text-primary">Contextual AI Assessment Arena</span>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle hover:bg-canvas-slate text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              Exit Assessment
            </Link>
          </div>
        </header>
      )}

      {/* 4. Horizontal Tab Navigation (48px) */}
      {!isFocusMode && (
        <nav
          aria-label="Primary Portal Navigation"
          className="fixed top-[119px] left-0 right-0 z-30 bg-surface-white border-b border-border-subtle shadow-[0_2px_4px_rgba(0,0,0,0.02)] h-12"
        >
          <div className="max-w-7xl mx-auto px-6 h-full">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar h-12">
              {navigationTabs.map((tab) => {
                const active =
                  pathname === tab.href ||
                  (tab.href !== "/dashboard" && pathname.startsWith(tab.href));

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`inline-flex items-center gap-2 h-full border-b-[3px] text-xs transition-colors shrink-0 whitespace-nowrap ${
                      active
                        ? "border-[#F47920] text-primary font-semibold"
                        : "border-transparent text-slate-600 hover:text-primary font-medium"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${active ? "text-[#F47920]" : "text-slate-400 group-hover:text-primary"}`}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full ${
          isFocusMode ? "pt-16 pb-8" : "pt-[176px] pb-12"
        }`}
      >
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Sovereign GIGW Institutional Footer */}
      {!isFocusMode && (
        <footer className="w-full bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-slate-300 font-semibold">
                भारत सरकार • Government of India | Ministry of Statistics &amp; Programme Implementation (MoSPI)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Integrated with iGOT Karmayogi Bharat Civil Services Platform • GIGW 3.0 &amp; WCAG 2.1 AA Compliant
              </p>
            </div>
            <div className="flex items-center space-x-4 text-[11px]">
              <Link href="/knowledge" className="hover:text-amber-400 transition-colors">
                Official Manuals
              </Link>
              <span className="text-slate-700">|</span>
              <Link href="/data-practice" className="hover:text-amber-400 transition-colors">
                Microdata Sandbox
              </Link>
              <span className="text-slate-700">|</span>
              <Link href="/admin/analytics" className="hover:text-amber-400 transition-colors">
                MDO Analytics
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
