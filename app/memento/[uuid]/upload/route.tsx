import { NextResponse } from "next/server";

// insert medias json to database
// check the amount of revenue and send notification with spreadsheet to gmail based on rule provided
// return signed url so that client can upload medias

export async function POST(request: Request) {
    console.log(request);
    return NextResponse.json({ message: "Not implemented yet" });
}