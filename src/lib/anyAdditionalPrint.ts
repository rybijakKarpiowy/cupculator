import { CupConfigInterface } from "@/components/calculator/calculator";

export const anyAdditionalPrint = (cupConfig: CupConfigInterface) => {
    const output =
        cupConfig.nadruk_apla ||
        cupConfig.nadruk_dookola_pod_uchem ||
        cupConfig.nadruk_na_dnie ||
        cupConfig.nadruk_na_powloce_magicznej_1_kolor ||
        cupConfig.nadruk_na_spodzie ||
        cupConfig.nadruk_na_uchu ||
        cupConfig.nadruk_przez_rant ||
        cupConfig.nadruk_wewnatrz_na_sciance;

    if (output) {
        return true;
    } else {
        return false;
    }
};
