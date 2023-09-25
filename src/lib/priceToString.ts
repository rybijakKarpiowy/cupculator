export const priceToString = (price: number | null | undefined, clientPriceUnit: "zł" | "EUR") => {
    if (!price) {
        return `${clientPriceUnit === "zł" ? "0,00" : "0.00"} ${clientPriceUnit}`;
    }

    let priceString = price.toString();
    if (priceString.split(".").length === 1) {
        priceString = priceString + ".00";
    }
    if (priceString.split(".")[1].length === 1) {
        priceString = priceString + "0";
    }

    if (clientPriceUnit === "zł") {
        priceString = priceString.replace(".", ",");
    }

    return `${priceString} ${clientPriceUnit}`;
};
