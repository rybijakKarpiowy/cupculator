'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";

export default function Recovery() {
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");
    
    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `http://localhost:3000/resetpassword?cup=${cup}&lang=${lang}`,
        })

        if (error) {
            alert(error.message)
        }

        if (data) {
            alert("Wysłano link do zresetowania hasła!")
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
                <button type="submit" onClick={(e) => handleSubmit(e)}>{lang === "1" ? "Zresetuj hasło" : "Reset password"}</button>
            </form>
        </div>
    )
}