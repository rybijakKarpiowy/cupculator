"use client";

import { Database } from "@/database/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup")?.replace("%20", "_");
    const error_description = searchParams.get("error_description");

    if (error_description === "Email link is invalid or has expired") {
        toast.error(
            `${
                lang === "1"
                    ? "Link do zmiany hasła wygasł lub został użyty! Podaj ponownie adres email"
                    : "The password change link has expired or has been already used! Enter your email address again"
            }`
        );
        setTimeout(() => (window.location.href = `/recovery?cup=${cup}&lang=${lang}`), 5000);
    }

    const supabase = createClientComponentClient<Database>();
    (async () => {
    const user = await supabase.auth.getUser();
    console.log(user);
    })()


    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        setLoading(true);
        event.preventDefault();
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const passwordRepeat = (document.getElementById("passwordRepeat") as HTMLInputElement)
            .value;

        if (password != passwordRepeat) {
            toast.warn(
                `${lang === "1" ? "Hasła nie są takie same!" : "Passwords are not the same!"}`
            );
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            toast.warn(`${lang === "1" ? "Hasło jest za krótkie!" : "The password is too short!"}`);
            setLoading(false);
            return;
        }

        if (password.length > 64) {
            toast.warn(`${lang === "1" ? "Hasło jest za długie!" : "The password is too long!"}`);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            if (error.status === 422) {
                toast.warn(
                    `${
                        lang === "1"
                            ? "Nowe hasło musi być inne niż poprzednie!"
                            : "The new password must be different from the previous one!"
                    }`
                );
                setLoading(false);
                return;
            }
            console.error(error);
            toast.error(`${lang === "1" ? "Wystąpił błąd!" : "An error occurred!"}`);
            setLoading(false);
            return;
        }

        if (data) {
            toast.success(
                `${lang === "1" ? "Hasło zostało zmienione!" : "The password has been changed!"}`
            );
            setTimeout(() => (window.location.href = `/?cup=${cup}&lang=${lang}`), 5000);
            setLoading(false);
        }
    };

    return (
        <div className="pt-24">
            <form className="flex flex-col content-center gap-4">
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="password" className="text-lg">
                        {lang === "1" ? "Nowe hasło: " : "New password: "}
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="passwordRepeat" className="text-lg">
                        {lang === "1" ? "Powtórz hasło: " : "Repeat password: "}
                    </label>
                    <input
                        id="passwordRepeat"
                        type="password"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-center items-center mt-2">
                    <button
                        type="submit"
                        className={`border-[#c00418] border rounded-[25px] w-fit px-4 py-2 text-black ${
                            loading ? "bg-slate-400" : "bg-white hover:bg-[#c00418]"
                        } hover:text-white duration-150 ease-in-out`}
                        onClick={(e) => handleSubmit(e)}
                        disabled={loading}
                    >
                        {lang === "1" ? "Zresetuj hasło" : "Reset password"}
                    </button>
                </div>
            </form>
        </div>
    );
}
