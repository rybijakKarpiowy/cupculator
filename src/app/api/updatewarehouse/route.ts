import { supabase } from "@/database/supabase";
import { getICLWarehouse } from "@/lib/scrapers/getICLWarehouse";
import { getQBSWarehouse } from "@/lib/scrapers/getQBSWarehouse";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const { data: warehouseData, error: error1 } = await supabase
        .from("scraped_warehouses")
        .select("provider, code_link, cup_id, updated_at")
        .order("updated_at", { ascending: false });
    if (error1) {
        console.log(error1);
        return NextResponse.json(error1.message, { status: 500 });
    }
    if (warehouseData.length === 0 || !warehouseData) {
        return NextResponse.json("Brak danych", { status: 500 });
    }
    // if latest update was less than 5 minutes ago, return 304
    const diffInMinutes =
        Math.round(
            ((new Date().getTime() - new Date(warehouseData[0].updated_at).getTime()) / 60000) * 100
        ) / 100;
    if (diffInMinutes < 5) {
        return NextResponse.json("Ostatnio odnowiono mniej niż 5 minut temu", { status: 304 });
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

    const allCupsData = [...ICLdata, ...QBSdata];

    const { error: error2 } = await supabase.from("scraped_warehouses").upsert(allCupsData, {
        onConflict: "provider, code_link",
        ignoreDuplicates: false,
    });
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
