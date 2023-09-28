import { Cup } from "@/app/api/updatecups/route";
import { CupConfigInterface } from "@/components/calculator/calculator";
import { Database } from "@/database/types";
import { ColorPricing } from "./colorPricingType";
import { calculatePrices } from "./calculatePrices";
import { translateColor } from "./translateColor";
import { priceToString } from "./priceToString";
import { anyAdditionalPrint } from "./anyAdditionalPrint";

export const copyCalcToClip = async ({
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

        const text = `${lang === "1" ? "Data: " : "Date: "}${new Date().toLocaleDateString(
            "pl-PL", {timeZone: "Europe/Warsaw"}
        )}\n\n${selectedCup.code}\n<b>${selectedCup.name} ${
            lang === "1" ? selectedCup.color : translateColor(selectedCup.color)
        }${cupConfig.imprintType ? " + " : ""}${
            [
                "direct_print",
                "transfer_plus_1",
                "transfer_plus_2",
                "transfer_plus_round",
                "polylux_1",
                "polylux_2",
                "polylux_round",
            ].includes(cupConfig.imprintType)
                ? `${cupConfig.imprintColors} ${
                      lang === "1"
                          ? cupConfig.imprintColors === 1
                              ? "kolor"
                              : [2, 3, 4].includes(cupConfig.imprintColors)
                              ? "kolory"
                              : "kolorów"
                          : cupConfig.imprintColors === 1
                          ? "color"
                          : "colors"
                  } `
                : ""
        }${
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
        }${!cupConfig.imprintType ? (lang === "1" ? ", brak nadruku" : ", no imprint") : ""}</b>\n${
            cupConfig.trend_color
                ? `${"TrendColor: "}${
                      cupConfig.trend_color === "inside"
                          ? lang === "1"
                              ? "Wewnątrz"
                              : "Inside"
                          : ""
                  }${
                      cupConfig.trend_color === "outside"
                          ? lang === "1"
                              ? "Na zewnątrz"
                              : "Outside"
                          : ""
                  }${
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
                  }\n`
                : ""
        }${cupConfig.pro_color ? `${"ProColor: "}${lang === "1" ? "Wewnątrz" : "Inside"}\n` : ""}${
            cupConfig.soft_touch ? `${"SoftTouch: "}${lang === "1" ? "Zewnątrz" : "Outside"}\n` : ""
        }${
            cupConfig.nadruk_wewnatrz_na_sciance ||
            cupConfig.nadruk_na_uchu ||
            cupConfig.nadruk_na_spodzie ||
            cupConfig.nadruk_na_dnie ||
            cupConfig.nadruk_przez_rant ||
            cupConfig.nadruk_apla ||
            (cupConfig.nadruk_zlotem && cupConfig.nadruk_zlotem !== true) ||
            cupConfig.personalizacja ||
            (cupConfig.zdobienie_paskiem && cupConfig.zdobienie_paskiem !== true) ||
            cupConfig.nadruk_na_powloce_magicznej_1_kolor ||
            (cupConfig.zdobienie_tapeta_na_barylce &&
                cupConfig.zdobienie_tapeta_na_barylce !== true) ||
            cupConfig.naklejka_papierowa_z_nadrukiem ||
            cupConfig.wkladanie_ulotek_do_kubka
                ? `\n${lang === "1" ? "Dodatkowe zdobienia: " : "Additional decorations: "}\n`
                : ""
        }${
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
        }${
            ["digital_print", ""].includes(cupConfig.imprintType) && anyAdditionalPrint(cupConfig)
                ? `${
                      lang === "1"
                          ? "Liczba kolorów nadruków dodatkowych"
                          : "Number of colors of additional prints"
                  }: ${cupConfig.imprintColors}\n`
                : ""
        }\n${lang === "1" ? "Sposób pakowania: " : "Packaging type: "}${
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
        }\n\n${
            amounts.amount1
                ? `<b>${lang === "1" ? "Ilość " : "Amount "}${amounts.amount1} ${
                      lang === "1" ? "szt." : "pcs."
                  }: ${
                      calculatedPrices[1].unit === null
                          ? ""
                          : priceToString(calculatedPrices[1].unit, clientPriceUnit)
                  } ${lang === "1" ? "netto / szt." : "/ pcs."}</b>\n${
                      calculatedPrices[1].singleCardboardPrice
                          ? `+ ${lang === "1" ? "opakowanie" : "packaging"}: ${priceToString(
                                calculatedPrices[1].singleCardboardPrice,
                                clientPriceUnit
                            )} ${lang === "1" ? "netto / szt." : "/ pcs."}\n`
                          : ""
                  }+ ${lang === "1" ? "przygotowalnia" : "set-up"}: ${priceToString(
                      calculatedPrices[1].prep,
                      clientPriceUnit
                  )} ${lang === "1" ? "netto" : ""}\n${
                      clientPriceUnit === "zł"
                          ? (cupConfig.cardboard === "singular" &&
                                selectedCup.mini_pallet_singular &&
                                selectedCup.half_pallet_singular &&
                                selectedCup.full_pallet_singular) ||
                            (cupConfig.cardboard !== "singular" &&
                                selectedCup.mini_pallet &&
                                selectedCup.half_pallet &&
                                selectedCup.full_pallet)
                              ? `+ transport: ${priceToString(
                                    calculatedPrices[1].transport,
                                    clientPriceUnit
                                )} ${lang === "1" ? "netto" : ""}\n`
                              : `+ transport: ${
                                    lang === "1" ? "Wycena indywidualna" : "Individual pricing"
                                }\n`
                          : ""
                  }${lang === "1" ? "Suma: " : "Total: "}${
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
                                    ) / 100,
                                    clientPriceUnit
                                )
                              : priceToString(
                                    Math.round(
                                        (calculatedPrices[1].prep! +
                                            (calculatedPrices[1].unit! +
                                                (calculatedPrices[1].singleCardboardPrice || 0)) *
                                                amounts[`amount${1}`]!) *
                                            100
                                    ) / 100,
                                    clientPriceUnit
                                )
                          : priceToString(0, clientPriceUnit)
                  } ${lang === "1" ? "netto" : ""}\n\n`
                : ""
        }${
            amounts.amount2
                ? `<b>${lang === "1" ? "Ilość " : "Amount "}${amounts.amount2} ${
                      lang === "1" ? "szt." : "pcs."
                  }: ${
                      calculatedPrices[2].unit === null
                          ? ""
                          : priceToString(calculatedPrices[2].unit, clientPriceUnit)
                  } ${lang === "1" ? "netto / szt." : "/ pcs."}</b>\n${
                      calculatedPrices[1].singleCardboardPrice
                          ? `+ ${lang === "1" ? "opakowanie" : "packaging"}: ${priceToString(
                                calculatedPrices[1].singleCardboardPrice,
                                clientPriceUnit
                            )} ${lang === "1" ? "netto / szt." : "/ pcs."}\n`
                          : ""
                  }+ ${lang === "1" ? "przygotowalnia" : "set-up"}: ${priceToString(
                      calculatedPrices[2].prep,
                      clientPriceUnit
                  )} ${lang === "1" ? "netto" : ""}\n${
                      clientPriceUnit === "zł"
                          ? (cupConfig.cardboard === "singular" &&
                                selectedCup.mini_pallet_singular &&
                                selectedCup.half_pallet_singular &&
                                selectedCup.full_pallet_singular) ||
                            (cupConfig.cardboard !== "singular" &&
                                selectedCup.mini_pallet &&
                                selectedCup.half_pallet &&
                                selectedCup.full_pallet)
                              ? `+ transport: ${priceToString(
                                    calculatedPrices[2].transport,
                                    clientPriceUnit
                                )} ${lang === "1" ? "netto" : ""}\n`
                              : `+ transport: ${
                                    lang === "1" ? "Wycena indywidualna" : "Individual pricing"
                                }\n`
                          : ""
                  }${lang === "1" ? "Suma: " : "Total: "}${
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
                                    ) / 100,
                                    clientPriceUnit
                                )
                              : priceToString(
                                    Math.round(
                                        (calculatedPrices[2].prep! +
                                            (calculatedPrices[2].unit! +
                                                (calculatedPrices[2].singleCardboardPrice || 0)) *
                                                amounts[`amount${2}`]!) *
                                            100
                                    ) / 100,
                                    clientPriceUnit
                                )
                          : priceToString(0, clientPriceUnit)
                  } ${lang === "1" ? "netto" : ""}\n\n`
                : ""
        }${
            amounts.amount3
                ? `<b>${lang === "1" ? "Ilość " : "Amount "}${amounts.amount3} ${
                      lang === "1" ? "szt." : "pcs."
                  }: ${
                      calculatedPrices[3].unit === null
                          ? ""
                          : priceToString(calculatedPrices[3].unit, clientPriceUnit)
                  } ${lang === "1" ? "netto / szt." : "/ pcs."}</b>\n${
                      calculatedPrices[1].singleCardboardPrice
                          ? `+ ${lang === "1" ? "opakowanie" : "packaging"}: ${priceToString(
                                calculatedPrices[1].singleCardboardPrice,
                                clientPriceUnit
                            )} ${lang === "1" ? "netto / szt." : "/ pcs."}\n`
                          : ""
                  }+ ${lang === "1" ? "przygotowalnia" : "set-up"}: ${priceToString(
                      calculatedPrices[3].prep,
                      clientPriceUnit
                  )} ${lang === "1" ? "netto" : ""}\n${
                      clientPriceUnit === "zł"
                          ? (cupConfig.cardboard === "singular" &&
                                selectedCup.mini_pallet_singular &&
                                selectedCup.half_pallet_singular &&
                                selectedCup.full_pallet_singular) ||
                            (cupConfig.cardboard !== "singular" &&
                                selectedCup.mini_pallet &&
                                selectedCup.half_pallet &&
                                selectedCup.full_pallet)
                              ? `+ transport: ${priceToString(
                                    calculatedPrices[3].transport,
                                    clientPriceUnit
                                )} ${lang === "1" ? "netto" : ""}\n`
                              : `+ transport: ${
                                    lang === "1" ? "Wycena indywidualna" : "Individual pricing"
                                }\n`
                          : ""
                  }${lang === "1" ? "Suma: " : "Total: "}${
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
                                    ) / 100,
                                    clientPriceUnit
                                )
                              : priceToString(
                                    Math.round(
                                        (calculatedPrices[3].prep! +
                                            (calculatedPrices[3].unit! +
                                                (calculatedPrices[3].singleCardboardPrice || 0)) *
                                                amounts[`amount${3}`]!) *
                                            100
                                    ) / 100,
                                    clientPriceUnit
                                )
                          : priceToString(0, clientPriceUnit)
                  } ${lang === "1" ? "netto" : ""}\n`
                : ""
        }`;

        const para = document.createElement("p");
        para.innerHTML = text.replaceAll("\n", "<br>");
        const listener = (e: ClipboardEvent) => {
            e.preventDefault();
            e.clipboardData?.setData("text/html", para.innerHTML);
            e.clipboardData?.setData(
                "text/plain",
                text.replaceAll("<b>", "").replaceAll("</b>", "")
            );
        };
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);

        return text;
    } catch (error) {
        console.error(error);
        return "";
    }
};
