"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup")?.replace(" ", "_");

    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        setLoading(true);
        event.preventDefault();
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.log(error.message);
            toast.error(lang === "1" ? "Błędny email lub hasło" : "Incorrect email or password");
            setLoading(false);
            return;
        }

        if (data) {
            toast.success(lang === "1" ? "Zalogowano!": "Signed in!", { autoClose: 1000 });
            setTimeout(()=>window.location.href = `/?cup=${cup}&lang=${lang}`, 1000);
            setLoading(false);
        }
    };

    return (
        <div className="pt-24">
            <form className="flex flex-col content-center gap-4">
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="email" className="text-lg">
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="password" className="text-lg">
                        {lang === "1" ? "Hasło: " : "Password: "}
                    </label>
                    <input
                        id="password"
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
                        {lang === "1" ? "Zaloguj się" : "Sign in"}
                    </button>
                </div>
            </form>
            <div className="flex flex-row justify-center items-center gap-12 mt-8">
                <span className="flex flex-col items-center">
                    {lang === "1" ? "Nie masz konta? " : "Do not have an account yet? "}
                    <Link
                        href={`/register?cup=${cup}&lang=${lang}`}
                        className="font-semibold text-black hover:text-[#c00418]"
                    >
                        {lang === "1" ? "Zarejestruj się" : "Sign up"}
                    </Link>
                </span>
                <span className="flex flex-col items-center">
                    {lang === "1" ? "Zapomniałeś hasła?" : "Forgot password?"}
                    <Link
                        href={`/recovery?cup=${cup}&lang=${lang}`}
                        className="font-semibold text-black hover:text-[#c00418]"
                    >
                        {lang === "1" ? "Zresetuj hasło" : "Reset password"}
                    </Link>
                </span>
            </div>
        </div>
    );
}
