"use client";

import { useState } from "react";
import { createVoucherAction } from "@/app/dashboard/actions";

type VoucherModalProps = {
  booths: Array<{ id: number; name: string | null }>;
};

export default function VoucherModal({ booths }: VoucherModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors"
      >
        + Buat Voucher
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="flex min-h-full items-start justify-center py-2 sm:items-center sm:py-6">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl sm:p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Buat Voucher Baru</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              action={async (formData) => {
                await createVoucherAction(formData);
                setOpen(false);
              }}
              className="mt-5 space-y-4"
            >
              {/* Name */}
              <div>
                <label htmlFor="v-name" className="text-xs font-medium text-slate-400">
                  Nama Voucher
                </label>
                <input
                  id="v-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Promo Pembukaan"
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Code */}
              <div>
                <label htmlFor="v-code" className="text-xs font-medium text-slate-400">
                  Kode Voucher
                </label>
                <input
                  id="v-code"
                  name="code"
                  type="text"
                  required
                  placeholder="OPENING50K"
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm uppercase placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Discount type + value */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="v-dtype" className="text-xs font-medium text-slate-400">
                    Tipe Diskon
                  </label>
                  <select
                    id="v-dtype"
                    name="discount_type"
                    required
                    className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="nominal">Nominal (Rp)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="v-dval" className="text-xs font-medium text-slate-400">
                    Nilai Diskon
                  </label>
                  <input
                    id="v-dval"
                    name="discount_value"
                    type="number"
                    min={1}
                    required
                    placeholder="20"
                    className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Max usage */}
              <div>
                <label htmlFor="v-max" className="text-xs font-medium text-slate-400">
                  Maks. Penggunaan
                </label>
                <input
                  id="v-max"
                  name="max_usage"
                  type="number"
                  min={1}
                  required
                  defaultValue={100}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Expires at */}
              <div>
                <label htmlFor="v-exp" className="text-xs font-medium text-slate-400">
                  Berlaku Sampai
                </label>
                <input
                  id="v-exp"
                  name="expires_at"
                  type="datetime-local"
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Allowed booths */}
              <div>
                <label className="text-xs font-medium text-slate-400">
                  Berlaku untuk Booth
                </label>
                <div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950 p-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {booths.map((booth) => (
                      <label
                        key={booth.id}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-800/70"
                      >
                        <input
                          type="checkbox"
                          name="allowed_booth_ids"
                          value={booth.id}
                          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                        />
                        <span>{booth.name || `Booth ${booth.id}`} (ID: {booth.id})</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Pilih minimal 1 booth.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors"
                >
                  Buat Voucher
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
