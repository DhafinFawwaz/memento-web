import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const json = await request.json();
    const { boothid } = json;
    if (!boothid) return NextResponse.json({ success: false, error: "No uuid found" }, { status: 400 });

    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .update({ is_paid: true, updated_at: new Date() })
        .eq("boothid", boothid)
        .eq("is_paid", false)
        .is("medias", null)
        .select("*")
        .single()
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
}