import { baseUrl } from "@/app/baseUrl";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import * as mssql from "mssql";
import { pgsql } from "@/database/pgsql";

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

    const { data: user, error } = await pgsql.query.users_restricted
        .findFirst({
            where: (users_restricted, { eq }) => eq(users_restricted.user_id, auth_id),
            columns: {
                role: true,
                warehouse_acces: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

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

    const { data: scrapedStock, error: error1 } = await pgsql.query.cups
        .findFirst({
            where: (cups, { eq }) => eq(cups.code, code),
            columns: {
                code: true,
            },
            with: {
                scraped_warehouses: {
                    columns: {
                        provider: true,
                        updated_at: true,
                        amount: true,
                    },
                },
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ error, data: null }));

    if (!scrapedStock || error1) {
        console.log(error1);
        return NextResponse.json({}, { status: 500 });
    }

    const ICLstockRaw = scrapedStock.scraped_warehouses.find(
        (warehouse) => warehouse.provider === "ICL"
    );
    const ICLstock = ICLstockRaw
        ? {
              amount: Math.max(ICLstockRaw.amount, 0),
              updated_at: ICLstockRaw.updated_at,
          }
        : null;

    const QBSstockRaw = scrapedStock.scraped_warehouses.find(
        (warehouse) => warehouse.provider === "QBS"
    );
    const QBSstock = QBSstockRaw
        ? {
              amount: Math.max(QBSstockRaw.amount, 0),
              updated_at: QBSstockRaw.updated_at,
          }
        : null;

    // fetch data from warehouse db
    const connectionConfig = {
        server: process.env.LOMAG_IP!,
        port: parseInt(process.env.LOMAG_PORT!)!,
        user: process.env.LOMAG_USERNAME!,
        password: process.env.LOMAG_PASSWORD!,
        database: "ProMedia",
        pool: {
            min: 5,
            max: 50,
            idleTimeoutMillis: 30000,
        },
        options: {
            encrypt: false,
        },
    };

    await mssql.connect(connectionConfig);
    const warehouseRaw: { warehouseId: number; message: string; amount: number }[] =
        await mssql.query`SELECT IDMagazynu as warehouseId, _TowarTempString1 as message, _TowarTempExpression1 as amount FROM ProMedia.dbo.Towar WHERE IDMagazynu IN (14, 19) AND _TowarTempString6 = ${code}` // change 19 to actual warehouse id
            .then((result) => {
                return result.recordset;
            })
            .catch((err) => {
                console.log(err);
                return [];
            });

    const actualStockRaw = warehouseRaw
        .filter((warehouse) => warehouse.warehouseId === 14)
        .reduce(
            (prev, curr) => {
                return {
                    amount: prev.amount + curr.amount,
                    note: prev.note + curr.message,
                };
            },
            { amount: 0, note: "" }
        );
    const actualStock = { amount: Math.max(actualStockRaw.amount, 0), note: actualStockRaw.note };

    const fictionalStockRaw = warehouseRaw
        .filter((warehouse) => warehouse.warehouseId === 19) // change 19 to actual warehouse id
        .reduce(
            (prev, curr) => {
                return {
                    amount: prev.amount + curr.amount,
                };
            },
            { amount: 0 }
        );
    const fictionalStock = { amount: Math.max(fictionalStockRaw.amount, 0) };

    if (user.role === "Admin" || user.role === "Salesman") {
        return NextResponse.json(
            {
                divided: {
                    ...(ICLstock && {
                        ICL: {
                            amount: ICLstock.amount,
                            updated_at: new Date(ICLstock.updated_at).toLocaleString("pl-PL", {
                                timeZone: "Europe/Warsaw",
                            }),
                        },
                    }),
                    ...(QBSstock && {
                        QBS: {
                            amount: QBSstock.amount,
                            updated_at: new Date(QBSstock.updated_at).toLocaleString("pl-PL", {
                                timeZone: "Europe/Warsaw",
                            }),
                        },
                    }),
                    ...(actualStock && {
                        warehouse: { amount: actualStock.amount, note: actualStock.note },
                    }),
                    total:
                        (ICLstock?.amount || 0) +
                        (QBSstock?.amount || 0) +
                        (actualStock?.amount || 0),
                },
            },
            { status: 200 }
        );
    }

    // here user.role === "User"
    if (user.warehouse_acces === "Actual") {
        return NextResponse.json(
            {
                sum: (ICLstock?.amount || 0) + (QBSstock?.amount || 0) + (actualStock?.amount || 0),
            },
            { status: 200 }
        );
    }

    if (user.warehouse_acces === "Fictional") {
        return NextResponse.json(
            {
                sum:
                    (ICLstock?.amount || 0) +
                    (QBSstock?.amount || 0) +
                    (actualStock?.amount || 0) +
                    (fictionalStock?.amount || 0),
            },
            { status: 200 }
        );
    }
};
