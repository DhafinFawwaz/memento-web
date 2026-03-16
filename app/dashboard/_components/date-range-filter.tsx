"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DateRangeFilter({ basePath = "/dashboard" }: { basePath?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(searchParams.get("from") ?? "");
  const [to, setTo] = useState(searchParams.get("to") ?? "");

  function apply() {
    const params = new URLSearchParams(searchParams.toString());
    // Reset to page 1 when filtering
    params.delete("page");
    if (from) params.set("from", from);
    else params.delete("from");
    if (to) params.set("to", to);
    else params.delete("to");
    router.push(`${basePath}?${params.toString()}`);
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
    setFrom("");
    setTo("");
  }

  const hasFilter = from || to;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="filter-from" className="block text-xs text-slate-400">
          Dari
        </label>
        <input
          id="filter-from"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="mt-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="filter-to" className="block text-xs text-slate-400">
          Sampai
        </label>
        <input
          id="filter-to"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="mt-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <button
        onClick={apply}
        className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400 transition-colors"
      >
        Filter
      </button>
      {hasFilter ? (
        <button
          onClick={clear}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
