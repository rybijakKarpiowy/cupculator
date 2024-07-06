import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import { Database } from "@/database/types";
import { NextRequest, NextResponse } from "next/server";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/database/supabase/server";

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createClient()
    const auth_id = (await clientSupabase.auth.getUser()).data.user?.id

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

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

    const data: Database["public"]["Tables"]["cups"]["Row"] = (await req.json()) as {
        id: number;
        supplier: string | null;
        supplier_code: string | null;
        mini_pallet: number;
        half_pallet: number;
        full_pallet: number;
        mini_pallet_singular: number;
        half_pallet_singular: number;
        full_pallet_singular: number;
        deep_effect: boolean;
        deep_effect_plus: boolean;
        digital_print: boolean;
        digital_print_additional: boolean;
        direct_print: boolean;
        polylux: boolean;
        transfer_plus: boolean;
        nadruk_apla: boolean;
        nadruk_dookola_pod_uchem: boolean;
        nadruk_na_dnie: boolean;
        nadruk_na_spodzie: boolean;
        nadruk_na_powloce_magicznej_1_kolor: boolean;
        nadruk_na_uchu: boolean;
        nadruk_przez_rant: boolean;
        nadruk_wewnatrz_na_sciance: boolean;
        nadruk_zlotem_do_25cm2: boolean;
        nadruk_zlotem_do_50cm2: boolean;
        naklejka_papierowa_z_nadrukiem: boolean;
        personalizacja: boolean;
        pro_color: boolean;
        soft_touch: boolean;
        trend_color: boolean;
        trend_color_lowered_edge: boolean;
        wkladanie_ulotek_do_kubka: boolean;
        zdobienie_paskiem_bez_laczenia: boolean;
        zdobienie_paskiem_z_laczeniem: boolean;
        zdobienie_tapeta_na_barylce_I_stopien_trudnosci: boolean;
        zdobienie_tapeta_na_barylce_II_stopien_trudnosci: boolean;
        category: string;
		code: string;
		color: string;
		icon: string|null;
		link: string;
		material: string;
		name: string;
		volume: string;
    };

    if (!data) {
        return NextResponse.json("Missing data", { status: 400 });
    }

    const { error } = await pgsql
        .update(schema.cups)
        .set(data)
        .where(eq(schema.cups.id, data.id))
        .then(() => ({ error: null }))
        .catch((error) => ({ error }));

    if (error) {
        return NextResponse.json(error.message, { status: 500 });
    }

    return NextResponse.json("Success", { status: 200 });
};
