import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { user_id } = await req.json()

    const { error } = await supabase.from("users_restricted").upsert([{ user_id }], { onConflict: "user_id" })

    if (error) {
        return NextResponse.json(error.message, {status: 500})
    }

    return NextResponse.json({status: 201})
}
