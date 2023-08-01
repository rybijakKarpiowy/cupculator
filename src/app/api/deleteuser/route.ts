import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { auth_id, user_id } = (await req.json()) as {
        auth_id: string;
        user_id: string;
    };

    const { data: roleData, error: error1 } = await supabase
        .from("users_restricted")
        .select("role")
        .eq("user_id", auth_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect("/login");
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect("/");
    }

    const { error: error2 } = await supabase
        .from("users_restricted")
        .delete()
        .eq("user_id", user_id);
    const { error: error3 } = await supabase.from("users").delete().eq("user_id", user_id);

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    const { error: error4 } = await supabase.auth.admin.deleteUser(user_id);

    if (error4) {
        return NextResponse.json(error4.message, { status: 500 });
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 })
};
