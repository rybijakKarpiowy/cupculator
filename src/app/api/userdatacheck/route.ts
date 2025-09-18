import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { createClient } from "@/database/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createClient()
    const auth_id = (await clientSupabase.auth.getUser()).data.user?.id

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
    const embed = params.get("embed") == 'true' ? true : false;

    if (!data || error || data.length > 0) {
        console.error(error);
        return NextResponse.redirect(new URL(`/?cup=${cup}&lang=${lang}&embed=${embed}`, baseUrl));
    }

    return NextResponse.json({ status: 200 });
};
