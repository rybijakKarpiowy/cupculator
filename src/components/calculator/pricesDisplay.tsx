import { Cup } from "@/app/api/updatecups/route";
import { Database } from "@/database/types";
import { calculatePrices } from "@/lib/calculatePrices";
import { ColorPricing } from "@/lib/colorPricingType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CupConfigInterface } from "./calculator";
import { priceToString } from "@/lib/priceToString";

export const PricesDisplay = ({
    amount,
    lang,
    clientPriceUnit,
    keep,
    selectedCup,
    colorPricing,
    additionalValues,
    cupConfig,
}: {
    amount: number | null;
    lang: "1" | "2";
    clientPriceUnit: "zł" | "EUR";
    keep?: boolean;
    selectedCup: Cup;
    colorPricing: ColorPricing;
    additionalValues: Database["public"]["Tables"]["additional_values"]["Row"];
    cupConfig: CupConfigInterface;
}) => {
    if (!amount && !keep) return <></>;

    const { data: calculatedPrices, error } = calculatePrices({
        amount,
        selectedCup,
        colorPricing,
        additionalValues,
        cupConfig,
        lang,
        clientPriceUnit,
    });
    if (error) {
        toast.warn(error);
    }

    let singleCardboardPrice = 0;
    if (calculatedPrices.cardboard) {
        if (cupConfig.cardboard === "6pack_klapowy" || cupConfig.cardboard === "6pack_wykrojnik") {
            const cardboardCount = Math.ceil((amount || 0) / 6);
            singleCardboardPrice = amount
                ? Math.round(((calculatedPrices.cardboard * cardboardCount) / amount) * 100) / 100
                : 0;
        } else {
            singleCardboardPrice = calculatedPrices.cardboard;
        }
    }

    return (
        <div className="flex flex-col text-right">
            <p>
                {amount}
                {lang === "1" ? " szt." : " pcs."}
            </p>
            <p>{priceToString(calculatedPrices.unit, clientPriceUnit)}</p>
            <p>{priceToString(singleCardboardPrice, clientPriceUnit)}</p>
            <p>{priceToString(calculatedPrices.prep, clientPriceUnit)}</p>
            {clientPriceUnit === "zł" && (
                <p>
                    {(cupConfig.cardboard === "singular" &&
                        selectedCup.mini_pallet_singular &&
                        selectedCup.half_pallet_singular &&
                        selectedCup.full_pallet_singular) ||
                    (cupConfig.cardboard !== "singular" &&
                        selectedCup.mini_pallet &&
                        selectedCup.half_pallet &&
                        selectedCup.full_pallet)
                        ? priceToString(calculatedPrices.transport, clientPriceUnit)
                        : lang === "1"
                        ? "Wycena indywidualna"
                        : "Individual pricing"}
                </p>
            )}
            <p>
                {calculatedPrices.prep !== null && calculatedPrices.unit !== null && amount
                    ? calculatedPrices.transport
                        ? priceToString(
                              Math.round(
                                  (calculatedPrices.prep +
                                      (calculatedPrices.unit + singleCardboardPrice) * amount +
                                      calculatedPrices.transport) *
                                      100
                              ) / 100,
                              clientPriceUnit
                          )
                        : priceToString(
                              Math.round(
                                  (calculatedPrices.prep +
                                      (calculatedPrices.unit + singleCardboardPrice) * amount) *
                                      100
                              ) / 100,
                              clientPriceUnit
                          )
                    : priceToString(0, clientPriceUnit)}
            </p>
        </div>
    );
};
