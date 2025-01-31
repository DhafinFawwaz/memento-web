import { db } from "@/utils/supabase/server";

export async function createCSVStr() {
    const supabase = await db();
    const { data, error } = await supabase.from("memento").select("*");
    if (error) throw error;

    // uuid,created_at,updated_at,additional,revenue
    let csvContent = "uuid,created_at,updated_at,additional,revenue\n";
    let totalRevenue = 0;
    for(const row of data) {
        csvContent += `${row.uuid},${row.created_at},${row.updated_at},${row.additional},${row.revenue}\n`;
        totalRevenue += row.revenue;
    }
    csvContent += `,,,,${totalRevenue}\n`;

    return csvContent;
}
