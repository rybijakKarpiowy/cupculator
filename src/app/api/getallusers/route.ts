import { supabase } from "@/database/supabase";
import { baseUrl } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { authId } = (await req.json()) as {
        authId: string;
    };

    const { data: roleData, error: error1 } = await supabase
        .from("users_restricted")
        .select("role")
        .eq("user_id", authId);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    // If the user is an admin or a salesman
    const { data: allUsersDataRaw, error: error2 } = await supabase
        .from("users")
        .select("*, users_restricted(*)");
    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    const allUsersData = allUsersDataRaw
        .map((user) => {
            // Filter out the admins and salesmen
            // @ts-ignore
            // if (user.users_restricted.role !== "User") {
            //     return null;
            // } UNCOMMENT THIS
            // Filter out unactivated users
            // @ts-ignore
            if (user.users_restricted.activated === false) {
                return null;
            }

            const { users_restricted, ...rest } = user;
            return {
                ...rest,
                // @ts-ignore
                cup_pricing: users_restricted.cup_pricing,
                // @ts-ignore
                color_pricing: users_restricted.color_pricing,
            };
        })
        .filter((user) => user !== null);

    return NextResponse.json(allUsersData, { status: 200 });
};
