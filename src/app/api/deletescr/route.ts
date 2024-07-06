import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { NextRequest, NextResponse } from "next/server";
import * as schema from "@/database/schema";
import { sql } from "drizzle-orm";
import { createClient } from "@/database/supabase/server";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createClient();
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

    const { provider, cup_id } = await req.json();

    if (!provider || !cup_id) {
        return NextResponse.json("Missing data", { status: 400 });
    }

    const { error } = await pgsql
            .delete(schema.scraped_warehouses)
            .where(sql`provider = ${provider} AND cup_id = ${cup_id}`)
            .then(() => ({ error: null }))
            .catch((e) => ({ error: e }));
            

    if (error) {
        return NextResponse.json(error.message, { status: 500 });
    }

    return NextResponse.json("Success", { status: 200 })
}