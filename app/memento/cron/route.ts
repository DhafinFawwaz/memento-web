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
    const previousDayMementos = await getAllMementoYesterday();
    const csvstr = await createCSVStr(previousDayMementos);
    console.log("Sending report notification");
    const yesterdayStr = yesterday();
    sendEmailToSelf(csvstr, yesterdayStr);
}

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }


    notifyPreviousDayRevenue();
    return new Response("Notification sent", { status: 200 });
}