import { PostgrestError } from "@supabase/supabase-js";
import { Memento } from "../types";
import { db } from "@/utils/supabase/server";
import Image from "next/image";

async function getMemento(uuid: string): Promise<Memento> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("*")
        .eq("uuid", uuid)
        .single();
    if (error) throw error;
    for(let i = 0; i < (data as Memento).medias.results.length; i++) {
        (data as Memento).medias.results[i] = `${process.env.NEXT_PUBLIC_BUCKET_BASE_URL}/storage/v1/object/public/memento/databases/${uuid}/result/${(data as Memento).medias.results[i]}`;
        (data as Memento).medias.materials[i] = `${process.env.NEXT_PUBLIC_BUCKET_BASE_URL}/storage/v1/object/public/memento/databases/${uuid}/${(data as Memento).medias.materials[i]}`;
    }
    return data;
}

export default async function MementoUser({ params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;
    return getMemento(uuid)
    .then(memento => <>
    <h1>Good</h1>
    <div>{JSON.stringify(memento)}</div>

    <h2>Results</h2>
    {memento.medias.results.map((media, i) => <video key={i} controls>
        <source src={media}/>
    </video>)}

    <h2>Materials</h2>
    {memento.medias.materials.map((media, i) => <video key={i} controls>
        <source src={media}/>
    </video>)}
</>)
        .catch(e => <>
    <h1>Error</h1>
    <div>{JSON.stringify(e)}</div>
</>)
    
}