"use client";

import { Restriction } from "@/lib/checkRestriction";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Restrictions = ({restrictions} : {restrictions: Restriction[]}) => {
    const [loading, setLoading] = useState(false);
    const [restrictionsState, setRestrictionsState] = useState<Restriction[]>(restrictions);

    return (
        <div className="pb-32">
            <h2>Wykluczenia</h2>
            <hr />
            <br />
            <ul className="flex flex-col px-4 gap-4">
                {restrictionsState &&
                    restrictionsState.map((restriction) => (
                        <li key={restriction.id} className="flex flex-row gap-4">
                            <input
                                type="text"
                                disabled
                                placeholder={restriction.imprintType}
                            />
                            <input
                                type="text"
                                disabled
                                placeholder={restriction.anotherValue}
                                className="w-64"
                            />
                            <button
                                className={`px-2 rounded-md ${
                                    loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"
                                }`}
                                onClick={async () => {
                                    setLoading(true);
                                    const res = await fetch("/api/restriction/delete", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            id: restriction.id,
                                        }),
                                    });

                                    if (res.status === 500) {
                                        toast.error("Błąd serwera");
                                        setLoading(false);
                                        return;
                                    }
                                    if (res.status === 400) {
                                        toast.error("Błędne dane");
                                        setLoading(false);
                                        return;
                                    }
                                    if (!res.ok) {
                                        toast.error("Wystąpił błąd");
                                        setLoading(false);
                                        return;
                                    }
                                    setRestrictionsState(
                                        restrictionsState.filter(
                                            (r) => r.id !== restriction.id
                                        )
                                    );
                                    toast.success("Usunięto wykluczenie");
                                    setLoading(false);
                                }}
                                disabled={loading}
                            >
                                Usuń
                            </button>
                        </li>
                    ))}
                <li>
                    <form
                        className="flex flex-row gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setLoading(true);
                            const res = await fetch("/api/restriction/add", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    imprintType: (
                                        document.getElementById(
                                            "imprintType"
                                        ) as HTMLInputElement
                                    ).value as Restriction["imprintType"],
                                    anotherValue: (
                                        document.getElementById(
                                            "anotherValue"
                                        ) as HTMLInputElement
                                    ).value as Restriction["anotherValue"],
                                }),
                            });
                            if (res.status === 500) {
                                toast.error("Błąd serwera");
                                setLoading(false);
                                return;
                            }
                            if (res.status === 400) {
                                toast.error("Błędne dane");
                                setLoading(false);
                                return;
                            }
                            if (!res.ok) {
                                toast.error("Wystąpił błąd");
                                setLoading(false);
                                return;
                            }

                            setRestrictionsState([
                                ...restrictionsState,
                                {
                                    id: restrictionsState.length + 1,
                                    imprintType: (
                                        document.getElementById(
                                            "imprintType"
                                        ) as HTMLInputElement
                                    ).value as Restriction["imprintType"],
                                    anotherValue: (
                                        document.getElementById(
                                            "anotherValue"
                                        ) as HTMLInputElement
                                    ).value as Restriction["anotherValue"],
                                },
                            ]);
                            toast.success("Dodano wykluczenie");
                            setLoading(false);
                        }}
                    >
                        <select
                            disabled={loading}
                            id="imprintType"
                            defaultValue=""
                            className="text-center border border-black"
                        >
                            <option value="" disabled hidden>
                                Wybierz rodzaj nadruku
                            </option>
                            {[
                                "direct_print",
                                "transfer_plus",
                                "polylux",
                                "deep_effect",
                                "deep_effect_plus",
                                "digital_print",
                                "pro_color",
                            ].map((iT) => (
                                <option key={iT} value={iT}>
                                    {iT}
                                </option>
                            ))}
                        </select>
                        <select
                            disabled={loading}
                            id="anotherValue"
                            defaultValue=""
                            className="text-center border border-black"
                        >
                            <option value="" disabled hidden>
                                Wybierz zdobienie
                            </option>
                            {[
                                "trend_color_inside",
                                "trend_color_outside",
                                "trend_color_both",
                                "trend_color_lowered_edge",
                                "soft_touch",
                                "pro_color",
                                "nadruk_wewnatrz_na_sciance",
                                "nadruk_na_uchu",
                                "nadruk_na_spodzie",
                                "nadruk_na_dnie",
                                "nadruk_przez_rant",
                                "nadruk_apla",
                                "nadruk_dookola_pod_uchem",
                                "nadruk_zlotem_25",
                                "nadruk_zlotem_50",
                                "personalizacja",
                                "zdobienie_paskiem_bez_laczenia",
                                "zdobienie_paskiem_z_laczeniem",
                                "nadruk_na_powloce_magicznej_1_kolor",
                                "zdobienie_tapeta_na_barylce_I_stopien",
                                "zdobienie_tapeta_na_barylce_II_stopien",
                                "naklejka_papierowa_z_nadrukiem",
                                "wkladanie_ulotek_do_kubka",
                            ].map((aV) => (
                                <option key={aV} value={aV}>
                                    {aV}
                                </option>
                            ))}
                        </select>
                        <button
                            className={`px-2 rounded-md ${
                                loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                            }`}
                            type="submit"
                            disabled={loading}
                        >
                            Dodaj
                        </button>
                    </form>
                </li>
            </ul>
        </div>
    )
}