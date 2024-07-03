import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Database } from "./database/types";
import { baseUrl } from "@/app/baseUrl";

export async function middleware(req: NextRequest) {
    const searchParams = new URL(req.url).searchParams;
    let lang = searchParams.get("lang");
    let cup = searchParams.get("cup")?.trim().replaceAll(" ", "_");
    const embed = searchParams.get("embed") == 'true' ? true : false;
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
                    new URL(`${req.nextUrl.pathname}?cup=${cup}&lang=${lang}&embed=${embed}`, baseUrl)
                );
            }
        }

        if (["/login", "/recovery", "/register"].includes(req.nextUrl.pathname)) {
            return NextResponse.redirect(new URL(`/?cup=${cup}&lang=${lang}&embed=${embed}`, baseUrl));
        }

        const userRoleRes = await fetch(new URL("/api/getuserrole", baseUrl), {
            headers: {
                cookie: req.headers.get("cookie") || "",
            },
        });

        if (!userRoleRes.ok) {
            if (req.nextUrl.pathname === "/account/details") {
                return NextResponse.next();
            }
            return NextResponse.redirect(
                new URL(`/account/details?cup=${cup}&lang=${lang}&embed=${embed}`, baseUrl)
            );
        }

        const data = (await userRoleRes.json()) as {
            email: string;
            first_name: string;
            last_name: string;
            company_name: string;
            country: string;
            region: string;
            adress: string;
            postal_code: string;
            city: string;
            phone: string;
            NIP: string;
            eu: boolean;
            role: "User" | "Admin" | "Salesman";
            user_id: string;
        };

        if (!data || !data.role) {
            if (req.nextUrl.pathname === "/account/details") {
                return NextResponse.next();
            }
            return NextResponse.redirect(
                new URL(`/account/details?cup=${cup}&lang=${lang}&embed=${embed}`, baseUrl)
            );
        }

        if (data.role === "User") {
            for (const key in data) {
                // @ts-ignore
                if (data[key] === null || data[key] === undefined || data[key] === "") {
                    if (key === "region") {
                        continue;
                    }
                    if (req.nextUrl.pathname === "/account/details") {
                        return NextResponse.next();
                    }
                    return NextResponse.redirect(
                        new URL(`/account/details?cup=${cup}&lang=${lang}&embed=${embed}`, baseUrl)
                    );
                }
            }
        }

        if ((!cup || cup === "" || cup === "null" || cup === "undefined") && data.role === "User") {
            return NextResponse.redirect(new URL(`https://kubki.com.pl/Kubki?lang=${lang}&embed=${embed}`));
        }

        if (setBaseParams) {
            if (data.eu) {
                lang = "2";
            }
            return NextResponse.redirect(new URL(`?cup=${cup}&lang=${lang}&embed=${embed}`, req.url));
        }

        return NextResponse.next();
    }

    if (!["/login", "/recovery", "/register", "/resetpassword"].includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL(`/login?cup=${cup}&lang=${lang}&embed=${embed}`, baseUrl));
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
