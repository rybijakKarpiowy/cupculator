import { pgsql } from "@/database/pgsql";
import { getICLWarehouse } from "@/lib/scrapers/getICLWarehouse";
import { getQBSWarehouse } from "@/lib/scrapers/getQBSWarehouse";
import { NextRequest, NextResponse } from "next/server";
import * as schema from "@/database/schema";
import { sql } from "drizzle-orm";

export const GET = async (req: NextRequest) => {
    const { data: warehouseData, error: error1 } = await pgsql.query.scraped_warehouses
        .findMany({
            columns: {
                provider: true,
                code_link: true,
                cup_id: true,
                updated_at: true,
            },
            orderBy: (scraped_warehouses, { desc }) => [desc(scraped_warehouses.updated_at)],
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ error, data: null }));
    if (error1) {
        console.log(error1);
        return NextResponse.json(error1.message, { status: 500 });
    }
    if (warehouseData!.length === 0 || !warehouseData) {
        return NextResponse.json("Brak danych", { status: 500 });
    }
    // if latest update was less than 5 minutes ago, return 409
    const diffInMinutes =
        Math.round(
            ((new Date().getTime() - new Date(warehouseData[0].updated_at).getTime()) / 60000) * 100
        ) / 100;
    if (diffInMinutes < 5) {
        return NextResponse.json("Magazyn był aktualizowany mniej niż 5 minut temu", {
            status: 409,
        });
    }

    const ICLCups = warehouseData
        .filter((cup: WarehouseCup) => cup.provider === "ICL")
        .map((cup: WarehouseCup) => {
            return { cup_id: cup.cup_id, link: cup.code_link };
        });
    const QBSCups = warehouseData
        .filter((cup: WarehouseCup) => cup.provider === "QBS")
        .map((cup: WarehouseCup) => {
            return { cup_id: cup.cup_id, code: cup.code_link };
        });

    const { data: ICLdata, error: ICLErrorLinks } = await getICLWarehouse(ICLCups);
    const { data: QBSdata, error: QBSErrorPages } = await getQBSWarehouse(QBSCups);

    const allCupsData = [
        ...(ICLdata.filter((item) => typeof item.amount === "number") as {
            provider: string;
            code_link: string;
            cup_id: number;
            updated_at: string;
            amount: number;
        }[]),
        ...(QBSdata.filter((item) => typeof item.amount === "number") as {
            provider: string;
            code_link: string;
            cup_id: number;
            updated_at: string;
            amount: number;
        }[]),
    ];

    const { error: error2 } = await pgsql
        .insert(schema.scraped_warehouses)
        .values(allCupsData)
        .onConflictDoUpdate({
            target: [schema.scraped_warehouses.provider, schema.scraped_warehouses.code_link],
            set: {
                cup_id: sql`EXCLUDED.cup_id`,
                updated_at: sql`EXCLUDED.updated_at`,
                amount: sql`EXCLUDED.amount`,
            },
        })
        .returning()
        .then(() => ({ error: null }))
        .catch((error) => ({ error }));
    if (error2) {
        console.log(error2);
        return NextResponse.json(error2.message, { status: 500 });
    }

    return NextResponse.json({ ICLErrorLinks, QBSErrorPages }, { status: 200 });
};

export interface WarehouseCup {
    provider: string;
    code_link: string;
    cup_id: number;
    updated_at: string;
}
