"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/competencies", icon: "star", label: "My Competencies" },
  { href: "/roadmap", icon: "route", label: "Learning Roadmap" },
  { href: "/resources", icon: "menu_book", label: "Learning Resources" },
  { href: "/assistant", icon: "smart_toy", label: "AI Assistant" },
  { href: "/assessments", icon: "quiz", label: "Assessments" },
  { href: "/knowledge", icon: "library_books", label: "Knowledge Hub" },
  { href: "/progress", icon: "trending_up", label: "Progress" },
  { href: "/admin/analytics", icon: "analytics", label: "Workforce Analytics" }
];

const secondary = [
  { href: "/profile", icon: "person", label: "Profile" },
  { href: "/login", icon: "logout", label: "Logout" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-soft lg:flex">
        <Link href="/dashboard" className="focus-ring flex items-center gap-3 rounded-lg">
          <div className="grid h-9 w-9 place-items-center rounded bg-primary-container text-on-primary">
            <Icon name="hub" filled />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-primary">DIKSHA</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Skill Intelligence</p>
          </div>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring flex items-center gap-4 rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  active
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 pt-4">
          {secondary.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring flex items-center gap-4 rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  active ? "bg-surface-container text-primary" : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      <div className="lg:pl-[244px]">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button className="focus-ring rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low lg:hidden" aria-label="Open navigation">
              <Icon name="menu" />
            </button>
            <div className="relative hidden w-full max-w-sm sm:block">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                className="focus-ring h-9 w-full rounded-full border border-slate-200 bg-surface px-10 text-sm"
                placeholder="Search competencies, resources..."
                aria-label="Search"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="focus-ring rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low" aria-label="Notifications">
                <Icon name="notifications" />
              </button>
              <button className="focus-ring rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low" aria-label="Help">
                <Icon name="help_outline" />
              </button>
              <Link href="/profile" className="focus-ring flex items-center gap-3 rounded-full pl-1 pr-2">
                <div className="grid h-8 w-8 place-items-center rounded-full border border-outline-variant bg-surface-container text-sm font-bold text-primary">
                  RK
                </div>
                <span className="hidden text-sm font-semibold md:inline">Rajesh Kumar</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
