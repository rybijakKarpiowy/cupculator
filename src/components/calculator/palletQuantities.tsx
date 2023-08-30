import { Cup } from "@/app/api/updatecups/route";
import { CupConfigInterface } from "./calculator";
import { getPalletQuantities } from "@/lib/getPalletQuantities";

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
    const palletsCount = getPalletQuantities(amount, selectedCup, selectedCardboard);

    if ((!amount || amount < 24) && !keep) return <></>;

    return (
        <div className="flex flex-col w-[168px]">
            <div className="flex flex-row gap-2 justify-between">
                <p>{lang === "1" ? "Liczba mini palet: " : "Mini-pallet quantity: "}</p>
                <span>{palletsCount.mini}</span>
            </div>
            <div className="flex flex-row gap-2 justify-between">
                <p>{lang === "1" ? "Liczba pół palet: " : "Half-pallet quantity: "}</p>
                <span>{palletsCount.half}</span>
            </div>
            <div className="flex flex-row gap-2 justify-between">
                <p>{lang === "1" ? "Liczba pełnych palet: " : "Full-pallet quantity: "}</p>
                <span>{palletsCount.full}</span>
            </div>
        </div>
    );
};
