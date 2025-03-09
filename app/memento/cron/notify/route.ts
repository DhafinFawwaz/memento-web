import { db } from "@/utils/supabase/server";
import { createCSVStr, getAllMemento, getAllMementoYesterday, yesterday } from "@/app/csv-creator";
import { sendEmailToSelf } from "@/app/mail-sender";

// TODO: optimize this with denormalized data
async function countPayments(): Promise<number> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("count", { count: "exact" });
    if (error) throw error;
    return data[0].count;
}


async function notifyPreviousDayRevenue() {
    console.log("getAllMementoYesterday()()");
    const previousDayMementos = await getAllMementoYesterday();
    console.log("createCSVStr()");
    const csvstr = await createCSVStr(previousDayMementos);
    console.log("yesterday()");
    const yesterdayStr = yesterday();
    console.log("Sending report notification");
    sendEmailToSelf(csvstr, yesterdayStr);
}

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
    console.log("auth")
    const authHeader = request.headers.get('authorization');
    console.log(authHeader, "===", `Bearer ${process.env.CRON_SECRET}`);
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        console.log("notifyPreviousDayRevenue()");
        notifyPreviousDayRevenue();
        return new Response("Notification sent", { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify(e), { status: 500 });
    }
}