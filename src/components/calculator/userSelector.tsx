"use client";

import { Cup } from "@/app/api/updatecups/route";
import { pricingsInterface } from "@/app/page";
import { Database } from "@/database/types";
import { getUserPricings } from "@/lib/getUserPricings";
import { ChangeEvent, useState } from "react";
import { Calculator } from "./calculator";

export const UserSelector = ({
    allUsersData,
    cup,
    lang,
}: {
    allUsersData: (Database["public"]["Tables"]["users"]["Row"] & pricingsInterface)[];
    cup: string;
    lang: string;
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

        const pricingsData = await getUserPricings(selectedUser, cup);
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
                className="w-max fixed top-[87px] left-6 z-[100] border border-[#c00418] rounded-full px-2 py-[2px] bg-white"
                defaultValue=""
            >
                <option value="" disabled hidden>
                    Wybierz klienta
                </option>
                {allUsersData.map((user) => {
                    return (
                        <option key={user.user_id} value={user.user_id}>
                            {user.company_name}
                        </option>
                    );
                })}
            </select>
            {loading && <div>{lang === "1" ? "Ładowanie..." : "Loading..."}</div>}
            {isError && (
                <div className="text-center text-2xl mt-72">
                    {lang === "1"
                        ? "Wystąpił błąd, odśwież stronę"
                        : "An error occured, refresh the page"}
                </div>
            )}
            {selectedPricingsData.colorPricing &&
                selectedPricingsData.cupData.length > 0 &&
                selectedUserUnit && (
                    <Calculator
                        cupData={selectedPricingsData.cupData}
                        colorPricing={selectedPricingsData.colorPricing}
                        lang={lang}
                        clientPriceUnit={selectedUserUnit}
                    />
                )}
        </>
    );
};

interface selectedPricingsDataInterface {
    cupData: Cup[];
    colorPricing: Database["public"]["Tables"]["color_pricings"]["Row"] | null;
}
