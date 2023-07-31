"use client";

import { Client, User } from "@/app/dashboard/page";
import { useEffect, useState } from "react";

export const DashboardPages = ({
    clients,
    adminsAndSalesmen,
    user,
    available_cup_pricings,
    available_color_pricings,
}: {
    clients?: Client[];
    adminsAndSalesmen?: Client[];
    user: User;
    available_cup_pricings: string[];
    available_color_pricings: string[];
}) => {
    const [chosenTab, setChosenTab] = useState<
        "activationRequests" | "clients" | "adminsAndSalesmen"
    >("activationRequests");
    const [loading, setLoading] = useState(false);
    const [addAdmin, setAddAdmin] = useState(false);

    const handleActication = async (e: React.FormEvent<HTMLFormElement>, user_id: string) => {
        e.preventDefault();
        setLoading(true);

        const cup_pricing = (e.currentTarget.querySelector("#cup_pricing") as HTMLInputElement)
            ?.value;
        const color_pricing = (e.currentTarget.querySelector("#color_pricing") as HTMLInputElement)
            ?.value;

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
            setLoading(false);
            window.location.reload();
            return;
        }

        alert("Wystąpił błąd");
        setLoading(false);
        return;
    };

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
                                    onSubmit={(e) => handleActication(e, client.user_id)}
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
                                <form
                                    key={client.user_id}
                                    id={client.user_id}
                                    onSubmit={(e) => handleActication(e, client.user_id)}
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
                                        className={`px-2 w-24 rounded-md ${
                                            loading
                                                ? "bg-slate-400"
                                                : "bg-green-300 hover:bg-green-400"
                                        }`}
                                    >
                                        Zmień cenniki
                                    </button>
                                </form>
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
                                        <li className="px-2 border border-black w-64 text-center">
                                            <select
                                                defaultValue={admin.role}
                                                onChange={() => handleRoleChange(admin.user_id)}
                                                disabled={loading}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Salesman">Handlowiec</option>
                                            </select>
                                        </li>
                                        <li className="px-2 border border-black w-80 text-center">
                                            {admin.email}
                                        </li>
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
                                    </div>
                                ))}
                            {adminsAndSalesmen
                                .filter((user) => user.role == "Salesman")
                                .map((salesman) => (
                                    <div key={salesman.user_id} className="flex flex-row">
                                        <li className="px-2 border border-black w-64 text-center">
                                            <select
                                                defaultValue={salesman.role}
                                                onChange={() => handleRoleChange(salesman.user_id)}
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
                                            className="px-2 w-24 rounded-md bg-red-300 hover:bg-red-400"
                                            disabled={loading}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                ))}
                            {addAdmin ? (
                                <form onSubmit={() => handleAddAdmin()} className="flex flex-row">
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
                                        id="passworRepeat"
                                        type="password"
                                        placeholder="Powtórz hasło"
                                        className="px-2 border border-black w-64 text-center"
                                        disabled={loading}
                                    ></input>
                                    <button
                                        type="submit"
                                        className="px-2 w-24 rounded-md bg-green-300 hover:bg-green-400"
                                        disabled={loading}
                                    >
                                        Dodaj
                                    </button>
                                    <button
                                        onClick={() => setAddAdmin(false)}
                                        className="px-2 w-24 rounded-md bg-red-300 hover:bg-red-400"
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
