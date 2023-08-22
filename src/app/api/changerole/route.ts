import { supabase } from "@/database/supabase";
import { Database } from "@/database/types";
import { baseUrl } from "@/middleware";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({req, res});
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { user_id, role } = await req.json() as { auth_id: string, user_id: string, role: "Admin"|"Salesman" };
    
    const { data: roleData, error: error1 } = await supabase.from("users_restricted").select("role").eq("user_id", auth_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User" || roleData[0].role == "Salesman") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const { error: error2 } = await supabase.from("users_restricted").update({ role }).eq("user_id", user_id);

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    return NextResponse.json({ message: "Role changed successfully" }, { status: 200 });
}