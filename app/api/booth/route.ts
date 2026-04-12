import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface BoothPrice {
  id: number;
  name: string;
  price: number;
  created_at: string;
}

async function getBoothPrice(boothId?: string): Promise<BoothPrice[]> {
  const supabase = await db();
  
  let query = supabase.from('booth').select('id, name, price, created_at');
  
  if (boothId) {
    query = query.eq('id', boothId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const boothId = searchParams.get('id');
    
    const boothPrices = await getBoothPrice(boothId || undefined);
    
    if (boothId && boothPrices.length === 0) {
      return NextResponse.json(
        { error: 'Booth not found', data: null },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: boothId ? boothPrices[0] : boothPrices
    });
  } catch (error) {
    console.error('[GET /api/booth]', error);
    return NextResponse.json(
      { error: 'Failed to fetch booth price', success: false },
      { status: 500 }
    );
  }
}
