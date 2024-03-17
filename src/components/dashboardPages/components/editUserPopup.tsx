"use client";

import { Client } from "@/app/dashboard/page";
import { validateInfo } from "@/lib/validateInfo";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

export const EditUserPopup = ({
    client,
    parentDiv,
    editButton,
    loading,
    setLoading,
    clients,
    setClients,
}: {
    client: Client;
    parentDiv: HTMLDivElement|null;
    editButton: HTMLButtonElement|null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    clients: Client[];
    setClients: Dispatch<SetStateAction<Client[] | undefined>>;
}) => {
    return (
        <div className="w-full h-full relative">
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const { currency, ...rest } = Object.fromEntries(formData.entries()) as {
                        first_name: string;
                        last_name: string;
                        company_name: string;
                        adress: string;
                        postal_code: string;
                        city: string;
                        region: string;
                        phone: string;
                        NIP: string;
                        currency: "PLN" | "EUR";
                        country: string;
                        email: string;
                    };
                    const data = {
                        ...rest,
                        eu: currency === "EUR",
                    };

                    const notValid = validateInfo(data);
                    if (notValid) {
                        toast.error(notValid);
                        setLoading(false);
                        if (parentDiv) {
                            parentDiv.classList.toggle("hidden");
                        }
                        if (editButton) {
                            editButton.disabled = false;
                            editButton.classList.toggle("bg-blue-300");
                            editButton.classList.toggle("hover:bg-blue-400");
                            editButton.classList.toggle("bg-slate-400");
                        }
                        return;
                    }

                    const res = await fetch("/api/updateclientinfo", {
                        method: "POST",
                        body: JSON.stringify({ ...data, user_id: client.user_id }),
                    });

                    if (res.status === 400) {
                        toast.error("Brakujące dane");
                        setLoading(false);
                        if (parentDiv) {
                            parentDiv.classList.toggle("hidden");
                        }
                        if (editButton) {
                            editButton.disabled = false;
                            editButton.classList.toggle("bg-blue-300");
                            editButton.classList.toggle("hover:bg-blue-400");
                            editButton.classList.toggle("bg-slate-400");
                        }
                        return;
                    }
                    if (res.status === 500) {
                        toast.error("Błąd serwera");
                        setLoading(false);
                        if (parentDiv) {
                            parentDiv.classList.toggle("hidden");
                        }
                        if (editButton) {
                            editButton.disabled = false;
                            editButton.classList.toggle("bg-blue-300");
                            editButton.classList.toggle("hover:bg-blue-400");
                            editButton.classList.toggle("bg-slate-400");
                        }
                        return;
                    }
                    if (!res.ok) {
                        toast.error("Nieznany błąd");
                        setLoading(false);
                        if (parentDiv) {
                            parentDiv.classList.toggle("hidden");
                        }
                        if (editButton) {
                            editButton.disabled = false;
                            editButton.classList.toggle("bg-blue-300");
                            editButton.classList.toggle("hover:bg-blue-400");
                            editButton.classList.toggle("bg-slate-400");
                        }
                        return;
                    }

                    toast.success("Zaktualizowano dane");
                    setClients(
                        clients.map((c) => {
                            if (c.user_id === client.user_id) {
                                return {
                                    ...c,
                                    ...data,
                                };
                            }
                            return c;
                        })
                    );

                    setLoading(false);
                    if (parentDiv) {
                        parentDiv.classList.toggle("hidden");
                    }
                    if (editButton) {
                        editButton.disabled = false;
                        editButton.classList.toggle("bg-blue-300");
                        editButton.classList.toggle("hover:bg-blue-400");
                        editButton.classList.toggle("bg-slate-400");
                    }
                }}
            >
                <ul className="flex flex-row min-w-max">
                    <li className="border-r border-black w-24 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.first_name}
                            name="first_name"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-24 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.last_name}
                            name="last_name"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-64 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.company_name}
                            name="company_name"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-64 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.adress}
                            name="adress"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-24 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.postal_code}
                            name="postal_code"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-32 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.city}
                            name="city"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-32 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.region}
                            name="region"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-48 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.phone}
                            name="phone"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-48 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.NIP}
                            name="NIP"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-16 text-center">
                        <select
                            defaultValue={client.eu ? "EUR" : "PLN"}
                            name="currency"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        >
                            <option value="PLN">PLN</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </li>
                    <li className=" border-r border-black w-32 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.country}
                            name="country"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li className=" border-r border-black w-64 text-center">
                        <input
                            disabled={loading}
                            type="text"
                            defaultValue={client.email}
                            name="email"
                            className="w-full text-center bg-blue-100 text-[purple]"
                        />
                    </li>
                    <li>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${
                                loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                            } h-full rounded-md px-2 w-16 ml-4`}
                        >
                            Zapisz
                        </button>
                    </li>
                </ul>
            </form>
            <button
                className={`absolute right-0 top-0 ${
                    loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"
                } h-full rounded-md px-2 w-8`}
                disabled={loading}
                type="button"
                onClick={() => {
                    if (parentDiv) {
                        parentDiv.classList.toggle("hidden");
                    }
                    if (editButton) {
                        editButton.disabled = false;
                        editButton.classList.toggle("bg-blue-300");
                        editButton.classList.toggle("hover:bg-blue-400");
                        editButton.classList.toggle("bg-slate-400");
                    }
                }}
            >
                X
            </button>
        </div>
    );
};
