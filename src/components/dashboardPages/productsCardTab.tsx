"use client";

import { Database } from "@/database/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { toast } from "react-toastify";

export const ProductsCardTab = ({
    cupsData,
}: {
    cupsData: Database["public"]["Tables"]["cups"]["Row"][];
}) => {
    const cupNames = Array.from(
        new Set(
            cupsData.map((cup) => {
                return cup.name.trim();
            })
        )
    ).sort();

    const supabase = createClientComponentClient();

    const [loading, setLoading] = useState(false);
    const [selectedName, setSelectedName] = useState(cupNames[0]);

    const chooseColor = (index: number) => {
        const colorIndex = index % 5;
        let color = "";
        switch (colorIndex) {
            case 0:
                color = "bg-[#B8DAD9]";
                break;
            case 1:
                color = "bg-[#FCF1C0]";
                break;
            case 2:
                color = "bg-[#FFE5F1]";
                break;
            case 3:
                color = "bg-[#FFD3D6]";
                break;
            case 4:
                color = "bg-[#C0B9BF]";
                break;
            default:
                color = "bg-slate-500";
                break;
        }
        return color;
    };

    return (
        <div>
            <h2>Karta produktów</h2>
            <hr />
            <br />
            <select
                className="min-w-max border border-black ml-4 mb-4 rounded-md"
                defaultValue={cupNames[0]}
                onChange={(e) => {
                    setSelectedName(e.target.value);
                }}
            >
                {cupNames.map((name) => (
                    <option key={name.trim()}>{name.trim()}</option>
                ))}
            </select>
            <ul className="overflow-x-auto px-4 w-auto">
                <li>
                    <ul className="flex flex-row min-w-max">
                        <li className="px-[2px] border border-black w-24 flex items-center justify-center">
                            Kod
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nazwa
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Kolor
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Materiał
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Kategoria
                        </li>
                        <li className="px-[2px] border border-black w-96 flex items-center justify-center">
                            Link do zdjęcia
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Końcówka linku do kubka
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Objętość
                        </li>
                        <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                            Dostawca
                        </li>
                        <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                            Kod u dostawcy
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Mini paleta
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Pół paleta
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Pełna paleta
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Mini paleta jednostkowe
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Pół paleta jednostkowe
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Pełna paleta jednostkowe
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Deep effect
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Deep effect plus
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Digital print
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Digital print dodatkowy
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Direct print
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Polylux
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Transfer plus
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk apla
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk dookoła pod uchem
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk na dnie
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk na spodzie
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk na powłoce magicznej
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk na uchu
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk przez rant
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk wewnątrz na ściance
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk złotem do 25cm2
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Nadruk złotem do 50cm2
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Naklejka papierowa z nadrukiem
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Personalizacja
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Pro color
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Soft touch
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Trend color
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Trend color z obniżonym rantem
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Wkładanie ulotek do kubka
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Zdobienie paskiem bez łączenia
                        </li>
                        <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                            Zdobienie paskiem z łączeniem
                        </li>
                        <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                            Zdobienie tapeta na baryłce I stopień trudności
                        </li>
                        <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                            Zdobienie tapeta na baryłce II stopień trudności
                        </li>
                    </ul>
                </li>
                {cupsData
                    .filter((cup) => cup.name.trim() === selectedName)
                    .map((cup, index) => (
                        <li key={cup.id}>
                            <form
                                className="flex flex-row items-center"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setLoading(true);
                                    const {
                                        supplier,
                                        supplier_code,
                                        mini_pallet,
                                        half_pallet,
                                        full_pallet,
                                        mini_pallet_singular,
                                        half_pallet_singular,
                                        full_pallet_singular,
                                        deep_effect,
                                        deep_effect_plus,
                                        digital_print,
                                        digital_print_additional,
                                        direct_print,
                                        polylux,
                                        transfer_plus,
                                        nadruk_apla,
                                        nadruk_dookola_pod_uchem,
                                        nadruk_na_dnie,
                                        nadruk_na_spodzie,
                                        nadruk_na_powloce_magicznej_1_kolor,
                                        nadruk_na_uchu,
                                        nadruk_przez_rant,
                                        nadruk_wewnatrz_na_sciance,
                                        nadruk_zlotem_do_25cm2,
                                        nadruk_zlotem_do_50cm2,
                                        naklejka_papierowa_z_nadrukiem,
                                        personalizacja,
                                        pro_color,
                                        soft_touch,
                                        trend_color,
                                        trend_color_lowered_edge,
                                        wkladanie_ulotek_do_kubka,
                                        zdobienie_paskiem_bez_laczenia,
                                        zdobienie_paskiem_z_laczeniem,
                                        zdobienie_tapeta_na_barylce_I_stopien_trudnosci,
                                        zdobienie_tapeta_na_barylce_II_stopien_trudnosci,
                                    } = e.target as typeof e.target & {
                                        supplier: HTMLInputElement;
                                        supplier_code: HTMLInputElement;
                                        mini_pallet: HTMLInputElement;
                                        half_pallet: HTMLInputElement;
                                        full_pallet: HTMLInputElement;
                                        mini_pallet_singular: HTMLInputElement;
                                        half_pallet_singular: HTMLInputElement;
                                        full_pallet_singular: HTMLInputElement;
                                        deep_effect: HTMLInputElement;
                                        deep_effect_plus: HTMLInputElement;
                                        digital_print: HTMLInputElement;
                                        digital_print_additional: HTMLInputElement;
                                        direct_print: HTMLInputElement;
                                        polylux: HTMLInputElement;
                                        transfer_plus: HTMLInputElement;
                                        nadruk_apla: HTMLInputElement;
                                        nadruk_dookola_pod_uchem: HTMLInputElement;
                                        nadruk_na_dnie: HTMLInputElement;
                                        nadruk_na_spodzie: HTMLInputElement;
                                        nadruk_na_powloce_magicznej_1_kolor: HTMLInputElement;
                                        nadruk_na_uchu: HTMLInputElement;
                                        nadruk_przez_rant: HTMLInputElement;
                                        nadruk_wewnatrz_na_sciance: HTMLInputElement;
                                        nadruk_zlotem_do_25cm2: HTMLInputElement;
                                        nadruk_zlotem_do_50cm2: HTMLInputElement;
                                        naklejka_papierowa_z_nadrukiem: HTMLInputElement;
                                        personalizacja: HTMLInputElement;
                                        pro_color: HTMLInputElement;
                                        soft_touch: HTMLInputElement;
                                        trend_color: HTMLInputElement;
                                        trend_color_lowered_edge: HTMLInputElement;
                                        wkladanie_ulotek_do_kubka: HTMLInputElement;
                                        zdobienie_paskiem_bez_laczenia: HTMLInputElement;
                                        zdobienie_paskiem_z_laczeniem: HTMLInputElement;
                                        zdobienie_tapeta_na_barylce_I_stopien_trudnosci: HTMLInputElement;
                                        zdobienie_tapeta_na_barylce_II_stopien_trudnosci: HTMLInputElement;
                                    };
                                    let rawData = {
                                        id: cup.id,
                                        supplier: supplier.value ? supplier.value.trim() : null,
                                        supplier_code: supplier_code.value
                                            ? supplier_code.value.trim()
                                            : null,
                                        mini_pallet: mini_pallet.value
                                            ? mini_pallet.value.trim()
                                            : null,
                                        half_pallet: half_pallet.value
                                            ? half_pallet.value.trim()
                                            : null,
                                        full_pallet: full_pallet.value
                                            ? full_pallet.value.trim()
                                            : null,
                                        mini_pallet_singular: mini_pallet_singular.value.trim()
                                            ? mini_pallet_singular.value
                                            : null,
                                        half_pallet_singular: half_pallet_singular.value.trim()
                                            ? half_pallet_singular.value
                                            : null,
                                        full_pallet_singular: full_pallet_singular.value.trim()
                                            ? full_pallet_singular.value
                                            : null,
                                        deep_effect: deep_effect.checked,
                                        deep_effect_plus: deep_effect_plus.checked,
                                        digital_print: digital_print.checked,
                                        digital_print_additional: digital_print_additional.checked,
                                        direct_print: direct_print.checked,
                                        polylux: polylux.checked,
                                        transfer_plus: transfer_plus.checked,
                                        nadruk_apla: nadruk_apla.checked,
                                        nadruk_dookola_pod_uchem: nadruk_dookola_pod_uchem.checked,
                                        nadruk_na_dnie: nadruk_na_dnie.checked,
                                        nadruk_na_spodzie: nadruk_na_spodzie.checked,
                                        nadruk_na_powloce_magicznej_1_kolor:
                                            nadruk_na_powloce_magicznej_1_kolor.checked,
                                        nadruk_na_uchu: nadruk_na_uchu.checked,
                                        nadruk_przez_rant: nadruk_przez_rant.checked,
                                        nadruk_wewnatrz_na_sciance:
                                            nadruk_wewnatrz_na_sciance.checked,
                                        nadruk_zlotem_do_25cm2: nadruk_zlotem_do_25cm2.checked,
                                        nadruk_zlotem_do_50cm2: nadruk_zlotem_do_50cm2.checked,
                                        naklejka_papierowa_z_nadrukiem:
                                            naklejka_papierowa_z_nadrukiem.checked,
                                        personalizacja: personalizacja.checked,
                                        pro_color: pro_color.checked,
                                        soft_touch: soft_touch.checked,
                                        trend_color: trend_color.checked,
                                        trend_color_lowered_edge: trend_color_lowered_edge.checked,
                                        wkladanie_ulotek_do_kubka:
                                            wkladanie_ulotek_do_kubka.checked,
                                        zdobienie_paskiem_bez_laczenia:
                                            zdobienie_paskiem_bez_laczenia.checked,
                                        zdobienie_paskiem_z_laczeniem:
                                            zdobienie_paskiem_z_laczeniem.checked,
                                        zdobienie_tapeta_na_barylce_I_stopien_trudnosci:
                                            zdobienie_tapeta_na_barylce_I_stopien_trudnosci.checked,
                                        zdobienie_tapeta_na_barylce_II_stopien_trudnosci:
                                            zdobienie_tapeta_na_barylce_II_stopien_trudnosci.checked,
                                    };
                                    if (
                                        rawData.mini_pallet !== null &&
                                        rawData.mini_pallet !== undefined &&
                                        parseInt(rawData.mini_pallet) >= 0
                                    ) {
                                        // @ts-ignore
                                        rawData.mini_pallet = parseInt(rawData.mini_pallet);
                                    } else {
                                        toast.error("Mini paleta musi być liczbą dodatnią");
                                        setLoading(false);
                                        return;
                                    }
                                    if (
                                        rawData.half_pallet !== null &&
                                        rawData.half_pallet !== undefined &&
                                        parseInt(rawData.half_pallet) >= 0
                                    ) {
                                        // @ts-ignore
                                        rawData.half_pallet = parseInt(rawData.half_pallet);
                                    } else {
                                        toast.error("Pół paleta musi być liczbą dodatnią");
                                        setLoading(false);
                                        return;
                                    }
                                    if (
                                        rawData.full_pallet !== null &&
                                        rawData.full_pallet !== undefined &&
                                        parseInt(rawData.full_pallet) >= 0
                                    ) {
                                        // @ts-ignore
                                        rawData.full_pallet = parseInt(rawData.full_pallet);
                                    } else {
                                        toast.error("Pełna paleta musi być liczbą dodatnią");
                                        setLoading(false);
                                        return;
                                    }
                                    if (
                                        rawData.mini_pallet_singular !== null &&
                                        rawData.mini_pallet_singular !== undefined &&
                                        parseInt(rawData.mini_pallet_singular) >= 0
                                    ) {
                                        // @ts-ignore
                                        rawData.mini_pallet_singular = parseInt(
                                            rawData.mini_pallet_singular
                                        );
                                    } else {
                                        toast.error("Mini paleta jednostkowe musi być liczbą dodatnią");
                                        setLoading(false);
                                        return;
                                    }
                                    if (
                                        rawData.half_pallet_singular !== null &&
                                        rawData.half_pallet_singular !== undefined &&
                                        parseInt(rawData.half_pallet_singular) >= 0
                                    ) {
                                        // @ts-ignore
                                        rawData.half_pallet_singular = parseInt(
                                            rawData.half_pallet_singular
                                        );
                                    } else {
                                        toast.error("Pół paleta jednostkowe musi być liczbą dodatnią");
                                        setLoading(false);
                                        return;
                                    }
                                    if (
                                        rawData.full_pallet_singular !== null &&
                                        rawData.full_pallet_singular !== undefined &&
                                        parseInt(rawData.full_pallet_singular) >= 0
                                    ) {
                                        // @ts-ignore
                                        rawData.full_pallet_singular = parseInt(
                                            rawData.full_pallet_singular
                                        );
                                    } else {
                                        toast.error("Pełna paleta jednostkowe musi być liczbą dodatnią");
                                        setLoading(false);
                                        return;
                                    }

                                    const data = {
                                        id: cup.id,
                                        supplier: rawData.supplier,
                                        supplier_code: rawData.supplier_code,
                                        mini_pallet: rawData.mini_pallet as unknown as number,
                                        half_pallet: rawData.half_pallet as unknown as number,
                                        full_pallet: rawData.full_pallet as unknown as number,
                                        mini_pallet_singular:
                                            rawData.mini_pallet_singular as unknown as number,
                                        half_pallet_singular:
                                            rawData.half_pallet_singular as unknown as number,
                                        full_pallet_singular:
                                            rawData.full_pallet_singular as unknown as number,
                                        deep_effect: rawData.deep_effect,
                                        deep_effect_plus: rawData.deep_effect_plus,
                                        digital_print: rawData.digital_print,
                                        digital_print_additional: rawData.digital_print_additional,
                                        direct_print: rawData.direct_print,
                                        polylux: rawData.polylux,
                                        transfer_plus: rawData.transfer_plus,
                                        nadruk_apla: rawData.nadruk_apla,
                                        nadruk_dookola_pod_uchem: rawData.nadruk_dookola_pod_uchem,
                                        nadruk_na_dnie: rawData.nadruk_na_dnie,
                                        nadruk_na_spodzie: rawData.nadruk_na_spodzie,
                                        nadruk_na_powloce_magicznej_1_kolor:
                                            rawData.nadruk_na_powloce_magicznej_1_kolor,
                                        nadruk_na_uchu: rawData.nadruk_na_uchu,
                                        nadruk_przez_rant: rawData.nadruk_przez_rant,
                                        nadruk_wewnatrz_na_sciance:
                                            rawData.nadruk_wewnatrz_na_sciance,
                                        nadruk_zlotem_do_25cm2: rawData.nadruk_zlotem_do_25cm2,
                                        nadruk_zlotem_do_50cm2: rawData.nadruk_zlotem_do_50cm2,
                                        naklejka_papierowa_z_nadrukiem:
                                            rawData.naklejka_papierowa_z_nadrukiem,
                                        personalizacja: rawData.personalizacja,
                                        pro_color: rawData.pro_color,
                                        soft_touch: rawData.soft_touch,
                                        trend_color: rawData.trend_color,
                                        trend_color_lowered_edge: rawData.trend_color_lowered_edge,
                                        wkladanie_ulotek_do_kubka:
                                            rawData.wkladanie_ulotek_do_kubka,
                                        zdobienie_paskiem_bez_laczenia:
                                            rawData.zdobienie_paskiem_bez_laczenia,
                                        zdobienie_paskiem_z_laczeniem:
                                            rawData.zdobienie_paskiem_z_laczeniem,
                                        zdobienie_tapeta_na_barylce_I_stopien_trudnosci:
                                            rawData.zdobienie_tapeta_na_barylce_I_stopien_trudnosci,
                                        zdobienie_tapeta_na_barylce_II_stopien_trudnosci:
                                            rawData.zdobienie_tapeta_na_barylce_II_stopien_trudnosci,
                                    };

                                    const { error } = await supabase
                                        .from("cups")
                                        .update(data)
                                        .match({ id: cup.id });
                                    if (error) {
                                        toast.error(error.message);
                                    } else {
                                        toast.success("Zaktualizowano");
                                    }
                                    setLoading(false);
                                }}
                            >
                                <ul className={`flex flex-row min-w-max ${chooseColor(index)}`}>
                                    <li className="px-[2px] border border-black w-24 flex items-center justify-center">
                                        {cup.code}
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        {cup.name}
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        {cup.color}
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        {cup.material ? cup.material : "brak"}
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        {cup.category ? cup.category : "brak"}
                                    </li>
                                    <li className="px-[2px] border border-black w-96 flex items-center justify-center break-all">
                                        {cup.icon ? cup.icon : "brak"}
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        {cup.link ? cup.link : "brak"}
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        {cup.volume ? cup.volume : "brak"}
                                    </li>
                                    <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                                        <input
                                            type="text"
                                            id="supplier"
                                            name="supplier"
                                            defaultValue={cup.supplier ? cup.supplier : ""}
                                            placeholder="brak"
                                            disabled={loading}
                                            className="w-40"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                                        <input
                                            type="text"
                                            id="supplier_code"
                                            name="supplier_code"
                                            defaultValue={
                                                cup.supplier_code ? cup.supplier_code : ""
                                            }
                                            placeholder="brak"
                                            disabled={loading}
                                            className="w-40"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="text"
                                            id="mini_pallet"
                                            name="mini_pallet"
                                            defaultValue={cup.mini_pallet ? cup.mini_pallet : "0"}
                                            placeholder="0"
                                            disabled={loading}
                                            className="w-24"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="text"
                                            id="half_pallet"
                                            name="half_pallet"
                                            defaultValue={cup.half_pallet ? cup.half_pallet : "0"}
                                            placeholder="0"
                                            disabled={loading}
                                            className="w-24"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="text"
                                            id="full_pallet"
                                            name="full_pallet"
                                            defaultValue={cup.full_pallet ? cup.full_pallet : "0"}
                                            placeholder="0"
                                            disabled={loading}
                                            className="w-24"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="text"
                                            id="mini_pallet_singular"
                                            name="mini_pallet_singular"
                                            defaultValue={
                                                cup.mini_pallet_singular
                                                    ? cup.mini_pallet_singular
                                                    : "0"
                                            }
                                            placeholder="0"
                                            disabled={loading}
                                            className="w-24"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="text"
                                            id="half_pallet_singular"
                                            name="half_pallet_singular"
                                            defaultValue={
                                                cup.half_pallet_singular
                                                    ? cup.half_pallet_singular
                                                    : "0"
                                            }
                                            placeholder="0"
                                            disabled={loading}
                                            className="w-24"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="text"
                                            id="full_pallet_singular"
                                            name="full_pallet_singular"
                                            defaultValue={
                                                cup.full_pallet_singular
                                                    ? cup.full_pallet_singular
                                                    : "0"
                                            }
                                            placeholder="0"
                                            disabled={loading}
                                            className="w-24"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="deep_effect"
                                            name="deep_effect"
                                            defaultChecked={cup.deep_effect ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="deep_effect_plus"
                                            name="deep_effect_plus"
                                            defaultChecked={cup.deep_effect_plus ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="digital_print"
                                            name="digital_print"
                                            defaultChecked={cup.digital_print ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="digital_print_additional"
                                            name="digital_print_additional"
                                            defaultChecked={
                                                cup.digital_print_additional ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="direct_print"
                                            name="direct_print"
                                            defaultChecked={cup.direct_print ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="polylux"
                                            name="polylux"
                                            defaultChecked={cup.polylux ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="transfer_plus"
                                            name="transfer_plus"
                                            defaultChecked={cup.transfer_plus ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_apla"
                                            name="nadruk_apla"
                                            defaultChecked={cup.nadruk_apla ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_dookola_pod_uchem"
                                            name="nadruk_dookola_pod_uchem"
                                            defaultChecked={
                                                cup.nadruk_dookola_pod_uchem ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_na_dnie"
                                            name="nadruk_na_dnie"
                                            defaultChecked={cup.nadruk_na_dnie ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_na_spodzie"
                                            name="nadruk_na_spodzie"
                                            defaultChecked={cup.nadruk_na_spodzie ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_na_powloce_magicznej_1_kolor"
                                            name="nadruk_na_powloce_magicznej_1_kolor"
                                            defaultChecked={
                                                cup.nadruk_na_powloce_magicznej_1_kolor
                                                    ? true
                                                    : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_na_uchu"
                                            name="nadruk_na_uchu"
                                            defaultChecked={cup.nadruk_na_uchu ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_przez_rant"
                                            name="nadruk_przez_rant"
                                            defaultChecked={cup.nadruk_przez_rant ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_wewnatrz_na_sciance"
                                            name="nadruk_wewnatrz_na_sciance"
                                            defaultChecked={
                                                cup.nadruk_wewnatrz_na_sciance ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_zlotem_do_25cm2"
                                            name="nadruk_zlotem_do_25cm2"
                                            defaultChecked={
                                                cup.nadruk_zlotem_do_25cm2 ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="nadruk_zlotem_do_50cm2"
                                            name="nadruk_zlotem_do_50cm2"
                                            defaultChecked={
                                                cup.nadruk_zlotem_do_50cm2 ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="naklejka_papierowa_z_nadrukiem"
                                            name="naklejka_papierowa_z_nadrukiem"
                                            defaultChecked={
                                                cup.naklejka_papierowa_z_nadrukiem ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="personalizacja"
                                            name="personalizacja"
                                            defaultChecked={cup.personalizacja ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="pro_color"
                                            name="pro_color"
                                            defaultChecked={cup.pro_color ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="soft_touch"
                                            name="soft_touch"
                                            defaultChecked={cup.soft_touch ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="trend_color"
                                            name="trend_color"
                                            defaultChecked={cup.trend_color ? true : false}
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="trend_color_lowered_edge"
                                            name="trend_color_lowered_edge"
                                            defaultChecked={
                                                cup.trend_color_lowered_edge ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="wkladanie_ulotek_do_kubka"
                                            name="wkladanie_ulotek_do_kubka"
                                            defaultChecked={
                                                cup.wkladanie_ulotek_do_kubka ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="zdobienie_paskiem_bez_laczenia"
                                            name="zdobienie_paskiem_bez_laczenia"
                                            defaultChecked={
                                                cup.zdobienie_paskiem_bez_laczenia ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="zdobienie_paskiem_z_laczeniem"
                                            name="zdobienie_paskiem_z_laczeniem"
                                            defaultChecked={
                                                cup.zdobienie_paskiem_z_laczeniem ? true : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="zdobienie_tapeta_na_barylce_I_stopien_trudnosci"
                                            name="zdobienie_tapeta_na_barylce_I_stopien_trudnosci"
                                            defaultChecked={
                                                cup.zdobienie_tapeta_na_barylce_I_stopien_trudnosci
                                                    ? true
                                                    : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                    <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="zdobienie_tapeta_na_barylce_II_stopien_trudnosci"
                                            name="zdobienie_tapeta_na_barylce_II_stopien_trudnosci"
                                            defaultChecked={
                                                cup.zdobienie_tapeta_na_barylce_II_stopien_trudnosci
                                                    ? true
                                                    : false
                                            }
                                            disabled={loading}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </li>
                                </ul>
                                <div className="absolute right-0">
                                    <button
                                        type="submit"
                                        className={`px-4 py-2 border border-black rounded-md ${
                                            loading
                                                ? "bg-slate-400"
                                                : "bg-green-300 hover:bg-green-400"
                                        }`}
                                    >
                                        Zapisz
                                    </button>
                                </div>
                            </form>
                        </li>
                    ))}
            </ul>
        </div>
    );
};
