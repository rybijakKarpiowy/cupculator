"use client";

import { Cup } from "@/app/api/updatecups/route";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Database } from "@/database/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import noImage from "@/../public/noimage.png";
import { ColorPricing } from "@/lib/colorPricingType";
import { PricesDisplay } from "./pricesDisplay";
import { Restriction, getNewForbidden } from "@/lib/checkRestriction";
import { PalletQuantities } from "./palletQuantities";
import { resetInputs } from "@/lib/resetInputs";
import { translateColor } from "@/lib/translateColor";
import { downloadPdf } from "@/lib/downloadPdf";
import { copyCalcToClip } from "@/lib/copyCalcToClip";

export const Calculator = ({
    cupData,
    colorPricing,
    lang,
    clientPriceUnit,
    additionalValues,
    restrictions,
}: {
    cupData: Cup[];
    colorPricing: ColorPricing;
    lang: "1" | "2";
    clientPriceUnit: "zł" | "EUR";
    additionalValues: Database["public"]["Tables"]["additional_values"]["Row"];
    restrictions: Restriction[];
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedCup, setSelectedCup] = useState<Cup>(
        cupData.sort((a, b) => a.color.localeCompare(b.color))[0]
    );
    const [amounts, setAmounts] = useState<{
        amount1: number | null;
        amount2: number | null;
        amount3: number | null;
        inputs: number;
    }>({
        amount1: null,
        amount2: null,
        amount3: null,
        inputs: 1,
    });
    const [cupConfig, setCupConfig] = useState<CupConfigInterface>({
        trend_color: "",
        soft_touch: false,
        pro_color: false,
        imprintType: selectedCup.digital_print ? "" : "transfer_plus_1",
        imprintColors: selectedCup.digital_print ? 0 : 1,
        nadruk_wewnatrz_na_sciance: 0,
        nadruk_na_uchu: false,
        nadruk_na_spodzie: false,
        nadruk_na_dnie: false,
        nadruk_przez_rant: false,
        nadruk_apla: false,
        nadruk_dookola_pod_uchem: false,
        nadruk_zlotem: false,
        personalizacja: false,
        zdobienie_paskiem: false,
        zdobienie_tapeta_na_barylce: false,
        nadruk_na_powloce_magicznej_1_kolor: false,
        naklejka_papierowa_z_nadrukiem: false,
        wkladanie_ulotek_do_kubka: false,
        cardboard: "",
    });
    const [forbidden, setForbidden] = useState({
        direct_print: false,
        transfer_plus: false,
        polylux: false,
        deep_effect: false,
        deep_effect_plus: false,
        digital_print: false,
        trend_color_inside: false,
        trend_color_outside: false,
        trend_color_both: false,
        trend_color_lowered_edge: false,
        soft_touch: false,
        pro_color: false,
        nadruk_wewnatrz_na_sciance: false,
        nadruk_na_uchu: false,
        nadruk_na_spodzie: false,
        nadruk_na_dnie: false,
        nadruk_przez_rant: false,
        nadruk_apla: false,
        nadruk_dookola_pod_uchem: false,
        nadruk_zlotem_25: false,
        nadruk_zlotem_50: false,
        personalizacja: false,
        zdobienie_paskiem_bez_laczenia: false,
        zdobienie_paskiem_z_laczeniem: false,
        nadruk_na_powloce_magicznej_1_kolor: false,
        zdobienie_tapeta_na_barylce_I_stopien: false,
        zdobienie_tapeta_na_barylce_II_stopien: false,
        naklejka_papierowa_z_nadrukiem: false,
        wkladanie_ulotek_do_kubka: false,
    });

    useEffect(() => {
        for (const price of Object.values(selectedCup.prices)) {
            if (!price) {
                toast.warn(
                    lang === "1"
                        ? "Brak cen dla wybranego kubka. Skontaktuj się z działem handlowym"
                        : "No prices for selected cup. Contact sales department"
                );
                return;
            }
        }
    }, [selectedCup]);

    useEffect(() => {
        const newForbidden = getNewForbidden({
            cupConfig,
            restrictions,
        });
        setForbidden(newForbidden);
    }, [cupConfig]);

    useEffect(() => {
        if (cupConfig.imprintType === "direct_print") {
            for (const amount of [amounts.amount1, amounts.amount2, amounts.amount3]) {
                if (amount && amount < 72) {
                    toast.warn(
                        lang === "1"
                            ? "Minimalna ilość przy nadruku bezpośrednim to 72 sztuki"
                            : "Minimum amount for direct print is 72 pieces"
                    );
                    return;
                } else if (amount && amount < 216 && cupConfig.imprintColors > 1) {
                    toast.warn(
                        lang === "1"
                            ? "Druk bezpośredni powyżej jednego koloru jest niedostępny dla zamówień poniżej 216 sztuk"
                            : "Direct print with more that one color is not available for orders of less than 216 cups"
                    );
                    return;
                }
            }
        }
    }, [amounts, cupConfig]);

    const amountAlerts = (amount: number | null, inputId: number) => {
        if (!amount) return;
        if (amount < 24) {
            switch (inputId) {
                case 1:
                    setAmounts({ ...amounts, amount1: null });
                    break;
                case 2:
                    setAmounts({ ...amounts, amount2: null });
                    break;
                case 3:
                    setAmounts({ ...amounts, amount3: null });
                    break;
            }
            toast.warn(
                lang === "1" ? "Minimalna ilość to 24 sztuki" : "Minimum amount is 24 pieces"
            );
            return;
        }
        if (amount >= 50 && amount < 72) {
            toast.info(
                lang === "1" ? "Lepsza cena przy 72 sztukach" : "You get better price for 72 pieces"
            );
            return;
        }
        if (amount >= 100 && amount < 108) {
            toast.info(
                lang === "1"
                    ? "Lepsza cena przy 108 sztukach"
                    : "You get better price for 108 pieces"
            );
            return;
        }
        if (amount >= 200 && amount < 216) {
            toast.info(
                lang === "1"
                    ? "Lepsza cena przy 216 sztukach"
                    : "You get better price for 216 pieces"
            );
            return;
        }
        if (amount >= 500 && amount < 504) {
            toast.info(
                lang === "1"
                    ? "Lepsza cena przy 504 sztukach"
                    : "You get better price for 504 pieces"
            );
            return;
        }
        if (amount >= 1000 && amount < 1008) {
            toast.info(
                lang === "1"
                    ? "Lepsza cena przy 1008 sztukach"
                    : "You get better price for 1008 pieces"
            );
            return;
        }
        if (amount >= 2500 && amount < 2520) {
            toast.info(
                lang === "1"
                    ? "Lepsza cena przy 2520 sztukach"
                    : "You get better price for 2520 pieces"
            );
            return;
        }
        if (amount >= 5040) {
            toast.info(
                lang === "1"
                    ? "Aby uzyskać indywidualną wycenę skontaktuj się ze swoim opiekunem handlowym (dla ilości powyżej 5040szt.)"
                    : "In order to get a special offer contact your sales department advisor (for amounts over 5040 pcs)"
            );
            return;
        }
    };
    return (
        <div className="flex flex-col items-start pt-12 pb-16">
            <div className="flex flex-row pr-[400px] w-full items-center justify-center gap-8">
                {selectedCup.icon ? (
                    <Image src={selectedCup.icon} alt={""} width={200} height={250} />
                ) : (
                    <Image src={noImage} alt={""} width={200} height={250} />
                )}
                <div className="flex flex-col">
                    <div className="border border-[#c00418] pl-2 pr-8 py-2 w-max rounded-md">
                        <p>{selectedCup.code}</p>
                        <p>{selectedCup.name}</p>
                        <p>{selectedCup.volume}</p>
                    </div>
                    <br />
                    <div className="flex flex-col relative w-80">
                        <p>{lang === "1" ? "Ilość: " : "Amount: "}</p>
                        <p>{lang === "1" ? "Jednostkowa cena produktu: " : "Price per unit: "}</p>
                        <p>
                            {lang === "1" ? "Koszt kartonika/szt: " : "Packaging cost per unit: "}
                        </p>
                        <p>{lang === "1" ? "Koszt przygotowalni: " : "Set up cost: "}</p>
                        {clientPriceUnit === "zł" && (
                            <p>{lang === "1" ? "Koszt transportu: " : "Transport cost: "}</p>
                        )}
                        <p>{lang === "1" ? "Całkowity koszt: " : "Total cost: "}</p>
                        <div className="absolute -right-[128px] flex flex-row">
                            <PricesDisplay
                                amount={amounts.amount1}
                                lang={lang}
                                clientPriceUnit={clientPriceUnit}
                                keep={amounts.inputs > 0}
                                selectedCup={selectedCup}
                                colorPricing={colorPricing}
                                additionalValues={additionalValues}
                                cupConfig={cupConfig}
                            />
                        </div>
                        <div className="absolute -right-[320px] flex flex-row">
                            <PricesDisplay
                                amount={amounts.amount2}
                                lang={lang}
                                clientPriceUnit={clientPriceUnit}
                                keep={amounts.inputs > 1}
                                selectedCup={selectedCup}
                                colorPricing={colorPricing}
                                additionalValues={additionalValues}
                                cupConfig={cupConfig}
                            />
                        </div>
                        <div className="absolute -right-[512px] flex flex-row">
                            <PricesDisplay
                                amount={amounts.amount3}
                                lang={lang}
                                clientPriceUnit={clientPriceUnit}
                                keep={amounts.inputs > 2}
                                selectedCup={selectedCup}
                                colorPricing={colorPricing}
                                additionalValues={additionalValues}
                                cupConfig={cupConfig}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="ml-[40%] flex flex-col gap-4">
                <div className="absolute right-[62vw] mr-4 mt-4 flex flex-row gap-2 items-center">
                    {lang == "1" ? "Wybierz kolor: " : "Select color: "}
                    <select
                        onChange={(e) => {
                            if (e.target.value === selectedCup.code) return;
                            setCupConfig({
                                trend_color: "",
                                soft_touch: false,
                                pro_color: false,
                                imprintType: "",
                                imprintColors: 0,
                                nadruk_wewnatrz_na_sciance: 0,
                                nadruk_na_uchu: false,
                                nadruk_na_spodzie: false,
                                nadruk_na_dnie: false,
                                nadruk_przez_rant: false,
                                nadruk_apla: false,
                                nadruk_dookola_pod_uchem: false,
                                nadruk_zlotem: false,
                                personalizacja: false,
                                zdobienie_paskiem: false,
                                zdobienie_tapeta_na_barylce: false,
                                nadruk_na_powloce_magicznej_1_kolor: false,
                                naklejka_papierowa_z_nadrukiem: false,
                                wkladanie_ulotek_do_kubka: false,
                                cardboard: "",
                            });
                            resetInputs(document, {
                                trend_color: true,
                                soft_touch: true,
                                pro_color: true,
                                imprintType: true,
                                nadruk_na_wewnatrz_sciance: true,
                                nadruk_na_uchu: true,
                                nadruk_na_spodzie: true,
                                nadruk_na_dnie: true,
                                nadruk_przez_rant: true,
                                nadruk_apla: true,
                                nadruk_dookola_pod_uchem: true,
                                nadruk_zlotem: true,
                                personalizacja: true,
                                zdobienie_paskiem: true,
                                nadruk_na_powloce_magicznej_1_kolor: true,
                                zdobienie_tapeta_na_barylce: true,
                                naklejka_papierowa_z_nadrukiem: true,
                                wkladanie_ulotek_do_kubka: true,
                                cardboard: true,
                            });
                            setSelectedCup(
                                cupData.find((cup) => cup.code === e.target.value) as Cup
                            );
                            // reset input/select elements
                        }}
                        defaultValue={
                            cupData.sort((a, b) => a.color.localeCompare(b.color))[0].code
                        }
                        className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                    >
                        {cupData
                            .sort((a, b) => a.color.localeCompare(b.color))
                            .map((cup) => (
                                <option key={cup.code} value={cup.code}>
                                    {lang === "1" ? cup.color : translateColor(cup.color)}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="relative">
                    {lang === "1" ? "Ilość: " : "Amount: "}
                    <div className="flex flex-row absolute ml-2 top-0 left-[11vw] ">
                        <div className="flex flex-row gap-[24px]">
                            <input
                                type="number"
                                min="1"
                                className="text-right border border-[#bbb] bg-slate-50 text-black px-2 rounded-md"
                                onBlur={(e) => {
                                    e.target.value
                                        ? setAmounts({
                                              ...amounts,
                                              amount1: parseInt(e.target.value),
                                          })
                                        : setAmounts({
                                              ...amounts,
                                              amount1: null,
                                          });
                                    amountAlerts(parseInt(e.target.value), 1);
                                }}
                                onKeyUp={(e) => {
                                    if (e.key === "Enter" || e.key === "Escape") {
                                        (e.target as HTMLInputElement).blur();
                                    }
                                }}
                            />
                            {amounts.inputs > 1 && (
                                <input
                                    type="number"
                                    min="1"
                                    className="text-right border border-[#bbb] bg-slate-50 text-black px-2 rounded-md"
                                    onBlur={(e) => {
                                        e.target.value
                                            ? setAmounts({
                                                  ...amounts,
                                                  amount2: parseInt(e.target.value),
                                              })
                                            : setAmounts({
                                                  ...amounts,
                                                  amount2: null,
                                              });
                                        amountAlerts(parseInt(e.target.value), 2);
                                    }}
                                    onKeyUp={(e) => {
                                        if (e.key === "Enter" || e.key === "Escape") {
                                            (e.target as HTMLInputElement).blur();
                                        }
                                    }}
                                />
                            )}
                            {amounts.inputs > 2 && (
                                <input
                                    type="number"
                                    min="1"
                                    className="text-right border border-[#bbb] bg-slate-50 text-black px-2 rounded-md"
                                    onBlur={(e) => {
                                        e.target.value
                                            ? setAmounts({
                                                  ...amounts,
                                                  amount3: parseInt(e.target.value),
                                              })
                                            : setAmounts({
                                                  ...amounts,
                                                  amount3: null,
                                              });
                                        amountAlerts(parseInt(e.target.value), 3);
                                    }}
                                    onKeyUp={(e) => {
                                        if (e.key === "Enter" || e.key === "Escape") {
                                            (e.target as HTMLInputElement).blur();
                                        }
                                    }}
                                />
                            )}
                        </div>
                        <div className="flex flex-row ml-2 gap-1">
                            {amounts.inputs < 3 && (
                                <button
                                    onClick={() =>
                                        setAmounts({
                                            ...amounts,
                                            inputs: amounts.inputs + 1,
                                        })
                                    }
                                    className="w-[24px] h-[24px] rounded-md bg-green-300 hover:bg-green-400 flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                    </svg>
                                </button>
                            )}
                            {amounts.inputs > 1 && (
                                <button
                                    onClick={() => {
                                        if (amounts.inputs === 3) {
                                            setAmounts({
                                                ...amounts,
                                                amount3: null,
                                                inputs: amounts.inputs - 1,
                                            });
                                        } else if (amounts.inputs === 2) {
                                            setAmounts({
                                                ...amounts,
                                                amount2: null,
                                                inputs: amounts.inputs - 1,
                                            });
                                        }
                                    }}
                                    className="w-[24px] h-[24px] rounded-md bg-red-300 hover:bg-red-400 flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-[386px] bg-slate-100 p-4">
                    <div className="flex flex-row justify-between items-center">
                        {lang === "1" ? "Wybierz nadruk: " : "Select print type: "}
                        <select
                            defaultValue={
                                !selectedCup.digital_print && selectedCup.transfer_plus
                                    ? "transfer_plus_1"
                                    : ""
                            }
                            id="imprintType"
                            onChange={(e) => {
                                if (e.target.value === cupConfig.imprintType) return;
                                setCupConfig({
                                    ...cupConfig,
                                    imprintType: e.target
                                        .value as CupConfigInterface["imprintType"],
                                    imprintColors: 1,
                                    trend_color: "",
                                    pro_color: false,
                                    soft_touch: false,
                                    nadruk_wewnatrz_na_sciance: 0,
                                    nadruk_na_uchu: false,
                                    nadruk_na_spodzie: false,
                                    nadruk_na_dnie: false,
                                    nadruk_przez_rant: false,
                                    nadruk_apla: false,
                                    nadruk_dookola_pod_uchem: false,
                                    nadruk_zlotem: false,
                                    personalizacja: false,
                                    zdobienie_paskiem: false,
                                    zdobienie_tapeta_na_barylce: false,
                                    nadruk_na_powloce_magicznej_1_kolor: false,
                                    naklejka_papierowa_z_nadrukiem: false,
                                    wkladanie_ulotek_do_kubka: false,
                                });
                                resetInputs(document, {
                                    trend_color: true,
                                    soft_touch: true,
                                    pro_color: true,
                                    imprintColors: true,
                                    nadruk_na_wewnatrz_sciance: true,
                                    nadruk_na_uchu: true,
                                    nadruk_na_spodzie: true,
                                    nadruk_na_dnie: true,
                                    nadruk_przez_rant: true,
                                    nadruk_apla: true,
                                    nadruk_dookola_pod_uchem: true,
                                    nadruk_zlotem: true,
                                    personalizacja: true,
                                    zdobienie_paskiem: true,
                                    nadruk_na_powloce_magicznej_1_kolor: true,
                                    zdobienie_tapeta_na_barylce: true,
                                    naklejka_papierowa_z_nadrukiem: true,
                                    wkladanie_ulotek_do_kubka: true,
                                    cardboard: true,
                                });
                                if (
                                    [
                                        "transfer_plus_1",
                                        "transfer_plus_2",
                                        "transfer_plus_round",
                                        "polylux_1",
                                        "polylux_2",
                                        "polylux_round",
                                        "direct_print",
                                    ].includes(e.target.value)
                                ) {
                                    const imprintColorsSelect = document.getElementById(
                                        "imprintColors"
                                    ) as HTMLSelectElement | null;
                                    if (imprintColorsSelect) {
                                        imprintColorsSelect.value = "1";
                                    }
                                }
                            }}
                            className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                        >
                            <option value="">{lang === "1" ? "Brak" : "None"}</option>
                            {selectedCup.direct_print && !forbidden.direct_print && (
                                <option value="direct_print">Direct print</option>
                            )}
                            {selectedCup.transfer_plus && (
                                <>
                                    <option value="transfer_plus_1">
                                        {lang === "1"
                                            ? "Transfer Plus 1 strona"
                                            : "Transfer Plus 1 side"}
                                    </option>
                                    <option value="transfer_plus_2">
                                        {lang === "1"
                                            ? "Transfer Plus 2 strony"
                                            : "Transfer Plus 2 sides"}
                                    </option>
                                    <option value="transfer_plus_round">
                                        {lang === "1"
                                            ? "Transfer Plus Tapeta"
                                            : "Transfer Plus Wallpaper"}
                                    </option>
                                </>
                            )}
                            {selectedCup.polylux && !selectedCup.digital_print && (
                                <>
                                    <option value="polylux_1">
                                        Polylux {lang === "1" ? "1 strona" : "1 side"}
                                    </option>
                                    <option value="polylux_2">
                                        Polylux {lang === "1" ? "2 strony" : "2 sides"}
                                    </option>
                                    <option value="polylux_round">
                                        Polylux {lang === "1" ? "tapeta" : "wallpaper"}
                                    </option>
                                </>
                            )}
                            {selectedCup.deep_effect && (
                                <>
                                    <option value="deep_effect_1">
                                        Deep effect {lang === "1" ? "1 strona" : "1 side"}
                                    </option>
                                    <option value="deep_effect_2">
                                        Deep effect {lang === "1" ? "2 strony" : "2 sides"}
                                    </option>
                                </>
                            )}
                            {selectedCup.deep_effect_plus && (
                                <>
                                    <option value="deep_effect_plus_1">
                                        Deep effect plus {lang === "1" ? "1 strona" : "1 side"}
                                    </option>
                                    <option value="deep_effect_plus_2">
                                        Deep effect plus {lang === "1" ? "2 strony" : "2 sides"}
                                    </option>
                                </>
                            )}
                            {selectedCup.digital_print && (
                                <option value="digital_print">
                                    {lang === "1" ? "Nadruk cyfrowy" : "Digital print"}
                                </option>
                            )}
                            {selectedCup.polylux && selectedCup.digital_print && (
                                <option value="polylux_1">
                                    {lang === "1"
                                        ? "Nadruk cyfrowy + Polylux"
                                        : "Digital print + Polylux"}
                                </option>
                            )}
                        </select>
                    </div>
                    {cupConfig.imprintType &&
                        ![
                            "deep_effect_1",
                            "deep_effect_2",
                            "deep_effect_plus_1",
                            "deep_effect_plus_2",
                        ].includes(cupConfig.imprintType) && (
                            <div className="flex flex-row justify-between items-center relative">
                                {lang === "1"
                                    ? "Liczba kolorów nadruku: "
                                    : "Number of print colors: "}
                                <select
                                    defaultValue="1"
                                    id="imprintColors"
                                    disabled={
                                        !cupConfig.imprintType ||
                                        cupConfig.imprintType === "digital_print"
                                    }
                                    onChange={(e) => {
                                        const imprintColors = parseInt(e.target.value) || 0;
                                        setCupConfig({
                                            ...cupConfig,
                                            imprintColors,
                                        });
                                    }}
                                    className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                                >
                                    <option value="1" disabled hidden>
                                        {cupConfig.imprintType !== "digital_print"
                                            ? "1"
                                            : lang === "1"
                                            ? "Pełny kolor"
                                            : "Full color"}
                                    </option>
                                    {cupConfig.imprintType &&
                                        cupConfig.imprintType === "direct_print" &&
                                        [...Array(3)].map(
                                            (_, index) => (
                                                (index += 2),
                                                (
                                                    <option key={index} value={index}>
                                                        {index.toString()}
                                                    </option>
                                                )
                                            )
                                        )}
                                    {cupConfig.imprintType &&
                                        [
                                            "transfer_plus_1",
                                            "transfer_plus_2",
                                            "transfer_plus_round",
                                            "polylux_1",
                                            "polylux_2",
                                            "polylux_round",
                                        ].includes(cupConfig.imprintType) &&
                                        [...Array(16)].map(
                                            (_, index) => (
                                                (index += 1),
                                                (
                                                    <option key={index} value={index}>
                                                        {index.toString()}
                                                    </option>
                                                )
                                            )
                                        )}
                                </select>
                                {selectedCup.digital_print &&
                                    cupConfig.imprintType === "polylux_1" && (
                                        <span className="absolute left-0 -bottom-4 text-xs text-slate-600">
                                            {lang === "1"
                                                ? "Liczba kolorów dotyczy tylko polylux"
                                                : "Number of colors applies to polylux only"}
                                        </span>
                                    )}
                            </div>
                        )}
                    {selectedCup.trend_color &&
                        (!forbidden.trend_color_both ||
                            !forbidden.trend_color_inside ||
                            !forbidden.trend_color_lowered_edge ||
                            !forbidden.trend_color_outside) && (
                            <div className="flex flex-row justify-between items-center">
                                Trend Color:
                                <select
                                    defaultValue=""
                                    id="trend_color"
                                    onChange={(e) => {
                                        if (e.target.value === cupConfig.trend_color) return;
                                        setCupConfig({
                                            ...cupConfig,
                                            trend_color: e.target
                                                .value as CupConfigInterface["trend_color"],
                                            pro_color: false,
                                            nadruk_wewnatrz_na_sciance: 0,
                                            nadruk_na_uchu: false,
                                            nadruk_na_spodzie: false,
                                            nadruk_na_dnie: false,
                                            nadruk_przez_rant: false,
                                            nadruk_apla: false,
                                            nadruk_dookola_pod_uchem: false,
                                            nadruk_zlotem: false,
                                            personalizacja: false,
                                            zdobienie_paskiem: false,
                                            zdobienie_tapeta_na_barylce: false,
                                            nadruk_na_powloce_magicznej_1_kolor: false,
                                            naklejka_papierowa_z_nadrukiem: false,
                                            wkladanie_ulotek_do_kubka: false,
                                        });
                                        resetInputs(document, {
                                            pro_color: true,
                                            nadruk_na_wewnatrz_sciance: true,
                                            nadruk_na_uchu: true,
                                            nadruk_na_spodzie: true,
                                            nadruk_na_dnie: true,
                                            nadruk_przez_rant: true,
                                            nadruk_apla: true,
                                            nadruk_dookola_pod_uchem: true,
                                            nadruk_zlotem: true,
                                            personalizacja: true,
                                            zdobienie_paskiem: true,
                                            nadruk_na_powloce_magicznej_1_kolor: true,
                                            zdobienie_tapeta_na_barylce: true,
                                            naklejka_papierowa_z_nadrukiem: true,
                                            wkladanie_ulotek_do_kubka: true,
                                        });
                                    }}
                                    className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                                >
                                    <option value="">
                                        {lang === "1" ? "Bez Trend Color" : "No Trend Color"}
                                    </option>
                                    {!forbidden.trend_color_inside && (
                                        <option value="inside">
                                            {lang === "1" ? "Wewnątrz" : "Inside"}
                                        </option>
                                    )}
                                    {!forbidden.trend_color_outside && (
                                        <option value="outside">
                                            {lang === "1" ? "Zewnątrz" : "Outside"}
                                        </option>
                                    )}
                                    {!forbidden.trend_color_both && (
                                        <option value="both">
                                            {lang === "1"
                                                ? "Wenątrz i na zewnątrz"
                                                : "Inside and outside"}
                                        </option>
                                    )}
                                    {selectedCup.trend_color_lowered_edge &&
                                        !forbidden.trend_color_lowered_edge && (
                                            <option value="lowered_edge">
                                                {lang === "1"
                                                    ? "Na zewnątrz z obniżonym rantem"
                                                    : "Outside with lowered edge"}
                                            </option>
                                        )}
                                </select>
                            </div>
                        )}
                    {selectedCup.pro_color &&
                        !(cupConfig.trend_color === "inside") &&
                        !forbidden.pro_color && (
                            <div className="flex flex-row justify-between items-center">
                                Pro Color:
                                <select
                                    defaultValue=""
                                    id="pro_color"
                                    onChange={(e) => {
                                        setCupConfig({
                                            ...cupConfig,
                                            pro_color: e.target.value ? true : false,
                                            nadruk_wewnatrz_na_sciance: 0,
                                            nadruk_na_uchu: false,
                                            nadruk_na_spodzie: false,
                                            nadruk_na_dnie: false,
                                            nadruk_przez_rant: false,
                                            nadruk_apla: false,
                                            nadruk_dookola_pod_uchem: false,
                                            nadruk_zlotem: false,
                                            personalizacja: false,
                                            zdobienie_paskiem: false,
                                            zdobienie_tapeta_na_barylce: false,
                                            nadruk_na_powloce_magicznej_1_kolor: false,
                                            naklejka_papierowa_z_nadrukiem: false,
                                            wkladanie_ulotek_do_kubka: false,
                                        });
                                        resetInputs(document, {
                                            nadruk_na_wewnatrz_sciance: true,
                                            nadruk_na_uchu: true,
                                            nadruk_na_spodzie: true,
                                            nadruk_na_dnie: true,
                                            nadruk_przez_rant: true,
                                            nadruk_apla: true,
                                            nadruk_dookola_pod_uchem: true,
                                            nadruk_zlotem: true,
                                            personalizacja: true,
                                            zdobienie_paskiem: true,
                                            nadruk_na_powloce_magicznej_1_kolor: true,
                                            zdobienie_tapeta_na_barylce: true,
                                            naklejka_papierowa_z_nadrukiem: true,
                                            wkladanie_ulotek_do_kubka: true,
                                            cardboard: true,
                                        });
                                    }}
                                    className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                                >
                                    <option value="">
                                        {lang === "1" ? "Bez Pro Color" : "No Pro Color"}
                                    </option>
                                    <option value="pro_color">
                                        {lang === "1" ? "Wewnątrz" : "Inside"}
                                    </option>
                                </select>
                            </div>
                        )}
                    {selectedCup.soft_touch && !forbidden.soft_touch && (
                        <div className="flex flex-row justify-between items-center">
                            Soft Touch:
                            <select
                                defaultValue=""
                                id="soft_touch"
                                onChange={(e) => {
                                    setCupConfig({
                                        ...cupConfig,
                                        soft_touch: e.target.value ? true : false,
                                        nadruk_wewnatrz_na_sciance: 0,
                                        nadruk_na_uchu: false,
                                        nadruk_na_spodzie: false,
                                        nadruk_na_dnie: false,
                                        nadruk_przez_rant: false,
                                        nadruk_apla: false,
                                        nadruk_dookola_pod_uchem: false,
                                        nadruk_zlotem: false,
                                        personalizacja: false,
                                        zdobienie_paskiem: false,
                                        zdobienie_tapeta_na_barylce: false,
                                        nadruk_na_powloce_magicznej_1_kolor: false,
                                        naklejka_papierowa_z_nadrukiem: false,
                                        wkladanie_ulotek_do_kubka: false,
                                    });
                                    resetInputs(document, {
                                        nadruk_na_wewnatrz_sciance: true,
                                        nadruk_na_uchu: true,
                                        nadruk_na_spodzie: true,
                                        nadruk_na_dnie: true,
                                        nadruk_przez_rant: true,
                                        nadruk_apla: true,
                                        nadruk_dookola_pod_uchem: true,
                                        nadruk_zlotem: true,
                                        personalizacja: true,
                                        zdobienie_paskiem: true,
                                        nadruk_na_powloce_magicznej_1_kolor: true,
                                        zdobienie_tapeta_na_barylce: true,
                                        naklejka_papierowa_z_nadrukiem: true,
                                        wkladanie_ulotek_do_kubka: true,
                                        cardboard: true,
                                    });
                                }}
                                className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                            >
                                <option value="">
                                    {lang === "1" ? "Bez Soft Touch" : "No Soft Touch"}
                                </option>
                                <option value="soft_touch">
                                    {lang === "1" ? "Zewnątrz" : "Outside"}
                                </option>
                            </select>
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-wrap gap-1 accent-[#009E60] bg-slate-100 pt-4 pb-2">
                    {selectedCup.nadruk_wewnatrz_na_sciance &&
                        !forbidden.nadruk_wewnatrz_na_sciance && (
                            <div className="flex flex-row gap-2 items-center mx-4">
                                <input
                                    type="checkbox"
                                    id="nadruk_wewnatrz_na_sciance"
                                    onChange={(e) =>
                                        e.target.checked
                                            ? setCupConfig({
                                                  ...cupConfig,
                                                  nadruk_wewnatrz_na_sciance: 1,
                                              })
                                            : setCupConfig({
                                                  ...cupConfig,
                                                  nadruk_wewnatrz_na_sciance: 0,
                                              })
                                    }
                                    className="cursor-pointer"
                                />
                                <p className="py-[2px]">
                                    {lang === "1"
                                        ? "Nadruk wewnątrz na ściance"
                                        : "Print on the wall inside"}
                                </p>
                                {cupConfig.nadruk_wewnatrz_na_sciance ? (
                                    <select
                                        defaultValue="1"
                                        id="nadruk_wewnatrz_na_sciance_select"
                                        onChange={(e) =>
                                            setCupConfig({
                                                ...cupConfig,
                                                nadruk_wewnatrz_na_sciance: parseInt(
                                                    e.target.value
                                                ) as 1 | 2 | 3 | 4,
                                            })
                                        }
                                        className="border w-16 border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                ) : (
                                    <div className="w-16" />
                                )}
                            </div>
                        )}
                    {selectedCup.nadruk_na_uchu && !forbidden.nadruk_na_uchu && (
                        <div className="flex flex-row gap-2 items-center mx-4">
                            <input
                                type="checkbox"
                                id="nadruk_na_uchu"
                                onChange={(e) =>
                                    setCupConfig({
                                        ...cupConfig,
                                        nadruk_na_uchu: e.target.checked,
                                    })
                                }
                                className="cursor-pointer"
                            />
                            <p className="py-[2px]">
                                {lang === "1" ? "Nadruk na uchu" : "Print on the handle"}
                            </p>
                        </div>
                    )}
                    {selectedCup.nadruk_na_spodzie && !forbidden.nadruk_na_spodzie && (
                        <div className="flex flex-row gap-2 items-center mx-4">
                            <input
                                type="checkbox"
                                id="nadruk_na_spodzie"
                                onChange={(e) =>
                                    setCupConfig({
                                        ...cupConfig,
                                        nadruk_na_spodzie: e.target.checked,
                                    })
                                }
                                className="cursor-pointer"
                            />
                            <p className="py-[2px]">
                                {lang === "1"
                                    ? "Nadruk na spodzie (zewn.)"
                                    : "Print on the bottom outside"}
                            </p>
                        </div>
                    )}
                    {selectedCup.nadruk_na_dnie &&
                        cupConfig.trend_color !== "inside" &&
                        !forbidden.nadruk_na_dnie && (
                            <div className="flex flex-row gap-2 items-center mx-4">
                                <input
                                    type="checkbox"
                                    id="nadruk_na_dnie"
                                    onChange={(e) =>
                                        setCupConfig({
                                            ...cupConfig,
                                            nadruk_na_dnie: e.target.checked,
                                        })
                                    }
                                    className="cursor-pointer"
                                />
                                <p className="py-[2px]">
                                    {lang === "1"
                                        ? "Nadruk na dnie (wewn.)"
                                        : "Print on the bottom inside"}
                                </p>
                            </div>
                        )}
                    {selectedCup.nadruk_przez_rant && !forbidden.nadruk_przez_rant && (
                        <div className="flex flex-row gap-2 items-center mx-4">
                            <input
                                type="checkbox"
                                id="nadruk_przez_rant"
                                onChange={(e) =>
                                    setCupConfig({
                                        ...cupConfig,
                                        nadruk_przez_rant: e.target.checked,
                                    })
                                }
                                className="cursor-pointer"
                            />
                            <p className="py-[2px]">
                                {lang === "1" ? "Nadruk przez rant" : "Over the rim imprint"}
                            </p>
                        </div>
                    )}
                    {selectedCup.nadruk_apla && !forbidden.nadruk_apla && (
                        <div className="flex flex-row gap-2 items-center mx-4">
                            <input
                                type="checkbox"
                                id="nadruk_apla"
                                onChange={(e) =>
                                    setCupConfig({
                                        ...cupConfig,
                                        nadruk_apla: e.target.checked,
                                    })
                                }
                                className="cursor-pointer"
                            />
                            <p className="py-[2px]">
                                {lang === "1" ? "Nadruk apla" : "Apla print"}
                            </p>
                        </div>
                    )}
                    {selectedCup.nadruk_dookola_pod_uchem &&
                        !forbidden.nadruk_dookola_pod_uchem && (
                            <div className="flex flex-row gap-2 items-center mx-4">
                                <input
                                    type="checkbox"
                                    id="nadruk_dookola_pod_uchem"
                                    onChange={(e) =>
                                        setCupConfig({
                                            ...cupConfig,
                                            nadruk_dookola_pod_uchem: e.target.checked,
                                        })
                                    }
                                    className="cursor-pointer"
                                />
                                <p className="py-[2px]">
                                    {lang === "1"
                                        ? "Nadruk dookoła (pod uchem)"
                                        : "Print around (under the handle)"}
                                </p>
                            </div>
                        )}
                    {((selectedCup.nadruk_zlotem_do_25cm2 && !forbidden.nadruk_zlotem_25) ||
                        (selectedCup.nadruk_zlotem_do_50cm2 && !forbidden.nadruk_zlotem_50)) && (
                        <div className="flex flex-row gap-2 items-center mx-4">
                            <input
                                type="checkbox"
                                id="nadruk_zlotem"
                                onChange={(e) =>
                                    setCupConfig({
                                        ...cupConfig,
                                        nadruk_zlotem: e.target.checked,
                                    })
                                }
                                className="cursor-pointer"
                            />
                            <p className="py-[2px]">
                                {lang === "1" ? "Nadruk złotem" : "Gold print"}
                            </p>
                            {cupConfig.nadruk_zlotem ? (
                                <select
                                    defaultValue=""
                                    id="nadruk_zlotem_select"
                                    onChange={(e) => {
                                        setCupConfig({
                                            ...cupConfig,
                                            nadruk_zlotem: e.target.value as "25" | "50",
                                        });
                                    }}
                                    className="border w-32 border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                                >
                                    <option value="" disabled hidden>
                                        {lang === "1" ? "Brak" : "None"}
                                    </option>
                                    {selectedCup.nadruk_zlotem_do_25cm2 &&
                                        !forbidden.nadruk_zlotem_25 && (
                                            <option value="25">{"<= 25cm2"}</option>
                                        )}
                                    {selectedCup.nadruk_zlotem_do_50cm2 &&
                                        !forbidden.nadruk_zlotem_50 && (
                                            <option value="50">{"<= 50cm2"}</option>
                                        )}
                                </select>
                            ) : (
                                <div className="w-32" />
                            )}
                        </div>
                    )}
                    {selectedCup.personalizacja && !forbidden.personalizacja && (
                        <div className="flex flex-row gap-2 items-center mx-4">
                            <input
                                type="checkbox"
                                id="personalizacja"
                                onChange={(e) =>
                                    setCupConfig({
                                        ...cupConfig,
                                        personalizacja: e.target.checked,
                                    })
                                }
                                className="cursor-pointer"
                            />
                            <p className="py-[2px]">
                                {lang === "1" ? "Personalizacja" : "Personalization"}
                            </p>
                        </div>
                    )}
                    {((selectedCup.zdobienie_paskiem_bez_laczenia &&
                        !forbidden.zdobienie_paskiem_bez_laczenia) ||
                        (selectedCup.zdobienie_paskiem_z_laczeniem &&
                            !forbidden.zdobienie_paskiem_z_laczeniem)) && (
                        <div className="flex flex-row gap-2 items-center mx-4">
                            <input
                                type="checkbox"
                                id="zdobienie_paskiem"
                                onChange={(e) =>
                                    setCupConfig({
                                        ...cupConfig,
                                        zdobienie_paskiem: e.target.checked,
                                    })
                                }
                                className="cursor-pointer"
                            />
                            <p className="py-[2px]">
                                {lang === "1" ? "Zdobienie paskiem" : "Decoration with stripe"}
                            </p>
                            {cupConfig.zdobienie_paskiem ? (
                                <select
                                    defaultValue=""
                                    id="zdobienie_paskiem_select"
                                    onChange={(e) => {
                                        setCupConfig({
                                            ...cupConfig,
                                            zdobienie_paskiem: e.target.value as
                                                | "bez_laczenia"
                                                | "z_laczeniem",
                                        });
                                    }}
                                    className="border w-48 border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                                >
                                    <option value="" disabled hidden>
                                        {lang === "1" ? "Brak" : "None"}
                                    </option>
                                    {selectedCup.zdobienie_paskiem_bez_laczenia &&
                                        !forbidden.zdobienie_paskiem_bez_laczenia && (
                                            <option value="bez_laczenia">
                                                {lang === "1"
                                                    ? "Bez łączenia"
                                                    : "Without connection"}
                                            </option>
                                        )}
                                    {selectedCup.zdobienie_paskiem_z_laczeniem &&
                                        !forbidden.zdobienie_paskiem_z_laczeniem && (
                                            <option value="z_laczeniem">
                                                {lang === "1" ? "Z łączeniem" : "With connection"}
                                            </option>
                                        )}
                                </select>
                            ) : (
                                <div className="w-48" />
                            )}
                        </div>
                    )}
                    {selectedCup.nadruk_na_powloce_magicznej_1_kolor &&
                        !forbidden.nadruk_na_powloce_magicznej_1_kolor && (
                            <div className="flex flex-row gap-2 items-center mx-4">
                                <input
                                    type="checkbox"
                                    id="nadruk_na_powloce_magicznej_1_kolor"
                                    onChange={(e) =>
                                        e.target.checked
                                            ? setCupConfig({
                                                  ...cupConfig,
                                                  nadruk_na_powloce_magicznej_1_kolor: true,
                                              })
                                            : setCupConfig({
                                                  ...cupConfig,
                                                  nadruk_na_powloce_magicznej_1_kolor: false,
                                              })
                                    }
                                    className="cursor-pointer"
                                />
                                <p className="py-[2px]">
                                    {lang === "1"
                                        ? "Nadruk na powłoce magicznej (1 kolor)"
                                        : "Print on the magic coating (1 color)"}
                                </p>
                            </div>
                        )}
                    {((selectedCup.zdobienie_tapeta_na_barylce_I_stopien_trudnosci &&
                        !forbidden.zdobienie_tapeta_na_barylce_I_stopien) ||
                        (selectedCup.zdobienie_tapeta_na_barylce_II_stopien_trudnosci &&
                            !forbidden.zdobienie_tapeta_na_barylce_II_stopien)) && (
                        <div className="flex flex-row gap-2 items-center mx-4">
                            <input
                                type="checkbox"
                                id="zdobienie_tapeta_na_barylce"
                                onChange={(e) =>
                                    setCupConfig({
                                        ...cupConfig,
                                        zdobienie_tapeta_na_barylce: e.target.checked,
                                    })
                                }
                                className="cursor-pointer"
                            />
                            <p className="py-[2px]">
                                {lang === "1"
                                    ? "Zdobienie tapetą na baryłce"
                                    : "Decoration with tape on the barrel"}
                            </p>
                            {cupConfig.zdobienie_tapeta_na_barylce ? (
                                <select
                                    defaultValue=""
                                    id="zdobienie_tapeta_na_barylce_select"
                                    onChange={(e) => {
                                        setCupConfig({
                                            ...cupConfig,
                                            zdobienie_tapeta_na_barylce: e.target.value as
                                                | "I_stopien"
                                                | "II_stopien",
                                        });
                                    }}
                                    className="border w-52 border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
                                >
                                    <option value="" disabled hidden>
                                        {lang === "1" ? "Brak" : "None"}
                                    </option>
                                    {selectedCup.zdobienie_tapeta_na_barylce_I_stopien_trudnosci &&
                                        !forbidden.zdobienie_tapeta_na_barylce_I_stopien && (
                                            <option value="I_stopien">
                                                {lang === "1"
                                                    ? "I stopień trudności"
                                                    : "I degree of difficulty"}
                                            </option>
                                        )}
                                    {selectedCup.zdobienie_tapeta_na_barylce_II_stopien_trudnosci &&
                                        !forbidden.zdobienie_tapeta_na_barylce_II_stopien && (
                                            <option value="II_stopien">
                                                {lang === "1"
                                                    ? "II stopień trudności"
                                                    : "II degree of difficulty"}
                                            </option>
                                        )}
                                </select>
                            ) : (
                                <div className="w-52" />
                            )}
                        </div>
                    )}
                    {selectedCup.naklejka_papierowa_z_nadrukiem &&
                        !forbidden.naklejka_papierowa_z_nadrukiem && (
                            <div className="flex flex-row gap-2 items-center mx-4">
                                <input
                                    type="checkbox"
                                    id="naklejka_papierowa_z_nadrukiem"
                                    onChange={(e) =>
                                        e.target.checked
                                            ? setCupConfig({
                                                  ...cupConfig,
                                                  naklejka_papierowa_z_nadrukiem: true,
                                              })
                                            : setCupConfig({
                                                  ...cupConfig,
                                                  naklejka_papierowa_z_nadrukiem: false,
                                              })
                                    }
                                    className="cursor-pointer"
                                />
                                <p className="py-[2px]">
                                    {lang === "1"
                                        ? "Naklejka papierowa z nadrukiem"
                                        : "Paper sticker with imprint"}
                                </p>
                            </div>
                        )}
                    {selectedCup.wkladanie_ulotek_do_kubka &&
                        !forbidden.wkladanie_ulotek_do_kubka && (
                            <div className="flex flex-row gap-2 items-center mx-4">
                                <input
                                    type="checkbox"
                                    id="wkladanie_ulotek_do_kubka"
                                    onChange={(e) =>
                                        e.target.checked
                                            ? setCupConfig({
                                                  ...cupConfig,
                                                  wkladanie_ulotek_do_kubka: true,
                                              })
                                            : setCupConfig({
                                                  ...cupConfig,
                                                  naklejka_papierowa_z_nadrukiem: false,
                                              })
                                    }
                                    className="cursor-pointer"
                                />
                                <p className="py-[2px]">
                                    {lang === "1"
                                        ? "Wkładanie ulotek do kubka"
                                        : "Inserting leaflets into the mug"}
                                </p>
                            </div>
                        )}
                </div>
            </div>
            <div className="ml-[40%] w-[60%] mt-5">
                <div className="flex flex-row ml-64 gap-[28px] items-center relative">
                    <div className="inline-flex flex-col absolute -left-64 bg-slate-100 px-4 pb-4 pt-2">
                        <p className="py-[2px]">{lang === "1" ? "Opakowanie: " : "Packaging: "}</p>
                        <select
                            defaultValue=""
                            id="cardboard"
                            onChange={(e) =>
                                setCupConfig({
                                    ...cupConfig,
                                    cardboard: e.target.value as CupConfigInterface["cardboard"],
                                })
                            }
                            className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md h-max"
                        >
                            <option value="">
                                {lang === "1" ? "Opakowanie zbiorcze" : "Bulk packaging"}
                            </option>
                            <option value="singular">
                                {lang === "1" ? "Kartoniki jednostkowe" : "Single boxes"}
                            </option>
                            {selectedCup.category !== "filiżanka" && (
                                <>
                                    <option value="6pack_wykrojnik">
                                        {lang === "1" ? "6-pak z wykrojnika" : "6-pack from a die"}
                                    </option>
                                    <option value="6pack_klapowy">
                                        {lang === "1" ? "6-pak klapowy" : "6-pack flap"}
                                    </option>
                                </>
                            )}
                        </select>
                    </div>
                    <PalletQuantities
                        lang={lang}
                        selectedCardboard={cupConfig.cardboard}
                        selectedCup={selectedCup}
                        amount={amounts.amount1}
                        keep={amounts.inputs > 0}
                    />
                    <PalletQuantities
                        lang={lang}
                        selectedCardboard={cupConfig.cardboard}
                        selectedCup={selectedCup}
                        amount={amounts.amount2}
                        keep={amounts.inputs > 1}
                    />
                    <PalletQuantities
                        lang={lang}
                        selectedCardboard={cupConfig.cardboard}
                        selectedCup={selectedCup}
                        amount={amounts.amount3}
                        keep={amounts.inputs > 2}
                    />
                </div>
            </div>
            <div className="mt-5 w-full flex justify-center gap-8">
                <button
                    className={`px-2 py-1 rounded-md ${
                        loading || (!amounts.amount1 && !amounts.amount2 && !amounts.amount3)
                            ? "bg-slate-400"
                            : "bg-green-300 hover:bg-green-400"
                    }`}
                    onClick={() =>
                        downloadPdf({
                            amounts,
                            cupConfig,
                            selectedCup,
                            lang,
                            additionalValues,
                            colorPricing,
                            clientPriceUnit,
                        })
                    }
                    disabled={loading || (!amounts.amount1 && !amounts.amount2 && !amounts.amount3)}
                >
                    {lang === "1" ? "Pobierz potwierdzenie" : "Download confirmation"}
                </button>
                <button
                    className={`px-2 py-1 rounded-md ${
                        loading || (!amounts.amount1 && !amounts.amount2 && !amounts.amount3)
                            ? "bg-slate-400"
                            : "bg-green-300 hover:bg-green-400"
                    }`}
                    onClick={async () => {
                        const res = await copyCalcToClip({
                            amounts,
                            cupConfig,
                            selectedCup,
                            lang,
                            additionalValues,
                            colorPricing,
                            clientPriceUnit,
                        });

                        if (res) {
                            toast.success(
                                lang === "1" ? "Skopiowano do schowka" : "Copied to clipboard"
                            );
                            return;
                        }

                        toast.error(
                            lang === "1"
                                ? "Wystąpił błąd podczas kopiowania do schowka"
                                : "An error occurred while copying to clipboard"
                        );
                    }}
                    disabled={loading || (!amounts.amount1 && !amounts.amount2 && !amounts.amount3)}
                >
                    {lang === "1" ? "Skopiuj do schowka" : "Copy to clipboard"}
                </button>
            </div>
        </div>
    );
};

export interface CupConfigInterface {
    trend_color: "" | "inside" | "outside" | "both" | "lowered_edge";
    soft_touch: boolean;
    pro_color: boolean;
    imprintType:
        | ""
        | "direct_print"
        | "transfer_plus_1"
        | "transfer_plus_2"
        | "transfer_plus_round"
        | "polylux_1"
        | "polylux_2"
        | "polylux_round"
        | "deep_effect_1"
        | "deep_effect_2"
        | "deep_effect_plus_1"
        | "deep_effect_plus_2"
        | "digital_print";
    imprintColors: number;
    nadruk_wewnatrz_na_sciance: 0 | 1 | 2 | 3 | 4;
    nadruk_na_uchu: boolean;
    nadruk_na_spodzie: boolean;
    nadruk_na_dnie: boolean;
    nadruk_przez_rant: boolean;
    nadruk_apla: boolean;
    nadruk_dookola_pod_uchem: boolean;
    nadruk_zlotem: true | false | "25" | "50";
    personalizacja: boolean;
    zdobienie_paskiem: true | false | "bez_laczenia" | "z_laczeniem";
    nadruk_na_powloce_magicznej_1_kolor: boolean;
    zdobienie_tapeta_na_barylce: true | false | "I_stopien" | "II_stopien";
    naklejka_papierowa_z_nadrukiem: boolean;
    wkladanie_ulotek_do_kubka: boolean;
    cardboard: "" | "singular" | "6pack_wykrojnik" | "6pack_klapowy";
}
