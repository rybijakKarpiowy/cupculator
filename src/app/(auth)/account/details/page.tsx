"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";

export default function AccountDetails() {
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const {
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
                alert(`${lang === "1" ? "Wypełnij wszystkie pola!" : "Fill in all fields!"}`);
                return;
            }
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert(`${lang === "1" ? "Nie jesteś zalogowany!" : "You are not logged in!"}`);
            window.location.href = `/login?cup=${cup}&lang=${lang}`;
            return;
        }

        const { data: userDataCheck } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", user?.id);

        if (userDataCheck && userDataCheck.length > 0) {
            alert("Dane zostały już wprowadzone!");
            window.location.href = `/?cup=${cup}&lang=${lang}`;
            return;
        }

        const { error } = await supabase.from("users").upsert(
            {
                user_id: user?.id,
                email: user?.email,
                first_name: userData.firstName,
                last_name: userData.lastName,
                company_name: userData.companyName,
                country: userData.country,
                region: userData.region,
                adress: userData.adress,
                postal_code: userData.postalCode,
                city: userData.city,
                phone: userData.phone,
                NIP: userData.NIP,
                eu: lang == "2" ? (userData.country == "Polska" ? false : true) : false,
            },
            { onConflict: "user_id" }
        );

        if (error) {
            alert(error.message);
            return;
        }

        const res = await fetch("/api/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user?.id,
            }),
        });

        if (!res.ok) {
            alert(`${lang === "1" ? "Wystąpił błąd, spróbuj ponownie później!" : "An error occurred, try again later!"}`);
            return;
        }

        alert(`${lang === "1" ? "Wprowadzono dane!" : "Data entered!"}`);
        window.location.href = `/?cup=${cup}&lang=${lang}`;
    };

    return (
        <div>
            <form className="flex flex-col content-center" id="form">
                <div className="flex flex-row justify-center">
                    <label htmlFor="firstName">{lang === "1" ? "Imię: " : "First name: "}</label>
                    <input id="firstName" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="lastName">{lang === "1" ? "Nazwisko: " : "Last name: "}</label>
                    <input id="lastName" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="companyName">{lang === "1" ? "Nazwa firmy: " : "Company name: "}</label>
                    <input id="companyName" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="country">{lang === "1" ? "Kraj: " : "Country: "}</label>
                    <input id="country" type="text" defaultValue={lang == "1" ? "Polska" : ""} />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="region">{lang === "1" ? "Województwo: " : "Region: "}</label>
                    <input id="region" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="adress">{lang === "1" ? "Adres: " : "Address: "}</label>
                    <input id="adress" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="postalCode">{lang === "1" ? "Kod pocztowy: " : "Postal code: "}</label>
                    <input id="postalCode" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="city">{lang === "1" ? "Miejscowość: " : "City: "}</label>
                    <input id="city" type="text" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="phone">{lang === "1" ? "Telefon: " : "Phone number: "}</label>
                    <input id="phone" type="tel" />
                </div>
                <div className="flex flex-row justify-center">
                    <label htmlFor="NIP">{lang === "1" ? "NIP: " : "Taxpayer identification number: "}</label>
                    <input id="NIP" type="text" />
                </div>
                <button type="submit" onClick={(e) => handleSubmit(e)}>
                    {lang === "1" ? "Zarejestruj" : "Sign up"}
                </button>
            </form>
        </div>
    );
}
