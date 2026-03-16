"use client";

import { useState } from "react";
import { updateBoothPriceAction } from "@/app/dashboard/actions";

export default function BoothPriceEditor({
  boothId,
  currentPrice,
}: {
  boothId: number;
  currentPrice: number;
}) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(currentPrice));

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(currentPrice);

  if (!editing) {
    return (
      <div>
        <p className="mt-1 text-xl font-bold">{formatted}</p>
        <button
          onClick={() => setEditing(true)}
          className="mt-3 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold hover:bg-indigo-400 transition-colors"
        >
          Set Pricing Booth
        </button>
      </div>
    );
  }

  return (
    <form action={updateBoothPriceAction} className="mt-2 space-y-3">
      <input type="hidden" name="booth_id" value={boothId} />
      <div>
        <label htmlFor={`price-${boothId}`} className="text-xs text-slate-400">
          Harga baru (Rp)
        </label>
        <input
          id={`price-${boothId}`}
          name="price"
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold hover:bg-indigo-400 transition-colors"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setPrice(String(currentPrice));
          }}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
