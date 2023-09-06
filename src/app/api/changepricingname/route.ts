import { supabase } from "@/database/supabase";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = (
    process.env.PROD === "true"
        ? "https://cupculator.vercel.app"
        : process.env.DEV === "true"
        ? "https://cupculator-rybijakkarpiowy.vercel.app"
        : "http://localhost:3000"
) as string;

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { pricing_name, new_pricing_name, cups_or_colors } = (await req.json()) as {
        pricing_name: string;
        new_pricing_name: string;
        cups_or_colors: "cups" | "colors";
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

    if (cups_or_colors === "cups") {
        const { error: error2 } = await supabase
            .from("cup_pricings")
            .update({ pricing_name: new_pricing_name })
            .eq("pricing_name", pricing_name);
        if (error2) {
            return NextResponse.json(error2.message, { status: 500 });
        }
        const { error: error3 } = await supabase
            .from("users_restricted")
            .update({ cup_pricing: new_pricing_name })
            .eq("cup_pricing", pricing_name);
        if (error3) {
            return NextResponse.json(error3.message, { status: 500 });
        }
    } else if (cups_or_colors === "colors") {
        const { error: error2 } = await supabase
            .from("color_pricings")
            .update({ pricing_name: new_pricing_name })
            .eq("pricing_name", pricing_name);
        if (error2) {
            return NextResponse.json(error2.message, { status: 500 });
        }
        const { error: error3 } = await supabase
            .from("users_restricted")
            .update({ color_pricing: new_pricing_name })
            .eq("color_pricing", pricing_name);
        if (error3) {
            return NextResponse.json(error3.message, { status: 500 });
        }
    } else {
        return NextResponse.json({ status: 400 });
    }

    return NextResponse.json({ status: 200 });
};
