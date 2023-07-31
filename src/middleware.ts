import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({req, res});
    const session = await supabase.auth.getSession();
    if (session) {
        const { data, error } = await supabase.from("users").select("*").eq("user_id", session.data.session?.user.id);
        if (error) {
            console.log(error);
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (!data || data.length === 0) {
            return NextResponse.redirect(new URL("/account/details", req.url));
        }

        for (const key in data) {
            if (data[key] === null || data[key] === undefined || data[key] === "") {
                return NextResponse.redirect(new URL("/details", req.url));
            }
        }

        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
    matcher: ["/", "/dashboard/:path*"],
};