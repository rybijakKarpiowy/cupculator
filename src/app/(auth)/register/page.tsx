"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Register() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        setLoading(true);
        event.preventDefault();
        const { email, password, passwordRepeat } = document.getElementById(
            "form"
        ) as HTMLFormElement;
        const userData = {
            email: email.value as string,
            password: password.value as string,
            passwordRepeat: passwordRepeat.value as string,
        } as Record<string, string>;

        for (const key in userData) {
            if (userData[key] == "") {
                alert(`${lang === "1" ? "Wypełnij wszystkie pola!" : "Fill in all fields!"}`);
                setLoading(false);
                return;
            }
        }

        if (userData.password != userData.passwordRepeat) {
            alert(`${lang === "1" ? "Hasła nie są takie same!" : "Passwords are not the same!"}`);
            setLoading(false);
            return;
        }

        if (userData.password.length < 8) {
            alert(`${lang === "1" ? "Hasło jest za krótkie!" : "The password is too short!"}`);
            setLoading(false);
            return;
        }

        if (userData.password.length > 64) {
            alert(`${lang === "1" ? "Hasło jest za długie!" : "The password is too long!"}`);
            setLoading(false);
            return;
        }

        if (!userData.email.includes("@")) {
            alert(`${lang === "1" ? "Email jest niepoprawny!" : "The email is incorrect!"}`);
            setLoading(false);
            return;
        }

        let { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                emailRedirectTo: `http://localhost:3000/account/details?cup=${cup}&lang=${lang}`,
            },
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        if (data) {
            alert(
                `${
                    lang === "1"
                        ? "Zarejestrowano pomyślnie! Potwierdź swój adres email!"
                        : "Registered successfully! Confirm your email address!"
                }`
            );
            window.location.href = `/?cup=${cup}&lang=${lang}`;
            setLoading(false);
            return;
        }
    };

    return (
        <div className="pt-24">
            <form className="flex flex-col content-center gap-4" id="form">
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
                        {lang === "1" ? "Zarejestruj" : "Register"}
                    </button>
                </div>
            </form>
            <div className="flex flex-row justify-center items-center gap-12 mt-8">
                <span className="flex flex-col items-center">
                    {lang === "1" ? "Masz już konto?" : "Already have an account?"}
                    <a
                        href={`/login?cup=${cup}&lang=${lang}`}
                        className="font-semibold text-black hover:text-[#c00418]"
                    >
                        {lang === "1" ? "Zaloguj się" : "Sign in"}
                    </a>
                </span>
                <span className="flex flex-col items-center">
                    {lang === "1" ? "Zapomniałeś hasła?" : "Forgot password?"}
                    <a
                        href={`/recovery?cup=${cup}&lang=${lang}`}
                        className="font-semibold text-black hover:text-[#c00418]"
                    >
                        {lang === "1" ? "Zresetuj hasło" : "Reset password"}
                    </a>
                </span>
            </div>
        </div>
    );
}
