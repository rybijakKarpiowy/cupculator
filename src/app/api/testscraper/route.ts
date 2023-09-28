import { supabase } from "@/database/supabase";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { getICLWarehouse } from "@/lib/scrapers/getICLWarehouse";
import { getQBSWarehouse } from "@/lib/scrapers/getQBSWarehouse";

export const GET = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

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

    const params = req.nextUrl.searchParams;
    const provider = params.get("provider");
    const code_link = params.get("code_link");
    const cup_id = params.get("cup_id");

    if (!provider || !code_link || !cup_id) {
        return NextResponse.json("Missing parameters", { status: 400 });
    }

    if (provider === "ICL") {
        const { data, error } = await getICLWarehouse([
            { cup_id: parseInt(cup_id), link: code_link },
        ]);
        if (error.length > 0 || data.length === 0) {
            return NextResponse.json("Wystąpił błąd", { status: 404 });
        }
        if (data[0].amount === "error") {
            return NextResponse.json("Wystąpił błąd", { status: 404 });
        }
        return NextResponse.json({ amount: data[0].amount }, { status: 200 });
    }

    if (provider === "QBS") {
        const { data, error } = await getQBSWarehouse([
            { cup_id: parseInt(cup_id), code: code_link },
        ]);
        console.log(data, error);
        if (error.length > 0 || data.length === 0) {
            return NextResponse.json("Wystąpił błąd", { status: 404 });
        }
        if (data[0].amount === "error") {
            return NextResponse.json("Wystąpił błąd", { status: 404 });
        }
        return NextResponse.json({ amount: data[0].amount }, { status: 200 });
    }

    return NextResponse.json("Niepoprawny dostawca", { status: 400 });
};
