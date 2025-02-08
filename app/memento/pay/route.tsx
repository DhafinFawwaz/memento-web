import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Memento } from "../types";

async function processPayment(request: Request) {
    // TODO: payment stuff here. depends on the used API, the body might be different
    const body = await request.json();
    const revenue = body.revenue || "12000";
    const additional = body.additional || "Payment for a widh id 1";
    const data = await savePayment(revenue, additional);
    return data;
}

async function savePayment(revenue: string, additional: string): Promise<Memento> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .insert({
            revenue: revenue,
            additional: additional
        })
        .select()
    if (error) throw error;
    return data[0];
}

// payment stuff
// called by Payment Gateway API
export async function POST(request: Request) {
    console.log(request);
    try {
        const data = await processPayment(request);
        return NextResponse.json({ success: true, data: data });    
    } catch (e) {
        return NextResponse.json({ success: false, error: e }, { status: 400 });
    }
}