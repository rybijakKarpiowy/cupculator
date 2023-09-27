import { baseUrl } from "@/app/baseUrl";
import { supabase } from "@/database/supabase";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    const query = req.nextUrl.searchParams;
    const code = query.get("code");

    if (!code) {
        return NextResponse.json({}, { status: 500 });
    }

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { data: user, error } = await supabase
        .from("users_restricted")
        .select("role, warehouse_acces")
        .eq("user_id", auth_id)
        .single();

    if (!user || error) {
        console.log(error);
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (
        user.role === "User" &&
        (user.warehouse_acces === "None" || user.warehouse_acces === null)
    ) {
        return NextResponse.json({}, { status: 401 });
    }

    const { data: scrapedStock, error: error1 } = await supabase
        .from("cups")
        .select("code, scraped_warehouses(provider, updated_at, amount)")
        .eq("code", code)
        .single();

    if (!scrapedStock || error1) {
        console.log(error1);
        return NextResponse.json({}, { status: 500 });
    }

    const ICLstock = scrapedStock.scraped_warehouses.find(
        (warehouse) => warehouse.provider === "ICL"
    );
    const QBSstock = scrapedStock.scraped_warehouses.find(
        (warehouse) => warehouse.provider === "QBS"
    );

    // fetch data from warehouse db
    // const actualStock = ......

    if (user.role === "Admin" || user.role === "Salesman") {
        return NextResponse.json(
            {
                divided: {
                    ...(ICLstock && {
                        ICL: {
                            amount: ICLstock.amount,
                            updated_at: new Date(ICLstock.updated_at).toLocaleString("pl-PL"),
                        },
                    }),
                    ...(QBSstock && {
                        QBS: {
                            amount: QBSstock.amount,
                            updated_at: new Date(QBSstock.updated_at).toLocaleString("pl-PL"),
                        },
                    }),
                    // ...(actualStock && {warehouse: {amount: actualStock.amount, updated_at: new Date(actualStock.updated_at).toLocaleString("pl-PL")}, note: actualStock.note})
                    total: (ICLstock?.amount || 0) + (QBSstock?.amount || 0), // + (actualStock?.amount || 0)
                },
            },
            { status: 200 }
        );
    }

    // here user.role === "User"
    if (user.warehouse_acces === "Actual") {
        return NextResponse.json(
            {
                sum: (ICLstock?.amount || 0) + (QBSstock?.amount || 0), // + (actualStock?.amount || 0)
            },
            { status: 200 }
        );
    }

    // const fictionalStock = .....
    if (user.warehouse_acces === "Fictional") {
        return NextResponse.json(
            {
                sum: (ICLstock?.amount || 0) + (QBSstock?.amount || 0), // + (actualStock?.amount || 0) + (fictionalStock?.amount || 0)
            },
            { status: 200 }
        );
    }
};
