import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { pricing_name, new_pricing_name, cups_or_colors } = (await req.json()) as {
        pricing_name: string;
        new_pricing_name: string;
        cups_or_colors: "cups" | "colors";
    };

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

    if (roleData[0].role == "User" || roleData[0].role == "Salesman") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    if (cups_or_colors === "cups") {
        const error2 = await pgsql
            .update(schema.cup_pricings)
            .set({ pricing_name: new_pricing_name })
            .where(eq(schema.cup_pricings.pricing_name, pricing_name))
            .catch((e) => e);
        if (error2) {
            return NextResponse.json("Error during updating pricing name", { status: 500 });
        }
        const { error: error3 } = await pgsql
            .update(schema.users_restricted)
            .set({
                cup_pricing: new_pricing_name,
            })
            .where(eq(schema.users_restricted.cup_pricing, pricing_name))
            .then(() => ({ error: null }))
            .catch((error) => ({ error }));
        if (error3) {
            return NextResponse.json(error3.message, { status: 500 });
        }
    } else if (cups_or_colors === "colors") {
        const error2 = await pgsql
            .update(schema.color_pricings)
            .set({ pricing_name: new_pricing_name })
            .where(eq(schema.color_pricings.pricing_name, pricing_name))
            .catch((e) => e);
        if (error2) {
            return NextResponse.json("Error during updating pricing name", { status: 500 });
        }
        const { error: error3 } = await pgsql
            .update(schema.users_restricted)
            .set({
                color_pricing: new_pricing_name,
            })
            .where(eq(schema.users_restricted.color_pricing, pricing_name))
            .then(() => ({ error: null }))
            .catch((error) => ({ error }));
        if (error3) {
            return NextResponse.json(error3.message, { status: 500 });
        }
    } else {
        return NextResponse.json({ status: 400 });
    }

    return NextResponse.json({ status: 200 });
};
