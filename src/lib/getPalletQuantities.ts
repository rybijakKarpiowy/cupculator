import { Cup } from "@/app/api/updatecups/route";

export const getPalletQuantities = (
    amount: number | null,
    selectedCup: Cup,
    selectedCardboard: "" | "singular" | "6pack_wykrojnik" | "6pack_klapowy"
) => {
    if (amount === null) return { mini: 0, half: 0, full: 0 };
    if (selectedCardboard === "singular") {
        if (
            !selectedCup.mini_pallet_singular ||
            !selectedCup.half_pallet_singular ||
            !selectedCup.full_pallet_singular
        )
            return { mini: 0, half: 0, full: 0 };

        const tempPalletsCount = { mini: 0, half: 0, full: 0 };
        let tempAmount = amount;
        while (tempAmount > 0) {
            if (
                selectedCup.full_pallet_singular &&
                tempAmount >= selectedCup.full_pallet_singular
            ) {
                tempPalletsCount.full++;
                tempAmount -= selectedCup.full_pallet_singular;
                continue;
            }
            if (
                selectedCup.half_pallet_singular &&
                selectedCup.full_pallet_singular &&
                tempAmount > selectedCup.half_pallet_singular
            ) {
                tempPalletsCount.full++;
                tempAmount = 0;
                continue;
            }
            if (
                selectedCup.half_pallet_singular &&
                tempAmount >= selectedCup.half_pallet_singular
            ) {
                tempPalletsCount.half++;
                tempAmount -= selectedCup.half_pallet_singular;
                continue;
            }
            if (
                selectedCup.mini_pallet_singular &&
                selectedCup.half_pallet_singular &&
                tempAmount > selectedCup.mini_pallet_singular
            ) {
                tempPalletsCount.half++;
                tempAmount = 0;
                continue;
            }
            if (
                selectedCup.mini_pallet_singular &&
                tempAmount >= selectedCup.mini_pallet_singular
            ) {
                tempPalletsCount.mini++;
                tempAmount -= selectedCup.mini_pallet_singular;
                continue;
            }
            if (tempAmount > 0) {
                tempPalletsCount.mini++;
                tempAmount = 0;
                continue;
            }
        }
        return tempPalletsCount;
    } else {
        if (!selectedCup.mini_pallet || !selectedCup.half_pallet || !selectedCup.full_pallet)
            return { mini: 0, half: 0, full: 0 };

        const tempPalletsCount = { mini: 0, half: 0, full: 0 };
        let tempAmount = amount;
        while (tempAmount > 0) {
            if (selectedCup.full_pallet && tempAmount >= selectedCup.full_pallet) {
                tempPalletsCount.full++;
                tempAmount -= selectedCup.full_pallet;
                continue;
            }
            if (
                selectedCup.half_pallet &&
                selectedCup.full_pallet &&
                tempAmount > selectedCup.half_pallet
            ) {
                tempPalletsCount.full++;
                tempAmount = 0;
                continue;
            }
            if (selectedCup.half_pallet && tempAmount >= selectedCup.half_pallet) {
                tempPalletsCount.half++;
                tempAmount -= selectedCup.half_pallet;
                continue;
            }
            if (
                selectedCup.mini_pallet &&
                selectedCup.half_pallet &&
                tempAmount > selectedCup.mini_pallet
            ) {
                tempPalletsCount.half++;
                tempAmount = 0;
                continue;
            }
            if (selectedCup.mini_pallet && tempAmount >= selectedCup.mini_pallet) {
                tempPalletsCount.mini++;
                tempAmount -= selectedCup.mini_pallet;
                continue;
            }
            if (tempAmount > 0) {
                tempPalletsCount.mini++;
                tempAmount = 0;
                continue;
            }
        }
        return tempPalletsCount;
    }
};
