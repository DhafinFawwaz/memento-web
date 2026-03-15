"use client";

import { deleteUserAction } from "@/app/dashboard/actions";

export default function DeleteUserButton({ userId }: { userId: string }) {
  return (
    <form
      action={deleteUserAction}
      onSubmit={(e) => {
        if (!confirm("Hapus user ini? Aksi ini tidak bisa dibatalkan.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="user_id" value={userId} />
      <button
        type="submit"
        className="rounded-lg border border-rose-500/40 px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/15 transition-colors"
      >
        Hapus
      </button>
    </form>
  );
}
