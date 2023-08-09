import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export const POST = async (req: NextRequest) => {
    const { auth_id, pricing_name, sheet_url } = (await req.json()) as {
        auth_id: string;
        pricing_name: string;
        sheet_url: string;
    };

    const { data: roleData, error: error1 } = await supabase
        .from("users_restricted")
        .select("role")
        .eq("user_id", auth_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect("/login");
    }

    if (roleData[0].role == "User" || roleData[0].role == "Salesman") {
        return NextResponse.redirect("/");
    }

    const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    const jwt = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY,
        scopes,
    });

    const id = sheet_url.split("/")[5];
    const gid = parseInt(sheet_url.split("gid=")[1].split("?")[0] as string);

    const doc = new GoogleSpreadsheet(id, jwt);
    await doc.loadInfo().catch((err) => {
        const statusCode = err.response.data.error.code;

        if (statusCode === 404) {
            return NextResponse.json("Nie znaleziono arkusza", { status: 404 });
        }

        if (statusCode === 403) {
            return NextResponse.json("Serwer nie ma uprawnień do wglądu arkusza", { status: 403 });
        }

        return NextResponse.json(err.response.data.error.message, { status: 500 });
    });

    const sheet = doc.sheetsById[gid];
    // i'm getting the sheet here yayy (keep in mind that gapi email has to be authorised in sheet)

    const transfer_plus_raw = await sheet.getCellsInRange("B6:Y12");
    const polylux_raw = await sheet.getCellsInRange("B17:Y23");
    const direct_print_raw = await sheet.getCellsInRange("B28:K31");
    const trend_color_raw = await sheet.getCellsInRange("B36:K37");
    const pro_color_raw = await sheet.getCellsInRange("B42:K43");
    const deep_effect_raw = await sheet.getCellsInRange("B48:K49");
    const digital_print_raw = await sheet.getCellsInRange("B54:K54");
    const cardboard_print_raw = await sheet.getCellsInRange("B59:K60");
    const soft_touch_raw = await sheet.getCellsInRange("B65:K65");
    const deep_effect_plus_raw = await sheet.getCellsInRange("B70:K71");
    const trend_color_lowered_edge_raw = await sheet.getCellsInRange("B76:K76");
    const additional_costs_raw = await sheet.getCellsInRange("N26:U42");
    const cardboards_raw = await sheet.getCellsInRange("N50:Y54");


    console.log(additional_costs_raw)
    console.log(cardboards_raw)
    // handle raw data here
}