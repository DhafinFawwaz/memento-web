import { Memento } from "../types";
import { db } from "@/utils/supabase/server";
import { env } from "@/app/env";
import MementoUserClient from "./client-page";

async function getMemento(uuid: string): Promise<Memento> {
    const supabase = await db();
    const { data, error } = await supabase
        .from("memento")
        .select("*")
        .eq("uuid", uuid)
        .single();
    if (error) throw error;
    for(let i = 0; i < (data as Memento).medias.results.length; i++) {
        (data as Memento).medias.results[i] = `${env.bucketBaseUrl}/storage/v1/object/public/memento/databases/${uuid}/result/${(data as Memento).medias.results[i]}`;
    }
    for(let i = 0; i < (data as Memento).medias.materials.length; i++) {
        (data as Memento).medias.materials[i] = `${env.bucketBaseUrl}/storage/v1/object/public/memento/databases/${uuid}/${(data as Memento).medias.materials[i]}`;
    }
    return data;
}



export default async function MementoUser({ params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;
    const memento = await getMemento(uuid);

    return <>
<div className="fixed bg-slate-900 -z-50 w-screen h-dvh h-vh"></div>

<MementoUserClient memento={memento}/>


</>
}