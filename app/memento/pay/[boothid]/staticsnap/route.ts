import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Memento } from "../../../types";
import { env } from "@/app/env";
import { randomUUID } from "crypto";

async function createTransaction(boothid: string, uuid: string) {
    const supabase = await db();
    // find booth_id == boothid && is_paid == false
    // if exist, return the object
    // else insert it and return the object

    const { data, error } = await supabase
        .from("memento")
        .select("*")
        .eq("boothid", boothid)
        .eq("is_paid", false)
        .is("medias", null)
        .single()
    if (data) {
        // update the uuid
        const { error } = await supabase
            .from("memento")
            .update({ uuid })
            .eq("uuid", data.uuid)
        if (error) throw error;
        return data;
    }
    const res = await supabase
        .from("memento")
        .insert({
            boothid,
            uuid,
            is_paid: false,
            medias: null,
        })
        .select("*")
        .single()

    if(!res || res.error || !res.data) throw new Error("Failed to create transaction")

    return res.data;

}

export async function GET(request: Request) {

    const split = request.url.split("/");
    const boothid = split[split.length - 2];
    const uuid = randomUUID();

    try {
        const transaction = await createTransaction(boothid, uuid)
        return NextResponse.json({success: true, data: {transaction, uuid}});
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Failed to create transaction" }, { status: 500 });
    }
}

