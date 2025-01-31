import { headers } from "next/headers";
import { Memento } from "./types";
import { db } from "@/utils/supabase/server";

async function getMemento(uuid: string): Promise<Memento> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("*")
        .eq("uuid", uuid)
        .single();
    if (error) throw error;
    return data;
}

export default async function MementoUser({ params }: { params: { uuid: string } }) {
    const { uuid } = await params;
    return getMemento(uuid)
    .then(memento => <>
    <h1>Good</h1>
    <div>{JSON.stringify(memento)}</div>
</>)
        .catch(e => <>
    <h1>Error</h1>
    <div>{JSON.stringify(e)}</div>
</>)
    
}