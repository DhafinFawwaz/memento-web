import { db } from "@/utils/supabase/server";
import { Memento } from "../../types";
import { deleteOneWeekOldMemento } from "./clean";

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        const data = await deleteOneWeekOldMemento();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify(e), { status: 500 });
    }
}
