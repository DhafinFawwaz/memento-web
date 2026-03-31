import type { DashboardSession } from "./auth";

export type Booth = {
  id: string;
  city: string;
  active: boolean;
  camera: "Terdeteksi" | "Terputus";
  printer: "Ready" | "Offline";
  internet: "Online" | "Offline";
  dailyRevenue: number;
  printCount: number;
  claimedVouchers: string[];
  paperAlertLimit: number;
  localPrice: number;
};

export const booths: Booth[] = [
  {
    id: "BTH-01",
    city: "Jakarta",
    active: true,
    camera: "Terdeteksi",
    printer: "Ready",
    internet: "Online",
    dailyRevenue: 5240000,
    printCount: 316,
    claimedVouchers: ["GEBYAR20", "OPENING50K"],
    paperAlertLimit: 400,
    localPrice: 39000,
  },
  {
    id: "BTH-02",
    city: "Bandung",
    active: true,
    camera: "Terdeteksi",
    printer: "Ready",
    internet: "Online",
    dailyRevenue: 3780000,
    printCount: 274,
    claimedVouchers: ["PROMOEVENT", "BANDUNGHEMAT"],
    paperAlertLimit: 320,
    localPrice: 41000,
  },
  {
    id: "BTH-03",
    city: "Surabaya",
    active: false,
    camera: "Terputus",
    printer: "Offline",
    internet: "Offline",
    dailyRevenue: 1950000,
    printCount: 183,
    claimedVouchers: ["EARLYBIRD10"],
    paperAlertLimit: 250,
    localPrice: 42000,
  },
];

export const GLOBAL_PRICE = 45000;

export function currency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function statusPill(status: string) {
  const colorByStatus: Record<string, string> = {
    Online: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    Terdeteksi: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    Ready: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    Offline: "bg-rose-500/15 text-rose-300 border-rose-500/40",
    Terputus: "bg-rose-500/15 text-rose-300 border-rose-500/40",
  };

  return colorByStatus[status] || "bg-slate-500/15 text-slate-300 border-slate-500/40";
}

export function activeBadge(active: boolean) {
  return active
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : "bg-rose-500/15 text-rose-300 border-rose-500/40";
}

export function getVisibleBooths(session: DashboardSession) {
  if (session.role === "superuser") {
    return booths;
  }

  const boothId = session.boothId ?? "BTH-01";
  return booths.filter((booth) => booth.id === boothId);
}

export function getAccessibleBooth(session: DashboardSession, boothId: string) {
  const visible = getVisibleBooths(session);
  return visible.find((booth) => booth.id === boothId) || null;
}
