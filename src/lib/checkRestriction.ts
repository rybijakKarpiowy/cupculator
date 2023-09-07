import { CupConfigInterface } from "@/components/calculator/calculator";

export const checkRestriction = ({
    cupConfig,
    restrictions,
    imprintType,
    anotherValue,
}: {
    cupConfig: CupConfigInterface;
    restrictions: Restriction[];
    imprintType?: Restriction["imprintType"];
    anotherValue?: Restriction["anotherValue"];
}) => {
    if (!restrictions || !restrictions.length) return false;
    if (!cupConfig) return false;
    if (!imprintType && !anotherValue) return false;

    if (imprintType) {
        const imprintTypeRestriction = restrictions.filter(
            (restriction) => restriction.imprintType === imprintType
        );
        if (!imprintTypeRestriction || !imprintTypeRestriction.length) {
            return false;
        }

        for (const element of imprintTypeRestriction) {
            const restr = element.anotherValue;
            if (imprintType === "digital_print") {
            }
            switch (restr) {
                case "trend_color_inside":
                    if (cupConfig.trend_color === "inside") return true;
                case "trend_color_outside":
                    if (cupConfig.trend_color === "outside") return true;
                case "trend_color_both":
                    if (cupConfig.trend_color === "both") return true;
                case "trend_color_lowered_edge":
                    if (cupConfig.trend_color === "lowered_edge") return true;
                case "soft_touch":
                    if (cupConfig.soft_touch) return true;
                case "pro_color":
                    if (cupConfig.pro_color) return true;
                // case "nadruk_wewnatrz_na_sciance":
                //     if (!!cupConfig.nadruk_wewnatrz_na_sciance) return true;
                // case "nadruk_na_uchu":
                //     if (cupConfig.nadruk_na_uchu) return true;
                // case "nadruk_na_spodzie":
                //     if (cupConfig.nadruk_na_spodzie) return true;
                // case "nadruk_na_dnie":
                //     if (cupConfig.nadruk_na_dnie) return true;
                // case "nadruk_przez_rant":
                //     if (cupConfig.nadruk_przez_rant) return true;
                // case "nadruk_apla":
                //     if (cupConfig.nadruk_apla) return true;
                // case "nadruk_dookola_pod_uchem":
                //     if (cupConfig.nadruk_dookola_pod_uchem) return true;
                // case "nadruk_zlotem_25":
                //     if (cupConfig.nadruk_zlotem === "25") return true;
                // case "nadruk_zlotem_50":
                //     if (cupConfig.nadruk_zlotem === "50") return true;
                // case "personalizacja":
                //     if (cupConfig.personalizacja) return true;
                // case "zdobienie_paskiem_bez_laczenia":
                //     if (cupConfig.zdobienie_paskiem === "bez_laczenia") return true;
                // case "zdobienie_paskiem_z_laczeniem":
                //     if (cupConfig.zdobienie_paskiem === "z_laczeniem") return true;
                // case "nadruk_na_powloce_magicznej_1_kolor":
                //     if (cupConfig.nadruk_na_powloce_magicznej_1_kolor) return true;
                // case "zdobienie_tapeta_na_barylce_I_stopien":
                //     if (cupConfig.zdobienie_tapeta_na_barylce === "I_stopien") return true;
                // case "zdobienie_tapeta_na_barylce_II_stopien":
                //     if (cupConfig.zdobienie_tapeta_na_barylce === "II_stopien") return true;
                // case "naklejka_papierowa_z_nadrukiem":
                //     if (cupConfig.naklejka_papierowa_z_nadrukiem) return true;
                // case "wkladanie_ulotek_do_kubka":
                //     if (cupConfig.wkladanie_ulotek_do_kubka) return true;
                default:
                    continue;
            }
        }
    }

    if (anotherValue) {
        const anotherValueRestriction = restrictions.filter(
            (restriction) => restriction.anotherValue === anotherValue
        );
        if (!anotherValueRestriction || !anotherValueRestriction.length) {
            return false;
        }
        for (const element of anotherValueRestriction) {
            const restr = element.imprintType;
            switch (restr) {
                case "deep_effect":
                    if (
                        cupConfig.imprintType === "deep_effect_1" ||
                        cupConfig.imprintType === "deep_effect_2"
                    )
                        return true;
                    break;
                case "deep_effect_plus":
                    if (
                        cupConfig.imprintType === "deep_effect_1" ||
                        cupConfig.imprintType === "deep_effect_2"
                    )
                        return true;
                    break;
                case "digital_print":
                    if (cupConfig.imprintType === "digital_print") return true;
                    break;
                case "polylux":
                    if (
                        cupConfig.imprintType === "polylux_1" ||
                        cupConfig.imprintType === "polylux_2" ||
                        cupConfig.imprintType === "polylux_round"
                    )
                        return true;
                    break;
                case "transfer_plus":
                    if (
                        cupConfig.imprintType === "transfer_plus_1" ||
                        cupConfig.imprintType === "transfer_plus_2" ||
                        cupConfig.imprintType === "transfer_plus_round"
                    )
                        return true;
                    break;
                case "direct_print":
                    if (cupConfig.imprintType === "direct_print") return true;
                    break;
                default:
                    continue;
            }
        }
    }
    return false;
};

export const getNewForbidden = ({
    cupConfig,
    restrictions,
}: {
    cupConfig: CupConfigInterface;
    restrictions: Restriction[];
}) => {
    const newForbidden = {
        direct_print: checkRestriction({
            cupConfig,
            restrictions,
            imprintType: "direct_print",
        }),
        transfer_plus: checkRestriction({
            cupConfig,
            restrictions,
            imprintType: "transfer_plus",
        }),
        polylux: checkRestriction({
            cupConfig,
            restrictions,
            imprintType: "polylux",
        }),
        deep_effect: checkRestriction({
            cupConfig,
            restrictions,
            imprintType: "deep_effect",
        }),
        deep_effect_plus: checkRestriction({
            cupConfig,
            restrictions,
            imprintType: "deep_effect_plus",
        }),
        digital_print: checkRestriction({
            cupConfig,
            restrictions,
            imprintType: "digital_print",
        }),
        trend_color_inside: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "trend_color_inside",
        }),
        trend_color_outside: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "trend_color_outside",
        }),
        trend_color_both: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "trend_color_both",
        }),
        trend_color_lowered_edge: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "trend_color_lowered_edge",
        }),
        soft_touch: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "soft_touch",
        }),
        pro_color: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "pro_color",
        }),
        nadruk_wewnatrz_na_sciance: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_wewnatrz_na_sciance",
        }),
        nadruk_na_uchu: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_na_uchu",
        }),
        nadruk_na_spodzie: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_na_spodzie",
        }),
        nadruk_na_dnie: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_na_dnie",
        }),
        nadruk_przez_rant: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_przez_rant",
        }),
        nadruk_apla: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_apla",
        }),
        nadruk_dookola_pod_uchem: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_dookola_pod_uchem",
        }),
        nadruk_zlotem_25: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_zlotem_25",
        }),
        nadruk_zlotem_50: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_zlotem_50",
        }),
        personalizacja: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "personalizacja",
        }),
        zdobienie_paskiem_bez_laczenia: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "zdobienie_paskiem_bez_laczenia",
        }),
        zdobienie_paskiem_z_laczeniem: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "zdobienie_paskiem_z_laczeniem",
        }),
        nadruk_na_powloce_magicznej_1_kolor: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "nadruk_na_powloce_magicznej_1_kolor",
        }),
        zdobienie_tapeta_na_barylce_I_stopien: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "zdobienie_tapeta_na_barylce_I_stopien",
        }),
        zdobienie_tapeta_na_barylce_II_stopien: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "zdobienie_tapeta_na_barylce_II_stopien",
        }),
        naklejka_papierowa_z_nadrukiem: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "naklejka_papierowa_z_nadrukiem",
        }),
        wkladanie_ulotek_do_kubka: checkRestriction({
            cupConfig,
            restrictions,
            anotherValue: "wkladanie_ulotek_do_kubka",
        }),
    };
    return newForbidden;
};

export interface Restriction {
    id: number;
    imprintType:
        | "direct_print"
        | "transfer_plus"
        | "polylux"
        | "deep_effect"
        | "deep_effect_plus"
        | "digital_print";
    anotherValue:
        | "trend_color_inside"
        | "trend_color_outside"
        | "trend_color_both"
        | "trend_color_lowered_edge"
        | "soft_touch"
        | "pro_color"
        | "nadruk_wewnatrz_na_sciance"
        | "nadruk_na_uchu"
        | "nadruk_na_spodzie"
        | "nadruk_na_dnie"
        | "nadruk_przez_rant"
        | "nadruk_apla"
        | "nadruk_dookola_pod_uchem"
        | "nadruk_zlotem_25"
        | "nadruk_zlotem_50"
        | "personalizacja"
        | "zdobienie_paskiem_bez_laczenia"
        | "zdobienie_paskiem_z_laczeniem"
        | "nadruk_na_powloce_magicznej_1_kolor"
        | "zdobienie_tapeta_na_barylce_I_stopien"
        | "zdobienie_tapeta_na_barylce_II_stopien"
        | "naklejka_papierowa_z_nadrukiem"
        | "wkladanie_ulotek_do_kubka";
}
