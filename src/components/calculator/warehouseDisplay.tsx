import { WarehouseStockInterface } from "./calculator";

export const WarehouseDisplay = ({
    warehouseStock,
    lang,
}: {
    warehouseStock: WarehouseStockInterface;
    lang: "1" | "2";
}) => {
    return (
        <>
            {"sum" in warehouseStock && (
                <div>
                    <p>
                        {lang === "1" ? "W magazynie:" : "In stock:"} {warehouseStock.sum}
                    </p>
                </div>
            )}
            {"divided" in warehouseStock && warehouseStock.divided && (
                <>
                    {"ICL" in warehouseStock.divided && (
                        <div className="flex justify-between gap-4 w-96">
                            <p>
                                {"ICL: "}
                                {warehouseStock.divided?.ICL?.amount || 0}
                            </p>
                            <p>
                                {"Aktualizacja: "}
                                {warehouseStock.divided?.ICL?.updated_at || "błąd"}
                            </p>
                        </div>
                    )}
                    {"QBS" in warehouseStock.divided && (
                        <div className="flex justify-between gap-4 w-96">
                            <p>
                                {"QBS: "}
                                {warehouseStock.divided?.QBS?.amount || 0}
                            </p>
                            <p>
                                {"Aktualizacja: "}
                                {warehouseStock.divided?.QBS?.updated_at || "błąd"}
                            </p>
                        </div>
                    )}
                    {"warehouse" in warehouseStock.divided && (
                        <>
                            <div className="flex justify-between gap-4 w-96">
                                <p>
                                    {"Magazyn: "}
                                    {warehouseStock.divided?.warehouse?.amount || 0}
                                </p>
                                <p>{"Aktualizacja: Teraz"}</p>
                            </div>
                            {warehouseStock.divided?.warehouse?.note && (
                                <div className="w-96">
                                    <p>
                                        {"Rezerwacja: "}
                                        {warehouseStock.divided?.warehouse?.note}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};
