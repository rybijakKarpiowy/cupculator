import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/middleware";

export const POST = async (req: NextRequest) => {
    const { auth_id, user_id, cup_pricing, color_pricing } = await req.json() as { auth_id: string, user_id: string, cup_pricing: string, color_pricing: string };
    
    const { data: roleData, error: error1 } = await supabase.from("users_restricted").select("role").eq("user_id", auth_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const { error: error2 } = await supabase.from("users_restricted").update({ cup_pricing, color_pricing, activated: true }).eq("user_id", user_id);
    // console.log(error2)

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
}