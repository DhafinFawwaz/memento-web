import { NextRequest, NextResponse } from "next/server";
import { getDashboardSession } from "../auth";
import { db } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const session = await getDashboardSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const boothId = url.searchParams.get("boothId");

  const supabase = await db();

  let query = supabase
    .from("memento")
    .select("created_at, revenue, boothid")
    .order("created_at", { ascending: false });

  // User role can only export their own booth
  if (session.role !== "superuser" && session.boothId !== null) {
    query = query.eq("boothid", String(session.boothId));
  } else if (boothId) {
    query = query.eq("boothid", boothId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];

  // Build XLS-compatible HTML table (Excel can open this)
  const header = `<tr><th>No</th><th>Timestamp</th><th>Revenue</th><th>Booth ID</th></tr>`;
  const body = rows
    .map(
      (row: { created_at: string; revenue: string; boothid: string }, i: number) =>
        `<tr><td>${i + 1}</td><td>${new Date(row.created_at).toLocaleString("id-ID")}</td><td>${row.revenue}</td><td>${row.boothid}</td></tr>`
    )
    .join("");

  const totalRevenue = rows.reduce(
    (sum: number, r: { revenue: string }) => sum + (Number(r.revenue) || 0),
    0
  );

  const footer = `<tr><td colspan="2"><strong>TOTAL</strong></td><td><strong>${totalRevenue}</strong></td><td></td></tr>`;

  const xls = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="UTF-8"></head>
    <body>
      <table border="1">
        <thead>${header}</thead>
        <tbody>${body}</tbody>
        <tfoot>${footer}</tfoot>
      </table>
    </body>
    </html>
  `;

  return new NextResponse(xls, {
    headers: {
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": `attachment; filename="laporan.xls"`,
    },
  });
}
