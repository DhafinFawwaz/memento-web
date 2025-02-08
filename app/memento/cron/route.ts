import { db } from "@/utils/supabase/server";
import { createCSVStr } from "@/app/csv-creator";
import { sendEmail as sendEmailToSelf } from "@/app/mail-sender";

// TODO: optimize this with denormalized data
async function countPayments(): Promise<number> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("count", { count: "exact" });
    if (error) throw error;
    return data[0].count;
}



// check the amount of revenue and send notification with spreadsheet to gmail based on rule provided
// lets just say every 5 customers
async function notifyIfRevenueEnough() {
    const count = await countPayments();
    if(count % 5 === 0) {
        const csvstr = await createCSVStr();
        console.log("Sending report notification");
        sendEmailToSelf(csvstr);
    }
}


export default function GET(request: Request) {
    notifyIfRevenueEnough();
    return new Response("OK");
}