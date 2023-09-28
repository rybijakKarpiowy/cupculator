import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";

export const POST = async (req: NextRequest) => {
    const { auth_id, key } = (await req.json()) as { auth_id?: string; key?: string };

    if (!auth_id || key !== process.env.SERVER_KEY) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { data: roleData, error: error1 } = await supabase
        .from("users_restricted")
        .select("role")
        .eq("user_id", auth_id);

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
            if (user.users_restricted.role !== "User") {
                return null;
            }
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
                // @ts-ignore
                salesman_id: users_restricted.salesman_id,
            };
        })
        .filter((user) => user !== null);

    if (roleData[0].role === "Salesman") {
        // If the user is a salesman, filter out the users that are not assigned to him
        const salesmansUsers = allUsersData.filter((user) => user?.salesman_id === auth_id);
        return NextResponse.json(salesmansUsers, { status: 200 });
    }

    // If the user is an admin, return all users
    return NextResponse.json(allUsersData, { status: 200 });
};
