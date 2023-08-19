'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";

export default function Login() {
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            alert(error.message)
            return
        }

        if (data) {
            alert("Zalogowano!")
            window.location.href = `/?cup=${cup}&lang=${lang}`
        }
    }

    return (
        <div>
        <form className="flex flex-col content-center">
            <div className="flex flex-row justify-center">
                <label htmlFor="email">Email: </label>
                <input id="email" type="email" />
            </div>
            <div className="flex flex-row justify-center">
                <label htmlFor="password">{lang === "1" ? "Hasło: " : "Password: "}</label>
                <input id="password" type="password" />
            </div>
            <button type="submit" onClick={(e) => handleSubmit(e)}>Zaloguj</button>
        </form>
        <span>{lang === "1" ? "Nie masz konta? " : "Do not have an account yet? "}<a href={`/register?cup=${cup}&lang=${lang}`}>{lang === "1" ? "Zarejestruj się" : "Sign up"}</a></span>
        <a href={`/recovery?cup=${cup}&lang=${lang}`} >{lang === "1" ? "Zapomniałeś hasła?" : "Forgot password?"}</a>
        </div>
    );
}
