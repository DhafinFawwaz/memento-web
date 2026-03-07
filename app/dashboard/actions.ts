"use server";

import { redirect } from "next/navigation";

import { clearDashboardSession, setDashboardSession } from "./auth";

export async function loginDashboardAction(formData: FormData) {
  const role = formData.get("role")?.toString();
  const name = formData.get("name")?.toString().trim() || "Operator";
  const boothId = formData.get("boothId")?.toString().trim() || "BTH-01";

  if (role !== "superuser" && role !== "user") {
    redirect("/dashboard/login?error=role");
  }

  await setDashboardSession({
    role,
    displayName: name,
    boothId: role === "user" ? boothId : undefined,
  });

  redirect("/dashboard");
}

export async function logoutDashboardAction() {
  await clearDashboardSession();
  redirect("/dashboard/login");
}
