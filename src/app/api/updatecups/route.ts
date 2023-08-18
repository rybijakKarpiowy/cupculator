import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { baseUrl } from "@/middleware";

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
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User" || roleData[0].role == "Salesman") {
        return NextResponse.redirect(new URL("/", baseUrl));
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

    const offset = 3; // number of rows to omit

    const rows = await sheet.getRows();
    // @ts-ignore
    const rawData = rows.slice(offset - 1).map((row) => row._rawData) as string[][];

    let incompleteCups = [] as string[];
    let cupsWithoutPrices = [] as string[];
    let lastCellEmpty = [] as string[];
    const preparedData = rawData
        .map((row, i) => {
            const rowId = `${i + offset + 1}`;
            if (row.length < 63) {
                lastCellEmpty.push(rowId);
                return null;
            }
            const obj = {
                code: row[0],
                name: row[1],
                color: row[2],
                material: row[3],
                category: row[4],
                icon: row[5],
                volume: row[6],
                supplier: row[7],
                supplier_code: row[8],
                mini_pallet: row[31] ? parseInt(row[31]) : null,
                half_pallet: row[32] ? parseInt(row[32]) : null,
                full_pallet: row[33] ? parseInt(row[33]) : null,
                deep_effect: row[35] === "1" ? true : row[35] === "0" ? false : null,
                deep_effect_plus: row[36] === "1" ? true : row[36] === "0" ? false : null,
                digital_print: row[37] === "1" ? true : row[37] === "0" ? false : null,
                direct_print: row[38] === "1" ? true : row[38] === "0" ? false : null,
                polylux: row[39] === "1" ? true : row[39] === "0" ? false : null,
                transfer_plus: row[40] === "1" ? true : row[40] === "0" ? false : null,
                nadruk_apla: row[41] === "1" ? true : row[41] === "0" ? false : null,
                nadruk_dookola_pod_uchem: row[42] === "1" ? true : row[42] === "0" ? false : null,
                nadruk_na_dnie: row[43] === "1" ? true : row[43] === "0" ? false : null,
                nadruk_na_powloce_magicznej_1_kolor:
                    row[44] === "1" ? true : row[44] === "0" ? false : null,
                nadruk_na_spodzie: row[45] === "1" ? true : row[45] === "0" ? false : null,
                nadruk_na_uchu: row[46] === "1" ? true : row[46] === "0" ? false : null,
                nadruk_przez_rant: row[47] === "1" ? true : row[47] === "0" ? false : null,
                nadruk_wewnatrz_na_sciance: row[48] === "1" ? true : row[48] === "0" ? false : null,
                nadruk_zlotem_do_25cm2: row[49] === "1" ? true : row[49] === "0" ? false : null,
                nadruk_zlotem_do_50cm2: row[50] === "1" ? true : row[50] === "0" ? false : null,
                naklejka_papierowa_z_nadrukiem:
                    row[51] === "1" ? true : row[51] === "0" ? false : null,
                personalizacja: row[52] === "1" ? true : row[52] === "0" ? false : null,
                pro_color: row[53] === "1" ? true : row[53] === "0" ? false : null,
                soft_touch: row[54] === "1" ? true : row[54] === "0" ? false : null,
                trend_color: row[55] === "1" ? true : row[55] === "0" ? false : null,
                trend_color_lowered_edge: row[56] === "1" ? true : row[56] === "0" ? false : null,
                wkladanie_ulotek_do_kubka: row[57] === "1" ? true : row[57] === "0" ? false : null,
                zdobienie_paskiem_bez_laczenia:
                    row[58] === "1" ? true : row[58] === "0" ? false : null,
                zdobienie_paskiem_z_laczeniem:
                    row[59] === "1" ? true : row[59] === "0" ? false : null,
                zdobienie_tapeta_na_barylce_II_stopien_trudnosci:
                    row[60] === "1" ? true : row[60] === "0" ? false : null,
                zdobienie_tapeta_na_barylce_I_stopien_trudnosci:
                    row[61] === "1" ? true : row[61] === "0" ? false : null,
                digital_print_additional: row[62] === "1" ? true : row[62] === "0" ? false : null,
                prices: {
                    price_24: parseFloat(row[9].replace("zł", "").trim().replace(",", ".")),
                    price_72: parseFloat(row[10].replace("zł", "").trim().replace(",", ".")),
                    price_108: parseFloat(row[11].replace("zł", "").trim().replace(",", ".")),
                    price_216: parseFloat(row[12].replace("zł", "").trim().replace(",", ".")),
                    price_504: parseFloat(row[13].replace("zł", "").trim().replace(",", ".")),
                    price_1008: parseFloat(row[14].replace("zł", "").trim().replace(",", ".")),
                    price_2520: parseFloat(row[15].replace("zł", "").trim().replace(",", ".")),
                },
            };

            if (!obj.code && !obj.name) {
                // cup is not meant to be in this row (and it's not)
                return null;
            }

            // check if the row that's supposed to be a cup is not missing any attributes
            if (
                !obj.code ||
                !obj.name ||
                !obj.color ||
                !obj.material ||
                !obj.category ||
                !obj.volume ||
                !obj.supplier ||
                !obj.supplier_code
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

            // if some of the attributes are null, remove them
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
        .filter((row) => row !== null) as Cup[];

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

    const encounteredCodes = new Set(preparedData.map((row) => row.code));
    if (encounteredCodes.size !== preparedData.length) {
        const allCodes = preparedData.map((row) => row.code);
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
        const { prices, ...rest } = row;
        return rest;
    });

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
            const { code } = row;
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
    const { error: error4 } = await supabase.from("cup_pricings").upsert(
        preparedData.map((row) => {
            const { code, prices } = row;
            const dbCupId = dbCupIds.find((cup) => cup.code === code)?.id as number;
            return {
                cup_id: dbCupId,
                pricing_name,
                ...prices,
            };
        }),
        {
            onConflict: "cup_id, pricing_name",
            ignoreDuplicates: false,
        }
    );

    if (error4) {
        console.error(error4);
        return NextResponse.json(error4.message, { status: 500 });
    }

    // if there is a cup which is not in any pricing, delete it from db
    const { data: cupIdsInPricings, error: error5 } = await supabase
        .from("cup_ids_in_pricings")
        .select("cup_id");
    if (cupIdsInPricings) {
        const cupIdsToDelete = dbCupIds.filter(
            (cup) => !cupIdsInPricings.find((cupId) => cupId.cup_id === cup.id)
        );
        const { error: error5 } = await supabase
            .from("cups")
            .delete()
            .in(
                "id",
                cupIdsToDelete.map((cup) => cup.id)
            );

        if (error5) {
            console.error(error5);
            return NextResponse.json(error5.message, { status: 500 });
        }
    }

    return NextResponse.json({ incompleteCups, cupsWithoutPrices, lastCellEmpty }, { status: 200 });
};

interface Cup {
    code: string;
    name: string;
    color: string;
    material: string;
    category: string;
    volume: string;
    supplier: string;
    supplier_code: string;
    mini_pallet?: number;
    half_pallet?: number;
    full_pallet?: number;
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
