export const validateInfo = ({
    eu,
    first_name,
    last_name,
    company_name,
    adress,
    postal_code,
    city,
    region,
    phone,
    NIP,
    country,
    email,
}: {
    eu: boolean;
    first_name: string;
    last_name: string;
    company_name: string;
    adress: string;
    postal_code: string;
    city: string;
    region: string;
    phone: string;
    NIP: string;
    country: string;
    email: string;
}) => {
    // name and surname validation
    if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(first_name)) {
        return "Niepoprawne imię";
    }
    if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(last_name)) {
        return "Niepoprawne nazwisko";
    }
    // country validation
    if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(country)) {
        return "Niepoprawny kraj";
    }
    // region validation
    if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(region) && !eu) {
        return "Niepoprawny region";
    }
    // postal code validation
    if (!/^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/gi.test(postal_code)) {
        return "Niepoprawny kod pocztowy";
    }
    // city validation
    if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/g.test(city)) {
        return "Niepoprawna nazwa miasta";
    }
    // phone validation
    if (!/^[0-9+ ]+$/g.test(phone)) {
        return "Niepoprawny numer telefonu";
    }
    // NIP validation
    if (!/^[A-Z]{2}[0-9 ]+$/g.test(NIP) || (NIP.length !== 12 && !eu)) {
        return "Niepoprawny numer NIP";
    }
    // email validation
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g.test(email)) {
        return "Niepoprawny adres email";
    }

    return null;
};
