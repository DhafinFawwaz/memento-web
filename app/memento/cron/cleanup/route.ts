import { db } from "@/utils/supabase/server";
import { Memento } from "../../types";
import { deleteOneWeekOldMemento } from "./clean";

async function deleteAllUnreferencedObjects() {
    console.log("Deleting all unreferenced objects in databases folder");
    // get all folder name in databases folder
    const supabase = await db();
    const { data, error } = await supabase.storage
        .from("memento")
        .list("databases");
    console.log("error", error);
    if (error) throw error;
    // if this folder name does not exist in any memento uuid, delete it

    data.forEach(async (folder) => {
        const { data: mementos, error: mementoError } = await supabase
            .from("memento")
            .select("uuid")
            .eq("uuid", folder.name)
            .limit(1);
        
        if (mementoError) throw mementoError;

        if (mementos.length === 0) {
            // const { error: deleteError } = await supabase.storage
            //     .from("memento")
            //     .remove([`databases/${folder.name}`]);
            // if (deleteError) throw deleteError;
            //
            try {

                // get all files in the folder
                const { data: files, error: fileError } = await supabase.storage
                    .from("memento")
                    .list(`databases/${folder.name}`, {
                        limit: 1000, // adjust as needed
                        offset: 0,
                    });
                if (fileError) throw fileError;

                // get all files in databases/{foldername}/result
                const { data: resultFiles, error: resultFileError } = await supabase.storage
                    .from("memento")
                    .list(`databases/${folder.name}/result`, {
                        limit: 1000, // adjust as needed
                        offset: 0,
                    });
                
                if (resultFileError) throw resultFileError;

                // delete all files in the folder
                files.forEach(async file => {
                    const { error: deleteError } = await supabase.storage
                        .from("memento")
                        .remove([`databases/${folder.name}/${file.name}`]);
                    // if (deleteError) throw deleteError;
                    console.log(`Deleted file: ${file.name}`, deleteError);
                })

                // delete all result files in the folder
                resultFiles.forEach(async file => {
                    const { error: deleteError } = await supabase.storage
                        .from("memento")
                        .remove([`databases/${folder.name}/result/${file.name}`]);
                    // if (deleteError) throw deleteError;
                    console.log(`Deleted result file: ${file.name}`, deleteError);
                })
            
            } catch(e) {
                
            }
        }
    });
}

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        // const data = await deleteOneWeekOldMemento();
        await deleteAllUnreferencedObjects();
        return new Response(JSON.stringify({}), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify(e), { status: 500 });
    }
}
