import { redirect } from "next/navigation";

import { getDashboardSession } from "../auth";
import { loginDashboardAction } from "../actions";

type LoginProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  missing: "Email dan password wajib diisi.",
  invalid: "Email atau password salah.",
  role: "Role tidak valid.",
};

export default async function DashboardLoginPage({ searchParams }: LoginProps) {
  const session = await getDashboardSession();

  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const errMsg = params.error ? errorMessages[params.error] || "Terjadi kesalahan." : null;

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100 flex justify-center items-center px-4 py-8">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-2xl shadow-black/30">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Authentication Gate</p>
          <h1 className="mt-2 text-2xl font-semibold">Dashboard Login</h1>
          <p className="mt-2 text-sm text-slate-300">
            Masuk dengan email dan password yang diberikan admin.
          </p>
        </div>

        {errMsg ? (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errMsg}
          </div>
        ) : null}

        <form action={loginDashboardAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="nama@email.com"
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
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-indigo-500/60 transition focus:ring-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Masuk
          </button>
        </form>
      </section>
    </main>
  );
}
