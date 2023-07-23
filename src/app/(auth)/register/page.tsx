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
        const {
            email,
            password,
            passwordRepeat,
            firstName,
            lastName,
            companyName,
            country,
            region,
            adress,
            postalCode,
            city,
            phone,
            NIP,
        } = document.getElementById("form") as HTMLFormElement;
        const userData = {
            email: email.value as string,
            password: password.value as string,
            passwordRepeat: passwordRepeat.value as string,
            firstName: firstName.value as string,
            lastName: lastName.value as string,
            companyName: companyName.value as string,
            country: country.value as string,
            region: region.value as string,
            adress: adress.value as string,
            postalCode: postalCode.value as string,
            city: city.value as string,
            phone: phone.value as string,
            NIP: NIP.value as string,
        } as Record<string, string>;

        for (const key in userData) {
            if (userData[key] == "") {
                alert("Wypełnij wszystkie pola!");
                return;
            }
        }

        if (userData.password != userData.passwordRepeat) {
            alert("Hasła nie są takie same!");
            return;
        }

        if (userData.password.length < 8) {
            alert("Hasło jest za krótkie!");
            return;
        }

        if (userData.password.length > 64) {
            alert("Hasło jest za długie!");
            return;
        }

        if (!userData.email.includes("@")) {
            alert("Email jest niepoprawny!");
            return;
        }

        let { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
        });

        // let { data, error } = { data: { user: { id: "1" } }, error: null as any };

        if (error) {
            alert(error.message);
            return;
        }

        if (data) {
            // const res = await fetch("/api/register", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         user_id: data.user?.id,
            //         first_name: userData.firstName,
            //         last_name: userData.lastName,
            //         company_name: userData.companyName,
            //         country: userData.country,
            //         region: userData.region,
            //         adress: userData.adress,
            //         postal_code: userData.postalCode,
            //         city: userData.city,
            //         phone: userData.phone,
            //         NIP: userData.NIP,
            //         eu: lang == "2" ? (userData.country == "Polska" ? false : true) : false,
            //     }),
            // });

            // if (res.status != 200) {
            //     alert("Wystąpił błąd, spróbuj ponownie później!");
            //     return;
            // }

            const { data: { user } } = await supabase.auth.getUser()
            console.log(user) // potwierdzenie maila i wtedy uzupelnienie info

            // let res = await supabase.from("profiles").insert({
            //     user_id: data.user?.id,
            //     first_name: userData.firstName,
            //     last_name: userData.lastName,
            //     company_name: userData.companyName,
            //     country: userData.country,
            //     region: userData.region,
            //     adress: userData.adress,
            //     postal_code: userData.postalCode,
            //     city: userData.city,
            //     phone: userData.phone,
            //     NIP: userData.NIP,
            //     eu: lang == "2" ? (userData.country == "Polska" ? false : true) : false,
            // });

            // if (res.error) {
            //     alert(res.error.message);
            //     return;
            // }


            alert("Zarejestrowano pomyślnie! Potwierdź swój adres email!");
            // window.location.href = `/?cup=${cup}&lang=${lang}`;
            return;
            // const { error } = await supabase.from("users").insert([
            //     {
            //         user_id: data.user?.id,
            //         first_name: userData.firstName,
            //         last_name: userData.lastName,
            //         company_name: userData.companyName,
            //         country: userData.country,
            //         region: userData.region,
            //         adress: userData.adress,
            //         postal_code: userData.postalCode,
            //         city: userData.city,
            //         phone: userData.phone,
            //         NIP: userData.NIP,
            //         eu: lang == "2" ? (userData.country == "Polska" ? false : true) : false,
            //     },
            // ]);

            // if (error) {
            //     alert(error.message);
            //     return;
            // }

            // alert("Zarejestrowano pomyślnie! Potwierdź swój adres email!");
            // window.location.href = `/?cup=${cup}&lang=${lang}`;
            // return;
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
                    <label htmlFor="password">Hasło: </label>
                    <input id="password" type="password" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="passwordRepeat">Powtórz hasło: </label>
                    <input id="passwordRepeat" type="password" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="firstName">Imię: </label>
                    <input id="firstName" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="lastName">Nazwisko: </label>
                    <input id="lastName" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="companyName">Nazwa firmy: </label>
                    <input id="companyName" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="country">Kraj: </label>
                    <input id="country" type="text" defaultValue={lang == "1" ? "Polska" : ""} />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="region">Województwo: </label>
                    <input id="region" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="adress">Adres: </label>
                    <input id="adress" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="postalCode">Kod pocztowy: </label>
                    <input id="postalCode" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="city">Miejscowość: </label>
                    <input id="city" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="phone">Telefon: </label>
                    <input id="phone" type="tel" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="NIP">NIP: </label>
                    <input id="NIP" type="text" />
                </div>
                <button type="submit" onClick={(e) => handleSubmit(e)}>
                    Zarejestruj
                </button>
            </form>
        </div>
    );
}
