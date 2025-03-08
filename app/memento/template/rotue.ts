import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


async function getSignedUploadUrl(media: string): Promise<{ signedUrl: string; token: string; path: string; }> {
    const supabase = await db();
    const { data, error } = await supabase.storage.from("memento").createSignedUploadUrl(media);
    if (error) throw error;
    return data;
}

export async function POST(request: Request) {
    console.log(request);

    const body = await request.json();
    if(!body) return NextResponse.json({ success: false, error: "No body found" }, { status: 400 });

    const templates: string = body.templates;
    if(!templates) return NextResponse.json({ success: false, error: "No templates found" }, { status: 400 });

    const signedUploadUrl = await getSignedUploadUrl(templates);
    return NextResponse.json({ success: true, data: signedUploadUrl });
}