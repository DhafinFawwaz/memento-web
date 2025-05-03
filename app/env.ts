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
    cronSecret: process.env.CRON_SECRET,

    basicAuthSecret: process.env.BASIC_AUTH_SECRET,

    duitkuIsProduction: process.env.DUITKU_IS_PRODUCTION === "1",
    duitkuMerchantId: process.env.DUITKU_MERCHANT_ID,
    duitkuAPIKey: process.env.DUITKU_API_KEY,
    duitkuPrice: process.env.DUITKU_PRICE,

    duitkuToken: process.env.DUITKU_TOKEN,
    duitkuChannelId: process.env.DUITKU_CHANNEL_ID,
    duitkuClientKey: process.env.DUITKU_CLIENT_KEY,
    duitkuPrivateKey: process.env.DUITKU_PRIVATE_KEY,
    duitkuBearer: process.env.DUITKU_BEARER,

}