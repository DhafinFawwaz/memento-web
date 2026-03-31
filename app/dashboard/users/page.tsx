import { redirect } from "next/navigation";

import DashboardShell from "../_components/dashboard-shell";
import DeleteUserButton from "@/app/dashboard/_components/delete-user-button";
import { requireDashboardSession } from "../auth";
import { createBoothUserAction } from "../actions";
import { db } from "@/utils/supabase/server";

type UsersPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

const errorMessages: Record<string, string> = {
  missing: "Semua field wajib diisi.",
  exists: "Email sudah terdaftar.",
  db: "Gagal menyimpan ke database.",
  cannot_delete_super: "Tidak bisa menghapus akun superadmin.",
};

const successMessages: Record<string, string> = {
  "1": "Akun berhasil dibuat dan password telah dikirim via email.",
  deleted: "User berhasil dihapus.",
};

export default async function DashboardUsersPage({ searchParams }: UsersPageProps) {
  const session = await requireDashboardSession();

  if (session.role !== "superuser") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const errMsg = params.error ? errorMessages[params.error] || "Terjadi kesalahan." : null;

  const supabase = await db();

  const { data: allBooths } = await supabase
    .from("booth")
    .select("id, name")
    .order("id", { ascending: true });

  const { data: allUsers } = await supabase
    .from("dashboard_users")
    .select("id, email, role, booth_id")
    .order("created_at", { ascending: true });

  const boothMap = new Map<number, string>();
  (allBooths || []).forEach((b: { id: number; name: string }) => boothMap.set(b.id, b.name || `Booth #${b.id}`));

  return (
    <DashboardShell session={session} active="users">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="mt-1 text-sm text-slate-300">
          Buat akun booth baru. Password akan dikirim via email ke pengguna.
        </p>
      </header>

      {params.success ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {successMessages[params.success] || "Berhasil."}
        </div>
      ) : null}

      {errMsg ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errMsg}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Buat Akun Booth Baru</h3>
        <form action={createBoothUserAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email Pengguna
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="booth@email.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-indigo-500/60 transition focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="text"
              required
              placeholder="Tentukan password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-indigo-500/60 transition focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="booth_id">
              Assign ke Booth
            </label>
            <select
              id="booth_id"
              name="booth_id"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-indigo-500/60 transition focus:ring-2"
            >
              <option value="">Pilih booth...</option>
              {(allBooths || []).map((booth: { id: number; name: string }) => (
                <option key={booth.id} value={booth.id}>
                  #{booth.id} — {booth.name || "Tanpa Nama"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Buat Akun & Kirim Email
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Daftar User Terdaftar</h3>
        <div className="mt-4 space-y-2">
          {(allUsers || []).length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada user terdaftar.</p>
          ) : null}
          {(allUsers || []).map((user: { id: string; email: string; role: string; booth_id: number | null }) => (
            <div key={user.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-slate-400">
                  Role: <span className="uppercase">{user.role}</span>
                  {user.booth_id !== null && user.booth_id !== undefined
                    ? ` · Booth: ${boothMap.get(user.booth_id) || `#${user.booth_id}`}`
                    : " · Semua Booth"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-2 py-1 text-xs ${
                    user.role === "superuser"
                      ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                      : "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
                  }`}
                >
                  {user.role === "superuser" ? "Superadmin" : "Booth User"}
                </span>
                {user.role !== "superuser" ? (
                  <DeleteUserButton userId={user.id} />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
