import { CupConfigInterface } from "@/app/test/page";

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
    if (!restrictions || !restrictions.length) return true;
    if (!cupConfig) return false;
    if (!imprintType && !anotherValue) return true;

    if (imprintType) {
        const imprintTypeRestriction = restrictions.filter(
            (restriction) => restriction.imprintType === imprintType
        );
        if (!imprintTypeRestriction || !imprintTypeRestriction.length) {
            return true;
        }
        imprintTypeRestriction.forEach((element) => {
            const restr = element.anotherValue;
            switch (restr) {
                case "trend_color_inside":
                    if (cupConfig.trend_color === "inside") return false;
                    break;
                case "trend_color_outside":
                    if (cupConfig.trend_color === "outside") return false;
                    break;
                case "trend_color_both":
                    if (cupConfig.trend_color === "both") return false;
                    break;
                case "trend_color_lowered_edge":
                    if (cupConfig.trend_color === "lowered_edge") return false;
                    break;
                case "soft_touch":
                    if (cupConfig.soft_touch) return false;
                    break;
                case "pro_color":
                    if (cupConfig.pro_color) return false;
                    break;
                default:
                    return true;
            }
        });
    }

    if (anotherValue) {
        const anotherValueRestriction = restrictions.filter(
            (restriction) => restriction.anotherValue === anotherValue
        );
        if (!anotherValueRestriction || !anotherValueRestriction.length) {
            return true;
        }
        anotherValueRestriction.forEach((element) => {
            const restr = element.imprintType;
            switch (restr) {
                case "deep_effect":
                    if (cupConfig.imprintType === "deep_effect_1" || cupConfig.imprintType === "deep_effect_2") return false;
                    break;
                case "deep_effect_plus":
                    if (cupConfig.imprintType === "deep_effect_1" || cupConfig.imprintType === "deep_effect_2") return false;
                    break;
                case "digital_print":
                    if (cupConfig.imprintType === "digital_print") return false;
                    break;
                case "polylux":
                    if (cupConfig.imprintType === "polylux_1" || cupConfig.imprintType === "polylux_2" || cupConfig.imprintType === "polylux_round") return false;
                    break;
                case "transfer_plus":
                    if (cupConfig.imprintType === "transfer_plus_1" || cupConfig.imprintType === "transfer_plus_2" || cupConfig.imprintType === "transfer_plus_round") return false;
                    break;
                case "direct_print":
                    if (cupConfig.imprintType === "direct_print") return false;
                    break;
                default:
                    return true;
            }
        });
    }

    return true;
};

export interface Restriction {
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
