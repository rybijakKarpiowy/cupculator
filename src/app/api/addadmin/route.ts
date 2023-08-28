import { supabase } from "@/database/supabase";
import { Database } from "@/database/types";
import { baseUrl } from "@/app/page";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { email, password, role } = (await req.json()) as {
        auth_id: string;
        email: string;
        password: string;
        role: "Admin" | "Salesman";
    };

    const { data: roleData, error: error1 } = await supabase
        .from("users_restricted")
        .select("role")
        .eq("user_id", auth_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User" || roleData[0].role == "Salesman") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const { data: userData, error: error2 } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: new URL("/", baseUrl).toString(),
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

    const { error: error3 } = await supabase.from("users").upsert({
        adress: "",
        city: "",
        company_name: "",
        country: "",
        email,
        eu: false,
        first_name: "",
        last_name: "",
        NIP: "",
        phone: "",
        postal_code: "",
        region: "",
        user_id,
    });

    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    const { error: error4 } = await supabase.from("users_restricted").upsert({
        user_id,
        role,
        activated: true,
    });

    if (error4) {
        return NextResponse.json(error4.message, { status: 500 });
    }

    return NextResponse.json({ message: "Success" }, { status: 201 });
};
