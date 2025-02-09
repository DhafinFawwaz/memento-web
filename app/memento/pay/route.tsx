import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Memento } from "../types";
import { env } from "@/app/env";
import { randomUUID } from "crypto";
const midtransClient = require('midtrans-client');


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

const getMidtransAPIUrl = () => env.midtransIsProduction ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions"

type Snap = {
    apiConfig: any
    httpClient: any
    transaction: any
    createTransaction: (parameter: any) => Promise<{ token: string, redirect_url: string }>
    createTransactionToken: (parameter: any) => Promise<any>
    createTransactionRedirectUrl: (parameter: any) => Promise<any>
}


// called by the client when showing the payment page
export async function GET(request: Request) {
    if (!env.midtransPrice) {
        return NextResponse.json({ success: false, error: "Price not set" }, { status: 400 });
    }
    
    const uuid = randomUUID();
    const param = {
        transaction_details: {
            order_id: uuid,
            gross_amount: parseInt(env.midtransPrice!)
        },
        credit_card: {
            secure: true
        }
    }

    const snap: Snap = new midtransClient.Snap({
        isProduction : env.midtransIsProduction,
        serverKey : env.midtransServerKey
    });
    const transaction = await snap.createTransaction(param)
    console.log('transactionToken:', transaction.token);

    return NextResponse.json({success: true, data: transaction});
}