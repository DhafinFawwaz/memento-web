import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


async function createCSVStr() {
    const supabase = await db();
    const { data, error } = await supabase.from("memento").select("*");
    if (error) throw error;

    // uuid,created_at,updated_at,additional,revenue
    let csvContent = "uuid,created_at,updated_at,additional,revenue\n";
    let totalRevenue = 0;
    for(const row of data) {
        csvContent += `${row.uuid},${row.created_at},${row.updated_at},${row.additional},${row.revenue}\n`;
        totalRevenue += row.revenue;
    }
    csvContent += `,,,,${totalRevenue}\n`;

    return csvContent;
}


export async function POST(req: Request) {
    const formData = await req.formData();
    const password = formData.get("password");
    console.log("password", password);
    if(!password) return NextResponse.json({ success: false, error: "No password found" }, { status: 400 });
    // TODO: Check password here

    try {
        const csvstr = await createCSVStr();
        const csvBlob = new Blob([csvstr], { type: "text/csv" });
      
        return new Response(csvBlob, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=frog_data.csv",
          },
        });
    } catch (e) {
        return NextResponse.json({ success: false, error: e }, { status: 400 });
    }
  }