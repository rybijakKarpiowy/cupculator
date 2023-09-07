import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Database } from "./database/types";
import { baseUrl } from "@/app/baseUrl";

export async function middleware(req: NextRequest) {
    const searchParams = new URL(req.url).searchParams;
    let lang = searchParams.get("lang");
    let cup = searchParams.get("cup");
    let setBaseParams = false;

    if (!lang || lang === "" || lang === "null" || lang === "undefined") {
        lang = "1";
        setBaseParams = true;
    }
    if (!cup || cup === "" || cup === "undefined") {
        cup = "null";
        setBaseParams = true;
    }

    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({ req, res });
    const session = await supabase.auth.getSession();

    if (session.data.session) {
        // Continue middleware
        if (["/resetpassword", "/account/details"].includes(req.nextUrl.pathname)) {
            if (setBaseParams) {
                return NextResponse.redirect(
                    new URL(`${req.nextUrl.pathname}?cup=${cup}&lang=${lang}`, baseUrl)
                );
            }
            return NextResponse.next();
        }

        if (["/login", "/recovery", "/register"].includes(req.nextUrl.pathname)) {
            return NextResponse.redirect(new URL(`/?cup=${cup}&lang=${lang}`, baseUrl));
        }

        const { data, error } = await supabase
            .from("users")
            .select(`*, users_restricted(role)`)
            .eq("user_id", session.data.session?.user.id)
            .single();

        if (error) {
            console.log(error);
            return NextResponse.redirect(
                new URL(`/account/details?cup=${cup}&lang=${lang}`, baseUrl)
            );
        }

        if (!data) {
            return NextResponse.redirect(
                new URL(`/account/details?cup=${cup}&lang=${lang}`, baseUrl)
            );
        }

        // @ts-ignore
        if (!data.users_restricted.role) {
            console.log("No users_restricted entry");
            return NextResponse.redirect(
                new URL(`/account/details?cup=${cup}&lang=${lang}`, baseUrl)
            );
        }

        // @ts-ignore
        if (data.users_restricted.role === "User") {
            for (const key in data) {
                // @ts-ignore
                if (data[key] === null || data[key] === undefined || data[key] === "") {
                    return NextResponse.redirect(
                        new URL(`/account/details?cup=${cup}&lang=${lang}`, baseUrl)
                    );
                }
            }
        }

        if (
            (!cup || cup === "" || cup === "null" || cup === "undefined") &&
            // @ts-ignore
            data.users_restricted.role === "User"
        ) {
            return NextResponse.redirect(new URL(`https://kubki.com.pl/Kubki?lang=${lang}`));
        }

        if (setBaseParams) {
            if (data.eu) {
                lang = "2";
            }
            return NextResponse.redirect(new URL(`?cup=${cup}&lang=${lang}`, req.url));
        }

        return NextResponse.next();
    }

    if (!["/login", "/recovery", "/register", "/resetpassword"].includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL(`/login?cup=${cup}&lang=${lang}`, baseUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/login",
        "/recovery",
        "/register",
        "/resetpassword",
        "/account/details",
    ],
};
