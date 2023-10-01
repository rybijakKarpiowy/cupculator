import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import * as schema from "@/database/schema";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const data = (await req.json()) as {
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
    };

    if (
        !data ||
        !data.email ||
        !data.first_name ||
        !data.last_name ||
        !data.company_name ||
        !data.country ||
        !data.adress ||
        !data.postal_code ||
        !data.city ||
        !data.phone ||
        !data.NIP
    ) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { error } = await pgsql
        .insert(schema.users)
        .values({
            user_id: auth_id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            company_name: data.company_name,
            country: data.country,
            region: data.region,
            adress: data.adress,
            postal_code: data.postal_code,
            city: data.city,
            phone: data.phone,
            NIP: data.NIP,
            eu: data.eu,
        })
        .onConflictDoUpdate({
            target: schema.users.user_id,
            set: {
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                company_name: data.company_name,
                country: data.country,
                region: data.region,
                adress: data.adress,
                postal_code: data.postal_code,
                city: data.city,
                phone: data.phone,
                NIP: data.NIP,
                eu: data.eu,
            },
        })
        .then(() => ({ error: null }))
        .catch((error) => ({ error }));

    if (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 });
    }

    return NextResponse.json("Success", { status: 200 });
};
