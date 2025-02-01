import { createCSVStr } from "@/app/csv-creator";
import { NextResponse } from "next/server";



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