import Link from "next/link";
import type { ReactNode } from "react";

import { logoutDashboardAction } from "../actions";
import type { DashboardSession } from "../auth";

type DashboardSection = "home" | "pricing" | "booths" | "users";

type DashboardShellProps = {
  session: DashboardSession;
  active: DashboardSection;
  children: ReactNode;
};

function menuClass(isActive: boolean) {
  if (isActive) {
    return "flex items-center gap-3 rounded-lg border border-indigo-500/70 bg-indigo-500/15 px-3 py-2 text-white";
  }

  return "flex items-center gap-3 rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800";
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

function PricingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
  );
}

function BoothIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h5a1 1 0 100-2H4V5h4a1 1 0 100-2H3zm11.707 4.293a1 1 0 010 1.414L13.414 10l1.293 1.293a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414l2-2a1 1 0 011.414 0zM17 10a1 1 0 00-1-1H9a1 1 0 100 2h7a1 1 0 001-1z" clipRule="evenodd" />
    </svg>
  );
}

export default function DashboardShell({ session, active, children }: DashboardShellProps) {
  const boothName =
    session.role === "superuser" ? "Semua Booth" : session.boothName || "Booth";

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <aside className="fixed left-0 top-0 z-20 flex h-dvh w-56 flex-col border-r border-slate-800 bg-slate-900 px-3 py-5">
        <div className="px-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400">memento</p>
          <h2 className="mt-1 text-sm font-bold">{boothName}</h2>
        </div>

        <nav className="mt-5 flex-1 space-y-1 text-sm">
          <Link href="/dashboard" className={menuClass(active === "home")}>
            <HomeIcon />
            <span>Home</span>
          </Link>
          {session.role === "superuser" ? (
            <>
              <Link href="/dashboard/pricing" className={menuClass(active === "pricing")}>
                <PricingIcon />
                <span>Pricing</span>
              </Link>
              <Link href="/dashboard/booths" className={menuClass(active === "booths")}>
                <BoothIcon />
                <span>Booths</span>
              </Link>
              <Link href="/dashboard/users" className={menuClass(active === "users")}>
                <UsersIcon />
                <span>Users</span>
              </Link>
            </>
          ) : null}
        </nav>

        <div className="border-t border-slate-800 pt-3">
          <p className="mb-2 truncate px-2 text-xs text-slate-400">{session.email}</p>
          <form action={logoutDashboardAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="pl-0 lg:pl-56">
        <div className="space-y-5 px-4 py-6 md:px-6">{children}</div>
      </div>
    </main>
  );
}
