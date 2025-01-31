import { NextResponse } from "next/server";

// insert medias json to database
// check the amount of revenue and send notification to gmail based on rule provided
// return signed url so that client can upload medias

type MediaSources = {
    video_src: string[];
    image_src: string[];
}
export async function POST(request: Request) {
    
}