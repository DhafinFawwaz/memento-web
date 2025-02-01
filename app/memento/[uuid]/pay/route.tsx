import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Memento } from "../types";
import fs from "fs";
import { createTransport } from "nodemailer";
import { createCSVStr } from "@/app/csv-creator";
import { sendEmail } from "@/app/mail-sender";

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

async function countPayments(): Promise<number> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("count", { count: "exact" });
    if (error) throw error;
    return data[0].count;
}


async function sendReportNotification() {
    console.log("Sending report notification");
    const csvstr = await createCSVStr();
    sendEmail(csvstr);
}

// check the amount of revenue and send notification with spreadsheet to gmail based on rule provided
// lets just say every 5 customers
async function notifyIfRevenueEnough() {
    const count = await countPayments();
    if(count % 5 === 0) {
        await sendReportNotification();
    }
}

// payment stuff
// return boolean if payment is successful and uuid of the user
export async function GET(request: Request) {
    console.log(request);
    try {
        const data = await processPayment(request);
        notifyIfRevenueEnough();
        return NextResponse.json({ success: true, data: data });    
    } catch (e) {
        return NextResponse.json({ success: false, error: e }, { status: 400 });
    }
}