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

    for (const folder of data) {
        console.log("Checking folder", folder.name);
        const { data: mementos, error: mementoError } = await supabase
            .from("memento")
            .select("uuid")
            .eq("uuid", folder.name)
            .limit(1);

        if (mementoError) throw mementoError;

        if (mementos.length === 0) {
            console.log(`Deleting folder ${folder.name} because it is not referenced by any memento`);

            try {
                // Get all files in the folder
                const { data: files, error: fileError } = await supabase.storage
                    .from("memento")
                    .list(`databases/${folder.name}`, {
                        limit: 1000,
                        offset: 0,
                    });
                if (fileError) throw fileError;

                // Get all files in databases/{foldername}/result
                const { data: resultFiles, error: resultFileError } = await supabase.storage
                    .from("memento")
                    .list(`databases/${folder.name}/result`, {
                        limit: 1000,
                        offset: 0,
                    });
                if (resultFileError) throw resultFileError;

                // Delete all files in the folder
                for (const file of files) {
                    const { error: deleteError } = await supabase.storage
                        .from("memento")
                        .remove([`databases/${folder.name}/${file.name}`]);
                    console.log(`Deleted file: ${folder.name}/${file.name}`, deleteError);
                }

                // Delete all result files in the folder
                for (const file of resultFiles) {
                    const { error: deleteError } = await supabase.storage
                        .from("memento")
                        .remove([`databases/${folder.name}/result/${file.name}`]);
                    console.log(`Deleted result file: ${folder.name}/${file.name}`, deleteError);
                }

            } catch (e) {
                console.error("Error deleting folder contents:", e);
            }
        }
    }

}

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        await deleteAllUnreferencedObjects();
        return new Response(JSON.stringify({}), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify(e), { status: 500 });
    }
}

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
