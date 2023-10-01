import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import * as schema from "@/database/schema";

export const GET = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { error } = await pgsql
        .insert(schema.users_restricted)
        .values({ user_id: auth_id })
        .onConflictDoNothing({ target: schema.users_restricted.user_id })
        .then(() => ({ error: null }))
        .catch((error) => ({ error }));

    if (error) {
        return NextResponse.json(error.message, { status: 500 });
    }

    return NextResponse.json({ status: 201 });
};
