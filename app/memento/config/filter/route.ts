import { db } from "@/utils/supabase/server";
import { Filter } from "../../types";
import { NextResponse } from "next/server";

async function insertFilter(filter: Filter) {
    const supabase = await db();
    const { data, error } = await supabase.from('filter').insert({
        data: filter
    });
    if (error) throw error;
    return data;
}

async function getHighestIdFilter() {
    const supabase = await db();
    const { data, error } = await supabase.from('filter').select('data').order('id', { ascending: false }).limit(1);
    if (error) throw error;
    return data;
}

export async function POST(request: Request) {
    const body = await request.json();
    const { filter } = body;
    if (!filter) { return new Response('No filter provided', { status: 400 }); }

    try {
        const data = await insertFilter(filter);
        return new Response(JSON.stringify(data), {status: 200});
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {status: 500,});
    }
    
}

export async function GET(request: Request) {
    try {
        const data = await getHighestIdFilter();
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {status: 400,});
    }
}