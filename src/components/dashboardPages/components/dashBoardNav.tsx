"use client";

import { useState } from "react";

export const DashBoardNav = ({url, user}:{url:string, user:User}) => {
    const [chosenTab, _] = useState<string>(url);
    
    const searchParams = new URLSearchParams(window.location.search);
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup")?.trim().replaceAll(" ", "_") || "";
    const embed = searchParams.get("embed") == 'true' ? true : false;

    const setChosenTab = (tab: string) => {
        window.location.href = `/dashboard/${tab}?cup=${cup}&lang=${lang}&embed=${embed}`;
    };

    return (
        <>
        <h1>Panel</h1>
            <div className="flex flex-row gap-3">
                <button
                    className={`${
                        chosenTab === "/activationRequests" ? "bg-slate-400" : "bg-slate-300"
                    } px-2 rounded-md`}
                    onClick={() => setChosenTab("activationRequests")}
                >
                    Aktywacja klientów
                </button>
                <button
                    className={`${
                        chosenTab === "/clients" ? "bg-slate-400" : "bg-slate-300"
                    } px-2 rounded-md`}
                    onClick={() => setChosenTab("clients")}
                >
                    Klienci
                </button>
                {user?.role === "Admin" && (
                    <>
                        <button
                            className={`${
                                chosenTab === "/adminsAndSalesmen" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("adminsAndSalesmen")}
                        >
                            Admini i handlowcy
                        </button>
                        <button
                            className={`${
                                chosenTab === "/pricings" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("pricings")}
                        >
                            Cenniki
                        </button>
                        <button
                            className={`${
                                chosenTab === "/additionalValues" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("additionalValues")}
                        >
                            Dodatkowe wartości
                        </button>
                        <button
                            className={`${
                                chosenTab === "/restrictions" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("restrictions")}
                        >
                            Wykluczenia
                        </button>
                        <button
                            className={`${
                                chosenTab === "/productsCard" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("productsCard")}
                        >
                            Karta produktów
                        </button>
                        <button
                            className={`${
                                chosenTab === "/scrapers" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("scrapers")}
                        >
                            Scrapery
                        </button>
                        <button
                            className={`${
                                chosenTab === "/adminEmails" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("adminEmails")}
                        >
                            Emaile adminów
                        </button>
                    </>
                )}
            </div>
            <p>Zalogowano jako: {user?.email}</p>
            <p>Rola: {user?.role}</p></>
    )
}

interface User {
    user_id: string;
    email: string;
    activated?: boolean | undefined;
    color_pricing?: string | null | undefined;
    cup_pricing?: string | null | undefined;
    role: "User" | "Salesman" | "Admin";
}