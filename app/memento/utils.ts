export function extractOrderId(order_id: string): [string, string] {
    const split = order_id.split(":") as [string, string];
    return split;
}
