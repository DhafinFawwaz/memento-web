import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Memento, Snap } from "../../../types";
import { env } from "@/app/env";
import { randomUUID } from "crypto";
const midtransClient = require('midtrans-client');





// called by the client when showing the payment page
export async function GET(request: Request) {
    if (!env.midtransPrice) {
        return NextResponse.json({ success: false, error: "Price not set" }, { status: 400 });
    }

    const split = request.url.split("/");
    const boothid = split[split.length - 2];
    
    const uuid = randomUUID();
    const orderId = `${boothid}:${uuid}`;
    const param = {
        transaction_details: {
            order_id: orderId,
            gross_amount: parseInt(env.midtransPrice!)
        },
        credit_card: {
            secure: true
        },
        // callbacks: {
        //     finish: "javascript:void(0)"
        // }
    }

    const snap: Snap = new midtransClient.Snap();
    snap.apiConfig.set({
        isProduction : env.midtransIsProduction,
        serverKey : env.midtransServerKey,
        clientKey : env.midtransClientKey
    })
    const transaction = await snap.createTransaction(param)
    console.log('transactionToken:', transaction.token);

    return NextResponse.json({success: true, data: {transaction, uuid}});
}
