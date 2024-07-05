import { Database } from "@/database/types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { Cup } from "../updatecups/route";
import { pgsql } from "@/database/pgsql";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createRouteHandlerClient<Database>({ cookies })
    let auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    const { user_id, cupLink, key } = (await req.json()) as {
        user_id: string;
        cupLink: string;
        key: string;
    };

    // this is user or anonymous person
    if (!auth_id) {
        if (key !== process.env.SERVER_KEY) {
            // anonymous person is trying to get user data
            return NextResponse.redirect(new URL("/login", baseUrl));
        }
        auth_id = user_id;
    }

    const { data: roleData, error: error0 } = await pgsql.query.users_restricted
        .findMany({
            where: (users_restricted, { eq }) => eq(users_restricted.user_id, auth_id!),
            columns: {
                role: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));
    if (error0) {
        return NextResponse.json(error0.message, { status: 500 });
    }

    if (!roleData || roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User" && auth_id !== user_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    // Admins and salesmen with any user_id or users with their own user_id
    // get user data
    const { data: user, error: error1 } = await pgsql.query.users_restricted
        .findFirst({
            where: (users_restricted, { eq }) => eq(users_restricted.user_id, user_id),
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error1) {
        console.log(error1, "error1");
        return NextResponse.json(error1.message, { status: 500 });
    }
    if (!user) {
        console.log("user is null");
        return NextResponse.json("user is null", { status: 500 });
    }
    if (!user.cup_pricing || !user.color_pricing) {
        console.log("user.cup_pricing or user.color_pricing is null");
        return NextResponse.json("user.cup_pricing or user.color_pricing is null", { status: 500 });
    }

    // get cups (it is one cup in multiple color variants) and its pricings
    const { data: cupDataRaw, error: error2 } = await pgsql.query.cups
        .findMany({
            where: (cups, { eq }) => eq(cups.link, cupLink),
            with: {
                cup_pricings: {
                    columns: {
                        cup_id: false,
                        id: false,
                    },
                },
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error2) {
        console.log(error2, "error2");
        return NextResponse.json(error2.message, { status: 500 });
    }
    if (!cupDataRaw || cupDataRaw.length === 0) {
        console.log("cupDataRaw is null or empty");
        return NextResponse.json("cupDataRaw is null or empty", { status: 500 });
    }

    // leave only one cup pricing per cup
    const cupData = cupDataRaw.map((cup) => {
        const cupPricingsRaw = cup.cup_pricings;
        const cupPricingsFiltered = cupPricingsRaw.filter((cupPricing) => {
            return cupPricing.pricing_name === user.cup_pricing;
        });

        const { cup_pricings, ...rest } = cup;
        if (cupPricingsFiltered.length === 0) {
            return {
                ...rest,
                prices: {
                    price_24: 0,
                    price_72: 0,
                    price_108: 0,
                    price_216: 0,
                    price_504: 0,
                    price_1008: 0,
                    price_2520: 0,
                },
            } as Cup;
        }

        const { pricing_name, ...cupPricing } = cupPricingsFiltered[0];
        return {
            ...rest,
            prices: cupPricing,
        } as Cup;
    });

    // get color pricing
    const { data: colorPricing, error: error4 } = await pgsql.query.color_pricings
        .findFirst({
            where: (color_pricings, { eq }) =>
                eq(color_pricings.pricing_name, user.color_pricing || ""),
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }))
        .catch((error) => ({ data: null, error }));
    if (error4) {
        console.log(error4, "error4");
        return NextResponse.json(error4.message, { status: 500 });
    }
    if (!colorPricing) {
        console.log("colorPricing is null");
        return NextResponse.json("colorPricing is null", { status: 500 });
    }

    return NextResponse.json(
        {
            cupData,
            colorPricing,
        },
        { status: 200 }
    );
};
