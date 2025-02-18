import { db } from "@/utils/supabase/server";
import { Memento } from "../../types";

function getOneWeekAgo() {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
}

async function getOneWeekAgoMemento(): Promise<Memento[]> {
    const supabase = await db();
    const { data, error} = await supabase
        .from("memento")
        .update({
            is_deleted: true
        })
        .lte("updated_at", getOneWeekAgo().toISOString())
        .eq("is_deleted", false)
        .select("*");
    if(error) throw error;
    return data;
}

async function deleteAllObjects(objects: string[]) {
    if(objects.length === 0) return [];
    const supabase = await db();
    const { data, error } = await supabase.storage
        .from("memento")
        .remove(objects);
    if(error) throw error;
    return data;
}

async function deleteOneWeekOldMemento() {
    const data = await getOneWeekAgoMemento();    
 
    // console.log("Data", data);

    const toDelete: string[] = [];
    for(const d of data) {
        for(const m of d.medias.materials) {
            toDelete.push(`databases/${d.uuid}/${m}`); // secure because filename comes from admin basically
        }
        for(const m of d.medias.results) {
            toDelete.push(`databases/${d.uuid}/result/${m}`); // secure because filename comes from admin basically
        }
    }

    // console.log("To delete", toDelete);

    const res = await deleteAllObjects(toDelete);

    
    return data;
}

export async function GET(request: Request) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Unauthorized', {
    //         status: 401,
    //     });
    // }

    try {
        const data = await deleteOneWeekOldMemento();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify(e), { status: 500 });
    }
}