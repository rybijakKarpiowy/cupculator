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
                ? (calculatedPrices.cardboard * cardboardCount) / amount
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
            <p>
                {calculatedPrices.unit === null
                    ? ""
                    : priceToString(
                          Math.round((calculatedPrices.unit + singleCardboardPrice) * 100) / 100
                      )}
                {clientPriceUnit}
            </p>
            <p>
                {priceToString(calculatedPrices.prep)}
                {clientPriceUnit}
            </p>
            {clientPriceUnit === "zł" && (
                <p>
                    {priceToString(calculatedPrices.transport)}
                    {clientPriceUnit}
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
                              ) / 100
                          )
                        : priceToString(
                              Math.round(
                                  (calculatedPrices.prep +
                                      (calculatedPrices.unit + singleCardboardPrice) * amount) *
                                      100
                              ) / 100
                          )
                    : "0.00"}
                {clientPriceUnit}
            </p>
        </div>
    );
};
