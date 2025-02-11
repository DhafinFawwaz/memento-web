import { env } from "@/app/env"
import { NextResponse } from "next/server";

function getApiUrl(orderId: string) {
    if(env.midtransIsProduction) {
        return `https://api.midtrans.com/v2/${orderId}/status`
    }
    return "https://api.sandbox.midtrans.com/v2/${orderId}/status"
}

export async function GET(request: Request) {
    const splitUrl = request.url.split("/");
    const uuid = splitUrl[splitUrl.length - 1];
    const res = await fetch(getApiUrl(uuid))
    const data = await res.json()


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