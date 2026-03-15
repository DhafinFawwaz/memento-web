import DashboardShell from "../_components/dashboard-shell";
import ChangePasswordForm from "@/app/dashboard/_components/change-password-form";
import { requireDashboardSession } from "../auth";

type SettingsPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

const errorMessages: Record<string, string> = {
  missing: "Semua field wajib diisi.",
  mismatch: "Password baru dan konfirmasi tidak cocok.",
  too_short: "Password baru minimal 6 karakter.",
  wrong_password: "Password lama salah.",
  db: "Gagal menyimpan ke database.",
};

export default async function DashboardSettingsPage({ searchParams }: SettingsPageProps) {
  const session = await requireDashboardSession();
  const params = await searchParams;

  const errMsg = params.error ? errorMessages[params.error] || "Terjadi kesalahan." : null;

  return (
    <DashboardShell session={session} active="settings">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-slate-300">
          Informasi akun dan pengaturan password.
        </p>
      </header>

      {params.success === "password" ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Password berhasil diubah.
        </div>
      ) : null}

      {errMsg ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errMsg}
        </div>
      ) : null}

      {/* ── Account Info ──────────────────────── */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Informasi Akun</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Email</p>
            <p className="text-sm font-medium">{session.email}</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Booth ID</p>
            <p className="text-sm font-medium">{session.boothId ?? "—"}</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Booth Name</p>
            <p className="text-sm font-medium">{session.boothName || "—"}</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Role</p>
            <span className="rounded-full border border-indigo-500/40 bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-300">
              {session.role === "superuser" ? "Superadmin" : "Booth User"}
            </span>
          </div>
        </div>
      </section>

      {/* ── Change Password ───────────────────── */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Ubah Password</h3>
        <p className="mt-1 text-xs text-slate-400">
          Masukkan password lama untuk verifikasi, lalu tentukan password baru.
        </p>
        <div className="mt-4 max-w-md">
          <ChangePasswordForm userId={session.userId} />
        </div>
      </section>
    </DashboardShell>
  );
}
