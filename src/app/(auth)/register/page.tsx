"use client";

import { baseUrl } from "@/middleware";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Register() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        setLoading(true);
        event.preventDefault();
        const { email, password, passwordRepeat, check1, check2, check3 } = document.getElementById(
            "form"
        ) as HTMLFormElement;
        const userData = {
            email: email.value as string,
            password: password.value as string,
            passwordRepeat: passwordRepeat.value as string,
            check1: check1.checked as boolean,
            check2: check2.checked as boolean,
            check3: check3.checked as boolean,
        } as {
            email: string;
            password: string;
            passwordRepeat: string;
            check1: boolean;
            check2: boolean;
            check3: boolean;
        };

        for (const key in userData) {
            // @ts-ignore
            if (userData[key] == "") {
                toast.warn(`${lang === "1" ? "Wypełnij wszystkie pola" : "Fill in all fields"}`);
                setLoading(false);
                return;
            }
        }

        if (userData.password != userData.passwordRepeat) {
            toast.warn(
                `${lang === "1" ? "Hasła nie są takie same" : "Passwords are not the same"}`
            );
            setLoading(false);
            return;
        }

        if (userData.password.length < 8) {
            toast.warn(`${lang === "1" ? "Hasło jest za krótkie" : "The password is too short"}`);
            setLoading(false);
            return;
        }

        if (userData.password.length > 64) {
            toast.warn(`${lang === "1" ? "Hasło jest za długie" : "The password is too long"}`);
            setLoading(false);
            return;
        }

        if (!userData.email.includes("@")) {
            toast.warn(`${lang === "1" ? "Email jest niepoprawny" : "The email is incorrect"}`);
            setLoading(false);
            return;
        }

        if (!userData.check1 || !userData.check2 || !userData.check3) {
            toast.warn(
                `${
                    lang === "1"
                        ? "Musisz zaakceptować politykę prywatności (wszystkie zgody)"
                        : "You must accept the privacy policy (all consents)"
                }`
            );
            setLoading(false);
            return;
        }

        let { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                emailRedirectTo: `${baseUrl}account/details?cup=${cup}&lang=${lang}`,
            },
        });

        if (error) {
            console.log(error);
            toast.error(
                `${
                    lang === "1"
                        ? "Wystąpił błąd, spróbuj ponownie później!"
                        : "An error occurred, try again later!"
                }`
            );
            setLoading(false);
            return;
        }

        if (data) {
            toast.success(
                `${
                    lang === "1"
                        ? "Zarejestrowano pomyślnie! Potwierdź swój adres email!"
                        : "Registered successfully! Confirm your email address!"
                }`
            );
            setTimeout(() => (window.location.href = `/?cup=${cup}&lang=${lang}`), 5000);
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
                        name= "email"
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
                        name="password"
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
                        name="passwordRepeat"
                        type="password"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-start px-[30%] items-center gap-4">
                    <input
                        id="ckeck1"
                        name="check1"
                        type="checkbox"
                        className="border border-[#bbb] bg-slate-50 text-black"
                        disabled={loading}
                    />
                    <label htmlFor="ckeck1" className="text-md">
                        {lang === "1"
                            ? "Zgodnie z art. 6 ust. 1 lit. a oraz art. 9 ust.2 lit. a ogólnego rozporządzenia o ochronie danych osobowych z dnia 27 kwietnia 2016r. Parlamentu Europejskiego i Rady (UE) 2016/679 wyrażam zgodę, na przetwarzanie moich danych osobowych, w celu korzystania z kalkulatora podłączonego do platformy internetowej www.kubki.com.pl."
                            : "According to Art. 6 sec. 1 lit. a and art. 9 section 2 lit. a of the general regulation on the protection of personal data of April 27, 2016. European Parliament and of the Council (EU) 2016/679, I consent to the processing of my personal data in order to use the calculator connected to the internet platform www.kubki.com.pl."}
                    </label>
                </div>
                <div className="flex flex-row justify-start px-[30%] items-center gap-4">
                    <input
                        id="ckeck2"
                        name="check2"
                        type="checkbox"
                        className="border border-[#bbb] bg-slate-50 text-black"
                        disabled={loading}
                    />
                    <label htmlFor="ckeck2" className="text-md">
                        {lang === "1"
                            ? "Zgodnie z ustawą z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną wyrażam zgodę na przesyłanie informacji handlowych środkami komunikacji elektronicznej."
                            : "In accordance with the Act of July 18, 2002 on the provision of electronic services, I consent to the sending of commercial information by electronic means."}
                    </label>
                </div>
                <div className="flex flex-row justify-start px-[30%] items-center gap-4">
                    <input
                        id="ckeck3"
                        name="check3"
                        type="checkbox"
                        className="border border-[#bbb] bg-slate-50 text-black"
                        disabled={loading}
                    />
                    <label htmlFor="ckeck3" className="text-md gap-1">
                        {lang === "1"
                            ? "Akceptuję " : "I accept "}
                        <Link
                            href={`/regulations?cup=${cup}&lang=${lang}`}
                            className="font-semibold text-black hover:text-[#c00418]"
                        >
                            {lang === "1" ? "Warunki Współpracy dla Agencji Reklamowych" : "Terms of Cooperation for Advertising Agencies"}
                        </Link>
                    </label>
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
                        {lang === "1" ? "Zarejestruj" : "Register"}
                    </button>
                </div>
            </form>
            <div className="flex flex-row justify-center items-center gap-12 mt-8">
                <span className="flex flex-col items-center">
                    {lang === "1" ? "Masz już konto?" : "Already have an account?"}
                    <Link
                        href={`/login?cup=${cup}&lang=${lang}`}
                        className="font-semibold text-black hover:text-[#c00418]"
                    >
                        {lang === "1" ? "Zaloguj się" : "Sign in"}
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
