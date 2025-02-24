"use client";

import { Cup } from "@/app/api/updatecups/route";
import { pricingsInterface } from "@/app/page";
import { Database } from "@/database/types";
import { ChangeEvent, useState } from "react";
import { Calculator } from "./calculator";
import { ColorPricing } from "@/lib/colorPricingType";
import { Restriction } from "@/lib/checkRestriction";

export const UserSelector = ({
    allUsersData,
    cup,
    lang,
    embed,
    additionalValues,
    restrictions
}: {
    allUsersData: (Database["public"]["Tables"]["users"]["Row"] & pricingsInterface)[];
    cup: string;
    lang: "1" | "2";
    embed: boolean;
    additionalValues: Database["public"]["Tables"]["additional_values"]["Row"];
    restrictions: Restriction[];
}) => {
    const [selectedPricingsData, setSelectedPricingsData] = useState<selectedPricingsDataInterface>(
        { cupData: [], colorPricing: null }
    );
    const [selectedUserUnit, setSelectedUserUnit] = useState<"zł" | "EUR">();
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const selectHandler = async (e: ChangeEvent<HTMLSelectElement>) => {
        setLoading(true);

        const selectedUser = e.target.value;
        setSelectedUserUnit(
            allUsersData.find((user) => user.user_id === selectedUser)?.eu ? "EUR" : "zł"
        );

        const pricingsDataRes = await fetch("/api/getuserpricings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: selectedUser, cupLink: cup }),
        });

        if (!pricingsDataRes.ok) {
            console.log(await pricingsDataRes.text());
            setIsError(true);
            setLoading(false);
            return;
        }

        const pricingsData = (await pricingsDataRes.json()) as {
            cupData: Cup[];
            colorPricing: ColorPricing;
        } | null;

        if (!pricingsData) {
            setIsError(true);
            setLoading(false);
            return;
        }

        setSelectedPricingsData(pricingsData);
        setLoading(false);
        return;
    };

    return (
        <>
            <select
                onChange={(e) => selectHandler(e)}
                className="w-max fixed group-data-[embed=true]:top-[57px] top-[87px] left-6 z-[100] border border-[#c00418] rounded-full px-2 py-[2px] bg-white"
                defaultValue=""
            >
                <option value="" disabled hidden>
                    Wybierz klienta
                </option>
                {allUsersData
                    .sort((a, b) =>
                        a.company_name.localeCompare(b.company_name, "pl", { sensitivity: "base" })
                    )
                    .map((user) => {
                        return (
                            <option key={user.user_id} value={user.user_id}>
                                {user.company_name}
                            </option>
                        );
                    })}
            </select>
            {loading && <div>{lang === "1" ? "Ładowanie..." : "Loading..."}</div>}
            {isError && cup !== "null" && (
                <div className="text-center text-2xl mt-72">
                    {lang === "1"
                        ? "Wystąpił błąd, odśwież stronę"
                        : "An error occured, refresh the page"}
                </div>
            )}
            {isError && cup === "null" && (
                <div className="text-center text-2xl mt-72">
                    {lang === "1" ? "Wybierz kubek" : "Select a cup"}
                </div>
            )}
            {!isError &&
                !loading &&
                selectedPricingsData.colorPricing &&
                selectedPricingsData.cupData.length > 0 &&
                selectedUserUnit && (
                    <Calculator
                        cupData={selectedPricingsData.cupData}
                        colorPricing={selectedPricingsData.colorPricing}
                        lang={lang}
                        embed={embed}
                        clientPriceUnit={selectedUserUnit}
                        additionalValues={additionalValues}
                        restrictions={restrictions}
                    />
                )}
        </>
    );
};

interface selectedPricingsDataInterface {
    cupData: Cup[];
    colorPricing: ColorPricing | null;
}
