import { db } from "@/utils/supabase/server";
import { Memento } from "./memento/types";

export async function getAllMemento(): Promise<Memento[]> {
    const supabase = await db();
    const { data, error } = await supabase.from("memento").select("*");
    if (error) throw error;
    return data;
}

export async function yesterday() {
    return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

export async function getAllMementoYesterday() {
    const supabase = await db();
    const { data, error } = await supabase.from("memento").select("*").gt("created_at", yesterday());
    if (error) throw error;
    return data;
}

export async function createCSVStr(data: Memento[]) {
    // uuid,created_at,updated_at,additional,revenue
    let csvContent = "uuid,created_at,updated_at,additional,revenue\n";
    let totalRevenue = 0;
    let count = 0;
    for(const row of data) {
        csvContent += `${row.uuid},${row.created_at},${row.updated_at},${row.additional},${row.revenue}\n`;
        totalRevenue += row.revenue;
    }
    csvContent += `,,,,\n`;
    csvContent += `Customer Total,,,,Revenue Total\n`;
    csvContent += `${count},,,,${totalRevenue}\n`;

    return csvContent;
}
