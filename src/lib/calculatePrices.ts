import { Cup } from "@/app/api/updatecups/route";
import { Database } from "@/database/types";
import { ColorPricing } from "./colorPricingType";
import { CupConfigInterface } from "@/components/calculator/calculator";

export const calculatePrices = ({
    amount,
    selectedCup,
    colorPricing,
    additionalValues,
    cupConfig,
    lang,
    clientPriceUnit,
}: {
    amount: number | null;
    selectedCup: Cup;
    colorPricing: ColorPricing;
    additionalValues: Database["public"]["Tables"]["additional_values"]["Row"];
    cupConfig: CupConfigInterface;
    lang: "1" | "2";
    clientPriceUnit: "zł" | "EUR";
}) => {
    if (!amount) return { data: { unit: null, prep: null, transport: null } };

    let amountRange: "24" | "72" | "108" | "216" | "504" | "1008" | "2520";
    if (amount < 72) amountRange = "24";
    else if (amount < 108) amountRange = "72";
    else if (amount < 216) amountRange = "108";
    else if (amount < 504) amountRange = "216";
    else if (amount < 1008) amountRange = "504";
    else if (amount < 2520) amountRange = "1008";
    else amountRange = "2520";

    const cupCost = selectedCup.prices[`price_${amountRange}`];
    let notSoImportantError: string | undefined;
    let nextColor: ColorPricing["polylux"][0] | undefined;
    let imprintCost = 0;
    let prepCost = 0;
    switch (cupConfig.imprintType) {
        case "":
            imprintCost = (cupCost * additionalValues.plain_cup_markup_percent) / 100;
            break;
        case "deep_effect_1":
            imprintCost =
                colorPricing.deep_effect.find((item) => item.sidesCount === "1")?.prices[
                    amountRange
                ] || 0;
            prepCost =
                colorPricing.deep_effect.find((item) => item.sidesCount === "1")?.prepCost || 0;
            break;
        case "deep_effect_2":
            imprintCost =
                colorPricing.deep_effect.find((item) => item.sidesCount === "2")?.prices[
                    amountRange
                ] || 0;
            prepCost =
                colorPricing.deep_effect.find((item) => item.sidesCount === "2")?.prepCost || 0;
            break;
        case "deep_effect_plus_1":
            imprintCost =
                colorPricing.deep_effect_plus.find((item) => item.sidesCount === "1")?.prices[
                    amountRange
                ] || 0;
            prepCost =
                colorPricing.deep_effect_plus.find((item) => item.sidesCount === "1")?.prepCost ||
                0;
            break;
        case "deep_effect_plus_2":
            imprintCost =
                colorPricing.deep_effect_plus.find((item) => item.sidesCount === "2")?.prices[
                    amountRange
                ] || 0;
            prepCost =
                colorPricing.deep_effect_plus.find((item) => item.sidesCount === "2")?.prepCost ||
                0;
            break;
        case "digital_print":
            imprintCost = colorPricing.digital_print.prices[amountRange];
            prepCost = colorPricing.digital_print.prepCost;
            break;
        case "direct_print":
            if (amountRange === "24") {
                return {
                    error:
                        lang === "1"
                            ? "Druk bezpośredni jest niedostępny dla zamówień poniżej 72 sztuk"
                            : "Direct print is not available for orders of less than 72 cups",
                    data: { unit: null, prep: null, transport: null },
                };
            }
            if ((amountRange === "72" || amountRange === "108") && cupConfig.imprintColors > 1) {
                return {
                    error:
                        lang === "1"
                            ? "Druk bezpośredni powyżej jednego koloru jest niedostępny dla zamówień poniżej 216 sztuk"
                            : "Direct print with more that one color is not available for orders of less than 216 cups",
                    data: { unit: null, prep: null, transport: null },
                };
            }
            imprintCost =
                colorPricing.direct_print.find(
                    (item) => parseInt(item.colorCount) === cupConfig.imprintColors
                )?.prices[amountRange] || 0;
            prepCost =
                colorPricing.direct_print.find(
                    (item) => parseInt(item.colorCount) === cupConfig.imprintColors
                )?.prepCost || 0;
            break;
        case "polylux_1":
            nextColor = colorPricing.polylux.find((item) => item.colorCount === "kolejny");
            if (cupConfig.imprintColors <= 6) {
                imprintCost =
                    colorPricing.polylux.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prices[amountRange][1] || 0;
                prepCost =
                    colorPricing.polylux.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prepCost || 0;
            } else {
                imprintCost =
                    colorPricing.polylux.find((item) => item.colorCount === "6")?.prices[
                        amountRange
                    ][1] || 0;
                prepCost =
                    colorPricing.polylux.find((item) => item.colorCount === "6")?.prepCost || 0;
                if (!nextColor)
                    notSoImportantError =
                        lang === "1"
                            ? "Wystąpił bląd, wyświetlono cenę dla 6 kolorów"
                            : "An error occurred, the price for 6 colors was displayed";
                else {
                    imprintCost += nextColor.prices[amountRange][1] * (cupConfig.imprintColors - 6);
                    prepCost += nextColor.prepCost * (cupConfig.imprintColors - 6);
                }
            }
            break;
        case "polylux_2":
            nextColor = colorPricing.polylux.find((item) => item.colorCount === "kolejny");
            if (cupConfig.imprintColors <= 6) {
                imprintCost =
                    colorPricing.polylux.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prices[amountRange][2] || 0;
                prepCost =
                    colorPricing.polylux.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prepCost || 0;
            } else {
                imprintCost =
                    colorPricing.polylux.find((item) => item.colorCount === "6")?.prices[
                        amountRange
                    ][2] || 0;
                prepCost =
                    colorPricing.polylux.find((item) => item.colorCount === "6")?.prepCost || 0;
                if (!nextColor)
                    notSoImportantError =
                        lang === "1"
                            ? "Wystąpił bląd, wyświetlono cenę dla 6 kolorów"
                            : "An error occurred, the price for 6 colors was displayed";
                else {
                    imprintCost += nextColor.prices[amountRange][2] * (cupConfig.imprintColors - 6);
                    prepCost += nextColor.prepCost * (cupConfig.imprintColors - 6);
                }
            }
            break;
        case "polylux_round":
            nextColor = colorPricing.polylux.find((item) => item.colorCount === "kolejny");
            if (cupConfig.imprintColors <= 6) {
                imprintCost =
                    colorPricing.polylux.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prices[amountRange].wallpaper || 0;
                prepCost =
                    colorPricing.polylux.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prepCost || 0;
            } else {
                imprintCost =
                    colorPricing.polylux.find((item) => item.colorCount === "6")?.prices[
                        amountRange
                    ].wallpaper || 0;
                prepCost =
                    colorPricing.polylux.find((item) => item.colorCount === "6")?.prepCost || 0;
                if (!nextColor)
                    notSoImportantError =
                        lang === "1"
                            ? "Wystąpił bląd, wyświetlono cenę dla 6 kolorów"
                            : "An error occurred, the price for 6 colors was displayed";
                else {
                    imprintCost +=
                        nextColor.prices[amountRange].wallpaper * (cupConfig.imprintColors - 6);
                    prepCost += nextColor.prepCost * (cupConfig.imprintColors - 6);
                }
            }
            break;
        case "transfer_plus_1":
            nextColor = colorPricing.transfer_plus.find((item) => item.colorCount === "kolejny");
            if (cupConfig.imprintColors <= 6) {
                imprintCost =
                    colorPricing.transfer_plus.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prices[amountRange][1] || 0;
                prepCost =
                    colorPricing.transfer_plus.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prepCost || 0;
            } else {
                imprintCost =
                    colorPricing.transfer_plus.find((item) => item.colorCount === "6")?.prices[
                        amountRange
                    ][1] || 0;
                prepCost =
                    colorPricing.transfer_plus.find((item) => item.colorCount === "6")?.prepCost ||
                    0;
                if (!nextColor)
                    notSoImportantError =
                        lang === "1"
                            ? "Wystąpił bląd, wyświetlono cenę dla 6 kolorów"
                            : "An error occurred, the price for 6 colors was displayed";
                else {
                    imprintCost += nextColor.prices[amountRange][1] * (cupConfig.imprintColors - 6);
                    prepCost += nextColor.prepCost * (cupConfig.imprintColors - 6);
                }
            }
            break;
        case "transfer_plus_2":
            nextColor = colorPricing.transfer_plus.find((item) => item.colorCount === "kolejny");
            if (cupConfig.imprintColors <= 6) {
                imprintCost =
                    colorPricing.transfer_plus.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prices[amountRange][2] || 0;
                prepCost =
                    colorPricing.transfer_plus.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prepCost || 0;
            } else {
                imprintCost =
                    colorPricing.transfer_plus.find((item) => item.colorCount === "6")?.prices[
                        amountRange
                    ][2] || 0;
                prepCost =
                    colorPricing.transfer_plus.find((item) => item.colorCount === "6")?.prepCost ||
                    0;
                if (!nextColor)
                    notSoImportantError =
                        lang === "1"
                            ? "Wystąpił bląd, wyświetlono cenę dla 6 kolorów"
                            : "An error occurred, the price for 6 colors was displayed";
                else {
                    imprintCost += nextColor.prices[amountRange][2] * (cupConfig.imprintColors - 6);
                    prepCost += nextColor.prepCost * (cupConfig.imprintColors - 6);
                }
            }
            break;
        case "transfer_plus_round":
            nextColor = colorPricing.transfer_plus.find((item) => item.colorCount === "kolejny");
            if (cupConfig.imprintColors <= 6) {
                imprintCost =
                    colorPricing.transfer_plus.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prices[amountRange].wallpaper || 0;
                prepCost =
                    colorPricing.transfer_plus.find(
                        (item) => item.colorCount === cupConfig.imprintColors.toString()
                    )?.prepCost || 0;
            } else {
                imprintCost =
                    colorPricing.transfer_plus.find((item) => item.colorCount === "6")?.prices[
                        amountRange
                    ].wallpaper || 0;
                prepCost =
                    colorPricing.transfer_plus.find((item) => item.colorCount === "6")?.prepCost ||
                    0;
                if (!nextColor)
                    notSoImportantError =
                        lang === "1"
                            ? "Wystąpił bląd, wyświetlono cenę dla 6 kolorów"
                            : "An error occurred, the price for 6 colors was displayed";
                else {
                    imprintCost +=
                        nextColor.prices[amountRange].wallpaper * (cupConfig.imprintColors - 6);
                    prepCost += nextColor.prepCost * (cupConfig.imprintColors - 6);
                }
            }
            break;
    }

    let trendProSoftCost = 0;
    switch (cupConfig.trend_color) {
        case "":
            break;
        case "inside":
            trendProSoftCost +=
                colorPricing.trend_color.find((item) => item.inOut === "Wewnątrz")?.prices[
                    amountRange
                ] || 0;
            break;
        case "outside":
            trendProSoftCost +=
                colorPricing.trend_color.find((item) => item.inOut === "Zewnątrz")?.prices[
                    amountRange
                ] || 0;
            break;
        case "both":
            colorPricing.trend_color.forEach((item) => {
                trendProSoftCost += item.prices[amountRange];
            });
            break;
        case "lowered_edge":
            trendProSoftCost += colorPricing.trend_color_lowered_edge.prices[amountRange];
            break;
    }
    if (cupConfig.pro_color) {
        trendProSoftCost +=
            colorPricing.pro_color.find((item) => item.inOut === "Wewnątrz")?.prices[amountRange] ||
            0;
    }
    if (cupConfig.soft_touch) {
        trendProSoftCost += colorPricing.soft_touch.prices[amountRange];
    }

    let additionalCosts = 0;
    if (cupConfig.nadruk_wewnatrz_na_sciance) {
        additionalCosts +=
            (colorPricing.additional_costs.find(
                (item) => item.name.trim() === "Nadruk wewnątrz na ściance"
            )?.price || 0) * cupConfig.nadruk_wewnatrz_na_sciance;
    }
    if (cupConfig.nadruk_na_uchu) {
        additionalCosts +=
            colorPricing.additional_costs.find((item) => item.name.trim() === "Nadruk na uchu")
                ?.price || 0;
    }
    if (cupConfig.nadruk_na_spodzie) {
        additionalCosts +=
            colorPricing.additional_costs.find((item) => item.name.trim() === "Nadruk na spodzie")
                ?.price || 0;
    }
    if (cupConfig.nadruk_na_dnie) {
        additionalCosts +=
            colorPricing.additional_costs.find((item) => item.name.trim() === "Nadruk na dnie")
                ?.price || 0;
    }
    if (cupConfig.nadruk_przez_rant) {
        additionalCosts +=
            colorPricing.additional_costs.find((item) => item.name.trim() === "Nadruk przez rant")
                ?.price || 0;
    }
    if (cupConfig.nadruk_apla) {
        additionalCosts +=
            colorPricing.additional_costs.find((item) => item.name.trim() === "Nadruk aplą")
                ?.price || 0;
    }
    if (cupConfig.nadruk_dookola_pod_uchem) {
        additionalCosts +=
            colorPricing.additional_costs.find(
                (item) => item.name.trim() === "Nadruk dookoła (pod uchem)"
            )?.price || 0;
    }
    if (cupConfig.nadruk_zlotem) {
        switch (cupConfig.nadruk_zlotem) {
            case "25":
                additionalCosts +=
                    colorPricing.additional_costs.find(
                        (item) => item.name.trim() === "Nadruk złotem do 25 cm2"
                    )?.price || 0;
                break;
            case "50":
                additionalCosts +=
                    colorPricing.additional_costs.find(
                        (item) => item.name.trim() === "Nadruk złotem do 50 cm2"
                    )?.price || 0;
                break;
        }
    }
    if (cupConfig.personalizacja) {
        additionalCosts +=
            colorPricing.additional_costs.find((item) => item.name.trim() === "Personalizacja *")
                ?.price || 0;
        prepCost += 50 * Math.ceil(amount / 70);
    }
    if (cupConfig.zdobienie_paskiem) {
        switch (cupConfig.zdobienie_paskiem) {
            case "bez_laczenia":
                additionalCosts +=
                    colorPricing.additional_costs.find(
                        (item) => item.name.trim() === "Zdobienie paskiem bez łączenia"
                    )?.price || 0;
                break;
            case "z_laczeniem":
                additionalCosts +=
                    colorPricing.additional_costs.find(
                        (item) => item.name.trim() === "Zdobienie paskiem z łączeniem"
                    )?.price || 0;
                break;
        }
    }
    if (cupConfig.nadruk_na_powloce_magicznej_1_kolor) {
        additionalCosts +=
            colorPricing.additional_costs.find(
                (item) => item.name.trim() === "Nadruk na powłoce magicznej (1 kolor) **"
            )?.price || 0;
        prepCost += 50;
    }
    if (cupConfig.zdobienie_tapeta_na_barylce) {
        switch (cupConfig.zdobienie_tapeta_na_barylce) {
            case "I_stopien":
                additionalCosts +=
                    colorPricing.additional_costs.find(
                        (item) =>
                            item.name.trim() === "Zdobienie tapetą na baryłce - I stopień trudności"
                    )?.price || 0;
                break;
            case "II_stopien":
                additionalCosts +=
                    colorPricing.additional_costs.find(
                        (item) =>
                            item.name.trim() ===
                            "Zdobienie tapetą na baryłce - II stopień trudności"
                    )?.price || 0;
                break;
        }
    }
    if (cupConfig.naklejka_papierowa_z_nadrukiem) {
        additionalCosts +=
            colorPricing.additional_costs.find(
                (item) => item.name.trim() === "Naklejka papierowa z nadrukiem"
            )?.price || 0;
    }
    if (cupConfig.wkladanie_ulotek_do_kubka) {
        additionalCosts +=
            colorPricing.additional_costs.find(
                (item) => item.name.trim() === "Wkładanie ulotek do kubka"
            )?.price || 0;
    }

    const palletsCount = { mini: null, half: null, full: null } as {
        mini: number | null;
        half: number | null;
        full: number | null;
    };
    if (cupConfig.cardboard === "singular") {
        palletsCount.mini = selectedCup.mini_pallet_singular
            ? Math.ceil(amount / selectedCup.mini_pallet_singular)
            : null;
        palletsCount.half = selectedCup.half_pallet_singular
            ? Math.ceil(amount / selectedCup.half_pallet_singular)
            : null;
        palletsCount.full = selectedCup.full_pallet_singular
            ? Math.ceil(amount / selectedCup.full_pallet_singular)
            : null;
    } else {
        palletsCount.mini = selectedCup.mini_pallet
            ? Math.ceil(amount / selectedCup.mini_pallet)
            : null;
        palletsCount.half = selectedCup.half_pallet
            ? Math.ceil(amount / selectedCup.half_pallet)
            : null;
        palletsCount.full = selectedCup.full_pallet
            ? Math.ceil(amount / selectedCup.full_pallet)
            : null;
    }

    const palletsCosts = {
        mini: palletsCount.mini ? additionalValues.mini_pallet_price * palletsCount.mini : null,
        half: palletsCount.half ? additionalValues.half_pallet_price * palletsCount.half : null,
        full: palletsCount.full ? additionalValues.full_pallet_price * palletsCount.full : null,
    } as { mini: number | null; half: number | null; full: number | null };

    const unitCost = cupCost + imprintCost + trendProSoftCost + additionalCosts;
    // prepCost is declared earlier
    const transportCost =
        clientPriceUnit === "zł"
            ? Math.min(...(Object.values(palletsCosts).filter((item) => item !== null) as number[]))
            : 0;

    return {
        data: {
            unit: unitCost,
            prep: prepCost,
            transport: transportCost,
        },
        error: notSoImportantError,
    } as {
        data: { unit: number | null; prep: number | null; transport: number | null };
        error?: string;
    };
};
