"use client";

import { useState } from "react";
import { changePasswordAction } from "@/app/dashboard/actions";

export default function ChangePasswordForm({ userId }: { userId: string }) {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold hover:bg-indigo-400 transition-colors"
      >
        Ubah Password
      </button>
    );
  }

  return (
    <form action={changePasswordAction} className="space-y-4">
      <input type="hidden" name="user_id" value={userId} />

      <div>
        <label htmlFor="old_password" className="block text-xs font-medium text-slate-400">
          Password Lama
        </label>
        <input
          id="old_password"
          name="old_password"
          type="password"
          required
          placeholder="Masukkan password lama"
          className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="new_password" className="block text-xs font-medium text-slate-400">
          Password Baru
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          required
          minLength={6}
          placeholder="Min. 6 karakter"
          className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-xs font-medium text-slate-400">
          Konfirmasi Password Baru
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={6}
          placeholder="Ulangi password baru"
          className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold hover:bg-indigo-400 transition-colors"
        >
          Simpan Password
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
