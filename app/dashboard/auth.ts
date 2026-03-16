import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type DashboardRole = "superuser" | "user";

export type DashboardSession = {
  userId: string;
  email: string;
  role: DashboardRole;
  boothId: string | null;
  boothName: string | null;
};

const SESSION_COOKIE = "dashboard_session";

function normalizeRole(rawRole: string | undefined): DashboardRole | null {
  if (rawRole === "superuser" || rawRole === "user") return rawRole;
  return null;
}

export async function getDashboardSession(): Promise<DashboardSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const role = normalizeRole(parsed.role);
    if (!role || !parsed.userId || !parsed.email) return null;

    return {
      userId: parsed.userId,
      email: parsed.email,
      role,
      boothId: parsed.boothId ?? null,
      boothName: parsed.boothName ?? null,
    };
  } catch {
    return null;
  }
}

export async function requireDashboardSession() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");
  return session;
}

export async function setDashboardSession(session: DashboardSession) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: JSON.stringify(session),
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearDashboardSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
