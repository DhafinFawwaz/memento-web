import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Memento } from "../types";

async function getNewCreatedMemento(request: Request): Promise<Memento | undefined> {
    const supabase = await db();
    // get latest memento
    const { data, error } = await supabase
        .from("memento")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);
    if (error) throw error;
    if (data.length === 0) return undefined;

    const splitUrl = request.url.split("/");
    const uuid = splitUrl[splitUrl.length - 2];
    const memento: Memento = data[0];
    if (memento.uuid === uuid) return undefined;
    return memento;
}

// Polled by frontend to check if new memento is created
export async function GET(request: Request) {
    console.log(request);
    const newUser = await getNewCreatedMemento(request)
    if(newUser) return NextResponse.json({ success: true, data: newUser });
    return NextResponse.json({ success: false, error: "No new memento created" }, { status: 400 });
}