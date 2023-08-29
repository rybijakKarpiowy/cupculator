export const priceToString = (price: number|null) => {
    if (price === null) {
        return "0.00";
    }
    const priceString = price.toString();
    if (priceString.split(".").length === 1) {
        return priceString + ".00";
    }
    if (priceString.split(".")[1].length === 1) {
        return priceString + "0";
    }
    return priceString;
}