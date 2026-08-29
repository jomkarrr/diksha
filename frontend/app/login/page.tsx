"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { FadeIn } from "@/components/motion/FadeIn";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4">
      <FadeIn duration={0.5}>
        <section className="w-full max-w-[380px] text-center">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg border border-outline-variant bg-white text-primary shadow-soft">
            <Icon name="hub" filled />
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-normal">DIKSHA</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Integrated with iGOT Karmayogi</p>
          <div className="card mt-6 p-5 text-left">
            <div className="text-center">
              <h2 className="text-base font-semibold">Welcome Back</h2>
              <p className="mt-1 text-xs text-on-surface-variant">Secure access to the statistical government portal</p>
            </div>
            <label className="mt-5 block text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              defaultValue="rajesh@mospi.gov.in"
              className="focus-ring mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            />
            <label className="mt-4 block text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              defaultValue="password"
              className="focus-ring mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            />
            <Link
              href="/profile"
              className="focus-ring mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#F4511E] text-xs font-semibold uppercase tracking-wide text-white"
            >
              Sign In <Icon name="arrow_forward" />
            </Link>
            <div className="mt-5 flex items-center gap-3 text-xs text-on-surface-variant">
              <span className="h-px flex-1 bg-slate-200" />
              or continue with
              <span className="h-px flex-1 bg-slate-200" />
            </div>
            <button className="focus-ring mt-4 h-10 w-full rounded-lg border border-slate-200 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              iGOT Karmayogi
            </button>
          </div>
          <p className="mt-5 text-xs text-on-surface-variant">Prototype login only. No backend authentication exists yet.</p>
        </section>
      </FadeIn>
    </main>
  );
}
