import { db } from "@/utils/supabase/server";
import { Memento } from "../../types";

function getOneWeekAgo() {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
}


async function getOneWeekAgoMemento(): Promise<Memento[]> {
    console.log("Getting one week ago memento");
    const supabase = await db();
    const { data, error} = await supabase
        .from("memento")
        .update({
            is_deleted: true
        })
        .lte("updated_at", getOneWeekAgo().toISOString())
        .eq("is_deleted", false)
        .select("*");
    console.log("error", error);
    if(error) throw error;
    console.log("data", data);
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


export async function deleteOneWeekOldMemento() {
    const data = await getOneWeekAgoMemento();    
 
    console.log("Cleaning up datas", data);

    const toDelete: string[] = [];
    for(const d of data) {
        for(const m of d.medias.materials) {
            toDelete.push(`databases/${d.uuid}/${m}`); // secure because filename comes from admin basically
        }
        for(const m of d.medias.results) {
            toDelete.push(`databases/${d.uuid}/result/${m}`); // secure because filename comes from admin basically
        }
    }

    console.log("To delete", toDelete);

    const res = await deleteAllObjects(toDelete);

    
    return data;
}