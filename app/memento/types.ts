export type MediaSources = {
    results: string[],
    materials: string[]
}

export type Memento = {
    uuid: string,
    created_at: string,
    updated_at: string,
    medias: MediaSources,
    revenue: number,
    additional: string
}

export type Snap = {
    apiConfig: any
    httpClient: any
    transaction: any
    createTransaction: (parameter: any) => Promise<{ token: string, redirect_url: string }>
    createTransactionToken: (parameter: any) => Promise<any>
    createTransactionRedirectUrl: (parameter: any) => Promise<any>
}

export type SnapStatus = {
    status_code: string,
    transaction_id: string,
    gross_amount: string,
    currency: string,
    order_id: string,
    payment_type: string,
    signature_key: string,
    transaction_status: string,
    fraud_status: string,
    status_message: string,
    merchant_id: string,
    transaction_type: string,
    issuer: string,
    acquirer: string,
    transaction_time: string,
    settlement_time: string,
    expiry_time: string,
}