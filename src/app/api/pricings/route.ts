import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";

export const POST = async (req: NextRequest) => {
    const { auth_id, key } = (await req.json()) as { auth_id?: string; key?: string };

    if (!auth_id || key !== process.env.SERVER_KEY) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { data: roleData, error: error1 } = await pgsql.query.users_restricted
        .findMany({
            where: (users_restricted, { eq }) => eq(users_restricted.user_id, auth_id),
            columns: {
                role: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (!roleData || roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const { data: cup_data, error: error2 } = await pgsql.query.available_cup_pricings
        .findMany({
            orderBy: (available_cup_pricings, { asc }) => [
                asc(available_cup_pricings.pricing_name),
            ],
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ error, data: null }));

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    const available_cup_pricings = cup_data!.map((obj) => obj.pricing_name);

    const { data: color_data, error: error3 } = await pgsql.query.available_color_pricings
        .findMany({
            orderBy: (available_color_pricings, { asc }) => [
                asc(available_color_pricings.pricing_name),
            ],
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ error, data: null }));

    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    const available_color_pricings = color_data!.map((obj) => obj.pricing_name);

    return NextResponse.json({ available_cup_pricings, available_color_pricings }, { status: 200 });
};
