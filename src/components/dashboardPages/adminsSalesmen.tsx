"use client"

import { Client, User } from "@/app/dashboard/page";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AdminsSalesmen = ({
	adminsAndSalesmenInput,
    user,
}: {
    adminsAndSalesmenInput: Client[];
    user: User;
}) => {
    const [loading, setLoading] = useState(false);
    const [addAdmin, setAddAdmin] = useState(false);
    const [adminsAndSalesmen, setAdminsAndSalesmen] = useState(adminsAndSalesmenInput);

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
            // if (role === "Admin") {
            //     clients?.forEach((client) => {
            //         if (client.salesman_id === user_id) {
            //             client.salesman_id = null;
            //             setClients([...clients]);
            //         }
            //     });
            // }
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
            // clients?.forEach((client, index) => {
            //     if (client.user_id === user_id) {
            //         clients.splice(index, 1);
            //         setClients([...clients]);
            //         return;
            //     }
            // });
            setLoading(false);
            return;
        }

        toast.error(await res.text());
        setLoading(false);
        return;
    };

    return (
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
    )
}