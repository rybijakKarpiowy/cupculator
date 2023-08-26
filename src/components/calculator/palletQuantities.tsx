import { Cup } from "@/app/api/updatecups/route";
import { CupConfigInterface } from "./calculator";

export const PalletQuantities = ({
    lang,
    selectedCardboard,
    selectedCup,
    amount,
    keep,
}: {
    lang: "1" | "2";
    selectedCardboard: CupConfigInterface["cardboard"];
    selectedCup: Cup;
    amount: number | null;
    keep?: boolean;
}) => {
    if ((!amount || amount < 24) && !keep) return <></>;

    return (
        <div className="flex flex-col w-[168px]">
            <div className="flex flex-row gap-2 justify-between">
                <p>{lang === "1" ? "Liczba mini palet: " : "Mini-pallet quantity: "}</p>
                <span>
                    {selectedCardboard === "singular"
                        ? selectedCup.mini_pallet_singular && amount
                            ? Math.ceil(amount / selectedCup.mini_pallet_singular)
                            : "N/A"
                        : selectedCup.mini_pallet && amount
                        ? Math.ceil(amount / selectedCup.mini_pallet)
                        : "N/A"}
                </span>
            </div>
            <div className="flex flex-row gap-2 justify-between">
                <p>{lang === "1" ? "Liczba pół palet: " : "Half-pallet quantity: "}</p>
                <span>
                    {selectedCardboard === "singular"
                        ? selectedCup.half_pallet_singular && amount
                            ? Math.ceil(amount / selectedCup.half_pallet_singular)
                            : "N/A"
                        : selectedCup.half_pallet && amount
                        ? Math.ceil(amount / selectedCup.half_pallet)
                        : "N/A"}
                </span>
            </div>
            <div className="flex flex-row gap-2 justify-between">
                <p>{lang === "1" ? "Liczba pełnych palet: " : "Full-pallet quantity: "}</p>
                <span>
                    {selectedCardboard === "singular"
                        ? selectedCup.full_pallet_singular && amount
                            ? Math.ceil(amount / selectedCup.full_pallet_singular)
                            : "N/A"
                        : selectedCup.full_pallet && amount
                        ? Math.ceil(amount / selectedCup.full_pallet)
                        : "N/A"}
                </span>
            </div>
        </div>
    );
};
