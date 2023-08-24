export const calculatePrices = (amount: number|null) => {
    if (!amount) return { unit: null, prep: null, transport: null }

    let amountRange : "24" | "72" | "108" | "216" | "504" | "1008" | "2520"
    if (amount < 72) amountRange = "24"
    else if (amount < 108) amountRange = "72"
    else if (amount < 216) amountRange = "108"
    else if (amount < 504) amountRange = "216"
    else if (amount < 1008) amountRange = "504"
    else if (amount < 2520) amountRange = "1008"
    else amountRange = "2520"

    

    return {} as { unit: number | null; prep: number | null; transport: number | null }
}