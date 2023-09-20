"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = (
    process.env.PROD === "true"
        ? "https://calculator.kubki.com.pl"
        : process.env.DEV === "true"
        ? "https://cupculator-rybijakkarpiowy.vercel.app"
        : "http://localhost:3000"
) as string;

export default function Register() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup")?.replace(" ", "_");

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
        } as {
            email: string;
            password: string;
            passwordRepeat: string;
        };

        const checks = {
            check1: check1.checked as boolean,
            check2: check2.checked as boolean,
            check3: check3.checked as boolean,
        } as {
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

        if (!checks.check1 || !checks.check2 || !checks.check3) {
            toast.warn(
                `${
                    lang === "1"
                        ? "Musisz zaakceptować wszystkie zgody"
                        : "You must accept all consents"
                }`
            );
            setLoading(false);
            return;
        }

        let { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                emailRedirectTo: new URL(`/?cup=${cup}&lang=${lang}`, baseUrl).href,
            },
        });

        if (error) {
            console.log(error);
            if (error.status === 429) {
                toast.error(
                    `${
                        lang === "1"
                            ? "Wysłałeś zbyt wiele żądań, spróbuj ponownie później!"
                            : "You have sent too many requests, try again later!"
                    }`
                );
                setLoading(false);
                return;
            }
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
            // Users have 14 days to verify their email
            if (
                data.user &&
                new Date().setDate(new Date().getDate() - 14) > Date.parse(data.user.created_at)
            ) {
                toast.error(
                    `${
                        lang === "1"
                            ? "Istnieje już konto z tym adresem email!"
                            : "An account with this email address already exists!"
                    }`
                );
                setLoading(false);
                return;
            }
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
                        name="email"
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
                        className="border border-[#bbb] bg-slate-50 text-black cursor-pointer"
                        disabled={loading}
                    />
                    <label htmlFor="ckeck1" className="text-md gap-1 cursor-pointer">
                        {lang === "1"
                            ? "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu korzystania z kalkulatora podłączonego do platformy internetowej www.kubki.com.pl. Informacja o przetwarzaniu danych osobowych dostępna jest "
                            : "I agree to processing of my personal data in order to use the calculator connected to the on-line platform www.kubki.com.pl. Information of the data analysis is available "}
                        <Link
                            href={
                                lang === "1"
                                    ? `https://kubki.com.pl/files/45613/Oswiadczenie_do_maila_-_RODO.pdf?&lang=${lang}`
                                    : `https://kubki.com.pl/files/45613/Statement_for_e-mail_-_RODO_ENG.pdf?lang=${lang}`
                            }
                            className="font-semibold text-black hover:text-[#c00418]"
                        >
                            {lang === "1" ? "TUTAJ" : "HERE"}
                        </Link>
                    </label>
                </div>
                <div className="flex flex-row justify-start px-[30%] items-center gap-4">
                    <input
                        id="ckeck2"
                        name="check2"
                        type="checkbox"
                        className="border border-[#bbb] bg-slate-50 text-black cursor-pointer"
                        disabled={loading}
                    />
                    <label htmlFor="ckeck2" className="text-md cursor-pointer">
                        {lang === "1"
                            ? "Wyrażam zgodę na przetwarzanie przez Pro Media Sp. z o.o. moich danych osobowych w celach marketingowych oraz w celu otrzymywania informacji handlowych."
                            : "I agree to process of my personal data by Pro Media Sp. z o.o. due to marketing and trading activities."}
                    </label>
                </div>
                <div className="flex flex-row justify-start px-[30%] items-center gap-4">
                    <input
                        id="ckeck3"
                        name="check3"
                        type="checkbox"
                        className="border border-[#bbb] bg-slate-50 text-black cursor-pointer"
                        disabled={loading}
                    />
                    <label htmlFor="ckeck3" className="text-md gap-1 cursor-pointer">
                        {lang === "1" ? "Akceptuję " : "I agree to "}
                        <Link
                            href={
                                lang === "1"
                                    ? `https://kubki.com.pl/files/45613/Warunki_wspolpracy_dla_Agencji_Reklamowych_2019.pdf?fbclid=IwAR2356gs-P2G9PM47HCaVUINkhQe6Zoef3sF-bbBpnwcG19wW3lc1xHm-ac?&lang=${lang}`
                                    : `https://kubki.com.pl/files/45613/Terms_of_cooperation_for_European_Customers.pdf?fbclid=IwAR3D-hs5RmPYS_fQ7BcLi5iZrWKZ6eLrPMPLox_e1J46Zw3roDNtqpOYZao?lang=${lang}`
                            }
                            className="font-semibold text-black hover:text-[#c00418]"
                        >
                            {lang === "1"
                                ? "Warunki Współpracy dla Agencji Reklamowych"
                                : "the term of co-operation"}
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
