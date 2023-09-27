import { Dispatch, SetStateAction } from "react";
import { WarehouseStockInterface } from "./calculator";
import { toast } from "react-toastify";

export const WarehouseDisplay = ({
    warehouseStock,
    lang,
    loading,
    setLoading,
}: {
    warehouseStock: WarehouseStockInterface;
    lang: "1" | "2";
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
    const handleUpdate = async () => {
        setLoading(true);
        const res = await fetch("/api/updatewarehouse");
        const status = res.status;
        switch (status) {
            case 200:
                toast.success("Magazyny zaktualizowane");
                break;
            case 409:
                toast.error("Magazyny były aktualizowane w ciągu ostatnich 5 minut");
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
                <p>{"Ładowanie..."}</p>
            </div>
        );
    }

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
                    <div className="w-96">
                        <p>
                            {"Łącznie: "}
                            {warehouseStock.divided.total}
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
