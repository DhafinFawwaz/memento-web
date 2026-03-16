"use client";

import { deleteVoucherAction } from "@/app/dashboard/actions";

export default function DeleteVoucherButton({ voucherId }: { voucherId: string }) {
  return (
    <form
      action={deleteVoucherAction}
      onSubmit={(e) => {
        if (!confirm("Hapus voucher ini?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="voucher_id" value={voucherId} />
      <button
        type="submit"
        className="rounded-lg border border-rose-500/40 px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/15 transition-colors"
      >
        Hapus
      </button>
    </form>
  );
}
