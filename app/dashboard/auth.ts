import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type DashboardRole = "superuser" | "user";

export type DashboardSession = {
  role: DashboardRole;
  displayName: string;
  boothId?: string;
};

const DASHBOARD_ROLE_COOKIE = "dashboard_role";
const DASHBOARD_NAME_COOKIE = "dashboard_name";
const DASHBOARD_BOOTH_COOKIE = "dashboard_booth";

function normalizeRole(rawRole: string | undefined): DashboardRole | null {
  if (rawRole === "superuser" || rawRole === "user") {
    return rawRole;
  }

  return null;
}

export async function getDashboardSession(): Promise<DashboardSession | null> {
  const cookieStore = await cookies();
  const role = normalizeRole(cookieStore.get(DASHBOARD_ROLE_COOKIE)?.value);

  if (!role) {
    return null;
  }

  const displayName = cookieStore.get(DASHBOARD_NAME_COOKIE)?.value || "Operator";
  const boothId = cookieStore.get(DASHBOARD_BOOTH_COOKIE)?.value;

  return {
    role,
    displayName,
    boothId,
  };
}

export async function requireDashboardSession() {
  const session = await getDashboardSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  return session;
}

export async function setDashboardSession(session: DashboardSession) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: DASHBOARD_ROLE_COOKIE,
    value: session.role,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  cookieStore.set({
    name: DASHBOARD_NAME_COOKIE,
    value: session.displayName,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  if (session.boothId) {
    cookieStore.set({
      name: DASHBOARD_BOOTH_COOKIE,
      value: session.boothId,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
  } else {
    cookieStore.delete(DASHBOARD_BOOTH_COOKIE);
  }
}

export async function clearDashboardSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DASHBOARD_ROLE_COOKIE);
  cookieStore.delete(DASHBOARD_NAME_COOKIE);
  cookieStore.delete(DASHBOARD_BOOTH_COOKIE);
}
