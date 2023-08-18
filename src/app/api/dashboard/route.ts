import { supabase } from "@/database/supabase";
import { baseUrl } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { user_id } = await req.json();
    
    const { data: roleData, error: error1 } = await supabase.from("users_restricted").select("role").eq("user_id", user_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const { data: usersInfo, error: error2 } = await supabase.from("users").select("*")


    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    const { data: usersRestricted, error: error3 } = await supabase.from("users_restricted").select("*")

    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    const users = usersInfo?.map((user) => {
        const restricted = usersRestricted?.find((restricted) => restricted.user_id === user.user_id);
        return {
            ...user,
            ...restricted,
        };
    });

    const clients = users?.filter((user) => user.role === "User");
    const adminsAndSalesmen = users?.filter(
        (user) => user.role === "Admin" || user.role === "Salesman" // consider getting data from endpoint with service key
    );

    const userInfo = users?.find((user) => user.user_id === user_id);
    
    if (roleData[0].role == "Admin") {
        return NextResponse.json({ clients, adminsAndSalesmen, userInfo });
    }

    if (roleData[0].role == "Salesman") {
        return NextResponse.json({ clients, userInfo });
    }
};
