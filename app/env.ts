export const env = {
    emailUser: process.env.EMAIL_USER,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    bucketBaseUrl: process.env.BUCKET_BASE_URL,
    midtransMerchantId: process.env.MIDTRANS_MERCHANT_ID,
    midtransClientKey: process.env.MIDTRANS_CLIENT_KEY,
    midtransServerKey: process.env.MIDTRANS_SERVER_KEY,
    midtransIsProduction: process.env.MIDTRANS_IS_PRODUCTION === "1",
    midtransPrice: process.env.MIDTRANS_PRICE,
}