import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { baseUrl } from "@/app/baseUrl";

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

    const offset = 3; // number of rows to omit

    const rows = await sheet.getRows();
    // @ts-ignore
    const rawData = rows.slice(offset - 1).map((row) => row._rawData) as string[][];

    let allCodes = [] as string[];
    let incompleteCups = [] as string[];
    let cupsWithoutPrices = [] as string[];
    let lastCellEmpty = [] as string[];
    const preparedData = rawData
        .map((row, i) => {
            const rowId = `${i + offset + 1}`;
            if (row.length < 32) {
                lastCellEmpty.push(rowId);
                return null;
            }
            const obj = {
                code: row[0].replace(" ", ""),
                name: row[1],
                color: row[2],
                link: row[3].trim(),
                material: row[4],
                category: row[5].replace(" ", ""),
                icon: row[6],
                volume: row[7],
                prices: {
                    price_24: parseFloat(row[10].replace("zł", "").trim().replace(",", ".")),
                    price_72: parseFloat(row[11].replace("zł", "").trim().replace(",", ".")),
                    price_108: parseFloat(row[12].replace("zł", "").trim().replace(",", ".")),
                    price_216: parseFloat(row[13].replace("zł", "").trim().replace(",", ".")),
                    price_504: parseFloat(row[14].replace("zł", "").trim().replace(",", ".")),
                    price_1008: parseFloat(row[15].replace("zł", "").trim().replace(",", ".")),
                    price_2520: parseFloat(row[16].replace("zł", "").trim().replace(",", ".")),
                },
            };

            if (!obj.code && !obj.name && !obj.link) {
                // cup is not meant to be in this row (and it's not)
                return null;
            }

            // collect cups' codes
            if (obj.code) {
                allCodes.push(obj.code);
            }

            // check if the row that's supposed to be a cup is not missing any attributes
            if (
                !obj.code ||
                !obj.name ||
                !obj.color ||
                !obj.link ||
                !obj.material ||
                !obj.category ||
                !obj.volume
            ) {
                incompleteCups.push(rowId);
                return null;
            }

            // check if cup has all prices
            if (
                !obj.prices.price_24 ||
                !obj.prices.price_72 ||
                !obj.prices.price_108 ||
                !obj.prices.price_216 ||
                !obj.prices.price_504 ||
                !obj.prices.price_1008 ||
                !obj.prices.price_2520
            ) {
                cupsWithoutPrices.push(rowId);
                // if not - set all prices to 0
                obj.prices = {
                    price_24: 0,
                    price_72: 0,
                    price_108: 0,
                    price_216: 0,
                    price_504: 0,
                    price_1008: 0,
                    price_2520: 0,
                };
            }

            // if some of the attributes are null, remove them from the object
            Object.keys(obj).forEach((key) => {
                // @ts-ignore
                if (obj[key] === null) {
                    // @ts-ignore
                    delete obj[key];
                }
            });

            return obj;
        })
        // remove rows that are not cups
        .filter((row) => row !== null);

    if (preparedData.length === 0) {
        return NextResponse.json(
            {
                message: "No cups found in the sheet",
                incompleteCups,
                cupsWithoutPrices,
                lastCellEmpty,
            },
            { status: 200 }
        );
    }

    const encounteredCodes = new Set(allCodes.map((code) => code));
    if (encounteredCodes.size !== allCodes.length) {
        const codesDict = {} as { [key: string]: number };
        allCodes.forEach((code) => {
            if (codesDict[code]) {
                codesDict[code] += 1;
            } else {
                codesDict[code] = 1;
            }
        });
        const duplicateCodes = Object.keys(codesDict).filter((code) => codesDict[code] > 1);
        return NextResponse.json(
            {
                message: "Some of the cups have duplicate codes",
                duplicateCodes,
            },
            { status: 400 }
        );
    }

    const cupData = preparedData.map((row) => {
        const { prices, ...rest } = row!;
        return rest;
    });

    // upsert cups from sheet and get their ids
    const { data: dbCupIds, error: error2 } = await supabase
        .from("cups")
        .upsert(cupData, {
            onConflict: "code",
            ignoreDuplicates: false,
        })
        .select("id, code");
    if (error2) {
        console.error(error2);
        return NextResponse.json(error2.message, { status: 500 });
    }

    const sheetCupIds = preparedData
        .map((row) => {
            const { code } = row!;
            const dbCupId = dbCupIds.find((cup) => cup.code === code)?.id;
            return dbCupId;
        })
        .filter((id) => id !== undefined) as number[];

    // delete all cup pricings that are not in the sheet
    const { error: error3 } = await supabase
        .from("cup_pricings")
        .delete()
        .match({ pricing_name })
        .not("cup_id", "in", `(${sheetCupIds.join(",")})`);

    if (error3) {
        console.error(error3);
        return NextResponse.json(error3.message, { status: 500 });
    }

    // update all cup pricings that are in the sheet
    const cupPricingsData = preparedData.map((row) => {
        const { code, prices } = row!;
        const dbCupId = dbCupIds.find((cup) => cup.code === code)?.id as number;
        return {
            cup_id: dbCupId,
            pricing_name,
            ...prices,
        };
    });

    const { error: error4 } = await supabase.from("cup_pricings").upsert(cupPricingsData, {
        onConflict: "cup_id,pricing_name",
        ignoreDuplicates: false,
    });

    if (error4) {
        console.error(error4);
        return NextResponse.json(error4.message, { status: 500 });
    }

    // if there is a cup which is not in any pricing, delete it from db
    const { data: cupIdsInPricings, error: error5 } = await supabase
        .from("cup_ids_in_pricings")
        .select("cup_id");
    if (error5) {
        console.error(error5);
        return NextResponse.json(error5.message, { status: 500 });
    }
    if (cupIdsInPricings) {
        const cupIdsToDelete = dbCupIds.filter(
            (cup) => !cupIdsInPricings.find((cupId) => cupId.cup_id === cup.id)
        );
        const { error: error6 } = await supabase
            .from("cups")
            .delete()
            .in(
                "id",
                cupIdsToDelete.map((cup) => cup.id)
            );

        if (error6) {
            console.error(error6);
            return NextResponse.json(error6.message, { status: 500 });
        }
    }

    return NextResponse.json({ incompleteCups, cupsWithoutPrices, lastCellEmpty }, { status: 200 });
};

export interface Cup {
    code: string;
    name: string;
    color: string;
    link: string;
    icon: string | null;
    material: string;
    category: string;
    volume: string;
    supplier: string | null;
    supplier_code: string | null;
    mini_pallet?: number;
    half_pallet?: number;
    full_pallet?: number;
    mini_pallet_singular?: number;
    half_pallet_singular?: number;
    full_pallet_singular?: number;
    deep_effect?: boolean;
    deep_effect_plus?: boolean;
    digital_print?: boolean;
    direct_print?: boolean;
    polylux?: boolean;
    transfer_plus?: boolean;
    nadruk_apla?: boolean;
    nadruk_dookola_pod_uchem?: boolean;
    nadruk_na_dnie?: boolean;
    nadruk_na_powloce_magicznej_1_kolor?: boolean;
    nadruk_na_spodzie?: boolean;
    nadruk_na_uchu?: boolean;
    nadruk_przez_rant?: boolean;
    nadruk_wewnatrz_na_sciance?: boolean;
    nadruk_zlotem_do_25cm2?: boolean;
    nadruk_zlotem_do_50cm2?: boolean;
    naklejka_papierowa_z_nadrukiem?: boolean;
    personalizacja?: boolean;
    pro_color?: boolean;
    soft_touch?: boolean;
    trend_color?: boolean;
    trend_color_lowered_edge?: boolean;
    wkladanie_ulotek_do_kubka?: boolean;
    zdobienie_paskiem_bez_laczenia?: boolean;
    zdobienie_paskiem_z_laczeniem?: boolean;
    zdobienie_tapeta_na_barylce_II_stopien_trudnosci?: boolean;
    zdobienie_tapeta_na_barylce_I_stopien_trudnosci?: boolean;
    digital_print_additional?: boolean;
    prices: {
        price_24: number;
        price_72: number;
        price_108: number;
        price_216: number;
        price_504: number;
        price_1008: number;
        price_2520: number;
    };
}
