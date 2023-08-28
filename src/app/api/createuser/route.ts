import { supabase } from "@/database/supabase";
import { Database } from "@/database/types";
import { baseUrl } from "@/app/page";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({req, res});
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { error } = await supabase.from("users_restricted").upsert([{ user_id: auth_id }], { onConflict: "user_id" })

    if (error) {
        return NextResponse.json(error.message, {status: 500})
    }

    return NextResponse.json({status: 201})
}
