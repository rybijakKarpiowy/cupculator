import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { auth_id, user_id, role } = await req.json() as { auth_id: string, user_id: string, role: "Admin"|"Salesman" };
    
    const { data: roleData, error: error1 } = await supabase.from("users_restricted").select("role").eq("user_id", auth_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect("/login");
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect("/");
    }

    const { error: error2 } = await supabase.from("users_restricted").update({ role }).eq("user_id", user_id);

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    return NextResponse.json({ message: "Role changed successfully" }, { status: 200 });
}