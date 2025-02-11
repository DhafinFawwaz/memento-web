import { env } from "@/app/env"
import { Snap, SnapStatus } from "@/app/memento/types";
import { NextResponse } from "next/server";
const midtransClient = require('midtrans-client');


export async function GET(request: Request) {
    const splitUrl = request.url.split("/");
    const uuid = splitUrl[splitUrl.length - 1];

    const snap: Snap = new midtransClient.Snap({
        isProduction : env.midtransIsProduction,
        serverKey : env.midtransServerKey
    });
    const data: SnapStatus = await snap.transaction.status(uuid);

    if(data.fraud_status !== "accept") return NextResponse.json({ success: true, data: {
        status: "fraud",
    } });
    if(!(data.transaction_status === "capture" || data.transaction_status === "settlement")) return NextResponse.json({ success: true, data: {
        status: data.transaction_status,
    } });

    return NextResponse.json({ success: true, data: {
        status: "paid",
        data: data
    } });
}