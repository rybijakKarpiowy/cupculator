"use client";

import { Database } from "@/database/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const supabase = createClientComponentClient<Database>();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        setLoading(true);
        event.preventDefault();
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const passwordRepeat = (document.getElementById("passwordRepeat") as HTMLInputElement)
            .value;

        if (password != passwordRepeat) {
            alert(`${lang === "1" ? "Hasła nie są takie same!" : "Passwords are not the same!"}`);
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            alert(`${lang === "1" ? "Hasło jest za krótkie!" : "The password is too short!"}`);
            setLoading(false);
            return;
        }

        if (password.length > 64) {
            alert(`${lang === "1" ? "Hasło jest za długie!" : "The password is too long!"}`);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        if (data) {
            alert(
                `${lang === "1" ? "Hasło zostało zmienione!" : "The password has been changed!"}`
            );
            window.location.href = `/?cup=${cup}&lang=${lang}`;
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
                        className={`border-[#c00418] border rounded-[25px] w-fit px-4 py-2 text-black ${loading ? "bg-slate-400" : "bg-white hover:bg-[#c00418]"} hover:text-white duration-150 ease-in-out`}
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
