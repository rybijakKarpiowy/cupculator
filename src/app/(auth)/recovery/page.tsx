"use client";

import { createClient } from "@/database/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = (
    process.env.PROD === "true"
        ? "https://calculator.kubki.com.pl"
        : process.env.DEV === "true"
        ? "https://cupculator-rybijakkarpiowy.vercel.app"
        : "http://localhost:3000"
) as string;

export default function Recovery() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup")?.trim().replaceAll(" ", "_");
    const embed = searchParams.get("embed") == 'true' ? true : false;

    const supabase = createClient();

    useEffect(() => {
        document.body.dataset.embed = embed ? "true" : "false";
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        setLoading(true);
        event.preventDefault();
        const email = (document.getElementById("email") as HTMLInputElement).value;

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: new URL("/resetpassword", baseUrl).href,
        });

        if (error) {
            console.error(error);
            if (error.message.includes("Email rate limit exceeded")) {
                toast.error(
                    lang === "1"
                        ? "Przekroczono limit wysyłania emaili, spróbuj ponownie później"
                        : "Email rate limit exceeded, try again later"
                );
                setLoading(false);
                return;
            }
            toast.error(lang === "1" ? "Błędny email" : "Incorrect email");
            setLoading(false);
            return;
        }

        if (data) {
            console.log(data);
            toast.success(
                lang === "1"
                    ? "Wysłano link do zresetowania hasła!"
                    : "Sent a link to reset your password!"
            );
            setTimeout(() => (window.location.href = `/?cup=${cup}&lang=${lang}&embed=${embed}`), 5000);
            setLoading(false);
        }
    };

    return (
        <div className="pt-24">
            <form className="flex flex-col items-center gap-4">
                <div className="flex flex-row justify-end items-center gap-4 relative">
                    <label htmlFor="email" className="text-lg absolute -left-16">
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-center items-center mt-4">
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
            <div className="flex flex-row justify-center items-center gap-12 mt-8">
                <span className="flex flex-col items-center">
                    {lang === "1" ? "Nie masz konta? " : "Do not have an account yet? "}
                    <Link
                        href={`/register?cup=${cup}&lang=${lang}&embed=${embed}`}
                        className="font-semibold text-black hover:text-[#c00418]"
                    >
                        {lang === "1" ? "Zarejestruj się" : "Sign up"}
                    </Link>
                </span>
                <span className="flex flex-col items-center">
                    {lang === "1" ? "Pamiętasz hasło?" : "Remember your password?"}
                    <Link
                        href={`/login?cup=${cup}&lang=${lang}&embed=${embed}`}
                        className="font-semibold text-black hover:text-[#c00418]"
                    >
                        {lang === "1" ? "Zaloguj się" : "Sign in"}
                    </Link>
                </span>
            </div>
        </div>
    );
}
