"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export const AdminEmailsTab = ({ adminEmails }: { adminEmails: string[] }) => {
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState(adminEmails);

    return (
        <div>
            <h2>Emaile adminów</h2>
            <hr />
            <br />
            <ul className="flex flex-col pl-16 gap-4">
                {emails.map((email, index) => (
                    <li key={index} className="flex flex-row items-center gap-4">
                        <p>{email}</p>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                const res = await fetch("/api/admin_emails", {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ email }),
                                });

                                if (!res.ok) {
                                    toast.error("Coś poszło nie tak");
                                    setLoading(false);
                                    return;
                                }

                                setEmails(emails.filter((e) => e !== email));
                                setLoading(false);
                                toast.success("Usunięto");
                            }}
                            className={`px-2 w-16 rounded-md ${
                                loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"
                            }`}
                        >
                            Usuń
                        </button>
                    </li>
                ))}
                <li>
                    <form
                        className="flex flex-row items-center gap-2"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setLoading(true);
                            const formData = new FormData(e.target as HTMLFormElement);
                            const email = formData.get("email") as string;

                            const res = await fetch("/api/admin_emails", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ email }),
                            });

                            if (!res.ok) {
                                toast.error("Coś poszło nie tak");
                                setLoading(false);
                                return;
                            }

                            setEmails([...emails, email]);
                            setLoading(false);
                            toast.success("Dodano");
                        }}
                    >
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="px-2 py-1 rounded-md border border-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-2 w-16 rounded-md ${
                                loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"
                            }`}
                        >
                            Dodaj
                        </button>
                    </form>
                </li>
            </ul>
        </div>
    );
};
