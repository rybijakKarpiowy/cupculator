import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { data, error } = await pgsql.query.users
        .findMany({
            where: (users, { eq }) => eq(users.user_id, auth_id),
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    const params = req.nextUrl.searchParams;
    const lang = params.get("lang");
    const cup = params.get("cup");

    if (!data || error || data.length > 0) {
        console.log(error);
        return NextResponse.redirect(new URL(`/?cup=${cup}&lang=${lang}`, baseUrl));
    }

    return NextResponse.json({ status: 200 });
};