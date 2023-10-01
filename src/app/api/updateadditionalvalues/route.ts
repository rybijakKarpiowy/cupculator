import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

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

    const { id, attr, value } = await req.json() as {
        id: number;
        attr: string;
        value: number;
    };

    if (!id || !attr || !value || !["plain_cup_markup_percent", "mini_pallet_price", "half_pallet_price", "full_pallet_price"].includes(attr)) {
        return NextResponse.json("Missing parameters", { status: 400 });
    }

    const { error } = await pgsql
            .update(schema.additional_values)
            .set({ [attr]: value })
            .where(eq(schema.additional_values.id, id))
            .then(() => ({ error: null }))
            .catch((error) => ({ error }));

    if (error) {
        return NextResponse.json(error.message, { status: 500 });
    }

    return NextResponse.json("Success", { status: 200 });
}