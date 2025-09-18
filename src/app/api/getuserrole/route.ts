import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { createClient } from "@/database/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const clientSupabase = createClient();
    const auth_id = (await clientSupabase.auth.getUser()).data.user?.id

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { data, error } = await pgsql.query.users
        .findFirst({
            where: (users, { eq }) => eq(users.user_id, auth_id),
            with: {
                users_restricted: {
                    columns: {
                        role: true,
                    },
                },
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error || !data) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }

    const reorganizedData = {
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
        role: data.users_restricted.role,
        user_id: data.user_id,
    };

    if (!reorganizedData.role) {
        console.log("No users_restricted entry");
        return NextResponse.redirect(new URL(`/account/details`, baseUrl));
    }

    if (reorganizedData.role === "User") {
        for (const key in data) {
            // @ts-ignore
            if (data[key] === null || data[key] === undefined || data[key] === "") {
                if (key === "region") {
                    continue;
                }
                console.log("Missing data");
                return NextResponse.redirect(new URL(`/account/details`, baseUrl));
            }
        }
    }

    return NextResponse.json(reorganizedData, { status: 200 });
};
