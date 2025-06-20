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
    // const { data, error } = await supabase.storage
    //     .from("memento")
    //     .remove(objects);
    // if(error) throw error;
    // return data;

    // new version one by one but with retry
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
                // Retry after a short delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
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

    await deleteAllObjects(toDelete);

    
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
