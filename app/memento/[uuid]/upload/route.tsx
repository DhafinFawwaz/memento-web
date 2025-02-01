import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function getSignedUploadUrls(medias: string[]): Promise<{ signedUrl: string; token: string; path: string; }[]> {
    const supabase = await db();
    const signedUploadUrls = await Promise.all(medias.map(async (media) => {
        const { data, error } = await supabase.storage.from("memento").createSignedUploadUrl(media);
        if (error) throw error;
        return data;
    }));

    return signedUploadUrls;
}
async function insertMedias(uuid: string, results: string[], materials: string[]) {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .update({
            medias: {
                results,
                materials
            }
        })
        .eq("uuid", uuid)
    if(error) throw error;
}

// insert medias json to database and the video/image files to bucket
export async function POST(request: Request) {
    console.log(request);

    const body = await request.json();
    const uuid: string = body.uuid;
    const materials: string[] = body.materials;
    const results: [string, string] = body.results;

    if(!body) return NextResponse.json({ success: false, error: "No body found" }, { status: 400 });
    if(!uuid) return NextResponse.json({ success: false, error: "No uuid found" }, { status: 400 });
    if(!materials) return NextResponse.json({ success: false, error: "No videos found" }, { status: 400 });
    if(!results) return NextResponse.json({ success: false, error: "No images found" }, { status: 400 });
    // if(results.length !== 2) return NextResponse.json({ success: false, error: "result should be [video src, image src]" }, { status: 400 });

    const medias = results.concat(materials);

    try {
        const signedUploadUrls = await getSignedUploadUrls(medias);
        await insertMedias(uuid, results, materials);
        return NextResponse.json({ success: true, data: signedUploadUrls });
    } catch (e) {
        return NextResponse.json({ success: false, error: e }, { status: 400 });
    }
}