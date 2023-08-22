"use client";

import { Database } from "@/database/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Cup } from "../api/updatecups/route";
import noImage from "@/../public/noimage.png";

export default function Test({
    searchParams,
}: {
    searchParams: {
        lang: string;
    };
}) {
    const lang = searchParams.lang;
    const clientPriceUnit: "zł" | "EUR" = "zł";

    // const [selectedCup, setSelectedCup] = useState(cupData[0]);
    const [amount, setAmount] = useState<number>();
    const [calculatedPrices, setCalculatedPrices] = useState<{
        unit: number | null;
        prep: number | null;
    }>({ unit: null, prep: null });
    const [printType, setPrintType] = useState<string>("");

    useEffect(() => {
        if (!amount) return;
        if (amount < 24) {
            setCalculatedPrices({
                unit: null,
                prep: null,
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
    }, [amount]);
    return (
        <div className="flex flex-col">
            <h1>{lang === "1" ? "Kalkulator" : "Calculator"}</h1>
            <div className="flex flex-row">
                {/* {selectedCup.icon ? (
                <Image src={selectedCup.icon} alt={""} />
            ) : ( */}
                <Image src={noImage} alt={""} width={200} />
                {/* )} */}
                <div className="flex flex-col">
                    {/* {selectedCup.code} */}
                    <p>K002.18.01</p>
                    {/* {selectedCup.name} */}
                    <p>Tomek EU</p>
                    {/* {selectedCup.volume} */}
                    <p>350ml</p>
                    <p>
                        {lang === "1" ? "Sztuk: " : "Pieces: "}
                        {amount}
                    </p>
                    <p>
                        {lang === "1"
                            ? "Jednostkowa cena produktu z nadrukiem: "
                            : "Price for printed product per unit: "}
                        {calculatedPrices.unit}
                        {clientPriceUnit}
                    </p>
                    <p>
                        {lang === "1" ? "Koszt przygotowalni: " : "Preparation cost: "}
                        {calculatedPrices.prep}
                        {clientPriceUnit}
                    </p>
                    <p>
                        {lang === "1" ? "Całkowity koszt: " : "Total cost: "}
                        {calculatedPrices.prep &&
                            calculatedPrices.unit &&
                            amount &&
                            calculatedPrices.prep + calculatedPrices.unit * amount}
                        {clientPriceUnit}
                    </p>
                </div>
            </div>
            <div>
                <div>
                    {lang == "1" ? "Wybierz kolor: " : "Select color: "}
                    <select
                    // onChange={(e) => {
                    //     setSelectedCup(
                    //         cupData.find((cup) => cup.code === e.target.value) as Cup
                    //     );
                    // }}
                    >
                        {/* {cupData.map((cup) => (
                            <option key={cup.code} value={cup.code}>
                                {cup.color}
                            </option>
                        ))} */}
                        <option value="niebieski">niebieski</option>
                        <option value="czerwony">czerwony</option>
                        <option value="zielony">zielony</option>
                    </select>
                </div>
                <div>
                    {lang === "1" ? "Ilość: " : "Amount: "}
                    <input
                        type="number"
                        min="1"
                        onBlur={(e) => {
                            setAmount(parseInt(e.target.value));
                        }}
                    />
                    {/* <button onClick={() => addAmountInput()} ></button> */}
                </div>
                {/* {(selectedCup.trend_color) && ( */}
                <div>
                    Trend Color:
                    <select defaultValue="">
                        <option value="">
                            {lang === "1" ? "Bez Trend Color" : "No Trend Color"}
                        </option>
                        {/* {selectedCup.trend_color && ( */}
                        <option value="inside">{lang === "1" ? "Wewnątrz" : "Inside"}</option>
                        <option value="outside">{lang === "1" ? "Zewnątrz" : "Outside"}</option>
                        <option value="both">
                            {lang === "1" ? "Wenątrz i na zewnątrz" : "Inside and outside"}
                        </option>
                        {/* )} */}
                        {/* {selectedCup.trend_colorzobnizonym rantem && ( */}
                        <option value="trend_colorzobizonymrantem">
                            {lang === "1"
                                ? "Na zewnątrz z obniżonym rantem"
                                : "Outside with lowered edge"}
                        </option>
                        {/* change these names (value and atrr) */}
                        {/* )} */}
                    </select>
                </div>
                <div>
                    Soft Touch:
                    <select defaultValue="">
                        <option value="">
                            {lang === "1" ? "Bez Soft Touch" : "No Soft Touch"}
                        </option>
                        {/* {selectedCup.soft_touch && ( */}
                        <option value="soft_touch">Soft Touch</option>
                        {/* )} */}
                    </select>
                </div>
                {/* )} */}
                {/* {selectedCup.pro_color && ( */}
                <div>
                    Pro Color:
                    <select defaultValue="">
                        <option value="">{lang === "1" ? "Bez Pro Color" : "No Pro Color"}</option>
                        <option value="pro_color">{lang === "1" ? "Wewnątrz" : "Inside"}</option>
                    </select>
                </div>
                {/* )} */}
                <div>
                    {lang === "1" ? "Wybierz nadruk: " : "Select print type: "}
                    <select defaultValue="">
                        <option value="">{lang === "1" ? "Brak" : "None"}</option>
                        {/* tutaj trzeba dolozyc troche +20% np do wpisania w panelu */}
                        <option value="direct_print">
                            {lang === "1" ? "Nadruk bezpośredni" : "Direct print"}
                        </option>
                        <option value="transfer_plus_1">
                            {lang === "1" ? "Kalka ceramiczna 1 strona" : "Transfer plus 1 side"}
                        </option>
                        <option value="transfer_plus_2">
                            {lang === "1" ? "Kalka ceramiczna 2 strony" : "Transfer plus 2 sides"}
                        </option>
                        <option value="transfer_plus_round">
                            {lang === "1" ? "Kalka ceramiczna wokół" : "Transfer plus around"}
                        </option>
                        <option value="polylux_1">
                            Polylux {lang === "1" ? "1 strona" : "1 side"}
                        </option>
                        <option value="polylux_2">
                            Polylux {lang === "1" ? "2 strony" : "2 sides"}
                        </option>
                        <option value="polylux_round">
                            Polylux {lang === "1" ? "wokół" : "around"}
                        </option>
                        <option value="deep_effect_1">
                            Deep effect {lang === "1" ? "1 strona" : "1 side"}
                        </option>
                        <option value="deep_effect_2">
                            Deep effect {lang === "1" ? "2 strony" : "2 sides"}
                        </option>
                        <option value="deep_effect_plus_1">
                            Deep effect plus {lang === "1" ? "1 strona" : "1 side"}
                        </option>
                        <option value="deep_effect_plus_2">
                            Deep effect plus {lang === "1" ? "2 strony" : "2 sides"}
                        </option>
                    </select>
                </div>
                <div>
                    {lang === "1" ? "Liczba kolorów nadruku: " : "Number of print colors: "}
                    <select defaultValue="">
                        <option value="" disabled hidden>
                            {lang === "1" ? "Brak" : "None"}
                        </option>
                        {printType &&
                            [
                                "deep_effect_1",
                                "deep_effect_2",
                                "deep_effect_plus_1",
                                "deep_effect_plus_2",
                            ].includes(printType) &&
                            [...Array(2)].map(
                                (num) => (
                                    (num += 1),
                                    (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    )
                                )
                            )}
                        {printType &&
                            printType === "direct_print" &&
                            [...Array(4)].map(
                                (num) => (
                                    (num += 1),
                                    (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    )
                                )
                            )}
                        {printType &&
                            [
                                "transfer_plus_1",
                                "transfer_plus_2",
                                "transfer_plus_round",
                                "polylux_1",
                                "polylux_2",
                                "polylux_round",
                            ].includes(printType) &&
                            [...Array(16)].map(
                                (num) => (
                                    (num += 1),
                                    (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    )
                                )
                            )}
                    </select>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>{lang === "1" ? "Nadruk wewnątrz na ściance" : "Print on the inside"}</p>
                        {
                            <>
                                <select defaultValue="1">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                                <p>{lang === "1" ? "nadruków" : "prints"}</p>
                            </>
                        }
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>{lang === "1" ? "Nadruk na uchu" : "Print on the handle"}</p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Nadruk na spodzie (zewn.)"
                                : "Print on the bottom outside"}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1" ? "Nadruk na dnie (wewn.)" : "Print on the bottom inside"}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>{lang === "1" ? "Nadruk przez rant" : "Over the rim imprint"}</p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1" ? "apla???" : "apla???"}
                            {/* dopytac */}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Nadruk dookoła (pod uchem)"
                                : "Print around (under the handle)"}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1" ? "Nadruk złotem do 25 cm2" : "Gold print up to 25 cm2"}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1" ? "Nadruk złotem do 50 cm2" : "Gold print up to 50 cm2"}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>{lang === "1" ? "Personalizacja" : "Personalization"}</p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Zdobienie paskiem bez łączenia"
                                : "Decoration with stripe without connection????"}
                        </p>
                        {/* dopytac */}
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Zdobienie paskiem z łączeniem"
                                : "Decoration with stripe with connection????"}
                        </p>
                        {/* dopytac */}
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Nadruk na powłoce magicznej (1 kolor)"
                                : "Print on the magic coating (1 color)"}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Zdobienie tapetą na baryłce - I stopień trudności"
                                : "Decoration with tape on the barrel - I degree of difficulty"}
                        </p>
                        {/* dopytac */}
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Zdobienie tapetą na baryłce - II stopień trudności"
                                : "Decoration with tape on the barrel - II degree of difficulty"}
                        </p>
                        {/* dopytac */}
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Naklejka papierowa z nadrukiem"
                                : "Paper sticker with imprint"}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" />
                        <p>
                            {lang === "1"
                                ? "Wkładanie ulotek do kubka"
                                : "Inserting leaflets into the cup"}
                        </p>
                    </div>
                </div>
            </div>
            {/* dodac kartoniki, jednostkowy lub 6pak jeden lub drugi, jak filizanka to tylko jednostkowy, domyslnie zawsze opakowanie zbiorcze za darmo */}
            {/* transport tylko w polsce (dla klientow PL) */}
            {/* ceny palet tez w panelu do wrzucenia */}
        </div>
    );
}
