"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AccountDetails() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup");

    const supabase = createClientComponentClient();

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        setLoading(true);
        event.preventDefault();
        const {
            firstName,
            lastName,
            companyName,
            country,
            region,
            adress,
            postalCodeprefix,
            postalCode,
            city,
            phone,
            NIPprefix,
            NIP,
        } = document.getElementById("form") as HTMLFormElement;

        const userData = {
            firstName: firstName.value.trim() as string,
            lastName: lastName.value.trim() as string,
            companyName: companyName.value.trim() as string,
            country: country.value.trim() as string,
            region: region.value.trim() as string,
            adress: adress.value.trim() as string,
            postalCodeprefix: postalCodeprefix.value.trim() as string,
            postalCode: postalCode.value.trim() as string,
            city: city.value.trim() as string,
            phone: phone.value.trim() as string,
            NIPprefix: (NIPprefix.value.trim() as string).toUpperCase(),
            NIP: NIP.value.trim() as string,
        } as Record<string, string>;

        for (const key in userData) {
            if (userData[key] == "") {
                alert(`${lang === "1" ? "Uzupełnij wszystkie pola!" : "Fill in all fields!"}`);
                setLoading(false);
                return;
            }
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert(`${lang === "1" ? "Nie jesteś zalogowany!" : "You are not logged in!"}`);
            window.location.href = `/login?cup=${cup}&lang=${lang}`;
            setLoading(false);
            return;
        }

        // name and surname validation
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.firstName)) {
            alert(
                `${lang === "1" ? "Niepoprawne imię!" : "Invalid name! Remove special characters"}`
            );
            setLoading(false);
            return;
        }
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.lastName)) {
            alert(
                `${
                    lang === "1"
                        ? "Niepoprawne nazwisko!"
                        : "Invalid surname! Remove special characters"
                }`
            );
            setLoading(false);
            return;
        }
        // country validation
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.country)) {
            alert(
                `${
                    lang === "1"
                        ? "Niepoprawny kraj!"
                        : "Invalid country! Remove special characters"
                }`
            );
            setLoading(false);
            return;
        }
        // region validation
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.region)) {
            alert(
                `${
                    lang === "1"
                        ? "Niepoprawny region!"
                        : "Invalid region! Remove special characters"
                }`
            );
            setLoading(false);
            return;
        }
        // postal code validation
        if (!/^[0-9 ]+$/g.test(userData.postalCodeprefix) || !/^[0-9 ]+$/g.test(userData.postalCode)) {
            alert(`${lang === "1" ? "Niepoprawny kod pocztowy!" : "Invalid postal code!"}`);
            setLoading(false);
            return;
        }
        // city validation
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.city)) {
            alert(
                `${
                    lang === "1"
                        ? "Niepoprawna miejscowość!"
                        : "Invalid city! Remove special characters"
                }`
            );
            setLoading(false);
            return;
        }
        // phone validation
        if (!/^[0-9+ ]+$/g.test(userData.phone)) {
            console.log(userData.phone)
            alert(`${lang === "1" ? "Niepoprawny numer telefonu!" : "Invalid phone number!"}`);
            setLoading(false);
            return;
        }
        // NIP validation
        if (!/^[A-Z ]+$/g.test(userData.NIPprefix)) {
            alert(`${lang === "1" ? "Niepoprawny prefiks NIP!" : "Invalid NIP prefix!"}`);
            setLoading(false);
            return;
        }
        if (!/^[0-9 ]+$/g.test(userData.NIP)) {
            alert(`${lang === "1" ? "Niepoprawny NIP!" : "Invalid NIP!"}`);
            setLoading(false);
            return;
        }

        const { data: userDataCheck } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", user?.id);

        if (userDataCheck && userDataCheck.length > 0) {
            alert("Dane zostały już wprowadzone!");
            window.location.href = `/?cup=${cup}&lang=${lang}`;
            setLoading(false);
            return;
        }

        const eu = userData.NIPprefix === "PL" ? false : true;

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
                postal_code: userData.postalCodeprefix + "-" + userData.postalCode,
                city: userData.city,
                phone: userData.phone,
                NIP: userData.NIPprefix + userData.NIP,
                eu: eu,
            },
            { onConflict: "user_id" }
        );

        if (error) {
            alert(error.message);
            setLoading(false);
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
            alert(
                `${
                    lang === "1"
                        ? "Wystąpił błąd, spróbuj ponownie później!"
                        : "An error occurred, try again later!"
                }`
            );
            setLoading(false);
            return;
        }

        alert(`${lang === "1" ? "Wprowadzono dane!" : "Data entered!"}`);
        window.location.href = `/?cup=${cup}&lang=${lang}`;
        setLoading(false);
    };

    return (
        <div className="pt-24">
            <form className="flex flex-col content-center gap-4" id="form">
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="firstName" className="text-lg">
                        {lang === "1" ? "Imię: " : "First name: "}
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="lastName" className="text-lg">
                        {lang === "1" ? "Nazwisko: " : "Last name: "}
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="companyName" className="text-lg">
                        {lang === "1" ? "Nazwa firmy: " : "Company name: "}
                    </label>
                    <input
                        id="companyName"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="country" className="text-lg">
                        {lang === "1" ? "Kraj: " : "Country: "}
                    </label>
                    <input
                        id="country"
                        type="text"
                        defaultValue={lang == "1" ? "Polska" : ""}
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="region" className="text-lg">
                        {lang === "1" ? "Województwo: " : "Region: "}
                    </label>
                    <input
                        id="region"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="adress" className="text-lg">
                        {lang === "1" ? "Adres: " : "Address: "}
                    </label>
                    <input
                        id="adress"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-3">
                    <label htmlFor="postalCodeprefix" className="text-lg">
                        {lang === "1" ? "Kod pocztowy: " : "Postal code: "}
                    </label>
                    <input
                        id="postalCodeprefix"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-36 rounded-md ml-1"
                        disabled={loading}
                    />
                    <span className="text-2xl w-2">-</span>
                    <input
                        id="postalCode"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-36 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="city" className="text-lg">
                        {lang === "1" ? "Miejscowość: " : "City: "}
                    </label>
                    <input
                        id="city"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="phone" className="text-lg">
                        {lang === "1" ? "Telefon: " : "Phone number: "}
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-row justify-end pr-[42%] items-center gap-2">
                    <label htmlFor="NIP" className="text-lg mr-2">
                        {lang === "1" ? "NIP: " : "Taxpayer identification number: "}
                    </label>
                    <input
                        defaultValue={lang == "1" ? "PL" : ""}
                        id="NIPprefix"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-14 rounded-md"
                        disabled={loading}
                    />
                    <input
                        id="NIP"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-64 rounded-md"
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
                        {lang === "1" ? "Wyślij" : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
