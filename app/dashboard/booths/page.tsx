import Link from "next/link";

import DashboardShell from "../_components/dashboard-shell";
import { requireDashboardSession } from "../auth";
import { activeBadge, currency, getVisibleBooths, statusPill } from "../mock-data";

export default async function DashboardBoothsPage() {
  const session = await requireDashboardSession();
  const isSuperuser = session.role === "superuser";
  const visibleBooths = getVisibleBooths(session);

  return (
    <DashboardShell session={session} active="booths">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
        <h1 className="text-2xl font-bold">Booths Management</h1>
        <p className="mt-1 text-sm text-slate-300">Lihat status aktif booth, akses set pricing, dan cek laporan per booth.</p>
      </header>

      <section className="space-y-3">
        {visibleBooths.map((booth) => (
          <article key={booth.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {booth.id} · {booth.city}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className={`rounded-full border px-2 py-1 ${activeBadge(booth.active)}`}>
                    Booth: {booth.active ? "Aktif" : "Nonaktif"}
                  </span>
                  <span className={`rounded-full border px-2 py-1 ${statusPill(booth.camera)}`}>
                    Kamera: {booth.camera}
                  </span>
                  <span className={`rounded-full border px-2 py-1 ${statusPill(booth.printer)}`}>
                    Printer: {booth.printer}
                  </span>
                  <span className={`rounded-full border px-2 py-1 ${statusPill(booth.internet)}`}>
                    Internet: {booth.internet}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs sm:text-sm">
                <p className="text-slate-300">
                  Omzet: <span className="font-semibold text-white">{currency(booth.dailyRevenue)}</span>
                </p>
                <p className="text-slate-300">
                  Total Print: <span className="font-semibold text-white">{booth.printCount.toLocaleString("id-ID")}</span>
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/dashboard/booths/${booth.id}`}
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800"
              >
                Lihat Detail Booth
              </Link>
              <button
                disabled={!isSuperuser}
                className="rounded-lg bg-indigo-500 px-3 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                Set Pricing Booth
              </button>
            </div>
          </article>
        ))}
      </section>
    </DashboardShell>
  );
}
