import Link from "next/link";
import { notFound } from "next/navigation";

import DashboardShell from "../../_components/dashboard-shell";
import { requireDashboardSession } from "../../auth";
import { GLOBAL_PRICE, activeBadge, currency, getAccessibleBooth, statusPill } from "../../mock-data";

type BoothDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function BoothDetailPage({ params }: BoothDetailProps) {
  const session = await requireDashboardSession();
  const isSuperuser = session.role === "superuser";
  const { id } = await params;

  const booth = getAccessibleBooth(session, id);
  if (!booth) {
    notFound();
  }

  return (
    <DashboardShell session={session} active="booths">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
        <p className="text-xs uppercase tracking-[0.15em] text-indigo-300">Booth Detail</p>
        <h1 className="mt-1 text-2xl font-bold">
          {booth.id} · {booth.city}
        </h1>
        <p className="mt-1 text-sm text-slate-300">Status operasional, pricing booth, dan laporan keuangan lokal.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">Status Booth</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
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

          {isSuperuser ? (
            <button className="mt-4 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-400">
              {booth.active ? "Matikan Aktivitas Booth" : "Aktifkan Booth"}
            </button>
          ) : null}
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">Pricing Booth</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-slate-300">Harga Global: <span className="font-semibold text-white">{currency(GLOBAL_PRICE)}</span></p>
            <p className="text-slate-300">Harga Lokal Booth: <span className="font-semibold text-white">{currency(booth.localPrice)}</span></p>
            <p className="text-slate-300">Voucher aktif: {booth.claimedVouchers.join(", ")}</p>
          </div>
          <button
            disabled={!isSuperuser}
            className="mt-4 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Set Pricing Booth
          </button>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-lg font-semibold">Laporan Keuangan & Inventory</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Omzet Booth</p>
            <p className="mt-1 text-xl font-bold">{currency(booth.dailyRevenue)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Total Print</p>
            <p className="mt-1 text-xl font-bold">{booth.printCount.toLocaleString("id-ID")}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Alert Ganti Kertas</p>
            <p className="mt-1 text-xl font-bold">{booth.paperAlertLimit}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800">Set Alert Kertas</button>
          <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800">Reset Counter Print</button>
          <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800">Export Laporan Booth</button>
        </div>
      </section>

      <div>
        <Link href="/dashboard/booths" className="text-sm text-indigo-300 hover:text-indigo-200">
          ← Kembali ke daftar booth
        </Link>
      </div>
    </DashboardShell>
  );
}
