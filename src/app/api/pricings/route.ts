import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { user_id } = await req.json();

    const { data: roleData, error: error1 } = await supabase
        .from("users_restricted")
        .select("role")
        .eq("user_id", user_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect("/login");
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect("/");
    }

    const { data: cup_data, error: error2 } = await supabase
        .from("available_cup_pricings")
        .select("*")
        .order("pricing_name", { ascending: true });

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    const available_cup_pricings = cup_data.map((obj) => obj.pricing_name);

    const { data: color_data, error: error3 } = await supabase
        .from("available_color_pricings")
        .select("*")
        .order("pricing_name", { ascending: true });

    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    const available_color_pricings = color_data.map((obj) => obj.pricing_name);

    return NextResponse.json({ available_cup_pricings, available_color_pricings }, { status: 200 });
};
