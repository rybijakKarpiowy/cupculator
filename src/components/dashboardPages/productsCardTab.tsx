"use client";

import { Database } from "@/database/types";
import { useState } from "react";

export const ProductsCardTab = ({
    cupsData,
}: {
    cupsData: Database["public"]["Tables"]["cups"]["Row"][];
}) => {
    const [loading, setLoading] = useState(false);

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
                {cupsData.map((cup, index) => (
                    <li key={cup.id}>
                        <form>
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
                                    {cup.material}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.category}
                                </li>
                                <li className="px-[2px] border border-black w-96 flex items-center justify-center break-all">
                                    {cup.icon}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.link}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.volume}
                                </li>
                                <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                                    {cup.supplier}
                                </li>
                                <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                                    {cup.supplier_code}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.mini_pallet}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.half_pallet}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.full_pallet}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.mini_pallet_singular}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.half_pallet_singular}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.full_pallet_singular}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id="deep_effect"
                                        defaultChecked={cup.deep_effect ? true : false}
                                        disabled={loading}
                                        className="h-5 w-5"
                                    />
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id="deep_effect_plus"
                                        defaultChecked={cup.deep_effect_plus ? true : false}
                                        disabled={loading}
                                        className="h-5 w-5"
                                    />
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id="digital_print"
                                        defaultChecked={cup.digital_print ? true : false}
                                        disabled={loading}
                                        className="h-5 w-5"
                                    />
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id="digital_print_additional"
                                        defaultChecked={cup.digital_print_additional ? true : false}
                                        disabled={loading}
                                        className="h-5 w-5"
                                    />
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id="direct_print"
                                        defaultChecked={cup.direct_print ? true : false}
                                        disabled={loading}
                                        className="h-5 w-5"
                                    />
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id="polylux"
                                        defaultChecked={cup.polylux ? true : false}
                                        disabled={loading}
                                        className="h-5 w-5"
                                    />
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.transfer_plus}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_apla}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_dookola_pod_uchem}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_na_dnie}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_na_spodzie}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_na_powloce_magicznej_1_kolor}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_na_uchu}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_przez_rant}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_wewnatrz_na_sciance}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_zlotem_do_25cm2}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.nadruk_zlotem_do_50cm2}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.naklejka_papierowa_z_nadrukiem}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.personalizacja}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.pro_color}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.soft_touch}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.trend_color}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.trend_color_lowered_edge}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.wkladanie_ulotek_do_kubka}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.zdobienie_paskiem_bez_laczenia}
                                </li>
                                <li className="px-[2px] border border-black w-32 flex items-center justify-center">
                                    {cup.zdobienie_paskiem_z_laczeniem}
                                </li>
                                <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                                    {cup.zdobienie_tapeta_na_barylce_I_stopien_trudnosci}
                                </li>
                                <li className="px-[2px] border border-black w-48 flex items-center justify-center">
                                    {cup.zdobienie_tapeta_na_barylce_II_stopien_trudnosci}
                                </li>
                            </ul>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    );
};
