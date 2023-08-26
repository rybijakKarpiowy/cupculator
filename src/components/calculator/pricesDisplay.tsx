import { Cup } from "@/app/api/updatecups/route";
import { Database } from "@/database/types";
import { calculatePrices } from "@/lib/calculatePrices";
import { ColorPricing } from "@/lib/colorPricingType";
import { toast } from "react-toastify";
import { CupConfigInterface } from "./calculator";

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

    return (
        <div className="flex flex-col text-right">
            <p>
                {amount}
                {lang === "1" ? " szt." : " pcs."}
            </p>
            <p>
                {calculatedPrices.unit}
                {clientPriceUnit}
            </p>
            <p>
                {calculatedPrices.prep}
                {clientPriceUnit}
            </p>
            {clientPriceUnit === "zł" && (
                <p>
                    {calculatedPrices.transport}
                    {clientPriceUnit}
                </p>
            )}
            <p>
                {calculatedPrices.prep &&
                    calculatedPrices.unit &&
                    amount &&
                    (calculatedPrices.transport
                        ? calculatedPrices.prep +
                          calculatedPrices.unit * amount +
                          calculatedPrices.transport
                        : calculatedPrices.prep + calculatedPrices.unit * amount)}
                {clientPriceUnit}
            </p>
        </div>
    );
};
