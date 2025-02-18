import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


async function getSignedUploadUrl(medias: string): Promise<{ signedUrl: string; token: string; path: string; }> {
    const supabase = await db();
    const { data, error } = await supabase.storage.from("memento").createSignedUploadUrl(medias, {
        upsert: true,
    });
    if (error) throw error;
    return data;
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { templates } = body;
        if (!templates) { return new Response('No medias provided', { status: 400 }); }

        const signedUploadUrl = await getSignedUploadUrl(templates);
        return NextResponse.json({ success: true, data: signedUploadUrl });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500, });
    }
}

async function getTemplatesUrl() {
    const supabase = await db();
    const data = await supabase.storage.from("memento").getPublicUrl("templates");
    return data;
}

export async function GET(request: Request) {
    try {
        const body = await request.json();
        const { templates } = body;
        if (!templates) { return new Response('No medias provided', { status: 400 }); }

        const templatesUrl = await getTemplatesUrl();
        return NextResponse.json({ success: true, data: templatesUrl });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500, });
    }
}
