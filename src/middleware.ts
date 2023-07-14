import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // if (session) {
    //     return NextResponse.next();
    // }

    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: ["/", "/panel/:path*"],
};
