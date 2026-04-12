import { db } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface VoucherValidationRequest {
  code: string;
  boothId?: string;
}

interface VoucherValidationResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    code: string;
    name: string;
    discount_type: 'percentage' | 'nominal';
    discount_value: number;
    max_usage: number;
    current_usage: number;
    expires_at: string;
  };
  error?: string;
}

async function validateVoucher(code: string): Promise<VoucherValidationResponse> {
  const supabase = await db();

  // Fetch voucher by code
  const { data: voucher, error: fetchError } = await supabase
    .from('voucher')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (fetchError || !voucher) {
    return {
      success: false,
      message: 'Voucher validation failed',
      error: 'voucher invalid name'
    };
  }

  // Check if voucher is expired
  const expiresAt = new Date(voucher.expires_at);
  const now = new Date();

  if (expiresAt < now) {
    return {
      success: false,
      message: 'Voucher validation failed',
      error: 'voucher expired'
    };
  }

  // Check if voucher has reached max usage
  if (voucher.current_usage >= voucher.max_usage) {
    return {
      success: false,
      message: 'Voucher validation failed',
      error: 'voucher max usage exceeded'
    };
  }

  // Voucher is valid
  return {
    success: true,
    message: 'Voucher is valid',
    data: {
      id: voucher.id,
      code: voucher.code,
      name: voucher.name,
      discount_type: voucher.discount_type,
      discount_value: voucher.discount_value,
      max_usage: voucher.max_usage,
      current_usage: voucher.current_usage,
      expires_at: voucher.expires_at
    }
  };
}

export async function POST(request: Request) {
  try {
    const body: VoucherValidationRequest = await request.json();
    const { code } = body;

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request',
          error: 'code is required'
        },
        { status: 400 }
      );
    }

    const result = await validateVoucher(code);
    
    const statusCode = result.success ? 200 : 422;
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('[POST /api/voucher/validate]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request',
          error: 'code query parameter is required'
        },
        { status: 400 }
      );
    }

    const result = await validateVoucher(code);
    
    const statusCode = result.success ? 200 : 422;
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('[GET /api/voucher/validate]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
