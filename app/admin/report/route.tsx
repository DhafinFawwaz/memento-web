import { createCSVStr, getAllMementoYesterday } from "@/app/csv-creator";
import { env } from "@/app/env";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    const formData = await req.formData();
    const password = formData.get("password");
    if(!password) return NextResponse.json({ success: false, error: "No password found" }, { status: 400 });
    if(password !== env.cronSecret) return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 400 });

    try {
        const mementos = await getAllMementoYesterday();
        const csvstr = await createCSVStr(mementos);
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