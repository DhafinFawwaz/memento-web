import { env } from "@/app/env";
import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";

function getUrl() {
    if(env.duitkuIsProduction) {
        return "https://api-prod.duitku.com/api/merchant/createInvoice";
    }
    return "https://api-sandbox.duitku.com/api/merchant/createInvoice";
}

function getGenerateQRISUrl(reference: string) {
    if(env.duitkuIsProduction) {
        return "https://app-prod.duitku.com/api/process/"+reference;
    }
    return "https://app-sandbox.duitku.com/api/process/"+reference;
}
function getRedirectUrl(reference: string) {
    if(env.duitkuIsProduction) {
        return "https://app-prod.duitku.com/redirect_checkout?reference="+reference;
    }
    return "https://app-sandbox.duitku.com/redirect_checkout?reference="+reference;
}

function extractTicket(html: string): string {
    // console.log("==========================");
    // console.log("HTML", html);
    // console.log("==========================");
    // find "ticket": "6cbc9ee5d22071881fd949c86b403c05e3a2fafe",
    // extract the value of ticket

    const match = html.match(/"ticket":\s*"([a-f0-9]+)"/);
    const ticket = match ? match[1] : null;

    if (!ticket) {
        return "";
    }
    return ticket;
}

async function skipToQris(reference: string, timestamp: string, signature: string) {
    const redirectUrl = getRedirectUrl(reference);
    const redirectRes = await fetch(redirectUrl, {
        method: "GET",
    });
    const redirectHtml = await redirectRes.text();
    const ticket = extractTicket(redirectHtml)
    console.log("Ticket", ticket);
    
    const generateQrUrl = getGenerateQRISUrl(reference);

    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Duitku-Ticket": ticket,
        "X-Timestamp": timestamp
    }
    console.log("Headers", headers);
    const qrRes = await fetch(generateQrUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            "merchantCode": env.duitkuMerchantId,
            "reference": reference,
            "channel": env.duitkuChannelId
        }),
    });
    if (!qrRes.ok) {
        const error = await qrRes.json();
        console.error("Error:", error);
    }
}

function getSignatureAndTimestamp() {
    const timestamp = Date.now().toString();
    const merchantCode = env.duitkuMerchantId;
    const apiKey = env.duitkuAPIKey;
    console.log("APIKey", apiKey);

    if (!merchantCode || !apiKey) {
        throw new Error("Duitku Merchant ID or API Key is missing in environment variables.");
    }

    const stringToSign = `${merchantCode}${timestamp}${apiKey}`;
    console.log("Before hash:");
    console.log("signature:", stringToSign);
    console.log("merchantCode:", merchantCode);
    console.log("timestamp:", timestamp);
    console.log("apiKey:", apiKey);

    try {
        const signature = createHash("sha256").update(stringToSign).digest("hex");
        return { signature, timestamp, merchantCode };
    } catch (error) {
        console.error("Error generating signature:", error);
        throw new Error("Failed to generate signature");
    }

}

function getHeaders() {
    const {signature, timestamp, merchantCode} = getSignatureAndTimestamp();
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-duitku-signature": signature!,
        "x-duitku-timestamp": timestamp!,
        "x-duitku-merchantcode": merchantCode!,
    }
}
function getBody(orderId: string) {

    return {
        "paymentAmount": parseInt(env.duitkuPrice!),
        "merchantOrderId": orderId,
        "productDetails": "Photobooth",
        "email": "memento.photobox@gmail.com",
        "callbackUrl": "/memento/pay/duitkunotify",
        "returnUrl": "/",
        "expiryPeriod": 10,
        "paymentMethod": env.duitkuChannelId
    }
}

async function getPayment(orderId: string) {
    const url = getUrl();
    console.log("QRIS URL", url);
    const headers = getHeaders();
    const body = getBody(orderId);
    console.log("headers", headers)
    console.log("body", body)
    const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const error = await res.json();
        console.error("Error:", error);
        throw new Error(error.responseMessage || "Failed to get token");
    }
    const data = await res.json();
    console.log("Data", data);

    // await skipToQris(data.reference, headers["x-duitku-timestamp"], headers["x-duitku-signature"]);
    

    return data;
}


export async function GET(request: Request) {
    if (!env.midtransPrice) {
        return NextResponse.json({ success: false, error: "Price not set" }, { status: 400 });
    }

    const split = request.url.split("/");
    const boothid = split[split.length - 2];
    
    const uuid = randomUUID();
    const orderId = `${boothid}:${uuid}`;

    try {
        const data = await getPayment(orderId);
        data.order_id = orderId;
        return NextResponse.json({success: true, data: data});
    } catch (error) {

        return NextResponse.json({success: false, error: error});
    }

}

