"use client";

import { Client, User } from "@/app/dashboard/page";
import { ChangeEvent, useEffect, useState } from "react";

export const DashboardPages = ({
    clientsInput,
    adminsAndSalesmenInput,
    user,
    available_cup_pricings,
    available_color_pricings,
}: {
    clientsInput?: Client[];
    adminsAndSalesmenInput?: Client[];
    user: User;
    available_cup_pricings: string[];
    available_color_pricings: string[];
}) => {
    const [chosenTab, setChosenTab] = useState<
        "activationRequests" | "clients" | "adminsAndSalesmen" | "pricings"
    >("activationRequests");
    const [loading, setLoading] = useState(false);
    const [addAdmin, setAddAdmin] = useState(false);
    const [clients, setClients] = useState(clientsInput);
    const [adminsAndSalesmen, setAdminsAndSalesmen] = useState(adminsAndSalesmenInput);
    const [cups_or_colors, setCups_or_colors] = useState<"cups" | "colors" | "">("");
    const [pricing_name, setPricing_name] = useState("");
    const [newPricing, setNewPricing] = useState(false);

    useEffect(() => {
        const cupsOrColorsDiv = document.querySelector("#cups_or_colors") as HTMLSelectElement;
        if (cupsOrColorsDiv) cupsOrColorsDiv.value = cups_or_colors;
        const pricingNameDiv = document.querySelector("#pricing_name") as HTMLSelectElement;
        if (pricingNameDiv) pricingNameDiv.value = pricing_name;

        if (pricing_name === "new") setNewPricing(true);
    }, [cups_or_colors, pricing_name]);

    const handleActication = async (user_id: string, e?: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        let cup_pricing = "";
        let color_pricing = "";
        let eu = "" as "EU" | "PL" | "brak" | boolean;

        if (e) {
            e.preventDefault();
            cup_pricing = (e.currentTarget.querySelector("#cup_pricing") as HTMLInputElement)
                ?.value;
            color_pricing = (e.currentTarget.querySelector("#color_pricing") as HTMLInputElement)
                ?.value;
            eu = (e.currentTarget.querySelector("#eu") as HTMLInputElement)?.value as
                | "EU"
                | "PL"
                | "brak";
            if (eu === "brak") {
                alert("Potwierdź czy klient ma być w EU czy nie");
                setLoading(false);
                return;
            }
        } else {
            const clientDiv = document.querySelector(`#${user_id}`);
            cup_pricing = (clientDiv?.querySelector("#cup_pricing") as HTMLInputElement)?.value;
            color_pricing = (clientDiv?.querySelector("#color_pricing") as HTMLInputElement).value;
        }

        if (!cup_pricing || !color_pricing) {
            alert("Uzupełnij cennik klienta");
            setLoading(false);
            return;
        }

        const res = await fetch("/api/activateclient", {
            method: "POST",
            body: JSON.stringify({
                auth_id: user?.user_id,
                user_id,
                cup_pricing,
                color_pricing,
                ...{ eu: eu === "EU" ? true : eu === "PL" ? false : undefined },
            }),
        });

        console.log(res);

        if (res.ok) {
            alert("Klient został aktywowany");
            clients?.forEach((client) => {
                if (client.user_id === user_id) {
                    client.activated = true;
                    client.cup_pricing = cup_pricing;
                    client.color_pricing = color_pricing;

                    setClients([...clients]);
                    return;
                }
            });
            setLoading(false);
            return;
        }

        alert("Wystąpił błąd");
        setLoading(false);
        return;
    };

    const handleRoleChange = async (e: ChangeEvent<HTMLSelectElement>, user_id: string) => {
        setLoading(true);
        const role = e.currentTarget.value as "Admin" | "Salesman";

        const res = await fetch("/api/changerole", {
            method: "POST",
            body: JSON.stringify({
                auth_id: user?.user_id,
                user_id,
                role,
            }),
        });

        if (res.ok) {
            alert("Rola została zmieniona");
            adminsAndSalesmen?.forEach((client) => {
                if (client.user_id === user_id) {
                    client.role = role;
                    setAdminsAndSalesmen([...adminsAndSalesmen]);
                    return;
                }
            });
            setLoading(false);
            return;
        }

        alert("Wystąpił błąd");
        setLoading(false);
        return;
    };

    const handleDeleteUser = async (user_id: string) => {
        if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

        setLoading(true);

        const res = await fetch("/api/deleteuser", {
            method: "POST",
            body: JSON.stringify({
                auth_id: user?.user_id,
                user_id,
            }),
        });

        if (res.ok) {
            alert("Użytkownik został usunięty");
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

        alert(await res.text());
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
            alert("Uzupełnij wszystkie pola");
            setLoading(false);
            return;
        }

        if (password !== passwordRepeat) {
            alert("Hasła nie są takie same");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            alert("Hasło musi mieć co najmniej 8 znaków");
            setLoading(false);
            return;
        }

        if (!email.includes("@")) {
            alert("Niepoprawny adres email");
            setLoading(false);
            return;
        }

        if (password.length > 64) {
            alert("Hasło jest za długie");
            setLoading(false);
            return;
        }

        const res = await fetch("/api/addadmin", {
            method: "POST",
            body: JSON.stringify({
                auth_id: user?.user_id,
                email,
                password,
                role,
            }),
        });

        if (res.ok) {
            alert(
                `${
                    role === "Admin" ? "Administrator" : "Sprzedawca"
                } został dodany, mail aktywacyjny został wysłany na podany adres email`
            );
            setAddAdmin(false);
            setLoading(false);
            window.location.reload();
            return;
        }

        alert("Wystąpił błąd");
        setLoading(false);
        return;
    };

    const handleAddPricing = async () => {
        setLoading(true);

        const sheet_url = (document.querySelector("#sheet_url") as HTMLInputElement)?.value;

        if (!cups_or_colors || !pricing_name || !sheet_url) {
            alert("Uzupełnij wszystkie pola");
            setLoading(false);
            return;
        }

        if (sheet_url && !sheet_url.includes("docs.google.com/spreadsheets/d/")) {
            alert("Niepoprawny link do arkusza");
            setLoading(false);
            return;
        }

        if (pricing_name.length > 64) {
            alert("Nazwa cennika jest za długa");
            setLoading(false);
            return;
        }

        if (
            (cups_or_colors === "cups" && available_cup_pricings?.includes(pricing_name)) ||
            (cups_or_colors === "colors" && available_color_pricings?.includes(pricing_name))
        ) {
            alert("Taki cennik już istnieje, proszę wybrać go z listy");
            setLoading(false);
            return;
        }

        let res = {} as Response;
        if (cups_or_colors === "cups") {
            res = await fetch("/api/updatecups", {
                method: "POST",
                body: JSON.stringify({
                    auth_id: user?.user_id,
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
                alert(
                    `Cennik został dodany. ${
                        lastCellEmpty.length > 0
                            ? `Uzupełnij ostatnią kolumnę w wierszach: ${lastCellEmpty.join(
                                  ", "
                              )} - inaczej zostaną pominięte. `
                            : ""
                    }${
                        incompleteCups.length > 0
                            ? `Kubki z niepełnymi danymi: ${incompleteCups.join(", ")}. `
                            : ""
                    }${
                        cupsWithoutPrices.length > 0
                            ? `Kubki bez cen: ${cupsWithoutPrices.join(", ")}. `
                            : ""
                    }
                Odśwież stronę, aby zobaczyć zmiany.`
                );
            }
        } else if (cups_or_colors === "colors") {
            res = await fetch("/api/updatecolors", {
                method: "POST",
                body: JSON.stringify({
                    auth_id: user?.user_id,
                    pricing_name,
                    sheet_url,
                }),
            });

            if (res.ok) {
                alert("Cennik został dodany. Odśwież stronę, aby zobaczyć zmiany.");
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
            alert(
                "Cennik zawiera duplikaty kodów, proszę je usunąć i spróbować ponownie. Duplikaty: " +
                    duplicateCodes.join(", ")
            );
        } else {
            alert("Wystąpił błąd");
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
                            Admini i sprzedawcy
                        </button>
                        <button
                            className={`${
                                chosenTab === "pricings" ? "bg-slate-400" : "bg-slate-300"
                            } px-2 rounded-md`}
                            onClick={() => setChosenTab("pricings")}
                        >
                            Cenniki
                        </button>
                    </>
                )}
            </div>
            <p>Zalogowano jako: {user?.email}</p>
            <p>Rola: {user?.role}</p>
            {chosenTab === "activationRequests" && (
                <div>
                    <h2>Aktywacja klientów</h2>
                    <ul className="overflow-x-auto">
                        <ul className="flex flex-row">
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
                            <li className="px-2 border border-black w-32 text-center">Miasto</li>
                            <li className="px-2 border border-black w-32 text-center">
                                Województwo / Region
                            </li>
                            <li className="px-2 border border-black w-48 text-center">Telefon</li>
                            <li className="px-2 border border-black w-48 text-center">NIP</li>
                            <li className="px-2 border border-black w-16 text-center">EU?</li>
                            <li className="px-2 border border-black w-32 text-center">Kraj</li>
                            <li className="px-2 border border-black w-64 text-center">Email</li>
                            <li className="px-2 border border-black w-20 text-center">
                                Cennik kubków
                            </li>
                            <li className="px-2 border border-black w-20 text-center">
                                Cennik kolorów
                            </li>
                        </ul>
                        {clients
                            ?.filter((client) => !client.activated)
                            .map((client) => (
                                <form
                                    key={client.user_id}
                                    id={client.user_id}
                                    onSubmit={(e) => handleActication(client.user_id, e)}
                                    className="flex flex-row"
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
                                        <select id="eu" disabled={loading} defaultValue="brak">
                                            <option value="brak" hidden disabled>
                                                {client.eu ? "EU" : "PL"}
                                            </option>
                                            <option value="PL">PL</option>
                                            <option value="EU">EU</option>
                                        </select>
                                    </li>
                                    <li className="px-2 border border-black w-32 text-center">
                                        {client.country}
                                    </li>
                                    <li className="px-2 border border-black w-64 text-center">
                                        {client.email}
                                    </li>
                                    <li className="px-2 border border-black w-20 text-center">
                                        <select
                                            id="cup_pricing"
                                            disabled={loading}
                                            defaultValue={
                                                client.cup_pricing ? client.cup_pricing : ""
                                            }
                                        >
                                            <option value="" key="brak" disabled>
                                                Brak
                                            </option>
                                            {available_cup_pricings.map((cup_pricing) => (
                                                <option key={cup_pricing} value={cup_pricing}>
                                                    {cup_pricing}
                                                </option>
                                            ))}
                                        </select>
                                    </li>
                                    <li className="px-2 border border-black w-20 text-center">
                                        <select
                                            id="color_pricing"
                                            disabled={loading}
                                            defaultValue={
                                                client.color_pricing ? client.color_pricing : ""
                                            }
                                        >
                                            <option value="" key="brak" disabled>
                                                Brak
                                            </option>
                                            {available_color_pricings.map((color_pricing) => (
                                                <option key={color_pricing} value={color_pricing}>
                                                    {color_pricing}
                                                </option>
                                            ))}
                                        </select>
                                    </li>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-2 rounded-md ${
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
                                        className={`px-2 rounded-md ${
                                            loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"
                                        }`}
                                    >
                                        Usuń
                                    </button>
                                </form>
                            ))}
                    </ul>
                </div>
            )}
            {chosenTab === "clients" && (
                <div>
                    <h2>Klienci</h2>
                    <ul className="overflow-x-auto">
                        <ul className="flex flex-row">
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
                            <li className="px-2 border border-black w-32 text-center">Miasto</li>
                            <li className="px-2 border border-black w-32 text-center">
                                Województwo / Region
                            </li>
                            <li className="px-2 border border-black w-48 text-center">Telefon</li>
                            <li className="px-2 border border-black w-48 text-center">NIP</li>
                            <li className="px-2 border border-black w-12 text-center">EU?</li>
                            <li className="px-2 border border-black w-32 text-center">Kraj</li>
                            <li className="px-2 border border-black w-64 text-center">Email</li>
                            <li className="px-2 border border-black w-20 text-center">
                                Cennik kubków
                            </li>
                            <li className="px-2 border border-black w-20 text-center">
                                Cennik kolorów
                            </li>
                        </ul>
                        {clients
                            ?.filter((client) => client.activated)
                            .map((client) => (
                                <div
                                    key={client.user_id}
                                    id={client.user_id}
                                    className="flex flex-row"
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
                                    <li className="px-2 border border-black w-12 text-center">
                                        {client.eu ? "EU" : "PL"}
                                    </li>
                                    <li className="px-2 border border-black w-32 text-center">
                                        {client.country}
                                    </li>
                                    <li className="px-2 border border-black w-64 text-center">
                                        {client.email}
                                    </li>
                                    <li className="px-2 border border-black w-20 text-center">
                                        <select
                                            id="cup_pricing"
                                            disabled={loading}
                                            onChange={() => handleActication(client.user_id)}
                                            className={`${loading && "bg-slate-400"}`}
                                            defaultValue={
                                                client.cup_pricing ? client.cup_pricing : ""
                                            }
                                        >
                                            <option value="" key="brak" disabled>
                                                Brak
                                            </option>
                                            {available_cup_pricings.map((cup_pricing) => (
                                                <option key={cup_pricing} value={cup_pricing}>
                                                    {cup_pricing}
                                                </option>
                                            ))}
                                        </select>
                                    </li>
                                    <li className="px-2 border border-black w-20 text-center">
                                        <select
                                            id="color_pricing"
                                            disabled={loading}
                                            onChange={() => handleActication(client.user_id)}
                                            className={`${loading && "bg-slate-400"}`}
                                            defaultValue={
                                                client.color_pricing ? client.color_pricing : ""
                                            }
                                        >
                                            <option value="" key="brak" disabled>
                                                Brak
                                            </option>
                                            {available_color_pricings.map((color_pricing) => (
                                                <option key={color_pricing} value={color_pricing}>
                                                    {color_pricing}
                                                </option>
                                            ))}
                                        </select>
                                    </li>
                                </div>
                            ))}
                    </ul>
                </div>
            )}
            {user?.role === "Admin" &&
                adminsAndSalesmen &&
                adminsAndSalesmen.length > 0 &&
                chosenTab === "adminsAndSalesmen" && (
                    <div>
                        <h2>Administratorzy i handlowcy</h2>
                        <ul className="overflow-x-auto">
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
                                        <option value="" disabled>
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
                                    className="px-2 rounded-md bg-green-300 hover:bg-green-400"
                                    disabled={loading}
                                >
                                    Dodaj admina / sprzedawcę
                                </button>
                            )}
                        </ul>
                    </div>
                )}
            {user?.role === "Admin" && chosenTab === "pricings" && (
                <div>
                    <h2>Aktualizuj/dodaj cennik</h2>
                    <select
                        id="cups_or_colors"
                        defaultValue=""
                        onChange={(e) => setCups_or_colors(e.target.value as "cups" | "colors")}
                        disabled={loading}
                    >
                        <option value="" disabled>
                            Kubki/kolory
                        </option>
                        <option value="cups">Kubki</option>
                        <option value="colors">Kolory</option>
                    </select>
                    <select
                        id="pricing_name"
                        defaultValue=""
                        disabled={!cups_or_colors || loading}
                        onChange={(e) => setPricing_name(e.target.value as string)}
                    >
                        <option value="" disabled>
                            Wybierz cennik
                        </option>
                        {cups_or_colors === "cups" &&
                            available_cup_pricings.map((pricing) => (
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
                        />
                    )}
                    <input
                        type="text"
                        id="sheet_url"
                        disabled={!cups_or_colors || !pricing_name || loading}
                        placeholder="Link do arkusza google"
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
            )}
        </div>
    );
};
