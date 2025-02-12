import { env } from "@/app/env"
import { Snap, SnapStatus } from "@/app/memento/types";
import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
const midtransClient = require('midtrans-client');

async function getNullMementoById(boothid: string) {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("*")
        // .eq("boothid", boothid)
        .is("medias", null)
    if (error) throw error;
    return data[0];
}

export async function GET(request: Request) {
    const splitUrl = request.url.split("/");
    const boothid = splitUrl[splitUrl.length - 1];
    try {
        const memento = await getNullMementoById(boothid);
        return NextResponse.json({ success: true, data: memento });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: true });
    }

}