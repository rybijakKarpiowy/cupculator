'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const passwordRepeat = (document.getElementById('passwordRepeat') as HTMLInputElement).value;

        if (password != passwordRepeat) {
            alert(`${lang === "1" ? "Hasła nie są takie same!" : "Passwords are not the same!"}`)
            return;
        }

        if (password.length < 8) {
            alert(`${lang === "1" ? "Hasło jest za krótkie!" : "The password is too short!"}`)
            return;
        }

        if (password.length > 64) {
            alert(`${lang === "1" ? "Hasło jest za długie!" : "The password is too long!"}`)
            return;
        }


        const { data, error } = await supabase.auth.updateUser({password: password})

        if (error) {
            alert(error.message)
        }

        if (data) {
            alert(`${lang === "1" ? "Hasło zostało zmienione!" : "The password has been changed!"}`)
            window.location.href = `/?cup=${cup}&lang=${lang}`
        }
    }

    return (
        <div>
            <form className="flex flex-col content-center">
                <div className="flex flex-row justify-center">
                    <label htmlFor="password">{lang === "1" ? "Nowe hasło: " : "New password: "}</label>
                    <input id="password" type="password" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="passwordRepeat">{lang === "1" ? "Powtórz nowe hasło: " : "Repeat password: "}</label>
                    <input id="passwordRepeat" type="password" />
                </div>
                <button type="submit" onClick={(e) => handleSubmit(e)}>{lang === "1" ? "Zresetuj hasło" : "Reset password"}</button>
            </form>
        </div>
    )
}