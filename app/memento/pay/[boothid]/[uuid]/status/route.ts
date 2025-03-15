import { env } from "@/app/env"
import { Memento, Snap, SnapStatus } from "@/app/memento/types";
import { extractOrderId } from "@/app/memento/utils";
import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function getNullMementoByBoothIdAndUUID(boothid: string, uuid: string): Promise<Memento> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("*")
        .eq("boothid", boothid)
        .eq("uuid", uuid)
        .is("medias", null)
    if (error) throw error;
    if (data.length === 0) throw new Error("No memento found");
    return data[0];
}

export async function GET(request: Request) {
    const splitUrl = request.url.split("/");
    const boothid = splitUrl[splitUrl.length - 3];
    const uuid = splitUrl[splitUrl.length - 2];
    console.log("Checking:", boothid, uuid);
    try {
        const memento = await getNullMementoByBoothIdAndUUID(boothid, uuid);
        return NextResponse.json({ success: true, data: memento });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: true }, { status: 404});
    }

}