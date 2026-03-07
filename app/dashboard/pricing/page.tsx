import DashboardShell from "../_components/dashboard-shell";
import { requireDashboardSession } from "../auth";
import { GLOBAL_PRICE, currency, getVisibleBooths } from "../mock-data";

export default async function DashboardPricingPage() {
  const session = await requireDashboardSession();
  const isSuperuser = session.role === "superuser";
  const visibleBooths = getVisibleBooths(session);

  return (
    <DashboardShell session={session} active="pricing">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
        <h1 className="text-2xl font-bold">Pricing & Voucher</h1>
        <p className="mt-1 text-sm text-slate-300">
          {isSuperuser
            ? "Set harga global, harga lokal per booth, dan distribusi voucher."
            : "Mode user: melihat harga aktif dan voucher yang berlaku di booth."}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Global Price</p>
          <h2 className="mt-2 text-2xl font-bold">{currency(GLOBAL_PRICE)}</h2>
          <button
            disabled={!isSuperuser}
            className="mt-3 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Update Semua Booth
          </button>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:col-span-2">
          <p className="text-xs text-slate-400">Voucher Management</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
              <p>Generate voucher diskon % / nominal</p>
              <p>Set tanggal berlaku dan limit pemakaian</p>
              <p>Distribusikan ke booth tertentu</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <button
                disabled={!isSuperuser}
                className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-black disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
              >
                Generate Voucher
              </button>
              <p className="mt-2 text-xs text-slate-400">Contoh voucher aktif: GEBYAR20, OPENING50K, PROMOEVENT</p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Set Price per Booth</h3>
        <div className="mt-3 space-y-2">
          {visibleBooths.map((booth) => (
            <div key={booth.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-sm font-medium">
                {booth.id} · {booth.city}
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-slate-300">Harga Booth: {currency(booth.localPrice)}</span>
                <button
                  disabled={!isSuperuser}
                  className="rounded-lg bg-indigo-500 px-3 py-1 font-semibold disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  Set Harga
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
