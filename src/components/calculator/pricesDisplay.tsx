export const PricesDisplay = ({
    amount,
    lang,
    calculatedPrices,
    clientPriceUnit,
    keep,
}: {
    amount: number | null;
    lang: "1" | "2";
    calculatedPrices: { unit: number | null; prep: number | null; transport: number | null };
    clientPriceUnit: "zł" | "EUR";
    keep?: boolean;
}) => {
    if (!amount && !keep) return <></>;

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
