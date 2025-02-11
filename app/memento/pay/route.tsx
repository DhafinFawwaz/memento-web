import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Memento } from "../types";
import { env } from "@/app/env";
import { randomUUID } from "crypto";
const midtransClient = require('midtrans-client');


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