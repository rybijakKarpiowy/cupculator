"use client";

import { Client, User } from "@/app/dashboard/page";
import { Database } from "@/database/types";
import { Restriction } from "@/lib/checkRestriction";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProductsCardTab } from "./dashboardPages/productsCardTab";
import { ScrapersTab } from "./dashboardPages/scrapersTab";
import { EditUserPopup } from "./dashboardPages/components/editUserPopup";
import { AdminEmailsTab } from "./dashboardPages/adminEmailsTab";

export const DashboardPages = ({
    clientsInput,
    adminsAndSalesmenInput,
    user,
    available_cup_pricings,
    available_color_pricings,
    additionalValues,
    restrictions,
    productsCard,
    scrapersDataFinal,
    adminEmails,
}: {
    clientsInput?: Client[];
    adminsAndSalesmenInput?: Client[];
    user: User;
    available_cup_pricings: string[];
    available_color_pricings: string[];
    additionalValues: {
        plain_cup_markup_percent: number;
        mini_pallet_price: number;
        half_pallet_price: number;
        full_pallet_price: number;
        id: number;
    };
    restrictions: Restriction[];
    productsCard: Database["public"]["Tables"]["cups"]["Row"][];
    scrapersDataFinal: {
        cup_code: string;
        cup_id: number;
        scrapers: { provider: string; code_link: string }[];
    }[];
    adminEmails: string[];
}) => {
    const [chosenTab, setChosenTab] = useState<
        | "activationRequests"
        | "clients"
        | "adminsAndSalesmen"
        | "pricings"
        | "additionalValues"
        | "restrictions"
        | "productsCard"
        | "scrapers"
        | "adminEmails"
    >("activationRequests");
    const [loading, setLoading] = useState(false);
    const [addAdmin, setAddAdmin] = useState(false);
    const [clients, setClients] = useState(clientsInput);
    const [adminsAndSalesmen, setAdminsAndSalesmen] = useState(adminsAndSalesmenInput);
    const [cups_or_colors, setCups_or_colors] = useState<"cups" | "colors" | "">("");
    const [pricing_name, setPricing_name] = useState("");
    const [newPricing, setNewPricing] = useState(false);
    const [additionalValuesState, setAdditionalValuesState] = useState(additionalValues);
    const [restrictionsState, setRestrictionsState] = useState<Restriction[]>(restrictions);
    const [cupsData, setCupsData] =
        useState<Database["public"]["Tables"]["cups"]["Row"][]>(productsCard);
    const [scrapersData, setScrapersData] = useState<
        {
            cup_code: string;
            cup_id: number;
            scrapers: { provider: string; code_link: string }[];
        }[]
    >(scrapersDataFinal);

    useEffect(() => {
        const cupsOrColorsDiv = document.querySelector("#cups_or_colors") as HTMLSelectElement;
        if (cupsOrColorsDiv) cupsOrColorsDiv.value = cups_or_colors;
        const pricingNameDiv = document.querySelector("#pricing_name") as HTMLSelectElement;
        if (pricingNameDiv) pricingNameDiv.value = pricing_name;
    }, [cups_or_colors, pricing_name]);

    const changeAdditionalValue = async (
        e: FormEvent<HTMLFormElement>,
        attr:
            | "plain_cup_markup_percent"
            | "mini_pallet_price"
            | "half_pallet_price"
            | "full_pallet_price"
    ) => {
        e.preventDefault();
        setLoading(true);
        const value = parseFloat(
            (e.currentTarget.querySelector(`#${attr}`) as HTMLInputElement).value as string
        );
        if (isNaN(value)) {
            toast.warn("Wartość musi być liczbą");
            setLoading(false);
            return;
        }
        if (value <= 0) {
            toast.warn("Wartość musi być większa od 0");
            setLoading(false);
            return;
        }

        const res = await fetch("/api/updateadditionalvalues", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                attr,
                value,
                id: additionalValuesState.id,
            }),
        });

        if (res.status === 500) {
            toast.error("Błąd serwera");
            setLoading(false);
            return;
        }
        if (res.status === 400) {
            toast.error("Błędne dane");
            setLoading(false);
            return;
        }
        if (!res.ok) {
            toast.error("Wystąpił błąd");
            setLoading(false);
            return;
        }

        toast.success("Wartość została zmieniona");
        setAdditionalValuesState({ ...additionalValuesState, [attr]: value });
        setLoading(false);
        return;
    };

    const handleActication = async (user_id: string, e?: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        let cup_pricing = "";
        let color_pricing = "";
        let salesman_id = "";
        let warehouse_acces = "";
        let eu = "" as "EU" | "PL" | "brak" | boolean;

        if (e) {
            e.preventDefault();
            cup_pricing = (e.currentTarget.querySelector("#cup_pricing") as HTMLSelectElement)
                ?.value;
            color_pricing = (e.currentTarget.querySelector("#color_pricing") as HTMLSelectElement)
                ?.value;
            salesman_id = (e.currentTarget.querySelector("#assigned_salesman") as HTMLSelectElement)
                ?.value;
            warehouse_acces = (
                e.currentTarget.querySelector("#warehouse_acces") as HTMLSelectElement
            )?.value;
            eu = (e.currentTarget.querySelector("#eu") as HTMLSelectElement)?.value as
                | "EU"
                | "PL"
                | "brak";
            if (eu === "brak") {
                toast.warn("Wybierz walutę klienta");
                setLoading(false);
                return;
            }
        } else {
            const clientDiv = document.getElementById(user_id) as HTMLDivElement;
            cup_pricing = (clientDiv?.querySelector("#cup_pricing") as HTMLSelectElement)?.value;
            color_pricing = (clientDiv?.querySelector("#color_pricing") as HTMLSelectElement).value;
            salesman_id = (clientDiv?.querySelector("#assigned_salesman") as HTMLSelectElement)
                .value;
            warehouse_acces = (clientDiv?.querySelector("#warehouse_acces") as HTMLSelectElement)
                ?.value;
        }

        if (!cup_pricing || !color_pricing || !salesman_id || !warehouse_acces) {
            toast.warn("Uzupełnij cennik klienta, przypisz handlowca i ustal dostęp do magazynu");
            setLoading(false);
            return;
        }

        const res = await fetch("/api/activateclient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id,
                cup_pricing,
                color_pricing,
                salesman_id,
                warehouse_acces,
                ...{ eu: eu === "EU" ? true : eu === "PL" ? false : undefined },
            }),
        });

        console.log(res);

        if (res.ok) {
            toast.success("Klient został aktywowany");
            clients?.forEach((client) => {
                if (client.user_id === user_id) {
                    client.activated = true;
                    client.cup_pricing = cup_pricing;
                    client.color_pricing = color_pricing;
                    client.salesman_id = salesman_id;
                    client.warehouse_acces = warehouse_acces as "None" | "Actual" | "Fictional";

                    setClients([...clients]);
                    return;
                }
            });
            setLoading(false);
            return;
        }

        toast.error("Wystąpił błąd");
        setLoading(false);
        return;
    };

    const handleRoleChange = async (e: ChangeEvent<HTMLSelectElement>, user_id: string) => {
        setLoading(true);
        const role = e.currentTarget.value as "Admin" | "Salesman";

        const res = await fetch("/api/changerole", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id,
                role,
            }),
        });

        if (res.ok) {
            toast.success("Rola została zmieniona");
            adminsAndSalesmen?.forEach((client) => {
                if (client.user_id === user_id) {
                    client.role = role;
                    setAdminsAndSalesmen([...adminsAndSalesmen]);
                    return;
                }
            });
            if (role === "Admin") {
                clients?.forEach((client) => {
                    if (client.salesman_id === user_id) {
                        client.salesman_id = null;
                        setClients([...clients]);
                    }
                });
            }
            setLoading(false);
            return;
        }

        toast.error("Wystąpił błąd");
        setLoading(false);
        return;
    };

    const handleDeleteUser = async (user_id: string) => {
        if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

        setLoading(true);

        const res = await fetch("/api/deleteuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id,
            }),
        });

        if (res.ok) {
            toast.success("Użytkownik został usunięty");
            adminsAndSalesmen?.forEach((client, index) => {
                if (client.user_id === user_id) {
                    adminsAndSalesmen.splice(index, 1);
                    setAdminsAndSalesmen([...adminsAndSalesmen]);
                    return;
                }
            });
            clients?.forEach((client, index) => {
                if (client.user_id === user_id) {
                    clients.splice(index, 1);
                    setClients([...clients]);
                    return;
                }
            });
            setLoading(false);
            return;
        }

        toast.error(await res.text());
        setLoading(false);
        return;
    };

    const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const email = (e.currentTarget.querySelector("#email") as HTMLInputElement)?.value;
        const password = (e.currentTarget.querySelector("#password") as HTMLInputElement)?.value;
        const passwordRepeat = (
            e.currentTarget.querySelector("#passwordRepeat") as HTMLInputElement
        )?.value;
        const role = (e.currentTarget.querySelector("#role") as HTMLInputElement)?.value as
            | "Admin"
            | "Salesman";

        if (!email || !password || !passwordRepeat || !role) {
            toast.warn("Uzupełnij wszystkie pola");
            setLoading(false);
            return;
        }

        if (password !== passwordRepeat) {
            toast.warn("Hasła nie są takie same");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            toast.warn("Hasło musi mieć co najmniej 8 znaków");
            setLoading(false);
            return;
        }

        if (!email.includes("@")) {
            toast.warn("Niepoprawny adres email");
            setLoading(false);
            return;
        }

        if (password.length > 64) {
            toast.warn("Hasło jest za długie");
            setLoading(false);
            return;
        }

        const res = await fetch("/api/addadmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                role,
            }),
        });

        if (res.ok) {
            toast.success(
                `${
                    role === "Admin" ? "Administrator" : "Sprzedawca"
                } został dodany, mail aktywacyjny został wysłany na podany adres email`
            );
            setAddAdmin(false);
            setLoading(false);
            setTimeout(() => window.location.reload(), 5000);
            return;
        }

        toast.error("Wystąpił błąd");
        setLoading(false);
        return;
    };

    const handleAddPricing = async () => {
        setLoading(true);

        const sheet_url = (document.querySelector("#sheet_url") as HTMLInputElement)?.value;

        if (!cups_or_colors || !pricing_name || !sheet_url) {
            toast.warn("Uzupełnij wszystkie pola");
            setLoading(false);
            return;
        }

        if (sheet_url && !sheet_url.includes("docs.google.com/spreadsheets/d/")) {
            toast.warn("Niepoprawny link do arkusza");
            setLoading(false);
            return;
        }

        if (pricing_name.length > 32) {
            toast.warn("Nazwa cennika jest za długa");
            setLoading(false);
            return;
        }

        if (
            ((cups_or_colors === "cups" && available_cup_pricings?.includes(pricing_name)) ||
                (cups_or_colors === "colors" &&
                    available_color_pricings?.includes(pricing_name))) &&
            newPricing
        ) {
            toast.warn("Taki cennik już istnieje, proszę wybrać go z listy");
            setLoading(false);
            return;
        }

        let res = {} as Response;
        if (cups_or_colors === "cups") {
            res = await fetch("/api/updatecups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pricing_name,
                    sheet_url,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const { incompleteCups, cupsWithoutPrices, lastCellEmpty } = data as {
                    incompleteCups: string[];
                    cupsWithoutPrices: string[];
                    lastCellEmpty: string[];
                };
                toast.success(
                    `Cennik został dodany. ${
                        lastCellEmpty.length > 0
                            ? `Uzupełnij ostatnią kolumnę w wierszach: ${lastCellEmpty.join(
                                  ", "
                              )} - inaczej zostaną pominięte. `
                            : ""
                    }${
                        incompleteCups.length > 0
                            ? `Kubki z niepełnymi danymi (zostaną pominięte) w wierszach: ${incompleteCups.join(
                                  ", "
                              )}. `
                            : ""
                    }${
                        cupsWithoutPrices.length > 0
                            ? `Kubki bez cen w wierszach: ${cupsWithoutPrices.join(", ")}. `
                            : ""
                    }
                Odśwież stronę, aby zobaczyć zmiany.`,
                    {
                        autoClose: false,
                    }
                );
            }
        } else if (cups_or_colors === "colors") {
            res = await fetch("/api/updatecolors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pricing_name,
                    sheet_url,
                }),
            });

            if (res.ok) {
                toast.success("Cennik został dodany. Odśwież stronę, aby zobaczyć zmiany.");
            }
        }

        if (res.ok) {
            setCups_or_colors("");
            setLoading(false);
            setPricing_name("");
            setNewPricing(false);
            return;
        }

        if (res.status === 400) {
            const data = await res.json();
            const { duplicateCodes } = data as { duplicateCodes: string[] };
            toast.error(
                "Cennik zawiera duplikaty kodów, proszę je usunąć i spróbować ponownie. Duplikaty: " +
                    duplicateCodes.join(", "),
                { autoClose: false }
            );
        } else {
            toast.error("Wystąpił błąd");
        }

        setLoading(false);
        setPricing_name("");
        setNewPricing(false);
        return;
    };

    return (
        <div>
            <h1>Panel</h1>
            <div className="flex flex-row gap-3">
                <button
                    className={`${
                        chosenTab === "activationRequests" ? "bg-slate-400" : "bg-slate-300"
                    } px-2 rounded-md`}
                    onClick={() => setChosenTab("activationRequests")}
                >
                    Aktywacja klientów
                </button>
                <button
                    className={`${
                        chosenTab === "clients" ? "bg-slate-400" : "bg-slate-300"
                    } px-2 rounded-md`}
                    onClick={() => setChosenTab("clients")}
                >
                    Klienci
                </button>
                {user?.role === "Admin" && (
                    <>
                        <button
                            className={`${
                                chosenTab === "adminsAndSalesmen" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("adminsAndSalesmen")}
                        >
                            Admini i handlowcy
                        </button>
                        <button
                            className={`${
                                chosenTab === "pricings" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("pricings")}
                        >
                            Cenniki
                        </button>
                        <button
                            className={`${
                                chosenTab === "additionalValues" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("additionalValues")}
                        >
                            Dodatkowe wartości
                        </button>
                        <button
                            className={`${
                                chosenTab === "restrictions" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("restrictions")}
                        >
                            Wykluczenia
                        </button>
                        <button
                            className={`${
                                chosenTab === "productsCard" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("productsCard")}
                        >
                            Karta produktów
                        </button>
                        <button
                            className={`${
                                chosenTab === "scrapers" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("scrapers")}
                        >
                            Scrapery
                        </button>
                        <button
                            className={`${
                                chosenTab === "adminEmails" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("adminEmails")}
                        >
                            Emaile adminów
                        </button>
                    </>
                )}
            </div>
            <p>Zalogowano jako: {user?.email}</p>
            <p>Rola: {user?.role}</p>
            {chosenTab === "activationRequests" && (
                <div>
                    <h2>Aktywacja klientów</h2>
                    <hr />
                    <br />
                    <ul className="overflow-x-auto px-4 w-auto">
                        <li>
                            <ul className="flex flex-row min-w-max">
                                <li className="px-2 border border-black w-48 text-center">
                                    Imię i nazwisko
                                </li>
                                <li className="px-2 border border-black w-64 text-center">
                                    Nazwa firmy
                                </li>
                                <li className="px-2 border border-black w-64 text-center">Adres</li>
                                <li className="px-2 border border-black w-24 text-center">
                                    Kod pocztowy
                                </li>
                                <li className="px-2 border border-black w-32 text-center">
                                    Miasto
                                </li>
                                <li className="px-2 border border-black w-32 text-center">
                                    Województwo / Region
                                </li>
                                <li className="px-2 border border-black w-48 text-center">
                                    Telefon
                                </li>
                                <li className="px-2 border border-black w-48 text-center">NIP</li>
                                <li className="px-2 border border-black w-16 text-center">
                                    Waluta
                                </li>
                                <li className="px-2 border border-black w-32 text-center">Kraj</li>
                                <li className="px-2 border border-black w-64 text-center">Email</li>
                                <li className="px-2 border border-black w-80 text-center">
                                    Cennik kubków
                                </li>
                                <li className="px-2 border border-black w-80 text-center">
                                    Cennik nadruków
                                </li>
                                <li className="px-2 border border-black w-60 text-center">
                                    Przypisany Handlowiec
                                </li>
                                <li className="px-2 border border-black w-60 text-center">
                                    Dostęp do stanów magazynowych
                                </li>
                            </ul>
                        </li>
                        <li>
                            {clients
                                ?.filter((client) => !client.activated)
                                .map((client) => (
                                    <ul key={client.user_id}>
                                        <form
                                            // id={client.user_id}
                                            onSubmit={(e) => handleActication(client.user_id, e)}
                                            className="flex flex-row w-max"
                                        >
                                            <li className="px-2 border border-black w-48 text-center">
                                                {client.first_name} {client.last_name}
                                            </li>
                                            <li className="px-2 border border-black w-64 text-center">
                                                {client.company_name}
                                            </li>
                                            <li className="px-2 border border-black w-64 text-center">
                                                {client.adress}
                                            </li>
                                            <li className="px-2 border border-black w-24 text-center">
                                                {client.postal_code}
                                            </li>
                                            <li className="px-2 border border-black w-32 text-center">
                                                {client.city}
                                            </li>
                                            <li className="px-2 border border-black w-32 text-center">
                                                {client.region}
                                            </li>
                                            <li className="px-2 border border-black w-48 text-center">
                                                {client.phone}
                                            </li>
                                            <li className="px-2 border border-black w-48 text-center">
                                                {client.NIP}
                                            </li>
                                            <li className="px-2 border border-black w-16 text-center">
                                                <select
                                                    id="eu"
                                                    disabled={loading}
                                                    defaultValue="brak"
                                                >
                                                    <option value="brak" hidden disabled>
                                                        -
                                                    </option>
                                                    <option value="PL">PLN</option>
                                                    <option value="EU">EUR</option>
                                                </select>
                                            </li>
                                            <li className="px-2 border border-black w-32 text-center">
                                                {client.country}
                                            </li>
                                            <li className="px-2 border border-black w-64 text-center">
                                                {client.email}
                                            </li>
                                            <li className="px-2 border border-black w-80 text-center">
                                                <select
                                                    id="cup_pricing"
                                                    disabled={loading}
                                                    defaultValue={
                                                        client.cup_pricing ? client.cup_pricing : ""
                                                    }
                                                >
                                                    <option value="" key="brak" disabled hidden>
                                                        Brak
                                                    </option>
                                                    {available_cup_pricings
                                                        .sort()
                                                        .map((cup_pricing) => (
                                                            <option
                                                                key={cup_pricing}
                                                                value={cup_pricing}
                                                            >
                                                                {cup_pricing}
                                                            </option>
                                                        ))}
                                                </select>
                                            </li>
                                            <li className="px-2 border border-black w-80 text-center">
                                                <select
                                                    id="color_pricing"
                                                    disabled={loading}
                                                    defaultValue={
                                                        client.color_pricing
                                                            ? client.color_pricing
                                                            : ""
                                                    }
                                                >
                                                    <option value="" key="brak" disabled hidden>
                                                        Brak
                                                    </option>
                                                    {available_color_pricings
                                                        .sort()
                                                        .map((color_pricing) => (
                                                            <option
                                                                key={color_pricing}
                                                                value={color_pricing}
                                                            >
                                                                {color_pricing}
                                                            </option>
                                                        ))}
                                                </select>
                                            </li>
                                            <li className="px-2 border border-black w-60 text-center">
                                                <select
                                                    id="assigned_salesman"
                                                    disabled={loading}
                                                    defaultValue={
                                                        client.salesman_id ? client.salesman_id : ""
                                                    }
                                                >
                                                    <option value="" key="brak" disabled hidden>
                                                        Brak
                                                    </option>
                                                    {adminsAndSalesmen
                                                        ?.filter((item) => item.role === "Salesman")
                                                        .sort((a, b) =>
                                                            a.email.localeCompare(b.email)
                                                        )
                                                        .map((salesman) => (
                                                            <option
                                                                key={salesman.user_id}
                                                                value={salesman.user_id}
                                                            >
                                                                {salesman.email}
                                                            </option>
                                                        ))}
                                                </select>
                                            </li>
                                            <li className="px-2 border border-black w-60 text-center">
                                                <select
                                                    id="warehouse_acces"
                                                    disabled={loading}
                                                    className="text-center"
                                                    defaultValue={
                                                        client.warehouse_acces
                                                            ? client.warehouse_acces
                                                            : ""
                                                    }
                                                >
                                                    <option value="" key="brak" disabled hidden>
                                                        -
                                                    </option>
                                                    <option value="None">Brak dostępu</option>
                                                    <option value="Actual">Faktyczne stany</option>
                                                    <option value="Fictional">
                                                        Fikcyjne stany
                                                    </option>
                                                </select>
                                            </li>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`px-2 w-20 rounded-md ${
                                                    loading
                                                        ? "bg-slate-400"
                                                        : "bg-green-300 hover:bg-green-400"
                                                }`}
                                            >
                                                Aktywuj
                                            </button>
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => handleDeleteUser(client.user_id)}
                                                className={`px-2 w-16 rounded-md ${
                                                    loading
                                                        ? "bg-slate-400"
                                                        : "bg-red-300 hover:bg-red-400"
                                                }`}
                                            >
                                                Usuń
                                            </button>
                                        </form>
                                    </ul>
                                ))}
                        </li>
                    </ul>
                </div>
            )}
            {chosenTab === "clients" && (
                <div>
                    <h2>Klienci</h2>
                    <hr />
                    <br />
                    <ul className="overflow-x-auto px-4 w-full">
                        <li>
                            <ul className="flex flex-row min-w-max">
                                <li className="px-2 border border-black w-48 text-center">
                                    Imię i nazwisko
                                </li>
                                <li className="px-2 border border-black w-64 text-center">
                                    Nazwa firmy
                                </li>
                                <li className="px-2 border border-black w-64 text-center">Adres</li>
                                <li className="px-2 border border-black w-24 text-center">
                                    Kod pocztowy
                                </li>
                                <li className="px-2 border border-black w-32 text-center">
                                    Miasto
                                </li>
                                <li className="px-2 border border-black w-32 text-center">
                                    Województwo / Region
                                </li>
                                <li className="px-2 border border-black w-48 text-center">
                                    Telefon
                                </li>
                                <li className="px-2 border border-black w-48 text-center">NIP</li>
                                <li className="px-2 border border-black w-16 text-center">
                                    Waluta
                                </li>
                                <li className="px-2 border border-black w-32 text-center">Kraj</li>
                                <li className="px-2 border border-black w-64 text-center">Email</li>
                                <li className="px-2 border border-black w-80 text-center">
                                    Cennik kubków
                                </li>
                                <li className="px-2 border border-black w-80 text-center">
                                    Cennik nadruków
                                </li>
                                <li className="px-2 border border-black w-60 text-center">
                                    Przypisany Handlowiec
                                </li>
                                <li className="px-2 border border-black w-60 text-center">
                                    Dostęp do stanów magazynowych
                                </li>
                            </ul>
                        </li>
                        <li>
                            {clients
                                ?.filter((client) => client.activated)
                                .map((client) => (
                                    <div
                                        key={client.user_id}
                                        id={client.user_id}
                                        className="flex flex-row min-w-max"
                                    >
                                        <div className="flex flex-row min-w-max relative">
                                            <li className="px-2 border border-black w-48 text-center">
                                                {client.first_name} {client.last_name}
                                            </li>
                                            <li className="px-2 border border-black w-64 text-center">
                                                {client.company_name}
                                            </li>
                                            <li className="px-2 border border-black w-64 text-center">
                                                {client.adress}
                                            </li>
                                            <li className="px-2 border border-black w-24 text-center">
                                                {client.postal_code}
                                            </li>
                                            <li className="px-2 border border-black w-32 text-center">
                                                {client.city}
                                            </li>
                                            <li className="px-2 border border-black w-32 text-center">
                                                {client.region}
                                            </li>
                                            <li className="px-2 border border-black w-48 text-center">
                                                {client.phone}
                                            </li>
                                            <li className="px-2 border border-black w-48 text-center">
                                                {client.NIP}
                                            </li>
                                            <li className="px-2 border border-black w-16 text-center">
                                                {client.eu ? "EUR" : "PLN"}
                                            </li>
                                            <li className="px-2 border border-black w-32 text-center">
                                                {client.country}
                                            </li>
                                            <li className="px-2 border border-black w-64 text-center">
                                                {client.email}
                                            </li>
                                            <li className="px-2 border border-black w-80 text-center">
                                                <select
                                                    id="cup_pricing"
                                                    disabled={loading}
                                                    onChange={() =>
                                                        handleActication(client.user_id)
                                                    }
                                                    className={`${loading && "bg-slate-400"}`}
                                                    defaultValue={
                                                        client.cup_pricing ? client.cup_pricing : ""
                                                    }
                                                >
                                                    <option value="" key="brak" disabled hidden>
                                                        Brak
                                                    </option>
                                                    {available_cup_pricings
                                                        .sort()
                                                        .map((cup_pricing) => (
                                                            <option
                                                                key={cup_pricing}
                                                                value={cup_pricing}
                                                            >
                                                                {cup_pricing}
                                                            </option>
                                                        ))}
                                                </select>
                                            </li>
                                            <li className="px-2 border border-black w-80 text-center">
                                                <select
                                                    id="color_pricing"
                                                    disabled={loading}
                                                    onChange={() =>
                                                        handleActication(client.user_id)
                                                    }
                                                    className={`${loading && "bg-slate-400"}`}
                                                    defaultValue={
                                                        client.color_pricing
                                                            ? client.color_pricing
                                                            : ""
                                                    }
                                                >
                                                    <option value="" key="brak" disabled hidden>
                                                        Brak
                                                    </option>
                                                    {available_color_pricings
                                                        .sort()
                                                        .map((color_pricing) => (
                                                            <option
                                                                key={color_pricing}
                                                                value={color_pricing}
                                                            >
                                                                {color_pricing}
                                                            </option>
                                                        ))}
                                                </select>
                                            </li>
                                            <li className="px-2 border border-black w-60 text-center">
                                                <select
                                                    id="assigned_salesman"
                                                    disabled={loading}
                                                    onChange={() =>
                                                        handleActication(client.user_id)
                                                    }
                                                    className={`${loading && "bg-slate-400"}`}
                                                    defaultValue={
                                                        client.salesman_id ? client.salesman_id : ""
                                                    }
                                                >
                                                    <option value="" key="brak" disabled hidden>
                                                        Brak
                                                    </option>
                                                    {adminsAndSalesmen
                                                        ?.filter((item) => item.role === "Salesman")
                                                        .sort((a, b) =>
                                                            a.email.localeCompare(b.email)
                                                        )
                                                        .map((salesman) => (
                                                            <option
                                                                key={salesman.user_id}
                                                                value={salesman.user_id}
                                                            >
                                                                {salesman.email}
                                                            </option>
                                                        ))}
                                                </select>
                                            </li>
                                            <li className="px-2 border border-black w-60 text-center">
                                                <select
                                                    id="warehouse_acces"
                                                    disabled={loading}
                                                    onChange={() =>
                                                        handleActication(client.user_id)
                                                    }
                                                    className={`${
                                                        loading && "bg-slate-400"
                                                    } text-center`}
                                                    defaultValue={
                                                        client.warehouse_acces
                                                            ? client.warehouse_acces
                                                            : ""
                                                    }
                                                >
                                                    <option value="" key="brak" disabled hidden>
                                                        -
                                                    </option>
                                                    <option value="None">Brak dostępu</option>
                                                    <option value="Actual">Faktyczne stany</option>
                                                    <option value="Fictional">
                                                        Fikcyjne stany
                                                    </option>
                                                </select>
                                            </li>
                                            <div
                                                className="w-full h-full border border-black bg-blue-100 z-30 hidden absolute"
                                                id={`${client.user_id}_popup`}
                                            >
                                                <EditUserPopup
                                                    client={client}
                                                    parentDiv={
                                                        document.getElementById(
                                                            `${client.user_id}_popup`
                                                        ) as HTMLDivElement
                                                    }
                                                    editButton={
                                                        document.getElementById(
                                                            `${client.user_id}_edit_button`
                                                        ) as HTMLButtonElement
                                                    }
                                                    loading={loading}
                                                    setLoading={setLoading}
                                                    clients={clients}
                                                    setClients={setClients}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => handleDeleteUser(client.user_id)}
                                            className={`px-2 w-16 rounded-md ${
                                                loading
                                                    ? "bg-slate-400"
                                                    : "bg-red-300 hover:bg-red-400"
                                            }`}
                                        >
                                            Usuń
                                        </button>
                                        <button
                                            type="button"
                                            id={`${client.user_id}_edit_button`}
                                            disabled={loading}
                                            onClick={(e) => {
                                                const popup = document.getElementById(
                                                    `${client.user_id}_popup`
                                                );
                                                if (popup) {
                                                    popup.classList.toggle("hidden");
                                                }
                                                const self = e.target as HTMLButtonElement;
                                                self.disabled = true;
                                                self.classList.toggle("bg-blue-300");
                                                self.classList.toggle("hover:bg-blue-400");
                                                self.classList.toggle("bg-slate-400");
                                            }}
                                            className={`px-2 w-16 rounded-md ${
                                                loading
                                                    ? "bg-slate-400"
                                                    : "bg-blue-300 hover:bg-blue-400"
                                            }`}
                                        >
                                            Edytuj
                                        </button>
                                    </div>
                                ))}
                        </li>
                    </ul>
                </div>
            )}
            {user?.role === "Admin" &&
                adminsAndSalesmen &&
                adminsAndSalesmen.length > 0 &&
                chosenTab === "adminsAndSalesmen" && (
                    <div>
                        <h2>Administratorzy i handlowcy</h2>
                        <hr />
                        <br />
                        <ul className="overflow-x-auto px-4">
                            <ul className="flex flex-row">
                                <li className="px-2 border border-black w-64 text-center">Rola</li>
                                <li className="px-2 border border-black w-80 text-center">Email</li>
                            </ul>
                            {adminsAndSalesmen
                                .filter((user) => user.role == "Admin")
                                .map((admin) => (
                                    <div key={admin.user_id} className="flex flex-row">
                                        <li
                                            className={`px-2 border border-black w-64 text-center ${
                                                admin.user_id === user.user_id && "bg-blue-200"
                                            }`}
                                        >
                                            {admin.user_id !== user.user_id ? (
                                                <select
                                                    defaultValue={admin.role}
                                                    onChange={(e) =>
                                                        handleRoleChange(e, admin.user_id)
                                                    }
                                                    disabled={loading}
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="Salesman">Handlowiec</option>
                                                </select>
                                            ) : (
                                                admin.role
                                            )}
                                        </li>
                                        <li
                                            className={`px-2 border border-black w-80 text-center  ${
                                                admin.user_id === user.user_id && "bg-blue-200"
                                            }`}
                                        >
                                            {admin.email}
                                        </li>
                                        {admin.user_id !== user.user_id && (
                                            <button
                                                onClick={() => handleDeleteUser(admin.user_id)}
                                                className={`px-2 w-24 rounded-md ${
                                                    loading
                                                        ? "bg-slate-400"
                                                        : "bg-red-300 hover:bg-red-400"
                                                }`}
                                                disabled={loading}
                                            >
                                                Usuń
                                            </button>
                                        )}
                                    </div>
                                ))}
                            {adminsAndSalesmen
                                .filter((user) => user.role == "Salesman")
                                .map((salesman) => (
                                    <div key={salesman.user_id} className="flex flex-row">
                                        <li className="px-2 border border-black w-64 text-center">
                                            <select
                                                defaultValue={salesman.role}
                                                onChange={(e) =>
                                                    handleRoleChange(e, salesman.user_id)
                                                }
                                                disabled={loading}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Salesman">Handlowiec</option>
                                            </select>
                                        </li>
                                        <li className="px-2 border border-black w-80 text-center">
                                            {salesman.email}
                                        </li>
                                        <button
                                            onClick={() => handleDeleteUser(salesman.user_id)}
                                            className={`px-2 w-24 rounded-md ${
                                                loading
                                                    ? "bg-slate-400"
                                                    : "bg-red-300 hover:bg-red-400"
                                            }`}
                                            disabled={loading}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                ))}
                            {addAdmin ? (
                                <form onSubmit={(e) => handleAddAdmin(e)} className="flex flex-row">
                                    <select
                                        id="role"
                                        defaultValue=""
                                        className="px-2 border border-black w-64 text-center"
                                        disabled={loading}
                                    >
                                        <option value="" disabled hidden>
                                            Wybierz rolę
                                        </option>
                                        <option value="Admin">Admin</option>
                                        <option value="Salesman">Handlowiec</option>
                                    </select>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        className="px-2 border border-black w-80 text-center"
                                        disabled={loading}
                                    />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Hasło"
                                        className="px-2 border border-black w-64 text-center"
                                        disabled={loading}
                                    ></input>
                                    <input
                                        id="passwordRepeat"
                                        type="password"
                                        placeholder="Powtórz hasło"
                                        className="px-2 border border-black w-64 text-center"
                                        disabled={loading}
                                    ></input>
                                    <button
                                        type="submit"
                                        className={`px-2 w-24 rounded-md ${
                                            loading
                                                ? "bg-slate-400"
                                                : "bg-green-300 hover:bg-green-400"
                                        }`}
                                        disabled={loading}
                                    >
                                        Dodaj
                                    </button>
                                    <button
                                        onClick={() => setAddAdmin(false)}
                                        className={`px-2 w-24 rounded-md ${
                                            loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"
                                        }`}
                                        disabled={loading}
                                    >
                                        Anuluj
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setAddAdmin(true)}
                                    className="px-2 mt-4 rounded-md bg-green-300 hover:bg-green-400"
                                    disabled={loading}
                                >
                                    Dodaj admina / handlowca
                                </button>
                            )}
                        </ul>
                    </div>
                )}
            {user?.role === "Admin" && chosenTab === "pricings" && (
                <>
                    <h2>Aktualizuj/dodaj cennik</h2>
                    <hr />
                    <br />
                    <div className="px-4 mb-4">
                        <select
                            id="cups_or_colors"
                            defaultValue=""
                            onChange={(e) => setCups_or_colors(e.target.value as "cups" | "colors")}
                            disabled={loading}
                            className="border border-black"
                        >
                            <option value="" disabled hidden>
                                Kubki/nadruki
                            </option>
                            <option value="cups">Kubki</option>
                            <option value="colors">Nadruki</option>
                        </select>
                    </div>
                    <div className="flex flex-row gap-4 px-4 mb-4">
                        <p>Aktualizuj/dodaj cennik:</p>
                        <select
                            id="pricing_name"
                            defaultValue=""
                            disabled={!cups_or_colors || loading}
                            onChange={(e) => {
                                if (e.target.value === "new") setNewPricing(true);
                                else setNewPricing(false);
                                setPricing_name(e.target.value as string);
                            }}
                            className="border border-black"
                        >
                            <option value="" disabled hidden>
                                Wybierz cennik
                            </option>
                            {cups_or_colors === "cups" &&
                                available_cup_pricings.sort().map((pricing) => (
                                    <option key={pricing} value={pricing}>
                                        {pricing}
                                    </option>
                                ))}
                            {cups_or_colors === "colors" &&
                                available_color_pricings.map((pricing) => (
                                    <option key={pricing} value={pricing}>
                                        {pricing}
                                    </option>
                                ))}
                            <option value="new">Nowy cennik</option>
                        </select>
                        {newPricing && (
                            <input
                                type="text"
                                id="new_pricing_name"
                                placeholder="Nazwa nowego cennika"
                                disabled={!cups_or_colors || loading}
                                onChange={(e) => setPricing_name(e.target.value)}
                                className="border border-black"
                            />
                        )}
                        <input
                            type="text"
                            id="sheet_url"
                            disabled={!cups_or_colors || !pricing_name || loading}
                            placeholder="Link do arkusza google"
                            className="w-96 border border-black px-2"
                        />
                        <button
                            onClick={() => handleAddPricing()}
                            disabled={!cups_or_colors || !pricing_name || loading}
                            className={`px-2 w-24 rounded-md ${
                                loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                            }`}
                        >
                            Wyślij
                        </button>
                    </div>
                    <div className="flex flex-row gap-4 px-4">
                        <p>Zmień nazwę cennika:</p>
                        <form
                            className="flex flex-row gap-4"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setLoading(true);

                                const pricing_name = (
                                    e.target as HTMLFormElement
                                ).elements.namedItem("change_pricing_name") as HTMLSelectElement;
                                const new_pricing_name = (
                                    e.target as HTMLFormElement
                                ).elements.namedItem("new_change_pricing_name") as HTMLInputElement;

                                if (!pricing_name.value || !new_pricing_name.value) {
                                    toast.warn("Wypełnij wszystkie pola");
                                    setLoading(false);
                                    return;
                                }

                                const res = await fetch("/api/changepricingname", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        pricing_name: pricing_name.value,
                                        new_pricing_name: new_pricing_name.value,
                                        cups_or_colors,
                                    }),
                                });
                                if (res.ok) {
                                    toast.success(
                                        "Nazwa cennika została zmieniona, odśwież stronę aby zobaczyć zmiany"
                                    );
                                    setPricing_name("");
                                    setCups_or_colors("");
                                    setNewPricing(false);
                                } else {
                                    toast.error("Wystąpił błąd");
                                }
                                setLoading(false);
                                return;
                            }}
                        >
                            <select
                                defaultValue=""
                                id="change_pricing_name"
                                disabled={!cups_or_colors || loading}
                                className="border border-black ml-[13px]"
                            >
                                <option value="" disabled hidden>
                                    Wybierz cennik
                                </option>
                                {cups_or_colors === "cups" &&
                                    available_cup_pricings.map((pricing) => (
                                        <option key={pricing} value={pricing}>
                                            {pricing}
                                        </option>
                                    ))}
                                {cups_or_colors === "colors" &&
                                    available_color_pricings.sort().map((pricing) => (
                                        <option key={pricing} value={pricing}>
                                            {pricing}
                                        </option>
                                    ))}
                            </select>
                            <input
                                id="new_change_pricing_name"
                                type="text"
                                placeholder="Nowa nazwa cennika"
                                disabled={!cups_or_colors || loading}
                                className="w-96 border border-black px-2"
                            />
                            <button
                                type="submit"
                                disabled={!cups_or_colors || loading}
                                className={`px-2 w-24 rounded-md ${
                                    loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                                }`}
                            >
                                Wyślij
                            </button>
                        </form>
                    </div>
                </>
            )}
            {user?.role === "Admin" && chosenTab === "additionalValues" && (
                <div>
                    <h2>Dodatkowe wartości</h2>
                    <hr />
                    <br />
                    <ul className="w-[25%] flex flex-col px-4 gap-4">
                        <li className="flex flex-row gap-4 justify-between">
                            <p>Narzut na kubki bez nadruku:</p>
                            <form
                                className="flex flex-row"
                                onSubmit={(e) => {
                                    changeAdditionalValue(e, "plain_cup_markup_percent");
                                }}
                            >
                                <input
                                    className="border border-black text-right"
                                    placeholder={additionalValuesState?.plain_cup_markup_percent.toString()}
                                    type="number"
                                    id="plain_cup_markup_percent"
                                />
                                <p className="w-4">%</p>
                                <button
                                    className={`px-2 rounded-md ${
                                        loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                                    } ml-4`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    Zapisz
                                </button>
                            </form>
                        </li>
                        <li className="flex flex-row gap-4 justify-between">
                            <p>Koszt wysyłki mini palety:</p>
                            <form
                                className="flex flex-row"
                                onSubmit={(e) => {
                                    changeAdditionalValue(e, "mini_pallet_price");
                                }}
                            >
                                <input
                                    className="border border-black text-right"
                                    placeholder={additionalValuesState?.mini_pallet_price.toString()}
                                    type="number"
                                    id="mini_pallet_price"
                                />
                                <p className="w-4">zł</p>
                                <button
                                    className={`px-2 rounded-md ${
                                        loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                                    } ml-4`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    Zapisz
                                </button>
                            </form>
                        </li>
                        <li className="flex flex-row gap-4 justify-between">
                            <p>Koszt wysyłki pół palety:</p>
                            <form
                                className="flex flex-row"
                                onSubmit={(e) => {
                                    changeAdditionalValue(e, "half_pallet_price");
                                }}
                            >
                                <input
                                    className="border border-black text-right"
                                    placeholder={additionalValuesState?.half_pallet_price.toString()}
                                    type="number"
                                    id="half_pallet_price"
                                />
                                <p className="w-4">zł</p>
                                <button
                                    className={`px-2 rounded-md ${
                                        loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                                    } ml-4`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    Zapisz
                                </button>
                            </form>
                        </li>
                        <li className="flex flex-row gap-4 justify-between">
                            <p>Koszt wysyłki pełnej palety:</p>
                            <form
                                className="flex flex-row"
                                onSubmit={(e) => {
                                    changeAdditionalValue(e, "full_pallet_price");
                                }}
                            >
                                <input
                                    className="border border-black text-right"
                                    placeholder={additionalValuesState?.full_pallet_price.toString()}
                                    type="number"
                                    id="full_pallet_price"
                                />
                                <p className="w-4">zł</p>
                                <button
                                    className={`px-2 rounded-md ${
                                        loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                                    } ml-4`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    Zapisz
                                </button>
                            </form>
                        </li>
                    </ul>
                </div>
            )}
            {user?.role === "Admin" && chosenTab === "restrictions" && (
                <div className="pb-32">
                    <h2>Wykluczenia</h2>
                    <hr />
                    <br />
                    <ul className="flex flex-col px-4 gap-4">
                        {restrictionsState &&
                            restrictionsState.map((restriction) => (
                                <li key={restriction.id} className="flex flex-row gap-4">
                                    <input
                                        type="text"
                                        disabled
                                        placeholder={restriction.imprintType}
                                    />
                                    <input
                                        type="text"
                                        disabled
                                        placeholder={restriction.anotherValue}
                                        className="w-64"
                                    />
                                    <button
                                        className={`px-2 rounded-md ${
                                            loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"
                                        }`}
                                        onClick={async () => {
                                            setLoading(true);
                                            const res = await fetch("/api/restriction/delete", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    id: restriction.id,
                                                }),
                                            });

                                            if (res.status === 500) {
                                                toast.error("Błąd serwera");
                                                setLoading(false);
                                                return;
                                            }
                                            if (res.status === 400) {
                                                toast.error("Błędne dane");
                                                setLoading(false);
                                                return;
                                            }
                                            if (!res.ok) {
                                                toast.error("Wystąpił błąd");
                                                setLoading(false);
                                                return;
                                            }
                                            setRestrictionsState(
                                                restrictionsState.filter(
                                                    (r) => r.id !== restriction.id
                                                )
                                            );
                                            toast.success("Usunięto wykluczenie");
                                            setLoading(false);
                                        }}
                                        disabled={loading}
                                    >
                                        Usuń
                                    </button>
                                </li>
                            ))}
                        <li>
                            <form
                                className="flex flex-row gap-4"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setLoading(true);
                                    const res = await fetch("/api/restriction/add", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            imprintType: (
                                                document.getElementById(
                                                    "imprintType"
                                                ) as HTMLInputElement
                                            ).value as Restriction["imprintType"],
                                            anotherValue: (
                                                document.getElementById(
                                                    "anotherValue"
                                                ) as HTMLInputElement
                                            ).value as Restriction["anotherValue"],
                                        }),
                                    });
                                    if (res.status === 500) {
                                        toast.error("Błąd serwera");
                                        setLoading(false);
                                        return;
                                    }
                                    if (res.status === 400) {
                                        toast.error("Błędne dane");
                                        setLoading(false);
                                        return;
                                    }
                                    if (!res.ok) {
                                        toast.error("Wystąpił błąd");
                                        setLoading(false);
                                        return;
                                    }

                                    setRestrictionsState([
                                        ...restrictionsState,
                                        {
                                            id: restrictionsState.length + 1,
                                            imprintType: (
                                                document.getElementById(
                                                    "imprintType"
                                                ) as HTMLInputElement
                                            ).value as Restriction["imprintType"],
                                            anotherValue: (
                                                document.getElementById(
                                                    "anotherValue"
                                                ) as HTMLInputElement
                                            ).value as Restriction["anotherValue"],
                                        },
                                    ]);
                                    toast.success("Dodano wykluczenie");
                                    setLoading(false);
                                }}
                            >
                                <select
                                    disabled={loading}
                                    id="imprintType"
                                    defaultValue=""
                                    className="text-center border border-black"
                                >
                                    <option value="" disabled hidden>
                                        Wybierz rodzaj nadruku
                                    </option>
                                    {[
                                        "direct_print",
                                        "transfer_plus",
                                        "polylux",
                                        "deep_effect",
                                        "deep_effect_plus",
                                        "digital_print",
                                        "pro_color",
                                    ].map((iT) => (
                                        <option key={iT} value={iT}>
                                            {iT}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    disabled={loading}
                                    id="anotherValue"
                                    defaultValue=""
                                    className="text-center border border-black"
                                >
                                    <option value="" disabled hidden>
                                        Wybierz zdobienie
                                    </option>
                                    {[
                                        "trend_color_inside",
                                        "trend_color_outside",
                                        "trend_color_both",
                                        "trend_color_lowered_edge",
                                        "soft_touch",
                                        "pro_color",
                                        "nadruk_wewnatrz_na_sciance",
                                        "nadruk_na_uchu",
                                        "nadruk_na_spodzie",
                                        "nadruk_na_dnie",
                                        "nadruk_przez_rant",
                                        "nadruk_apla",
                                        "nadruk_dookola_pod_uchem",
                                        "nadruk_zlotem_25",
                                        "nadruk_zlotem_50",
                                        "personalizacja",
                                        "zdobienie_paskiem_bez_laczenia",
                                        "zdobienie_paskiem_z_laczeniem",
                                        "nadruk_na_powloce_magicznej_1_kolor",
                                        "zdobienie_tapeta_na_barylce_I_stopien",
                                        "zdobienie_tapeta_na_barylce_II_stopien",
                                        "naklejka_papierowa_z_nadrukiem",
                                        "wkladanie_ulotek_do_kubka",
                                    ].map((aV) => (
                                        <option key={aV} value={aV}>
                                            {aV}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className={`px-2 rounded-md ${
                                        loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                                    }`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    Dodaj
                                </button>
                            </form>
                        </li>
                    </ul>
                </div>
            )}
            {user?.role === "Admin" && chosenTab === "productsCard" && (
                <ProductsCardTab cupsData={cupsData} />
            )}
            {user?.role === "Admin" && chosenTab === "scrapers" && (
                <ScrapersTab scrapersDataInput={scrapersData} />
            )}
            {user?.role === "Admin" && chosenTab === "adminEmails" && (
                <AdminEmailsTab adminEmails={adminEmails} />
            )}
        </div>
    );
};
