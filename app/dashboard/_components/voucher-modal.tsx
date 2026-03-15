"use client";

import { useState } from "react";
import { createVoucherAction } from "@/app/dashboard/actions";

export default function VoucherModal() {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
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
              <div className="grid grid-cols-2 gap-3">
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
      )}
    </>
  );
}
