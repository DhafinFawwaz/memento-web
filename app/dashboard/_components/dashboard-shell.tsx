import Link from "next/link";
import type { ReactNode } from "react";

import { logoutDashboardAction } from "../actions";
import type { DashboardSession } from "../auth";
import { booths } from "../mock-data";

type DashboardSection = "home" | "pricing" | "booths";

type DashboardShellProps = {
  session: DashboardSession;
  active: DashboardSection;
  children: ReactNode;
};

function menuClass(isActive: boolean) {
  if (isActive) {
    return "flex items-center gap-2 rounded-lg border border-indigo-500/70 bg-indigo-500/15 px-3 py-2 text-white";
  }

  return "flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800";
}

export default function DashboardShell({ session, active, children }: DashboardShellProps) {
  const boothName =
    session.role === "superuser"
      ? "Semua Booth"
      : booths.find((booth) => booth.id === (session.boothId || "BTH-01"))?.city || session.boothId || "Booth";

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <aside className="fixed left-0 top-0 z-20 flex h-dvh w-72 flex-col border-r border-slate-800 bg-slate-900 p-4">
        <h2 className="mt-2 text-lg font-bold">{boothName}</h2>

        <nav className="mt-4 space-y-2 text-sm">
          <Link href="/dashboard" className={menuClass(active === "home")}>
            <span aria-hidden="true">🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/dashboard/pricing" className={menuClass(active === "pricing")}>
            <span aria-hidden="true">💳</span>
            <span>Pricing</span>
          </Link>
          <Link href="/dashboard/booths" className={menuClass(active === "booths")}>
            <span aria-hidden="true">🗂️</span>
            <span>Booth Management</span>
          </Link>
        </nav>

        <div className="mt-auto flex gap-2 justify-center">
          <form action={logoutDashboardAction}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-400"
            >
              <span aria-hidden="true">⎋</span>
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="pl-0 lg:pl-72">
        <div className="space-y-5 px-4 py-6 md:px-6">{children}</div>
      </div>
    </main>
  );
}
