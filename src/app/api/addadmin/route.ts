import { supabase } from "@/database/supabase";
import { Database } from "@/database/types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import * as schema from "@/database/schema";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createRouteHandlerClient<Database>({ cookies })
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { email, password, role } = (await req.json()) as {
        email: string;
        password: string;
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

    const { data: userData, error: error2 } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: new URL("/", baseUrl).href,
        },
    });

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    const user_id = userData?.user?.id;
    console.log(user_id);

    if (!user_id) {
        return NextResponse.json("User ID not found", { status: 500 });
    }

    const { error: error3 } = await pgsql
        .insert(schema.users)
        .values({
            adress: "",
            city: "",
            company_name: "",
            country: "",
            email,
            eu: false,
            first_name: "",
            last_name: "",
            phone: "",
            postal_code: "",
            region: "",
            user_id,
            NIP: "",
        })
        .onConflictDoNothing({ target: schema.users.user_id })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    const { error: error4 } = await pgsql
        .insert(schema.users_restricted)
        .values({
            user_id,
            role,
            activated: true,
        })
        .onConflictDoUpdate({
            target: schema.users_restricted.user_id,
            set: {
                role,
                activated: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error4) {
        return NextResponse.json(error4.message, { status: 500 });
    }

    return NextResponse.json({ message: "Success" }, { status: 201 });
};
