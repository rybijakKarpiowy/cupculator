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
        "activationRequests" | "clients" | "adminsAndSalesmen"
    >("activationRequests");
    const [loading, setLoading] = useState(false);
    const [addAdmin, setAddAdmin] = useState(false);
    const [clients, setClients] = useState(clientsInput);
    const [adminsAndSalesmen, setAdminsAndSalesmen] = useState(adminsAndSalesmenInput);

    const handleActication = async (user_id: string, e?: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        let cup_pricing = "";
        let color_pricing = "";

        if (e) {
        e.preventDefault();
        cup_pricing = (e.currentTarget.querySelector("#cup_pricing") as HTMLInputElement)
            ?.value;
        color_pricing = (e.currentTarget.querySelector("#color_pricing") as HTMLInputElement)
            ?.value;
        } else {
            const clientDiv = document.querySelector(`#${user_id}`);
            cup_pricing = (clientDiv?.querySelector("#cup_pricing") as HTMLInputElement)?.value;
            color_pricing = (clientDiv?.querySelector("#color_pricing") as HTMLInputElement).value;
        }

        if (!cup_pricing || !color_pricing) {
            alert("Uzupełnij cennik klienta");
            return;
        }

        const res = await fetch("/api/activateclient", {
            method: "POST",
            body: JSON.stringify({
                auth_id: user?.user_id,
                user_id,
                cup_pricing,
                color_pricing,
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
            })
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
            })
            setLoading(false);
            return;
        }

        alert("Wystąpił błąd");
        setLoading(false);
        return;
    }

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
            })
            setLoading(false);
            return;
        }

        alert(await res.text());
        setLoading(false);
        return;
    }

    const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const email = (e.currentTarget.querySelector("#email") as HTMLInputElement)?.value;
        const password = (e.currentTarget.querySelector("#password") as HTMLInputElement)?.value;
        const passwordRepeat = (e.currentTarget.querySelector("#passwordRepeat") as HTMLInputElement)?.value;
        const role = (e.currentTarget.querySelector("#role") as HTMLInputElement)?.value as "Admin" | "Salesman";

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
            alert(`${role === "Admin" ? "Administrator" : "Sprzedawca"} został dodany, mail aktywacyjny został wysłany na podany adres email`);
            setAddAdmin(false);
            setLoading(false);
            window.location.reload();
            return;
        }

        alert("Wystąpił błąd");
        setLoading(false);
        return;
    }

    return (
        <div>
            <h1>Dashboard</h1>
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
                    <button
                        className={`${
                            chosenTab === "adminsAndSalesmen" ? "bg-slate-400" : "bg-slate-300"
                        } px-2 rounded-md`}
                        onClick={() => setChosenTab("adminsAndSalesmen")}
                    >
                        Admini i sprzedawcy
                    </button>
                )}
            </div>
            <p>Logged in as {user?.email}</p>
            <p>Role: {user?.role}</p>
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
                                        <li className={`px-2 border border-black w-64 text-center ${admin.user_id === user.user_id && "bg-blue-200"}`}>
                                        {admin.user_id !== user.user_id ? <select
                                                defaultValue={admin.role}
                                                onChange={(e) => handleRoleChange(e, admin.user_id)}
                                                disabled={loading}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Salesman">Handlowiec</option>
                                            </select>: admin.role}
                                        </li>
                                        <li className={`px-2 border border-black w-80 text-center  ${admin.user_id === user.user_id && "bg-blue-200"}`}>
                                            {admin.email}
                                        </li>
                                        {admin.user_id !== user.user_id && <button
                                            onClick={() => handleDeleteUser(admin.user_id)}
                                            className={`px-2 w-24 rounded-md ${
                                                loading
                                                    ? "bg-slate-400"
                                                    : "bg-red-300 hover:bg-red-400"
                                            }`}
                                            disabled={loading}
                                        >
                                            Usuń
                                        </button>}
                                    </div>
                                ))}
                            {adminsAndSalesmen
                                .filter((user) => user.role == "Salesman")
                                .map((salesman) => (
                                    <div key={salesman.user_id} className="flex flex-row">
                                        <li className="px-2 border border-black w-64 text-center">
                                            <select
                                                defaultValue={salesman.role}
                                                onChange={(e) => handleRoleChange(e, salesman.user_id)}
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
                                            className={`px-2 w-24 rounded-md ${loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"}`}
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
                                        className={`px-2 w-24 rounded-md ${loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"}`}
                                        disabled={loading}
                                    >
                                        Dodaj
                                    </button>
                                    <button
                                        onClick={() => setAddAdmin(false)}
                                        className={`px-2 w-24 rounded-md ${loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"}`}
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
        </div>
    );
};
