import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Database } from "./database/types";

export async function middleware(req: NextRequest) {
    const searchParams = new URL(req.url).searchParams;
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({req, res});
    const session = await supabase.auth.getSession();
    if (session) {
        const { data, error } = await supabase.from("users").select(`*, users_restricted(role)`).eq("user_id", session.data.session?.user.id).single();
        
        if (error) {
            console.log(error);
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (!data) {
            return NextResponse.redirect(new URL("/account/details", req.url));
        }

        // @ts-ignore
        if (!data.users_restricted.role) {
            console.log("No users_restricted entry")
            return NextResponse.redirect(new URL("/account/details", req.url));
        }

        for (const key in data) {
            // @ts-ignore
            if (data[key] === null || data[key] === undefined || data[key] === "") {
                return NextResponse.redirect(new URL("/account/details", req.url));
            }
        }

        // @ts-ignore
        if ((!cup || cup === "" || cup === "null" || cup === "undefined") && data.users_restricted.role === "User") {
            return NextResponse.redirect(new URL("https://kubki.com.pl/Kubki", req.url));
        }

        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
    matcher: ["/", "/dashboard/:path*"],
};