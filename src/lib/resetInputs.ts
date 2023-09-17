export const resetInputs = async (document: Document, toReset: ToReset) => {
    const {
        trend_color,
        soft_touch,
        pro_color,
        imprintType,
        imprintColors,
        nadruk_na_wewnatrz_sciance,
        nadruk_na_uchu,
        nadruk_na_spodzie,
        nadruk_na_dnie,
        nadruk_przez_rant,
        nadruk_apla,
        nadruk_dookola_pod_uchem,
        nadruk_zlotem,
        personalizacja,
        zdobienie_paskiem,
        nadruk_na_powloce_magicznej_1_kolor,
        zdobienie_tapeta_na_barylce,
        naklejka_papierowa_z_nadrukiem,
        wkladanie_ulotek_do_kubka,
        cardboard,
    } = toReset;

    if (trend_color) {
        const trend_color = document.getElementById("trend_color") as HTMLSelectElement | null;
        if (trend_color) {
            trend_color.value = "";
        }
    }

    if (soft_touch) {
        const soft_touch = document.getElementById("soft_touch") as HTMLSelectElement | null;
        if (soft_touch) {
            soft_touch.value = "";
        }
    }

    if (pro_color) {
        const pro_color = document.getElementById("pro_color") as HTMLSelectElement | null;
        if (pro_color) {
            pro_color.value = "";
        }
    }

    if (imprintType) {
        const imprintType = document.getElementById("imprintType") as HTMLSelectElement | null;
        if (imprintType) {
            imprintType.value = "";
        }
        const imprintColors = document.getElementById("imprintColors") as HTMLSelectElement | null;
        if (imprintColors) {
            imprintColors.value = "1";
        }
    }

    if (imprintColors) {
        const imprintColors = document.getElementById("imprintColors") as HTMLSelectElement | null;
        if (imprintColors) {
            imprintColors.value = "1";
        }
    }

    if (nadruk_na_wewnatrz_sciance) {
        const nadruk_na_wewnatrz_sciance = (await document.getElementById(
            "nadruk_wewnatrz_na_sciance"
        )) as HTMLInputElement | null;
        console.log(nadruk_na_wewnatrz_sciance);
        if (nadruk_na_wewnatrz_sciance) {
            nadruk_na_wewnatrz_sciance.checked = false;
        }
        const nadruk_wewnatrz_na_sciance_select = (await document.getElementById(
            "nadruk_wewnatrz_na_sciance_select"
        )) as HTMLSelectElement | null;
        if (nadruk_wewnatrz_na_sciance_select) {
            nadruk_wewnatrz_na_sciance_select.value = "1";
        }
    }

    if (nadruk_na_uchu) {
        const nadruk_na_uchu = document.getElementById("nadruk_na_uchu") as HTMLInputElement | null;
        if (nadruk_na_uchu) {
            nadruk_na_uchu.checked = false;
        }
    }

    if (nadruk_na_spodzie) {
        const nadruk_na_spodzie = document.getElementById(
            "nadruk_na_spodzie"
        ) as HTMLInputElement | null;
        if (nadruk_na_spodzie) {
            nadruk_na_spodzie.checked = false;
        }
    }

    if (nadruk_na_dnie) {
        const nadruk_na_dnie = document.getElementById("nadruk_na_dnie") as HTMLInputElement | null;
        if (nadruk_na_dnie) {
            nadruk_na_dnie.checked = false;
        }
    }

    if (nadruk_przez_rant) {
        const nadruk_przez_rant = document.getElementById(
            "nadruk_przez_rant"
        ) as HTMLInputElement | null;
        if (nadruk_przez_rant) {
            nadruk_przez_rant.checked = false;
        }
    }

    if (nadruk_apla) {
        const nadruk_apla = document.getElementById("nadruk_apla") as HTMLInputElement | null;
        if (nadruk_apla) {
            nadruk_apla.checked = false;
        }
    }

    if (nadruk_dookola_pod_uchem) {
        const nadruk_dookola_pod_uchem = document.getElementById(
            "nadruk_dookola_pod_uchem"
        ) as HTMLInputElement | null;
        if (nadruk_dookola_pod_uchem) {
            nadruk_dookola_pod_uchem.checked = false;
        }
    }

    if (nadruk_zlotem) {
        const nadruk_zlotem = document.getElementById("nadruk_zlotem") as HTMLInputElement | null;
        if (nadruk_zlotem) {
            nadruk_zlotem.checked = false;
        }
        const nadruk_zlotem_select = document.getElementById(
            "nadruk_zlotem_select"
        ) as HTMLSelectElement | null;
        if (nadruk_zlotem_select) {
            nadruk_zlotem_select.value = "";
        }
    }

    if (personalizacja) {
        const personalizacja = document.getElementById("personalizacja") as HTMLInputElement | null;
        if (personalizacja) {
            personalizacja.checked = false;
        }
    }

    if (zdobienie_paskiem) {
        const zdobienie_paskiem = document.getElementById(
            "zdobienie_paskiem"
        ) as HTMLInputElement | null;
        if (zdobienie_paskiem) {
            zdobienie_paskiem.checked = false;
        }
        const zdobienie_paskiem_select = document.getElementById(
            "zdobienie_paskiem_select"
        ) as HTMLSelectElement | null;
        if (zdobienie_paskiem_select) {
            zdobienie_paskiem_select.value = "";
        }
    }

    if (nadruk_na_powloce_magicznej_1_kolor) {
        const nadruk_na_powloce_magicznej_1_kolor = document.getElementById(
            "nadruk_na_powloce_magicznej_1_kolor"
        ) as HTMLInputElement | null;
        if (nadruk_na_powloce_magicznej_1_kolor) {
            nadruk_na_powloce_magicznej_1_kolor.checked = false;
        }
    }

    if (zdobienie_tapeta_na_barylce) {
        const zdobienie_tapeta_na_barylce = document.getElementById(
            "zdobienie_tapeta_na_barylce"
        ) as HTMLInputElement | null;
        if (zdobienie_tapeta_na_barylce) {
            zdobienie_tapeta_na_barylce.checked = false;
        }
        const zdobienie_tapeta_na_barylce_select = document.getElementById(
            "zdobienie_tapeta_na_barylce_select"
        ) as HTMLSelectElement | null;
        if (zdobienie_tapeta_na_barylce_select) {
            zdobienie_tapeta_na_barylce_select.value = "";
        }
    }

    if (naklejka_papierowa_z_nadrukiem) {
        const naklejka_papierowa_z_nadrukiem = document.getElementById(
            "naklejka_papierowa_z_nadrukiem"
        ) as HTMLInputElement | null;
        if (naklejka_papierowa_z_nadrukiem) {
            naklejka_papierowa_z_nadrukiem.checked = false;
        }
    }

    if (wkladanie_ulotek_do_kubka) {
        const wkladanie_ulotek_do_kubka = document.getElementById(
            "wkladanie_ulotek_do_kubka"
        ) as HTMLInputElement | null;
        if (wkladanie_ulotek_do_kubka) {
            wkladanie_ulotek_do_kubka.checked = false;
        }
    }

    if (cardboard) {
        const cardboard = document.getElementById("cardboard") as HTMLSelectElement | null;
        if (cardboard) {
            cardboard.value = "";
        }
    }
};

interface ToReset {
    trend_color?: boolean;
    soft_touch?: boolean;
    pro_color?: boolean;
    imprintType?: boolean;
    imprintColors?: boolean;
    nadruk_na_wewnatrz_sciance?: boolean;
    nadruk_na_uchu?: boolean;
    nadruk_na_spodzie?: boolean;
    nadruk_na_dnie?: boolean;
    nadruk_przez_rant?: boolean;
    nadruk_apla?: boolean;
    nadruk_dookola_pod_uchem?: boolean;
    nadruk_zlotem?: boolean;
    personalizacja?: boolean;
    zdobienie_paskiem?: boolean;
    nadruk_na_powloce_magicznej_1_kolor?: boolean;
    zdobienie_tapeta_na_barylce?: boolean;
    naklejka_papierowa_z_nadrukiem?: boolean;
    wkladanie_ulotek_do_kubka?: boolean;
    cardboard?: boolean;
}
