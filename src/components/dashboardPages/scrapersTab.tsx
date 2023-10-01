"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ScrapersTab = ({
    scrapersDataInput,
}: {
    scrapersDataInput: {
        cup_code: string;
        cup_id: number;
        scrapers: {
            provider: string;
            code_link: string;
        }[];
    }[];
}) => {
    const [scrapersData, setScrapersData] = useState(scrapersDataInput);
    const [selectedItem, setSelectedItem] = useState<{
        cup_code: string;
        cup_id: number;
        scrapers: {
            provider: string;
            code_link: string;
        }[];
    }>(scrapersData[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ICLlink = document.getElementById("icl-link") as HTMLInputElement | undefined;
        const QBScode = document.getElementById("qbs-code") as HTMLInputElement | undefined;
        if (ICLlink) {
            ICLlink.value = "";
        }
        if (QBScode) {
            QBScode.value = "";
        }
    }, [selectedItem]);

    const testScraper = async (provider: string, code_link: string, cup_id: number) => {
        setLoading(true);
        if (!code_link) {
            toast.error("Nie podano linku/kodu");
            setLoading(false);
            return;
        }

        const res = await fetch(
            "/api/testscraper?provider=" +
                provider +
                "&code_link=" +
                code_link +
                "&cup_id=" +
                cup_id
        );

        switch (res.status) {
            case 400:
                toast.error("Niepoprawne dane");
                break;
            case 500:
                toast.error("Błąd serwera");
                break;
            case 404:
                toast.error("Błąd scrapera");
                break;
            case 200:
                const data = (await res.json()) as { amount: number };
                if (
                    !confirm(
                        "Pomyślnie pobrano dane. Ilość produktów: " +
                            data.amount.toString() +
                            "\nCzy chcesz zapisać dane?"
                    )
                ) {
                    setLoading(false);
                    return;
                }

                const res2 = await fetch("/api/updatescrdata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        provider,
                        code_link,
                        cup_id,
                    }),
                });

                if (res2.status === 500) {
                    toast.error("Bład serwera");
                    setLoading(false);
                    return;
                }
                if (res2.status === 400) {
                    toast.error("Niepoprawne dane");
                    setLoading(false);
                    return;
                }
                if (!res2.ok) {
                    toast.error("Wystąpił błąd");
                    setLoading(false);
                    return;
                }
                const newScrapersData = scrapersData.map((item) => {
                    if (item.cup_id === cup_id) {
                        return {
                            ...item,
                            scrapers: [
                                ...item.scrapers.filter((item) => item.provider !== provider),
                                {
                                    provider,
                                    code_link,
                                },
                            ],
                        };
                    }
                    return item;
                });
                setScrapersData(newScrapersData);
                toast.success("Zapisano dane");
                break;
        }
        setLoading(false);
    };

    const deleteScraper = async (
        provider: string,
        scrapersItem: {
            cup_code: string;
            cup_id: number;
            scrapers: {
                provider: string;
                code_link: string;
            }[];
        }
    ) => {
        setLoading(true);
        if (!scrapersItem.cup_code) {
            setLoading(false);
            return;
        }
        if (!scrapersItem.scrapers.find((item) => item.provider === provider)) {
            toast.error("Scraper nie istnieje");
            setLoading(false);
            return;
        }

        const res = await fetch("/api/deletescr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                provider,
                cup_id: scrapersItem.cup_id,
            }),
        });

        if (res.status === 500) {
            toast.error("Bład serwera");
            setLoading(false);
            return;
        }
        if (res.status === 400) {
            toast.error("Niepoprawne dane");
            setLoading(false);
            return;
        }
        if (!res.ok) {
            toast.error("Wystąpił błąd");
            setLoading(false);
            return;
        }
        const newScrapersData = scrapersData.map((item) => {
            if (item.cup_id === scrapersItem.cup_id) {
                return {
                    ...item,
                    scrapers: [...item.scrapers.filter((item) => item.provider !== provider)],
                };
            }
            return item;
        });
        setScrapersData(newScrapersData);
        toast.success("Usunięto scraper");
        setLoading(false);
    };

    return (
        <div>
            <h2>Scrapery</h2>
            <hr />
            <br />
            <select
                className="min-w-max border border-black ml-4 mb-4 rounded-md"
                defaultValue={scrapersData[0].cup_code || ""}
                onChange={(e) => {
                    setSelectedItem(scrapersData.find((item) => item.cup_code === e.target.value)!);
                }}
            >
                {scrapersData.map((item) => (
                    <option key={item.cup_code}>{item.cup_code}</option>
                ))}
            </select>
            <h3 className="ml-4 mb-2">Wybrany kod: {selectedItem.cup_code}</h3>
            <div className="ml-4 mb-4 flex flex-col border-2 border-red-500 w-fit p-2 rounded-md">
                <p>ICL wymaga podania linku</p>
                <p>QBS wymaga podania kodu</p>
            </div>
            <ul className="flex flex-col p-2">
                <li className="flex flex-row text-center">
                    <p className="w-20 border border-black">Dostawca</p>
                    <p className="w-[1000px] border border-black">Link/kod</p>
                    <p className="w-96 border border-black">Akcje</p>
                </li>
                <li className="flex flex-row text-center">
                    <p className="w-20 border border-black">ICL</p>
                    <input
                        className="w-[1000px] border border-black text-center"
                        placeholder={
                            selectedItem.scrapers.find((item) => item.provider === "ICL")
                                ?.code_link || ""
                        }
                        disabled={loading}
                        id="icl-link"
                    />
                    <button
                        className={`px-2 w-48 rounded-md border border-black ${
                            loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                        }`}
                        disabled={loading}
                        onClick={() => {
                            testScraper(
                                "ICL",
                                (
                                    document.getElementById("icl-link") as
                                        | HTMLInputElement
                                        | undefined
                                )?.value || "",
                                selectedItem.cup_id
                            );
                        }}
                    >
                        Testuj
                    </button>
                    <button
                        className={`px-2 w-48 rounded-md border border-black ${
                            loading ||
                            !selectedItem.scrapers.find((item) => item.provider === "ICL")
                                ? "bg-slate-300"
                                : "bg-red-300 hover:bg-red-400"
                        }`}
                        disabled={
                            loading ||
                            !selectedItem.scrapers.find((item) => item.provider === "ICL")
                        }
                        onClick={() => {
                            deleteScraper("ICL", selectedItem);
                        }}
                    >
                        Usuń
                    </button>
                </li>
                <li className="flex flex-row text-center">
                    <p className="w-20 border border-black">QBS</p>
                    <input
                        className="w-[1000px] border border-black text-center"
                        placeholder={
                            selectedItem.scrapers.find((item) => item.provider === "QBS")
                                ?.code_link || ""
                        }
                        disabled={loading}
                        id="qbs-code"
                    />
                    <button
                        className={`px-2 w-48 rounded-md border border-black ${
                            loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                        }`}
                        disabled={loading}
                        onClick={() => {
                            testScraper(
                                "QBS",
                                (
                                    document.getElementById("qbs-code") as
                                        | HTMLInputElement
                                        | undefined
                                )?.value || "",
                                selectedItem.cup_id
                            );
                        }}
                    >
                        Testuj
                    </button>
                    <button
                        className={`px-2 w-48 rounded-md border border-black ${
                            loading ||
                            !selectedItem.scrapers.find((item) => item.provider === "QBS")
                                ? "bg-slate-300"
                                : "bg-red-300 hover:bg-red-400"
                        }`}
                        disabled={
                            loading ||
                            !selectedItem.scrapers.find((item) => item.provider === "QBS")
                        }
                        onClick={() => {
                            deleteScraper("QBS", selectedItem);
                        }}
                    >
                        Usuń
                    </button>
                </li>
            </ul>
        </div>
    );
};
