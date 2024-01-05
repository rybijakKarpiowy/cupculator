import { Dispatch, SetStateAction } from "react";
import { WarehouseStockInterface } from "./calculator";
import { toast } from "react-toastify";

export const WarehouseDisplay = ({
    warehouseDisplayStock,
    lang,
    loading,
    setLoading,
    updateWarehouseDisplayStock,
}: {
    warehouseDisplayStock: WarehouseStockInterface;
    lang: "1" | "2";
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    updateWarehouseDisplayStock: () => Promise<void>;
}) => {
    const handleUpdate = async () => {
        setLoading(true);
        const res = await fetch("https://cupculatorbackend-production.up.railway.app/");
        // const res = await fetch("http://localhost:5000/");
        const status = res.status;
        switch (status) {
            case 200:
                toast.success("Magazyny zaktualizowane");
                await updateWarehouseDisplayStock();
                break;
            case 409:
                toast.warn("Magazyny były aktualizowane w ciągu ostatnich 5 minut");
                await updateWarehouseDisplayStock();
                break;
            case 500:
                toast.error("Błąd serwera");
                break;
            default:
                toast.error("Nieznany błąd");
                break;
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="w-96">
                <p>{lang === "1" ? "Ładowanie..." : "Loading..."}</p>
            </div>
        );
    }

    return (
        <>
            {"sum" in warehouseDisplayStock && (
                <div>
                    <p>
                        {lang === "1" ? "W magazynie:" : "In stock:"} {warehouseDisplayStock.sum}
                    </p>
                </div>
            )}
            {"divided" in warehouseDisplayStock && warehouseDisplayStock.divided && (
                <>
                    {"ICL" in warehouseDisplayStock.divided && (
                        <div className="flex justify-between gap-4 w-96">
                            <p>
                                {"ICL: "}
                                {warehouseDisplayStock.divided?.ICL?.amount || 0}
                            </p>
                            <p>
                                {"Aktualizacja: "}
                                {warehouseDisplayStock.divided?.ICL?.updated_at || "błąd"}
                            </p>
                        </div>
                    )}
                    {"QBS" in warehouseDisplayStock.divided && (
                        <div className="flex justify-between gap-4 w-96">
                            <p>
                                {"QBS: "}
                                {warehouseDisplayStock.divided?.QBS?.amount || 0}
                            </p>
                            <p>
                                {"Aktualizacja: "}
                                {warehouseDisplayStock.divided?.QBS?.updated_at || "błąd"}
                            </p>
                        </div>
                    )}
                    {"warehouse" in warehouseDisplayStock.divided && (
                        <>
                            <div className="flex justify-between gap-4 w-96">
                                <p>
                                    {"Magazyn: "}
                                    {warehouseDisplayStock.divided?.warehouse?.amount || 0}
                                </p>
                                <p>{"Aktualizacja: Teraz"}</p>
                            </div>
                            {warehouseDisplayStock.divided?.warehouse?.note && (
                                <div className="w-96">
                                    <p>
                                        {"Rezerwacja: "}
                                        {warehouseDisplayStock.divided?.warehouse?.note}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    <div className="w-96">
                        <p>
                            {"Łącznie: "}
                            {warehouseDisplayStock.divided.total}
                        </p>
                    </div>
                    <div className="w-96 flex justify-center" onClick={() => handleUpdate()}>
                        <button className="px-2 mt-2 rounded-md bg-green-300 hover:bg-green-400">
                            Aktualizuj magazyny
                        </button>
                    </div>
                </>
            )}
        </>
    );
};
