import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/database/supabase/server";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createClient()
    const auth_id = (await clientSupabase.auth.getUser()).data.user?.id

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { user_id, role } = (await req.json()) as {
        user_id: string;
        role: "Admin" | "Salesman";
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

    const { error: error2 } = await pgsql
        .update(schema.users_restricted)
        .set({ role })
        .where(eq(schema.users_restricted.user_id, user_id))
        .then(() => ({ error: null }))
        .catch((error) => ({ error }));

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    if (role == "Admin") {
        const { error: error3 } = await pgsql
            .update(schema.users_restricted)
            .set({
                salesman_id: null,
            })
            .where(eq(schema.users_restricted.salesman_id, user_id))
            .then(() => ({ error: null }))
            .catch((error) => ({ error }));

        if (error3) {
            return NextResponse.json(error3.message, { status: 500 });
        }
    }

    return NextResponse.json({ message: "Role changed successfully" }, { status: 200 });
};
