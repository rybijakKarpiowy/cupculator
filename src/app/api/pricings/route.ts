import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { user_id } = await req.json();
    
    const { data: roleData, error: error1 } = await supabase.from("users_restricted").select("role").eq("user_id", user_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect("/login");
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect("/");
    }

    const { data: available_cup_pricings, error: error2 } = await supabase.from("cup_pricings").select("DISTINCT pricing").order("pricing", { ascending: true });

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    const { data: available_color_pricings, error: error3 } = await supabase.from("color_pricings").select("DISTINCT pricing").order("pricing", { ascending: true });

    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    return NextResponse.json({ available_cup_pricings, available_color_pricings }, { status: 200 });
}