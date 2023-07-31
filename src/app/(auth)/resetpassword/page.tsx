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
            alert("Hasła nie są takie same!")
            return;
        }

        if (password.length < 8) {
            alert("Hasło jest za krótkie!")
            return;
        }

        if (password.length > 64) {
            alert("Hasło jest za długie!")
            return;
        }


        const { data, error } = await supabase.auth.updateUser({password: password})

        if (error) {
            alert(error.message)
        }

        if (data) {
            alert("Zresetowano hasło!")
            window.location.href = `/?cup=${cup}&lang=${lang}`
        }
    }

    return (
        <div>
            <form className="flex flex-col content-center">
                <div className="flex flex-row justify-center">
                    <label htmlFor="password">Nowe hasło: </label>
                    <input id="password" type="password" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="passwordRepeat">Powtórz nowe hasło: </label>
                    <input id="passwordRepeat" type="password" />
                </div>
                <button type="submit" onClick={(e) => handleSubmit(e)}>Zresetuj hasło</button>
            </form>
        </div>
    )
}