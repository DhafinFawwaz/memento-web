import DashboardShell from "./_components/dashboard-shell";
import { requireDashboardSession } from "./auth";
import { currency, getVisibleBooths } from "./mock-data";

export default async function DashboardPage() {
  const session = await requireDashboardSession();
  const visibleBooths = getVisibleBooths(session);

  const omzetTotal = visibleBooths.reduce((sum, booth) => sum + booth.dailyRevenue, 0);
  const totalPrints = visibleBooths.reduce((sum, booth) => sum + booth.printCount, 0);
  const totalBooths = visibleBooths.length;
  const totalActiveBooths = visibleBooths.filter((booth) => booth.active).length;

  return (
    <DashboardShell session={session} active="home">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
        <h1 className="text-2xl font-bold">Pusat Kendali Utama</h1>
        <p className="mt-1 text-sm text-slate-300">
          Landing dashboard menampilkan ringkasan total print dan total laporan disatukan.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Total Print</p>
          <h2 className="mt-2 text-3xl font-bold">{totalPrints.toLocaleString("id-ID")}</h2>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Total Laporan (Disatukan)</p>
          <h2 className="mt-2 text-3xl font-bold">{currency(omzetTotal)}</h2>
          <p className="mt-1 text-xs text-slate-400">
            {totalActiveBooths}/{totalBooths} booth aktif terpantau.
          </p>
        </article>
      </section>
    </DashboardShell>
  );
}
