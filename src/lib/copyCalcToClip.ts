import { Cup } from "@/app/api/updatecups/route";
import { CupConfigInterface } from "@/components/calculator/calculator";
import { Database } from "@/database/types";
import { ColorPricing } from "./colorPricingType";
import { calculatePrices } from "./calculatePrices";
import { getPalletQuantities } from "./getPalletQuantities";
import { translateColor } from "./translateColor";
import { priceToString } from "./priceToString";

export const copyCalcToClip = ({
    amounts,
    selectedCup,
    colorPricing,
    additionalValues,
    cupConfig,
    lang,
    clientPriceUnit,
}: {
    amounts: {
        amount1: number | null;
        amount2: number | null;
        amount3: number | null;
        inputs: number;
    };
    selectedCup: Cup;
    colorPricing: ColorPricing;
    additionalValues: Database["public"]["Tables"]["additional_values"]["Row"];
    cupConfig: CupConfigInterface;
    lang: "1" | "2";
    clientPriceUnit: "zł" | "EUR";
}) => {
    try {
        let calculatedPrices = {
            1: {
                unit: null as number | null,
                prep: null as number | null,
                transport: null as number | null,
                cardboard: null as number | null,
                singleCardboardPrice: null as number | null,
            },
            2: {
                unit: null as number | null,
                prep: null as number | null,
                transport: null as number | null,
                cardboard: null as number | null,
                singleCardboardPrice: null as number | null,
            },
            3: {
                unit: null as number | null,
                prep: null as number | null,
                transport: null as number | null,
                cardboard: null as number | null,
                singleCardboardPrice: null as number | null,
            },
        };

        for (let i = 1; i <= 3; i++) {
            if (!amounts[`amount${i as 1 | 2 | 3}`]) continue;
            const { data } = calculatePrices({
                amount: amounts[`amount${i as 1 | 2 | 3}`],
                selectedCup,
                colorPricing,
                additionalValues,
                cupConfig,
                lang,
                clientPriceUnit,
            });
            let singleCardboardPrice = 0;
            if (data.cardboard) {
                if (
                    cupConfig.cardboard === "6pack_klapowy" ||
                    cupConfig.cardboard === "6pack_wykrojnik"
                ) {
                    const cardboardCount = Math.ceil((amounts[`amount${i as 1 | 2 | 3}`] || 0) / 6);
                    singleCardboardPrice = amounts[`amount${i as 1 | 2 | 3}`]
                        ? Math.round(
                              ((data.cardboard * cardboardCount) /
                                  amounts[`amount${i as 1 | 2 | 3}`]!) *
                                  100
                          ) / 100
                        : 0;
                } else {
                    singleCardboardPrice = data.cardboard;
                }
            }

            calculatedPrices[i as 1 | 2 | 3] = {
                unit: data.unit,
                prep: data.prep,
                transport: data.transport,
                cardboard: data.cardboard,
                singleCardboardPrice,
            };
        }

        const palletQuantities = {
            1: getPalletQuantities(amounts.amount1, selectedCup, cupConfig.cardboard),
            2: getPalletQuantities(amounts.amount2, selectedCup, cupConfig.cardboard),
            3: getPalletQuantities(amounts.amount3, selectedCup, cupConfig.cardboard),
        };

        const text = `${lang === "1" ? "Data: " : "Date: "}${new Date().toLocaleDateString(
            "pl-PL"
        )}\n\n${lang === "1" ? "Specyfikacja:" : "Specification:"}\n\n${selectedCup.code}\n${
            selectedCup.name
        }\n${selectedCup.volume}\n${
            lang === "1" ? selectedCup.color : translateColor(selectedCup.color)
        }\n\n${
            amounts.amount1 ? `${lang === "1" ? "Ilość: " : "Amount: "}${amounts.amount1}\t` : ""
        }${amounts.amount2 ? `${lang === "1" ? "Ilość: " : "Amount: "}${amounts.amount2}\t` : ""}${
            amounts.amount3 ? `${lang === "1" ? "Ilość: " : "Amount: "}${amounts.amount3}\t` : ""
        }\n${lang === "1" ? "Nadruk: " : "Print type: "}${
            cupConfig.imprintType === "direct_print"
                ? lang === "1"
                    ? "Nadruk bezpośredni"
                    : "Direct print"
                : ""
        }${
            cupConfig.imprintType === "transfer_plus_1"
                ? lang === "1"
                    ? "Transfer Plus 1 strona"
                    : "Transfer Plus 1 side"
                : ""
        }${
            cupConfig.imprintType === "transfer_plus_2"
                ? lang === "1"
                    ? "Transfer Plus 2 strony"
                    : "Transfer Plus 2 sides"
                : ""
        }${
            cupConfig.imprintType === "transfer_plus_round"
                ? lang === "1"
                    ? "Transfer Plus tapeta"
                    : "Transfer Plus wallpaper"
                : ""
        }${
            cupConfig.imprintType === "polylux_1"
                ? lang === "1"
                    ? "Polylux 1 strona"
                    : "Polylux 1 side"
                : ""
        }${
            cupConfig.imprintType === "polylux_2"
                ? lang === "1"
                    ? "Polylux 2 strony"
                    : "Polylux 2 sides"
                : ""
        }${
            cupConfig.imprintType === "polylux_round"
                ? lang === "1"
                    ? "Polylux tapeta"
                    : "Polylux wallpaper"
                : ""
        }${
            cupConfig.imprintType === "digital_print"
                ? lang === "1"
                    ? "Nadruk cyfrowy"
                    : "Digital print"
                : ""
        }${
            cupConfig.imprintType === "deep_effect_1"
                ? lang === "1"
                    ? "Deep Effect 1 strona"
                    : "Deep Effect 1 side"
                : ""
        }${
            cupConfig.imprintType === "deep_effect_2"
                ? lang === "1"
                    ? "Deep Effect 2 strony"
                    : "Deep Effect 2 sides"
                : ""
        }${
            cupConfig.imprintType === "deep_effect_plus_1"
                ? lang === "1"
                    ? "Deep Effect Plus 1 strona"
                    : "Deep Effect Plus 1 side"
                : ""
        }${
            cupConfig.imprintType === "deep_effect_plus_2"
                ? lang === "1"
                    ? "Deep Effect Plus 2 strony"
                    : "Deep Effect Plus 2 sides"
                : ""
        }${!cupConfig.imprintType ? "Brak" : ""}\n${
            cupConfig.imprintType === "digital_print"
                ? lang === "1"
                    ? "Liczba kolorów: Pełny kolor\n"
                    : "Number of colors: Full color\n"
                : ""
        }${
            [
                "direct_print",
                "transfer_plus_1",
                "transfer_plus_2",
                "transfer_plus_round",
                "polylux_1",
                "polylux_2",
                "polylux_round",
            ].includes(cupConfig.imprintType)
                ? `${lang === "1" ? "Liczba kolorów: " : "Number of colors: "}${
                      cupConfig.imprintColors
                  }\n`
                : ""
        }${"TrendColor: "}${
            cupConfig.trend_color === "inside" ? (lang === "1" ? "Wewnątrz" : "Inside") : ""
        }${cupConfig.trend_color === "outside" ? (lang === "1" ? "Na zewnątrz" : "Outside") : ""}${
            cupConfig.trend_color === "both"
                ? lang === "1"
                    ? "Wewnątrz i na zewnątrz"
                    : "Inside and outside"
                : ""
        }${
            cupConfig.trend_color === "lowered_edge"
                ? lang === "1"
                    ? "Z obniżonym ranten"
                    : "With lowered edge"
                : ""
        }${!cupConfig.trend_color ? (lang === "1" ? "Brak" : "None") : ""}\n${"ProColor: "}${
            cupConfig.pro_color
                ? lang === "1"
                    ? "Wewnątrz"
                    : "Inside"
                : lang === "1"
                ? "Brak"
                : "None"
        }\n${"SoftTouch: "}${
            cupConfig.soft_touch
                ? lang === "1"
                    ? "Zewnątrz"
                    : "Outside"
                : lang === "1"
                ? "Brak"
                : "None"
        }\n${lang === "1" ? "Dodatkowe zdobienia: " : "Additional decorations: "}\n${
            cupConfig.nadruk_wewnatrz_na_sciance
                ? `${"• "}${
                      lang === "1"
                          ? `Nadruk wewnątrz na ściance: ${cupConfig.nadruk_wewnatrz_na_sciance} szt.`
                          : `Print on the wall inside: ${cupConfig.nadruk_wewnatrz_na_sciance} pcs.`
                  }\n`
                : ""
        }${
            cupConfig.nadruk_na_uchu
                ? `${"• "}${lang === "1" ? "Nadruk na uchu" : "Print on the handle"}\n`
                : ""
        }${
            cupConfig.nadruk_na_spodzie
                ? `${"• "}${
                      lang === "1" ? "Nadruk na spodzie (zewn.)" : "Print on the bottom outside"
                  }\n`
                : ""
        }${
            cupConfig.nadruk_na_dnie
                ? `${"• "}${
                      lang === "1" ? "Nadruk na spodzie (wewn.)" : "Print on the bottom inside"
                  }\n`
                : ""
        }${
            cupConfig.nadruk_przez_rant
                ? `${"• "}${lang === "1" ? "Nadruk przez rant" : "Over the rim imprint"}\n`
                : ""
        }${cupConfig.nadruk_apla ? `${"• "}${lang === "1" ? "Nadruk apla" : "Apla print"}\n` : ""}${
            cupConfig.nadruk_zlotem && cupConfig.nadruk_zlotem !== true
                ? `${"• "}${lang === "1" ? "Nadruk złotem: " : "Gold print: "}${
                      cupConfig.nadruk_zlotem
                  }${"cm2"}\n`
                : ""
        }${
            cupConfig.personalizacja
                ? `${"• "}${lang === "1" ? "Personalizacja" : "Personalization"}\n`
                : ""
        }${
            cupConfig.zdobienie_paskiem && cupConfig.zdobienie_paskiem !== true
                ? `${"• "}${lang === "1" ? "Zdobienie paskiem: " : "Decoration with stripe: "}${
                      cupConfig.zdobienie_paskiem === "bez_laczenia"
                          ? lang === "1"
                              ? "bez łączenia"
                              : "without conection"
                          : ""
                  }${
                      cupConfig.zdobienie_paskiem === "z_laczeniem"
                          ? lang === "1"
                              ? "z łączeniem"
                              : "with conection"
                          : ""
                  }\n`
                : ""
        }${
            cupConfig.nadruk_na_powloce_magicznej_1_kolor
                ? `${"• "}${
                      lang === "1"
                          ? "Nadruk na powłoce magicznej (1 kolor)"
                          : "Print on magic coating (1 color)"
                  }\n`
                : ""
        }${
            cupConfig.zdobienie_tapeta_na_barylce && cupConfig.zdobienie_tapeta_na_barylce !== true
                ? `${"• "}${
                      lang === "1"
                          ? `Zdobienie tapeta na barylce: ${
                                cupConfig.zdobienie_tapeta_na_barylce.split("_")[0]
                            } poziom trudności`
                          : `Decoration with tape on the barrel: ${
                                cupConfig.zdobienie_tapeta_na_barylce.split("_")[0]
                            } degree of difficulty`
                  }\n`
                : ""
        }${
            cupConfig.naklejka_papierowa_z_nadrukiem
                ? `${"• "}${
                      lang === "1" ? "Naklejka papierowa z nadrukiem" : "Paper sticker with imprint"
                  }\n`
                : ""
        }${
            cupConfig.wkladanie_ulotek_do_kubka
                ? `${"• "}${
                      lang === "1" ? "Wkładanie ulotek do kubka" : "Inserting leaflets into the mug"
                  }\n`
                : ""
        }${lang === "1" ? "Sposób pakowania: " : "Packaging type: "}${
            cupConfig.cardboard === "singular"
                ? lang === "1"
                    ? "Kartoniki jednostkowe"
                    : "Single boxes"
                : ""
        }${
            cupConfig.cardboard === "6pack_klapowy"
                ? lang === "1"
                    ? "6-pak klapowy"
                    : "6-pack flap"
                : ""
        }${
            cupConfig.cardboard === "6pack_wykrojnik"
                ? lang === "1"
                    ? "6-pak z wykrojnika"
                    : "6-pack from a die"
                : ""
        }${
            !cupConfig.cardboard ? (lang === "1" ? "Opakowanie zbiorcze" : "Bulk packaging") : ""
        }\n\n\n${lang === "1" ? "Cena:" : "Price:"}\n\n${
            amounts.amount1
                ? `${
                      lang === "1"
                          ? "Produkt z nadrukiem (1 szt. netto): "
                          : "Product with imprint (1 pcs. net): "
                  }${
                      calculatedPrices[1].unit === null
                          ? ""
                          : priceToString(calculatedPrices[1].unit)
                  }${clientPriceUnit}\t`
                : ""
        }${
            amounts.amount2
                ? `${
                      lang === "1"
                          ? "Produkt z nadrukiem (1 szt. netto): "
                          : "Product with imprint (1 pcs. net): "
                  }${
                      calculatedPrices[2].unit === null
                          ? ""
                          : priceToString(calculatedPrices[2].unit)
                  }${clientPriceUnit}\t`
                : ""
        }${
            amounts.amount3
                ? `${
                      lang === "1"
                          ? "Produkt z nadrukiem (1 szt. netto): "
                          : "Product with imprint (1 pcs. net): "
                  }${
                      calculatedPrices[3].unit === null
                          ? ""
                          : priceToString(calculatedPrices[3].unit)
                  }${clientPriceUnit}\t`
                : ""
        }\n${
            amounts.amount1
                ? `${lang === "1" ? "Opakowanie (1 szt. netto): " : "Packaging (1 pcs. net): "}${
                      calculatedPrices[1].singleCardboardPrice
                          ? priceToString(calculatedPrices[1].singleCardboardPrice)
                          : "0.00"
                  }${clientPriceUnit}\t`
                : ""
        }${
            amounts.amount2
                ? `${lang === "1" ? "Opakowanie (1 szt. netto): " : "Packaging (1 pcs. net): "}${
                      calculatedPrices[2].singleCardboardPrice
                          ? priceToString(calculatedPrices[2].singleCardboardPrice)
                          : "0.00"
                  }${clientPriceUnit}\t`
                : ""
        }${
            amounts.amount3
                ? `${lang === "1" ? "Opakowanie (1 szt. netto): " : "Packaging (1 pcs. net): "}${
                      calculatedPrices[3].singleCardboardPrice
                          ? priceToString(calculatedPrices[3].singleCardboardPrice)
                          : "0.00"
                  }${clientPriceUnit}\t`
                : ""
        }\n${
            amounts.amount1
                ? `${lang === "1" ? "Przygotowalnia: " : "Set-up: "}${priceToString(
                      calculatedPrices[1].prep
                  )}${clientPriceUnit}\t`
                : ""
        }${
            amounts.amount2
                ? `${lang === "1" ? "Przygotowalnia: " : "Set-up: "}${priceToString(
                      calculatedPrices[2].prep
                  )}${clientPriceUnit}\t`
                : ""
        }${
            amounts.amount3
                ? `${lang === "1" ? "Przygotowalnia: " : "Set-up: "}${priceToString(
                      calculatedPrices[3].prep
                  )}${clientPriceUnit}\t`
                : ""
        }\n${
            amounts.amount1
                ? `${"Transport: "}${
                      clientPriceUnit === "zł"
                          ? `${priceToString(calculatedPrices[1].transport)} ${clientPriceUnit}`
                          : "Please contact your advisor"
                  }\t`
                : ""
        }${
            amounts.amount2
                ? `${"Transport: "}${
                      clientPriceUnit === "zł"
                          ? `${priceToString(calculatedPrices[2].transport)} ${clientPriceUnit}`
                          : "Please contact your advisor"
                  }\t`
                : ""
        }${
            amounts.amount3
                ? `${"Transport: "}${
                      clientPriceUnit === "zł"
                          ? `${priceToString(calculatedPrices[3].transport)} ${clientPriceUnit}`
                          : "Please contact your advisor"
                  }\t`
                : ""
        }\n${
            amounts.amount1
                ? `${
                      lang === "1"
                          ? "Całkowita wartość kalkulacji netto: "
                          : "Total sum of the calculation net: "
                  }${
                      calculatedPrices[1].prep !== null &&
                      calculatedPrices[1].unit !== null &&
                      amounts[`amount${1}`]
                          ? calculatedPrices[1].transport
                              ? priceToString(
                                    Math.round(
                                        (calculatedPrices[1].prep! +
                                            (calculatedPrices[1].unit! +
                                                (calculatedPrices[1].singleCardboardPrice || 0)) *
                                                amounts[`amount${1}`]! +
                                            calculatedPrices[1].transport!) *
                                            100
                                    ) / 100
                                )
                              : priceToString(
                                    Math.round(
                                        (calculatedPrices[1].prep! +
                                            (calculatedPrices[1].unit! +
                                                (calculatedPrices[1].singleCardboardPrice || 0)) *
                                                amounts[`amount${1}`]!) *
                                            100
                                    ) / 100
                                )
                          : "0.00"
                  }${clientPriceUnit}\t`
                : ""
        }${
            amounts.amount2
                ? `${
                      lang === "1"
                          ? "Całkowita wartość kalkulacji netto: "
                          : "Total sum of the calculation net: "
                  }${
                      calculatedPrices[2].prep !== null &&
                      calculatedPrices[2].unit !== null &&
                      amounts[`amount${2}`]
                          ? calculatedPrices[2].transport
                              ? priceToString(
                                    Math.round(
                                        (calculatedPrices[2].prep! +
                                            (calculatedPrices[2].unit! +
                                                (calculatedPrices[2].singleCardboardPrice || 0)) *
                                                amounts[`amount${2}`]! +
                                            calculatedPrices[2].transport!) *
                                            100
                                    ) / 100
                                )
                              : priceToString(
                                    Math.round(
                                        (calculatedPrices[2].prep! +
                                            (calculatedPrices[2].unit! +
                                                (calculatedPrices[2].singleCardboardPrice || 0)) *
                                                amounts[`amount${2}`]!) *
                                            100
                                    ) / 100
                                )
                          : "0.00"
                  }${clientPriceUnit}\t`
                : ""
        }${
            amounts.amount3
                ? `${
                      lang === "1"
                          ? "Całkowita wartość kalkulacji netto: "
                          : "Total sum of the calculation net: "
                  }${
                      calculatedPrices[3].prep !== null &&
                      calculatedPrices[3].unit !== null &&
                      amounts[`amount${3}`]
                          ? calculatedPrices[3].transport
                              ? priceToString(
                                    Math.round(
                                        (calculatedPrices[3].prep! +
                                            (calculatedPrices[3].unit! +
                                                (calculatedPrices[3].singleCardboardPrice || 0)) *
                                                amounts[`amount${3}`]! +
                                            calculatedPrices[3].transport!) *
                                            100
                                    ) / 100
                                )
                              : priceToString(
                                    Math.round(
                                        (calculatedPrices[3].prep! +
                                            (calculatedPrices[3].unit! +
                                                (calculatedPrices[3].singleCardboardPrice || 0)) *
                                                amounts[`amount${3}`]!) *
                                            100
                                    ) / 100
                                )
                          : "0.00"
                  }${clientPriceUnit}\t`
                : ""
        }\n\n\n${lang === "1" ? "Dane logistyczne:" : "Logistic details:"}\n\n${
            amounts.amount1
                ? `${lang === "1" ? "Liczba palet MINI: " : "Quantity of pallets MINI: "}${
                      palletQuantities[1].mini
                  }\t`
                : ""
        }${
            amounts.amount2
                ? `${lang === "1" ? "Liczba palet MINI: " : "Quantity of pallets MINI: "}${
                      palletQuantities[2].mini
                  }\t`
                : ""
        }${
            amounts.amount3
                ? `${lang === "1" ? "Liczba palet MINI: " : "Quantity of pallets MINI: "}${
                      palletQuantities[3].mini
                  }\t`
                : ""
        }\n${
            amounts.amount1
                ? `${lang === "1" ? "Liczba półpalet: " : "Quantity of half-pallets: "}${
                      palletQuantities[1].half
                  }\t`
                : ""
        }${
            amounts.amount2
                ? `${lang === "1" ? "Liczba półpalet: " : "Quantity of half-pallets: "}${
                      palletQuantities[2].half
                  }\t`
                : ""
        }${
            amounts.amount3
                ? `${lang === "1" ? "Liczba półpalet: " : "Quantity of half-pallets: "}${
                      palletQuantities[3].half
                  }\t`
                : ""
        }\n${
            amounts.amount1
                ? `${lang === "1" ? "Liczba palet EURO: " : "Quantity of pallets EUR: "}${
                      palletQuantities[1].full
                  }\t`
                : ""
        }${
            amounts.amount2
                ? `${lang === "1" ? "Liczba palet EURO: " : "Quantity of pallets EUR: "}${
                      palletQuantities[2].full
                  }\t`
                : ""
        }${
            amounts.amount3
                ? `${lang === "1" ? "Liczba palet EURO: " : "Quantity of pallets EUR: "}${
                      palletQuantities[3].full
                  }\t`
                : ""
        }`.trim();

        navigator.clipboard.writeText(text);

        return text;
    } catch (error) {
        console.error(error);
        return "";
    }
};
