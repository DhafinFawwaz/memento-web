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

// insert medias json to database and the video/image files to bucket
export async function POST(request: Request) {
    console.log(request);

    const body = await request.json();
    const uuid: string = body.uuid;
    const materials: string[] = body.videos;
    const outputs: [string, string] = body.images;

    if(!body) return NextResponse.json({ success: false, error: "No body found" });
    if(!uuid) return NextResponse.json({ success: false, error: "No uuid found" });
    if(!materials) return NextResponse.json({ success: false, error: "No videos found" });
    if(!outputs) return NextResponse.json({ success: false, error: "No images found" });
    if(outputs.length !== 2) return NextResponse.json({ success: false, error: "output should be [video src, image src]" });

    const medias = outputs.concat(materials);

    try {
        const signedUploadUrls = await getSignedUploadUrls(medias);
        return NextResponse.json({ success: true, data: signedUploadUrls });
    } catch (e) {
        return NextResponse.json({ success: false, error: e }, { status: 400 });
    }
}