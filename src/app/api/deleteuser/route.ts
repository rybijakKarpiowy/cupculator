import { supabase } from "@/database/supabase";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { user_id } = (await req.json()) as {
        user_id: string;
    };

    const { data: roleData, error: error1 } = await pgsql.query.users_restricted
        .findMany({
            where: (users_restricted, { eq }) => eq(users_restricted.user_id, auth_id),
            columns: {
                role: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (!roleData || roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User" || roleData[0].role == "Salesman") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    // delete user from supabase
    const { error: error2 } = await supabase.auth.admin.deleteUser(user_id);
    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    // and from pgsql
    const { error: error3 } = await pgsql
        .delete(schema.users)
        .where(eq(schema.users.user_id, user_id))
        .then(() => ({ error: null }))
        .catch((error) => ({ error }));
    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
};
