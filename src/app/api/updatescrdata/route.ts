import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { NextRequest, NextResponse } from "next/server";
import * as schema from "@/database/schema";
import { createClient } from "@/database/supabase/server";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createClient()
    const auth_id = (await clientSupabase.auth.getUser()).data.user?.id

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

    const { provider, code_link, cup_id } = await req.json() as {
        provider: string;
        code_link: string;
        cup_id: number;
    };

    if (!provider || !code_link || !cup_id) {
        return NextResponse.json("Missing data", { status: 400 });
    }

    const { error } = await pgsql
        .insert(schema.scraped_warehouses)
        .values({
            provider,
            cup_id,
            code_link: code_link.trim()
        })
        .onConflictDoUpdate({
            target: [schema.scraped_warehouses.provider, schema.scraped_warehouses.cup_id],
            set: {
                code_link
            },
        })
        .then(() => ({ error: null }))
        .catch((e) => ({ error: e }));

    if (error) {
        return NextResponse.json(error.message, { status: 500 });
    }

    return NextResponse.json("Success", { status: 200 });
};
