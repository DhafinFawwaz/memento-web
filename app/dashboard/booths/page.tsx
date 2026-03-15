import Link from "next/link";

import DashboardShell from "../_components/dashboard-shell";
import { requireDashboardSession } from "../auth";
import { currency } from "../mock-data";
import { db } from "@/utils/supabase/server";

export default async function DashboardBoothsPage() {
  const session = await requireDashboardSession();
  if (session.role !== "superuser") {
    return (
      <DashboardShell session={session} active="booths">
        <p className="text-slate-400">Akses hanya untuk superuser.</p>
      </DashboardShell>
    );
  }

  const supabase = await db();

  // Fetch all booths
  const { data: booths } = await supabase
    .from("booth")
    .select("id, name, price")
    .order("id", { ascending: true });

  const boothList = (booths ?? []) as { id: number; name: string; price: number }[];

  // For each booth, get total prints and total revenue from memento
  const boothStats: Record<number, { prints: number; revenue: number }> = {};

  if (boothList.length > 0) {
    // Fetch all stats in parallel
    const statPromises = boothList.map(async (booth) => {
      const boothIdStr = String(booth.id);

      const [countRes, revenueRes] = await Promise.all([
        supabase
          .from("memento")
          .select("*", { count: "exact", head: true })
          .eq("boothid", boothIdStr),
        supabase
          .from("memento")
          .select("revenue")
          .eq("boothid", boothIdStr),
      ]);

      const prints = countRes.count ?? 0;
      const revenue = (revenueRes.data ?? []).reduce(
        (sum: number, r: { revenue: string }) => sum + (Number(r.revenue) || 0),
        0
      );

      return { boothId: booth.id, prints, revenue };
    });

    const results = await Promise.all(statPromises);
    for (const r of results) {
      boothStats[r.boothId] = { prints: r.prints, revenue: r.revenue };
    }
  }

  return (
    <DashboardShell session={session} active="booths">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
        <h1 className="text-2xl font-bold">Booths Management</h1>
        <p className="mt-1 text-sm text-slate-300">
          Lihat status aktif booth, akses set pricing, dan cek laporan per booth.
        </p>
      </header>

      <section className="space-y-3">
        {boothList.length === 0 ? (
          <p className="py-6 text-center text-slate-500">Belum ada booth terdaftar.</p>
        ) : null}

        {boothList.map((booth) => {
          const stats = boothStats[booth.id] || { prints: 0, revenue: 0 };

          return (
            <article key={booth.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {booth.name || `Booth ${booth.id}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    ID: {booth.id} · Harga: {currency(booth.price ?? 0)}
                  </p>
                </div>

                <div className="text-right text-xs sm:text-sm">
                  <p className="text-slate-300">
                    Revenue: <span className="font-semibold text-white">{currency(stats.revenue)}</span>
                  </p>
                  <p className="text-slate-300">
                    Total Print: <span className="font-semibold text-white">{stats.prints.toLocaleString("id-ID")}</span>
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
              </div>
            </article>
          );
        })}
      </section>
    </DashboardShell>
  );
}
