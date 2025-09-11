import { env } from "@/app/env"
import { Memento, Snap, SnapStatus } from "@/app/memento/types";
import { extractOrderId } from "@/app/memento/utils";
import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function getNullMementoByBoothId(boothid: string): Promise<Memento> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("*")
        .eq("boothid", boothid)
        .is("medias", null)
    if (error) throw error;
    return data[0];
}

export async function GET(request: Request) {
    console.log("Request:", request);
    const splitUrl = request.url.split("/");
    const boothid = splitUrl[splitUrl.length - 2];
    try {
        const memento = await getNullMementoByBoothId(boothid);
        console.log("Response:", memento);
        return NextResponse.json({ success: true, data: memento });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: true }, { status: 500});
    }

}