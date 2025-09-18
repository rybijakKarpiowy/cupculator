import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { NextRequest, NextResponse } from "next/server";
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

    if (roleData[0].role == "User") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const data = (await req.json()) as {
        user_id: string;
        eu: boolean;
        first_name: string;
        last_name: string;
        company_name: string;
        adress: string;
        postal_code: string;
        city: string;
        region: string;
        phone: string;
        NIP: string;
        country: string;
        email: string;
    };

    const {
        user_id,
        eu,
        first_name,
        last_name,
        company_name,
        adress,
        postal_code,
        city,
        region,
        phone,
        NIP,
        country,
        email,
    } = data;

    if (
        !user_id ||
        eu === undefined ||
        !first_name ||
        !last_name ||
        !company_name ||
        !adress ||
        !postal_code ||
        !city ||
        !phone ||
        !NIP ||
        !country ||
        !email
    ) {
        return NextResponse.json("Missing data", { status: 400 });
    }

    const { error } = await pgsql
        .update(schema.users)
        .set({
            eu,
            first_name,
            last_name,
            company_name,
            adress,
            postal_code,
            city,
            region,
            phone,
            NIP,
            country,
            email,
        })
        .where(eq(schema.users.user_id, user_id))
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error) {
        console.error(error);
        return NextResponse.json(error.message, { status: 500 });
    }

    return NextResponse.json("Success", { status: 200 });
};
