"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Cup } from "../api/updatecups/route";
import noImage from "@/../public/noimage.png";
import { PricesDisplay } from "@/components/calculator/pricesDisplay";
import { PalletQuantities } from "@/components/calculator/palletQuantities";

export default function Test({
    searchParams,
}: {
    searchParams: {
        lang: "1" | "2";
    };
}) {
    const lang = searchParams.lang;
    const clientPriceUnit: "zł" | "EUR" = "zł";
    const cupData: Cup[] = [
        {
            // example of a Cup
            code: "K002.18.01",
            name: "Tomek EU",
            color: "niebieski",
            volume: "350ml",
            icon: "",
            trend_color: true,
            soft_touch: true,
            pro_color: true,
            category: "kubek",
            link: "Tomek_EU",
            material: "ceramika",
            deep_effect: true,
            deep_effect_plus: true,
            direct_print: true,
            polylux: true,
            transfer_plus: true,
            digital_print: true,
            digital_print_additional: false,
            nadruk_apla: true,
            nadruk_dookola_pod_uchem: true,
            nadruk_na_dnie: true,
            nadruk_na_spodzie: true,
            nadruk_na_uchu: true,
            nadruk_na_powloce_magicznej_1_kolor: true,
            nadruk_wewnatrz_na_sciance: true,
            personalizacja: true,
            nadruk_przez_rant: true,
            naklejka_papierowa_z_nadrukiem: true,
            zdobienie_paskiem_bez_laczenia: true,
            zdobienie_paskiem_z_laczeniem: true,
            zdobienie_tapeta_na_barylce_I_stopien_trudnosci: true,
            zdobienie_tapeta_na_barylce_II_stopien_trudnosci: true,
            wkladanie_ulotek_do_kubka: true,
            nadruk_zlotem_do_25cm2: true,
            nadruk_zlotem_do_50cm2: true,
            trend_color_lowered_edge: true,
            prices: {
                price_24: 7,
                price_72: 6.5,
                price_108: 6,
                price_216: 5.5,
                price_504: 5,
                price_1008: 4.5,
                price_2520: 4,
            },
            supplier: null,
            supplier_code: null,
            mini_pallet: 108,
            half_pallet: 432,
            full_pallet: 1440,
            mini_pallet_singular: 72,
            half_pallet_singular: 288,
            full_pallet_singular: 960,
        },
    ];

    const [selectedCup, setSelectedCup] = useState<Cup>(cupData[0]);
    const [amounts, setAmounts] = useState<{
        amount1: number | null;
        amount2: number | null;
        amount3: number | null;
    }>({
        amount1: null,
        amount2: null,
        amount3: null,
    });
    const [calculatedPrices, setCalculatedPrices] = useState<{
        unit: number | null;
        prep: number | null;
        transport: number | null;
    }>({ unit: null, prep: null, transport: null });
    const [imprintType, setImprintType] = useState<string>("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedCardboard, setSelectedCardboard] = useState<string>("");

    const amountAlerts = (amount: number | null) => {
        if (!amount) return;
        if (amount < 24) {
            setCalculatedPrices({
                unit: null,
                prep: null,
                transport: null,
            });
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
                    ? "Skontaktuj się z działem handlowym w celu uzyskania indywidualnej kalkulacji"
                    : "Contact our sales department for individual pricing"
            );
            return;
        }
    };
    return (
        <div className="flex flex-col items-start">
            <h1 className="w-full text-center">{lang === "1" ? "Kalkulator" : "Calculator"}</h1>
            <div className="flex flex-row pr-[400px] w-full items-center justify-center">
                {selectedCup.icon ? (
                    <Image src={selectedCup.icon} alt={""} />
                ) : (
                    <Image src={noImage} alt={""} width={200} />
                )}
                <div className="flex flex-col">
                    <p>{selectedCup.code}</p>
                    <p>{selectedCup.name}</p>
                    <p>{selectedCup.volume}</p>
                    <div className="flex flex-col relative w-80">
                        <p>{lang === "1" ? "Ilość: " : "Amount: "}</p>
                        <p>{lang === "1" ? "Jednostkowa cena produktu: " : "Price per unit: "}</p>
                        <p>{lang === "1" ? "Koszt przygotowalni: " : "Preparation cost: "}</p>
                        {clientPriceUnit === "zł" && (
                            <p>{lang === "1" ? "Koszt transportu: " : "Transport cost: "}</p>
                        )}
                        <p>{lang === "1" ? "Całkowity koszt: " : "Total cost: "}</p>
                        <div className="absolute -right-[128px] flex flex-row">
                            <PricesDisplay
                                amount={amounts.amount1}
                                lang={lang}
                                calculatedPrices={calculatedPrices}
                                clientPriceUnit={clientPriceUnit}
                                keep
                            />
                        </div>
                        <div className="absolute -right-[320px] flex flex-row">
                            <PricesDisplay
                                amount={amounts.amount2}
                                lang={lang}
                                calculatedPrices={calculatedPrices}
                                clientPriceUnit={clientPriceUnit}
                            />
                        </div>
                        <div className="absolute -right-[512px] flex flex-row">
                            <PricesDisplay
                                amount={amounts.amount3}
                                lang={lang}
                                calculatedPrices={calculatedPrices}
                                clientPriceUnit={clientPriceUnit}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="ml-[40%]">
                <div>
                    {lang == "1" ? "Wybierz kolor: " : "Select color: "}
                    <select
                        onChange={(e) => {
                            setSelectedCup(
                                cupData.find((cup) => cup.code === e.target.value) as Cup
                            );
                        }}
                        defaultValue={cupData[0].code}
                    >
                        {cupData.map((cup) => (
                            <option key={cup.code} value={cup.code}>
                                {cup.color}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    {lang === "1" ? "Ilość: " : "Amount: "}
                    <input
                        type="number"
                        min="1"
                        onBlur={(e) => {
                            setAmounts({ ...amounts, amount1: parseInt(e.target.value) });
                            amountAlerts(parseInt(e.target.value));
                        }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur();
                            }
                        }}
                    />
                </div>
                {selectedCup.trend_color && (
                    <div>
                        Trend Color:
                        <select defaultValue="">
                            <option value="">
                                {lang === "1" ? "Bez Trend Color" : "No Trend Color"}
                            </option>
                            <option value="inside">{lang === "1" ? "Wewnątrz" : "Inside"}</option>
                            <option value="outside">{lang === "1" ? "Zewnątrz" : "Outside"}</option>
                            <option value="both">
                                {lang === "1" ? "Wenątrz i na zewnątrz" : "Inside and outside"}
                            </option>
                            {selectedCup.trend_color_lowered_edge && (
                                <option value="lowered_edge">
                                    {lang === "1"
                                        ? "Na zewnątrz z obniżonym rantem"
                                        : "Outside with lowered edge"}
                                </option>
                            )}
                        </select>
                    </div>
                )}
                {selectedCup.soft_touch && (
                    <div>
                        Soft Touch:
                        <select defaultValue="">
                            <option value="">
                                {lang === "1" ? "Bez Soft Touch" : "No Soft Touch"}
                            </option>
                            <option value="soft_touch">Soft Touch</option>
                        </select>
                    </div>
                )}
                {selectedCup.pro_color && (
                    <div>
                        Pro Color:
                        <select defaultValue="">
                            <option value="">
                                {lang === "1" ? "Bez Pro Color" : "No Pro Color"}
                            </option>
                            <option value="pro_color">
                                {lang === "1" ? "Wewnątrz" : "Inside"}
                            </option>
                        </select>
                    </div>
                )}
                <div>
                    {lang === "1" ? "Wybierz nadruk: " : "Select print type: "}
                    <select defaultValue="" onChange={(e) => setImprintType(e.target.value)}>
                        <option value="">{lang === "1" ? "Brak" : "None"}</option>
                        {/* tutaj trzeba dolozyc troche +20% np do wpisania w panelu */}
                        {selectedCup.direct_print && (
                            <option value="direct_print">
                                {lang === "1" ? "Nadruk bezpośredni" : "Direct print"}
                            </option>
                        )}
                        {selectedCup.transfer_plus && (
                            <>
                                <option value="transfer_plus_1">
                                    {lang === "1"
                                        ? "Kalka ceramiczna 1 strona"
                                        : "Transfer plus 1 side"}
                                </option>
                                <option value="transfer_plus_2">
                                    {lang === "1"
                                        ? "Kalka ceramiczna 2 strony"
                                        : "Transfer plus 2 sides"}
                                </option>
                                <option value="transfer_plus_round">
                                    {lang === "1"
                                        ? "Kalka ceramiczna wokół"
                                        : "Transfer plus around"}
                                </option>
                            </>
                        )}
                        {selectedCup.polylux && (
                            <>
                                <option value="polylux_1">
                                    Polylux {lang === "1" ? "1 strona" : "1 side"}
                                </option>
                                <option value="polylux_2">
                                    Polylux {lang === "1" ? "2 strony" : "2 sides"}
                                </option>
                                <option value="polylux_round">
                                    Polylux {lang === "1" ? "wokół" : "around"}
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
                    </select>
                </div>
                <div>
                    {lang === "1" ? "Liczba kolorów nadruku: " : "Number of print colors: "}
                    <select
                        defaultValue=""
                        disabled={!imprintType || imprintType === "digital_print"}
                    >
                        <option value="" disabled hidden>
                            {imprintType !== "digital_print"
                                ? lang === "1"
                                    ? "Brak"
                                    : "None"
                                : lang === "1"
                                ? "Pełny kolor"
                                : "Full color"}
                        </option>
                        {imprintType &&
                            [
                                "deep_effect_1",
                                "deep_effect_2",
                                "deep_effect_plus_1",
                                "deep_effect_plus_2",
                            ].includes(imprintType) &&
                            [...Array(2)].map(
                                (_, index) => (
                                    (index += 1),
                                    (
                                        <option key={index} value={index}>
                                            {index.toString()}
                                        </option>
                                    )
                                )
                            )}
                        {imprintType &&
                            imprintType === "direct_print" &&
                            [...Array(4)].map(
                                (_, index) => (
                                    (index += 1),
                                    (
                                        <option key={index} value={index}>
                                            {index.toString()}
                                        </option>
                                    )
                                )
                            )}
                        {imprintType &&
                            [
                                "transfer_plus_1",
                                "transfer_plus_2",
                                "transfer_plus_round",
                                "polylux_1",
                                "polylux_2",
                                "polylux_round",
                            ].includes(imprintType) &&
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
                </div>
                <div className="flex flex-col">
                    {selectedCup.nadruk_wewnatrz_na_sciance && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat([
                                                  "nadruk_wewnatrz_na_sciance",
                                              ])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "nadruk_wewnatrz_na_sciance"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Nadruk wewnątrz na ściance"
                                    : "Print on the inside"}
                            </p>
                            {selectedServices.includes("nadruk_wewnatrz_na_sciance") && (
                                <>
                                    <select defaultValue="1">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <p>{lang === "1" ? "nadruków" : "prints"}</p>
                                    {/* to znandlowac */}
                                </>
                            )}
                        </div>
                    )}
                    {selectedCup.nadruk_na_uchu && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["nadruk_na_uchu"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter((v) => v !== "nadruk_na_uchu")
                                          )
                                }
                            />
                            <p>{lang === "1" ? "Nadruk na uchu" : "Print on the handle"}</p>
                        </div>
                    )}
                    {selectedCup.nadruk_na_spodzie && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["nadruk_na_spodzie"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "nadruk_na_spodzie"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Nadruk na spodzie (zewn.)"
                                    : "Print on the bottom outside"}
                            </p>
                        </div>
                    )}
                    {selectedCup.nadruk_na_dnie && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["nadruk_na_dnie"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter((v) => v !== "nadruk_na_dnie")
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Nadruk na dnie (wewn.)"
                                    : "Print on the bottom inside"}
                            </p>
                        </div>
                    )}
                    {selectedCup.nadruk_przez_rant && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["nadruk_przez_rant"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "nadruk_przez_rant"
                                              )
                                          )
                                }
                            />
                            <p>{lang === "1" ? "Nadruk przez rant" : "Over the rim imprint"}</p>
                        </div>
                    )}
                    {selectedCup.nadruk_apla && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["nadruk_apla"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter((v) => v !== "nadruk_apla")
                                          )
                                }
                            />
                            <p>{lang === "1" ? "Nadruk aplą" : "Apla print"}</p>
                        </div>
                    )}
                    {selectedCup.nadruk_dookola_pod_uchem && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["nadruk_dookola_pod_uchem"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "nadruk_dookola_pod_uchem"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Nadruk dookoła (pod uchem)"
                                    : "Print around (under the handle)"}
                            </p>
                        </div>
                    )}
                    {(selectedCup.nadruk_zlotem_do_25cm2 || selectedCup.nadruk_zlotem_do_50cm2) && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["nadruk_zlotem"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter((v) => v !== "nadruk_zlotem")
                                          )
                                }
                            />
                            <p>{lang === "1" ? "Nadruk złotem" : "Gold print"}</p>
                            {selectedServices.includes("nadruk_zlotem") && (
                                <select defaultValue="">
                                    <option>{lang === "1" ? "Brak" : "None"}</option>
                                    {selectedCup.nadruk_zlotem_do_25cm2 && (
                                        <option value="nadruk_zlotem_do_25cm2">{"<= 25cm2"}</option>
                                    )}
                                    {selectedCup.nadruk_zlotem_do_50cm2 && (
                                        <option value="nadruk_zlotem_do_50cm2">{"<= 50cm2"}</option>
                                    )}
                                </select>
                            )}
                        </div>
                    )}
                    {selectedCup.personalizacja && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["personalizacja"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter((v) => v !== "personalizacja")
                                          )
                                }
                            />
                            <p>{lang === "1" ? "Personalizacja" : "Personalization"}</p>
                        </div>
                    )}
                    {selectedCup.zdobienie_paskiem_bez_laczenia && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat([
                                                  "zdobienie_paskiem_bez_laczenia",
                                              ])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "zdobienie_paskiem_bez_laczenia"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Zdobienie paskiem bez łączenia"
                                    : "Decoration with stripe without connection"}
                            </p>
                        </div>
                    )}
                    {selectedCup.zdobienie_paskiem_z_laczeniem && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat([
                                                  "zdobienie_paskiem_z_laczeniem",
                                              ])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "zdobienie_paskiem_z_laczeniem"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Zdobienie paskiem z łączeniem"
                                    : "Decoration with stripe with connection"}
                            </p>
                        </div>
                    )}
                    {selectedCup.nadruk_na_powloce_magicznej_1_kolor && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat([
                                                  "nadruk_na_powloce_magicznej_1_kolor",
                                              ])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "nadruk_na_powloce_magicznej_1_kolor"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Nadruk na powłoce magicznej (1 kolor)"
                                    : "Print on the magic coating (1 color)"}
                            </p>
                        </div>
                    )}
                    {selectedCup.zdobienie_tapeta_na_barylce_I_stopien_trudnosci && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat([
                                                  "zdobienie_tapeta_na_barylce_I_stopien_trudnosci",
                                              ])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) =>
                                                      v !==
                                                      "zdobienie_tapeta_na_barylce_I_stopien_trudnosci"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Zdobienie tapetą na baryłce - I stopień trudności"
                                    : "Decoration with tape on the barrel - I degree of difficulty"}
                            </p>
                        </div>
                    )}
                    {selectedCup.zdobienie_tapeta_na_barylce_II_stopien_trudnosci && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat([
                                                  "zdobienie_tapeta_na_barylce_II_stopien_trudnosci",
                                              ])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) =>
                                                      v !==
                                                      "zdobienie_tapeta_na_barylce_II_stopien_trudnosci"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Zdobienie tapetą na baryłce - II stopień trudności"
                                    : "Decoration with tape on the barrel - II degree of difficulty"}
                            </p>
                        </div>
                    )}
                    {selectedCup.naklejka_papierowa_z_nadrukiem && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat([
                                                  "naklejka_papierowa_z_nadrukiem",
                                              ])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "naklejka_papierowa_z_nadrukiem"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Naklejka papierowa z nadrukiem"
                                    : "Paper sticker with imprint"}
                            </p>
                        </div>
                    )}
                    {selectedCup.wkladanie_ulotek_do_kubka && (
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedServices(
                                              selectedServices.concat(["wkladanie_ulotek_do_kubka"])
                                          )
                                        : setSelectedServices(
                                              selectedServices.filter(
                                                  (v) => v !== "wkladanie_ulotek_do_kubka"
                                              )
                                          )
                                }
                            />
                            <p>
                                {lang === "1"
                                    ? "Wkładanie ulotek do kubka"
                                    : "Inserting leaflets into the cup"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="ml-[40%]">
                <div className="flex flex-row">
                    <select defaultValue="" onChange={(e) => setSelectedCardboard(e.target.value)}>
                        <option value="">
                            {lang === "1" ? "Opakowanie zbiorcze" : "Bulk packaging"}
                        </option>{" "}
                        {/* free */}
                        <option value="singular">
                            {lang === "1" ? "Kartoniki jednostkowe" : "Unit cartons"}
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
                {/* transport tylko w polsce (dla klientow PL) */}
                <div className="flex flex-row">
                    <PalletQuantities
                        lang={lang}
                        selectedCardboard={selectedCardboard}
                        selectedCup={selectedCup}
                        amount={amounts.amount1}
                        keep
                    />
                    <PalletQuantities
                        lang={lang}
                        selectedCardboard={selectedCardboard}
                        selectedCup={selectedCup}
                        amount={amounts.amount2}
                    />
                    <PalletQuantities
                        lang={lang}
                        selectedCardboard={selectedCardboard}
                        selectedCup={selectedCup}
                        amount={amounts.amount3}
                    />
                    {/* ceny palet tez w panelu do wrzucenia */}
                </div>
            </div>
        </div>
    );
}
