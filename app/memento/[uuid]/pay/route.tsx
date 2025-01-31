import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// payment stuff
// database should have on update and on delete trigger to update the denormalized total revenue
// return boolean if payment is successful and uuid of the user
export async function POST(request: Request) {
    console.log("Payment request received");
    const supabase = await db();

    
}