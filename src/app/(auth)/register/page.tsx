"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";

export default function Register() {
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
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
                return;
            }
        }

        if (userData.password != userData.passwordRepeat) {
            alert(`${lang === "1" ? "Hasła nie są takie same!" : "Passwords are not the same!"}`);
            return;
        }

        if (userData.password.length < 8) {
            alert(`${lang === "1" ? "Hasło jest za krótkie!" : "The password is too short!"}`);
            return;
        }

        if (userData.password.length > 64) {
            alert(`${lang === "1" ? "Hasło jest za długie!" : "The password is too long!"}`);
            return;
        }

        if (!userData.email.includes("@")) {
            alert(`${lang === "1" ? "Email jest niepoprawny!" : "The email is incorrect!"}`);
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
            return;
        }
    };

    return (
        <div>
            <form className="flex flex-col content-center" id="form">
                <div className="flex flex-row justify-center">
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="password">{lang === "1" ? "Hasło: " : "Password: "}</label>
                    <input id="password" type="password" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="passwordRepeat">
                        {lang === "1" ? "Powtórz hasło: " : "Repeat password: "}
                    </label>
                    <input id="passwordRepeat" type="password" />
                </div>
                <button type="submit" onClick={(e) => handleSubmit(e)}>
                    {lang === "1" ? "Zarejestruj" : "Register"}
                </button>
            </form>
        </div>
    );
}
