import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { colorSheetParser } from "@/lib/colorSheetParser";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const baseUrl = (
    process.env.PROD === "true"
        ? "https://cupculator.vercel.app"
        : process.env.DEV === "true"
        ? "https://cupculator-rybijakkarpiowy.vercel.app"
        : "http://localhost:3000"
) as string;

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { pricing_name, sheet_url } = (await req.json()) as {
        auth_id: string;
        pricing_name: string;
        sheet_url: string;
    };

    const { data: roleData, error: error1 } = await supabase
        .from("users_restricted")
        .select("role")
        .eq("user_id", auth_id);

    if (error1) {
        console.log(error1);
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User" || roleData[0].role == "Salesman") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    const jwt = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        scopes,
    });

    const id = sheet_url.split("/")[5];
    const gid = parseInt(sheet_url.split("gid=")[1].split("?")[0] as string);

    const doc = new GoogleSpreadsheet(id, jwt);
    await doc.loadInfo().catch((err) => {
        console.log(err);
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

    try {
        // parse sheet
        const sheetDataParsed = await colorSheetParser(sheet);

        // upsert to db
        const { error: error2 } = await supabase
            .from("color_pricings")
            .upsert(
                { ...sheetDataParsed, pricing_name },
                { onConflict: "pricing_name", ignoreDuplicates: false }
            );

        if (error2) {
            console.log(error2);
            return NextResponse.json(error2.message, { status: 500 });
        }

        return NextResponse.json("Pomyślnie zaktualizowano cennik", { status: 200 });

        // handle parser function errors
    } catch (err) {
        console.log(err);
        return NextResponse.json(err, { status: 500 });
    }
};
