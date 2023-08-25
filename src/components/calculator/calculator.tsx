"use client";

import { Cup } from "@/app/api/updatecups/route";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Database } from "@/database/types";
import { toast } from "react-toastify";
import noImage from "@/../public/noimage.png";
import { ColorPricing } from "@/lib/colorPricingType";

export const Calculator = ({
    cupData,
    colorPricing,
    lang,
    clientPriceUnit,
    additionalValues,
}: {
    cupData: Cup[];
    colorPricing: ColorPricing;
    lang: string;
    clientPriceUnit: "zł" | "EUR";
    additionalValues: Database["public"]["Tables"]["additional_values"]["Row"];
}) => {
    const [selectedCup, setSelectedCup] = useState(cupData[0]);
    const [amount, setAmount] = useState<number>();
    const [calculatedPrices, setCalculatedPrices] = useState<{
        unit: number | null;
        prep: number | null;
    }>({ unit: null, prep: null });

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
    }, [amount, lang]);

    return (
        <div>
            <h1>{lang === "1" ? "Kalkulator" : "Calculator"}</h1>
            {selectedCup.icon ? (
                <Image src={selectedCup.icon} alt={""} width={128} height={128} />
            ) : (
                <Image src={noImage} alt={""} />
            )}
            {selectedCup.prices.price_24 === 0 ? (
                <div>
                    <p>{selectedCup.code}</p>
                    <p>{selectedCup.name}</p>
                    <p>{selectedCup.volume}</p>
                    <h1>
                        {lang === "1"
                            ? "Brak danych w systemie dla tego koloru, skontaktuj się z działem handlowym."
                            : "No data in system for this color, contact our sales department."}
                    </h1>
                </div>
            ) : (
                <div>
                    <p>{selectedCup.code}</p>
                    <p>{selectedCup.name}</p>
                    <p>{selectedCup.volume}</p>
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
            )}
            <div>
                <div>
                    {lang == "1" ? "Wybierz kolor: " : "Select color: "}
                    <select
                        onChange={(e) => {
                            setSelectedCup(
                                cupData.find((cup) => cup.code === e.target.value) as Cup
                            );
                        }}
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
                        disabled={selectedCup.prices.price_24 === 0}
                        type="number"
                        min="1"
                        onChange={(e) => {
                            setAmount(parseInt(e.target.value));
                        }}
                    />
                    {/* <button onClick={() => addAmountInput()} ></button> */}
                </div>
                {(selectedCup.trend_color || selectedCup.soft_touch) && (
                    <div>
                        Hydrocolor / Soft Touch:
                        <select defaultValue="">
                            <option value="">
                                {lang === "1" ? "Bez hydrokoloru" : "No hydrocolor"}
                            </option>
                            {selectedCup.trend_color && (
                                <option value="trend_color">Trend Color</option>
                            )}
                            {selectedCup.soft_touch && (
                                <option value="soft_touch">Soft Touch</option>
                            )}
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
                            <option value="pro_color">Pro Color</option>
                        </select>
                    </div>
                )}
                <div>
                    {lang === "1" ? "Wybierz nadruk: " : "Select print type: "}
                    <select defaultValue="">
                        <option value="">{lang === "1" ? "Brak" : "None"}</option>
                    </select>
                </div>
                <div>{lang === "1" ? "Liczba kolorów nadruku: " : "Number of print colors: "}</div>
            </div>
        </div>
    );
};
