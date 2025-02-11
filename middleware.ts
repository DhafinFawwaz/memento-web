import { NextRequest, NextResponse } from "next/server";

 
export function middleware(request: NextRequest) {
    if (request.method === 'OPTIONS') {
        return new Response("ok", {status: 200})
    }

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Basic ${process.env.BASIC_AUTH_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    const res = NextResponse.next()
    return res
}
 
export const config = {
    matcher: [
        '/memento/:uuid/check', 
        '/memento/:uuid/upload', 
        // '/memento/cron', // different env var
        '/memento/pay', 
    ],
}