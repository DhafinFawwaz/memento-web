import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function getExistingFiles(uuid: string): Promise<Set<string>> {
    const supabase = await db();
    const existingFiles = new Set<string>();

    // Check files in databases/{uuid}/
    try {
        const { data: mainFiles, error: mainError } = await supabase.storage
            .from("memento")
            .list(`databases/${uuid}`, { limit: 1000 });
        if (!mainError && mainFiles) {
            mainFiles.forEach(file => {
                if (file.name) existingFiles.add(`databases/${uuid}/${file.name}`);
            });
        }
    } catch (e) {
        console.warn(`Could not list files in databases/${uuid}:`, e);
    }

    // Check files in databases/{uuid}/result/
    try {
        const { data: resultFiles, error: resultError } = await supabase.storage
            .from("memento")
            .list(`databases/${uuid}/result`, { limit: 1000 });
        if (!resultError && resultFiles) {
            resultFiles.forEach(file => {
                if (file.name) existingFiles.add(`databases/${uuid}/result/${file.name}`);
            });
        }
    } catch (e) {
        console.warn(`Could not list files in databases/${uuid}/result:`, e);
    }

    return existingFiles;
}

async function getSignedUploadUrls(medias: string[], existingFiles: Set<string>): Promise<{ signedUrl: string; token: string; path: string; }[]> {
    const supabase = await db();
    const signedUploadUrls = await Promise.all(medias.map(async (media) => {
        // Skip if file already exists
        if (existingFiles.has(media)) {
            console.log(`File ${media} already exists, skipping signed URL creation`);
            return { signedUrl: media, token: "", path: media };
        }
        const { data, error } = await supabase.storage.from("memento").createSignedUploadUrl(media);
        if (error) throw error;
        return data;
    }));

    return signedUploadUrls;
}

function getFileNameFromUrl(url: string): string | undefined {
    return url.split("/").pop();
}


async function insertMedias(uuid: string, results: string[], materials: string[]) {

    const resultsConverted = results.map(getFileNameFromUrl).filter((result) => result !== undefined) as string[];
    const materialsConverted = materials.map(getFileNameFromUrl).filter((material) => material !== undefined) as string[];

    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .update({
            medias: {
                results: resultsConverted,
                materials: materialsConverted
            }
        })
        .eq("uuid", uuid)
    if(error) throw error;
}

// insert medias json to database and the video/image files to bucket
export async function POST(request: Request) {
    console.log(request);

    const splitUrl = request.url.split("/");
    const uuid = splitUrl[splitUrl.length - 2];

    const body = await request.json();
    const materials: string[] = body.materials;
    const results: [string, string] = body.results;

    if(!body) return NextResponse.json({ success: false, error: "No body found" }, { status: 400 });
    if(!uuid) return NextResponse.json({ success: false, error: "No uuid found" }, { status: 400 });
    if(!materials) return NextResponse.json({ success: false, error: "No videos found" }, { status: 400 });
    if(!results) return NextResponse.json({ success: false, error: "No images found" }, { status: 400 });
    // if(results.length !== 2) return NextResponse.json({ success: false, error: "result should be [video src, image src]" }, { status: 400 });

    const medias = results.concat(materials);

    try {
        const existingFiles = await getExistingFiles(uuid);
        const signedUploadUrls = await getSignedUploadUrls(medias, existingFiles);
        await insertMedias(uuid, results, materials);
        console.log("Response:", signedUploadUrls);
        return NextResponse.json({ success: true, data: signedUploadUrls });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: e }, { status: 400 });
    }
}