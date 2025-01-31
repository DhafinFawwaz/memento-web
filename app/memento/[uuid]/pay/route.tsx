import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Memento } from "../types";

async function processPayment(request: Request) {
    // TODO: payment stuff here
    const data = await savePayment("12000", "Payment for a widh id 1");
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

// check the amount of revenue and send notification with spreadsheet to gmail based on rule provided
async function notifyIfRevenueEnough() {

}

// payment stuff
// return boolean if payment is successful and uuid of the user
export async function POST(request: Request) {
    console.log(request);
    try {
        const data = await processPayment(request);
        notifyIfRevenueEnough();
        return NextResponse.json({ success: true, data: data });    
    } catch (e) {
        return NextResponse.json({ success: false, error: e }, { status: 400 });
    }
}