import { db } from "@/utils/supabase/server";
import { Memento } from "../../types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

function getOneWeekAgo() {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
}


async function getOneWeekAgoMemento(): Promise<Memento[]> {
    console.log("Getting one week ago memento");
    const supabase = await db();

    let result: PostgrestSingleResponse<any[]> | null = null;

    while(!result || result.error) {
        result = await supabase
            .from("memento")
            .select("*")
            .lte("updated_at", getOneWeekAgo().toISOString())
            .eq("is_deleted", false)
        if(result.error) {
            console.error("Error fetching mementos:", result.error);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    console.log("data", result.data);
    return result.data;
}

async function deleteAllObjects(objects: string[]) {
    if(objects.length === 0) return [];
    const supabase = await db();
    for(const object of objects) {
        while(true) {
            try {
                const { data, error } = await supabase.storage
                    .from("memento")
                    .remove([object]);
                if (error) throw error;
                console.log(`Deleted object: ${object}`);
                break;
            } catch (error) {
                console.error(`Error deleting object ${object}:`, error);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
}

async function deleteAllObjectsAndMarkAsDeleted(memento: Memento) {
    const supabase = await db();

    const objects: string[] = [];
    for(const m of memento.medias.materials) {
        objects.push(`databases/${memento.uuid}/${m}`); // secure because filename comes from admin basically
    }
    for(const m of memento.medias.results) {
        objects.push(`databases/${memento.uuid}/result/${m}`); // secure because filename comes from admin basically
    }

    for(const object of objects) {
        while(true) {
            try {
                const { data, error } = await supabase.storage
                    .from("memento")
                    .remove([object]);
                if (error) throw error;
                console.log(`Deleted object: ${object}`);
                break;
            } catch (error) {
                console.error(`Error deleting object ${object}:`, error);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    let result: PostgrestSingleResponse<any> | null = null;
    while(!result || result.error) {
        result = await supabase
            .from("memento")
            .update({ is_deleted: true })
            .eq("uuid", memento.uuid)
            .select("*");
        if(result.error) {
            console.error("Error marking memento as deleted:", result.error);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// only thing used
export async function deleteOneWeekOldMemento() {
    const data = await getOneWeekAgoMemento();    
 
    console.log("Cleaning up datas", data);

    const result = await Promise.all(data.map(memento => deleteAllObjectsAndMarkAsDeleted(memento)));

    return data;
}


async function markOldMementosAsDeleted(): Promise<Memento[]> {
    console.log("Marking mementos older than one week as deleted...");
    const supabase = await db();

    const { data, error } = await supabase
        .from("memento")
        .update({ is_deleted: true })
        .lte("updated_at", getOneWeekAgo())
        .eq("is_deleted", false)
        .select("*"); // Return the updated rows

    if (error) throw error;

    console.log(`Marked ${data.length} mementos as deleted`);
    return data;
}

export async function deleteOneWeekOldMementos() {
    const deletedMementos = await markOldMementosAsDeleted();

    const pathsToDelete: string[] = [];

    for (const memento of deletedMementos) {
        for (const material of memento.medias.materials) {
            pathsToDelete.push(`databases/${memento.uuid}/${material}`);
        }
        for (const result of memento.medias.results) {
            pathsToDelete.push(`databases/${memento.uuid}/result/${result}`);
        }
    }

    console.log(`Deleting ${pathsToDelete.length} files from storage...`);
    const res = await deleteAllObjects(pathsToDelete);

    return {
        deletedMementos,
        deletedFiles: res
    };
}
