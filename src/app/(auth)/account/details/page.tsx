"use client";

import { Database } from "@/database/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AccountDetails() {
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup")?.trim().replaceAll(" ", "_");
    const error_description = searchParams.get("error_description");

    useEffect(() => {
        if (loading) document.body.style.cursor = "wait";
        else document.body.style.cursor = "default";
    }, [loading]);

    if (error_description === "No associated flow state found. 400: Flow state is expired") {
        toast.error(
            `${
                lang === "1"
                    ? "Sesja wygasła! Zarejestruj się ponownie"
                    : "Session expired! Sign up again"
            }`,
            { autoClose: 3000 }
        );
        setTimeout(() => (window.location.href = `/register?cup=${cup}&lang=${lang}`), 3000);
    }

    const supabase = createClientComponentClient<Database>();

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
            region:
                lang !== "1" && (!region || !region.value) ? "-" : (region.value.trim() as string),
            adress: adress.value.trim() as string,
            postalCode: postalCode.value.trim() as string,
            city: city.value.trim() as string,
            phone: phone.value.trim() as string,
            NIPprefix: (NIPprefix.value.trim() as string).toUpperCase(),
            NIP: NIP.value.trim() as string,
        } as {
            firstName: string;
            lastName: string;
            companyName: string;
            country: string;
            region: string;
            adress: string;
            postalCode: string;
            city: string;
            phone: string;
            NIPprefix: string;
            NIP: string;
        };

        for (const key in userData) {
            // @ts-ignore
            if (userData[key] == "") {
                if (key === "region" && lang === "2") continue;
                toast.warn(`${lang === "1" ? "Uzupełnij wszystkie pola!" : "Fill in all fields!"}`);
                setLoading(false);
                return;
            }
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            toast.error(`${lang === "1" ? "Nie jesteś zalogowany!" : "You are not logged in!"}`, {
                autoClose: 1000,
            });
            setTimeout(() => (window.location.href = `/login?cup=${cup}&lang=${lang}`), 1000);
            setLoading(false);
            return;
        }

        // name and surname validation
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.firstName)) {
            toast.warn(
                `${lang === "1" ? "Niepoprawne imię!" : "Invalid name! Remove special characters"}`
            );
            setLoading(false);
            return;
        }
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.lastName)) {
            toast.warn(
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
            toast.warn(
                `${
                    lang === "1"
                        ? "Niepoprawny kraj!"
                        : "Invalid country! Remove special characters"
                }`
            );
            setLoading(false);
            return;
        }

        if (lang === "1" && userData.country !== "Polska") {
            toast.warn(
                "Formularz dla klientów z poza Polski pojawi się po kliknięciu flagi Wielkiej Brytanii (prawy górny róg)"
            );
            setLoading(false);
            return;
        }

        if (lang === "2" && userData.country === "Polska") {
            toast.warn(
                "Form for customers from Poland will appear after clicking the flag of Poland (top right corner)"
            );
            setLoading(false);
            return;
        }
        // region validation
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.region) && lang === "1") {
            toast.warn("Niepoprawne województwo!");
            setLoading(false);
            return;
        }
        // postal code validation
        if (!/^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/gi.test(userData.postalCode)) {
            toast.warn(`${lang === "1" ? "Niepoprawny kod pocztowy!" : "Invalid postal code!"}`);
            setLoading(false);
            return;
        }
        // city validation
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(userData.city)) {
            toast.warn(
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
            toast.warn(`${lang === "1" ? "Niepoprawny numer telefonu!" : "Invalid phone number!"}`);
            setLoading(false);
            return;
        }
        // NIP validation
        if (!/^[A-Z ]+$/g.test(userData.NIPprefix)) {
            toast.warn(`${lang === "1" ? "Niepoprawny prefiks NIP!" : "Invalid NIP prefix!"}`);
            setLoading(false);
            return;
        }

        const eu = userData.NIPprefix === "PL" ? false : true;

        if (!/^[0-9 ]+$/g.test(userData.NIP) || (userData.NIP.length !== 10 && !eu)) {
            toast.warn(`${lang === "1" ? "Niepoprawny NIP!" : "Invalid NIP!"}`);
            setLoading(false);
            return;
        }

        await fetch("/api/userdatacheck", {
            method: "GET",
        });

        const completeAccDetailsRes = await fetch("/api/completeaccdetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: user?.email as string,
                first_name: userData.firstName,
                last_name: userData.lastName,
                company_name: userData.companyName,
                country: userData.country,
                region: userData.region,
                adress: userData.adress,
                postal_code: userData.postalCode,
                city: userData.city,
                phone: userData.phone,
                NIP: userData.NIPprefix + userData.NIP,
                eu: eu,
            }),
        });

        if (!completeAccDetailsRes.ok) {
            console.log(await completeAccDetailsRes.text());
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

        const res = await fetch("/api/createuser", {
            method: "GET",
        });

        if (!res.ok) {
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

        toast.success(
            `${
                lang === "1"
                    ? "Drogi Kliencie, Otrzymaliśmy Twojego maila z prośbą o założenie konta i dostęp do kalkulatora. W kolejnym mailu otrzymasz potwierdzenie aktywacji."
                    : "Dear Client, We received your request to get an account and access to the calculator. Expect our confirmation of registration in next upcoming mail from us."
            }`
        );
        setTimeout(() => (window.location.href = `/?cup=${cup}&lang=${lang}`), 5500);
        setLoading(false);
    };

    return (
        <div className="pt-24">
            <form className="flex flex-col content-center gap-4" id="form">
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
                <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                    <label htmlFor="country" className="text-lg">
                        {lang === "1" ? "Kraj: " : "Country: "}
                    </label>
                    <select
                        id="country"
                        defaultValue={lang === "1" ? "Polska" : ""}
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-[5.5px] w-80 rounded-md"
                        disabled={loading}
                        onClick={(e) => {
                            if (lang === "1") {
                                toast.warn(
                                    "Formularz dla klientów z poza Polski pojawi się po kliknięciu flagi Wielkiej Brytanii (prawy górny róg)"
                                );
                                (e.target as HTMLInputElement).value = "Polska";
                                (e.target as HTMLInputElement).blur();
                                return;
                            }
                        }}
                        onChange={(e) => {
                            if (e.target.value !== "Polska" && lang === "1") {
                                toast.warn(
                                    "Formularz dla klientów z poza Polski pojawi się po kliknięciu flagi Wielkiej Brytanii (prawy górny róg)"
                                );
                                e.target.value = "Polska";
                                return;
                            }
                            if (e.target.value === "Polska" && lang === "2") {
                                toast.warn(
                                    "Form for customers from Poland will appear after clicking the flag of Poland (top right corner)"
                                );
                                e.target.value = "";
                                return;
                            }
                            (document.getElementById("NIPprefix") as HTMLInputElement).value =
                                Country[e.target.value as keyof typeof Country];
                        }}
                    >
                        <option value="" disabled hidden>
                            {lang === "1" ? "Wybierz kraj" : "Select country"}
                        </option>
                        <option value="Polska">{lang === "1" ? "Polska" : "Poland"}</option>
                        {lang !== "1" && (
                            <>
                                <option value="Albania">Albania</option>
                                <option value="Księstwo Andory">Andorra</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbejdżan">Azerbaijan</option>
                                <option value="Białoruś">Belarus</option>
                                <option value="Belgia">Belgium</option>
                                <option value="Bośnia i Hercegowina">Bosnia and Herzegovina</option>
                                <option value="Bułgaria">Bulgaria</option>
                                <option value="Chorwacja">Croatia</option>
                                <option value="Cypr">Cyprus</option>
                                <option value="Czechy">Czech Republic</option>
                                <option value="Dania">Denmark</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Finlandia">Finland</option>
                                <option value="Francja">France</option>
                                <option value="Gruzja">Georgia</option>
                                <option value="Niemcy">Germany</option>
                                <option value="Grecja">Greece</option>
                                <option value="Węgry">Hungary</option>
                                <option value="Islandia">Iceland</option>
                                <option value="Irladnia">Ireland</option>
                                <option value="Włochy">Italy</option>
                                <option value="Jordania">Jordan</option>
                                <option value="Kosowo">Kosovo</option>
                                <option value="Kuwejt">Kuwait</option>
                                <option value="Łotwa">Latvia</option>
                                <option value="Liechtenstein">Liechtenstein</option>
                                <option value="Litwa">Lithuania</option>
                                <option value="Luksemburg">Luxembourg</option>
                                <option value="Macedonia">Macedonia</option>
                                <option value="Malta">Malta</option>
                                <option value="Mołdawia">Moldova</option>
                                <option value="Monako">Monaco</option>
                                <option value="Montenegro">Montenegro</option>
                                <option value="Niderlandy">Netherlands</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Norwegia">Norway</option>
                                <option value="Portugalia">Portugal</option>
                                <option value="Katar">Qatar</option>
                                <option value="Rumunia">Romania</option>
                                <option value="Rosja">Russia</option>
                                <option value="San Marino">San Marino</option>
                                <option value="Arabia Saudyjska">Saudi Arabia</option>
                                <option value="Senegal">Senegal</option>
                                <option value="Serbia">Serbia</option>
                                <option value="Słowacja">Slovakia</option>
                                <option value="Słowenia">Slovenia</option>
                                <option value="Hiszpania">Spain</option>
                                <option value="Szwecja">Sweden</option>
                                <option value="Szwajcaria">Switzerland</option>
                                <option value="Trynidad i Tobago">Trinidad and Tobago</option>
                                <option value="Turcja">Turkey</option>
                                <option value="Ukraina">Ukraine</option>
                                <option value="Zjednoczone Emiraty Arabskie">
                                    United Arab Emirates
                                </option>
                                <option value="Wielka Brytania">United Kingdom</option>
                                <option value="Watykan">Vatican City</option>
                            </>
                        )}
                    </select>
                </div>
                {lang === "1" && (
                    <div className="flex flex-row justify-end pr-[42%] items-center gap-4">
                        <label htmlFor="region" className="text-lg">
                            Województwo:
                        </label>
                        <select
                            id="region"
                            className="border border-[#bbb] bg-slate-50 text-black px-2 py-[5.5px] w-80 rounded-md"
                            disabled={loading}
                            defaultValue=""
                        >
                            <option value="" disabled hidden>
                                Wybierz województwo
                            </option>
                            <option value="Dolnośląskie">Dolnośląskie</option>
                            <option value="Kujawsko-pomorskie">Kujawsko-pomorskie</option>
                            <option value="Lubelskie">Lubelskie</option>
                            <option value="Lubuskie">Lubuskie</option>
                            <option value="Łódzkie">Łódzkie</option>
                            <option value="Małopolskie">Małopolskie</option>
                            <option value="Mazowieckie">Mazowieckie</option>
                            <option value="Opolskie">Opolskie</option>
                            <option value="Podkarpackie">Podkarpackie</option>
                            <option value="Podlaskie">Podlaskie</option>
                            <option value="Pomorskie">Pomorskie</option>
                            <option value="Śląskie">Śląskie</option>
                            <option value="Świętokrzyskie">Świętokrzyskie</option>
                            <option value="Warmińsko-mazurskie">Warmińsko-mazurskie</option>
                            <option value="Wielkopolskie">Wielkopolskie</option>
                            <option value="Zachodniopomorskie">Zachodniopomorskie</option>
                        </select>
                    </div>
                )}
                <div className="flex flex-row justify-end pr-[42%] items-center gap-3">
                    <label htmlFor="postalCodeprefix" className="text-lg">
                        {lang === "1" ? "Kod pocztowy: " : "Postal code: "}
                    </label>
                    <input
                        id="postalCode"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-80 rounded-md"
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

                <div className="flex flex-row justify-end pr-[42%] items-center gap-2">
                    <label htmlFor="NIP" className="text-lg mr-2">
                        {lang === "1" ? "NIP: " : "VAT identification number: "}
                    </label>
                    <input
                        defaultValue={lang == "1" ? "PL" : ""}
                        id="NIPprefix"
                        type="text"
                        className="border border-[#bbb] bg-slate-50 text-black px-2 py-1 w-14 rounded-md"
                        disabled
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
                        className={`border-[#c00418] border rounded-[25px] w-fit px-4 py-2 text-black ${
                            loading ? "bg-slate-400" : "bg-white hover:bg-[#c00418]"
                        } hover:text-white duration-150 ease-in-out`}
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

enum Country {
    "Polska" = "PL",
    "Albania" = "AL",
    "Księstwo Andory" = "AD",
    "Armenia" = "AM",
    "Austria" = "AT",
    "Azerbejdżan" = "AZ",
    "Białoruś" = "BY",
    "Belgia" = "BE",
    "Bośnia i Hercegowina" = "BA",
    "Bułgaria" = "BG",
    "Chorwacja" = "HR",
    "Cypr" = "CY",
    "Czechy" = "CZ",
    "Dania" = "DK",
    "Estonia" = "EE",
    "Finlandia" = "FI",
    "Francja" = "FR",
    "Gruzja" = "GE",
    "Niemcy" = "DE",
    "Grecja" = "EL",
    "Węgry" = "HU",
    "Islandia" = "IS",
    "Irladnia" = "IE",
    "Włochy" = "IT",
    "Jordania" = "JO",
    "Kosowo" = "XK",
    "Kuwejt" = "KW",
    "Łotwa" = "LV",
    "Liechtenstein" = "LI",
    "Litwa" = "LT",
    "Luksemburg" = "LU",
    "Macedonia" = "MK",
    "Malta" = "MT",
    "Mołdawia" = "MD",
    "Monako" = "MC",
    "Montenegro" = "ME",
    "Niderlandy" = "NL",
    "Nigeria" = "NG",
    "Norwegia" = "NO",
    "Portugalia" = "PT",
    "Katar" = "QA",
    "Rumunia" = "RO",
    "Rosja" = "RU",
    "San Marino" = "SM",
    "Arabia Saudyjska" = "SA",
    "Senegal" = "SN",
    "Serbia" = "XS",
    "Słowacja" = "SK",
    "Słowenia" = "SI",
    "Hiszpania" = "ES",
    "Szwecja" = "SE",
    "Szwajcaria" = "CH",
    "Trynidad i Tobago" = "TT",
    "Turcja" = "TR",
    "Ukraina" = "UA",
    "Zjednoczone Emiraty Arabskie" = "AE",
    "Wielka Brytania" = "GB",
    "Watykan" = "VA",
}
