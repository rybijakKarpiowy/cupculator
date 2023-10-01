import { DashboardPages } from "@/components/dashboardPages";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";
import { User as AuthUser, PostgrestError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Restriction } from "@/lib/checkRestriction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";

export const dynamic = "force-dynamic";

const getUserData = async (authUser: AuthUser, lang: string, cup: string) => {
    const res = await fetch(`${baseUrl}/api/dashboard`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth_id: authUser?.id, key: process.env.SERVER_KEY }),
    });

    if (!res.ok) {
        throw new Error("Something went wrong (no user data)");
    }

    const {
        userInfo,
        clients,
        adminsAndSalesmen,
    }: { userInfo: any; clients: Client[]; adminsAndSalesmen: Client[] } = await res.json();

    const user = {
        ...userInfo,
        email: authUser?.email,
    } as User;

    if (user.role === "Admin") {
        return { user, clients, adminsAndSalesmen };
    }

    if (user.role === "Salesman") {
        return { user, clients };
    }

    window.location.href = `/?lang=${lang}&cup=${cup}`;
    return;
};

const getPricings = async (authUser: AuthUser) => {
    const res = await fetch(`${baseUrl}/api/pricings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth_id: authUser?.id, key: process.env.SERVER_KEY }),
    });

    if (!res.ok) {
        console.log("Something went wrong (no pricings)");
        return { available_cup_pricings: [], available_color_pricings: [] };
    }

    const { available_cup_pricings, available_color_pricings } = await res.json();

    return { available_cup_pricings, available_color_pricings };
};

export default async function Dashboard({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const lang = searchParams?.lang || "1";
    const cup = searchParams?.cup?.trim().replaceAll(" ", "_") || "";

    const supabase = createServerComponentClient<Database>({ cookies });
    const authUser = (await supabase.auth.getUser()).data.user;

    if (!authUser) {
        window.location.href = `/?lang=${lang}&cup=${cup}`;
        return;
    }

    const { e, ...userData } = (await getUserData(authUser, lang, cup).catch((e) => {
        return { e };
    })) as { e?: any; user: User; clients: Client[]; adminsAndSalesmen?: Client[] };
    if (e || !userData) {
        redirect(`/?lang=${lang}&cup=${cup}`);
    }

    const { user, clients, adminsAndSalesmen } = userData;

    const pricings = await getPricings(authUser);
    const { available_color_pricings, available_cup_pricings } = pricings;

    const { data: additionalValues, error } = await pgsql.query.additional_values
        .findFirst()
        .then((data) => ({ data, error: null }))
        .catch((e) => ({ data: null, error: e }));
    if (error) {
        console.log(error);
        redirect(`/?lang=${lang}&cup=${cup}`);
    }

    const { data: restrictions, error: error2 } = await pgsql.query.restrictions
        .findMany()
        .then(
            (data) =>
                ({
                    data: data.sort((a, b) => a.imprintType.localeCompare(b.imprintType)),
                    error: null,
                } as { data: Restriction[]; error: null })
        )
        .catch((error) => ({ data: null, error }));
    if (error2 || !restrictions) {
        toast.error("Coś poszło nie tak (brak wykluczeń)", {
            autoClose: 3000,
        });
        setTimeout(() => {
            redirect(`/?lang=${lang}&cup=${cup}`);
        }, 3000);
        return;
    }

    // get products tab data
    const { data: productsCard, error: productsCardError } = await pgsql.query.cups
        .findMany()
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));
    if (productsCardError || !productsCard) {
        toast.error("Coś poszło nie tak (brak produktów)", {
            autoClose: 3000,
        });
        setTimeout(() => {
            redirect(`/?lang=${lang}&cup=${cup}`);
        }, 3000);
        return;
    }

    // Get scrapers data
    const { data: scrWarehouses, error: scrWarehousesError } = await pgsql.query.cups
        .findMany({
            columns: {
                id: true,
                code: true,
            },
            with: {
                scraped_warehouses: {
                    columns: {
                        provider: true,
                        code_link: true,
                    },
                },
            },
        })
        .then((data) => {
            const renamedData = data
                .map((item) => ({
                    cup_id: item.id,
                    cup_code: item.code,
                    scrapers: item.scraped_warehouses,
                }))
                .sort((a, b) => a.cup_code.localeCompare(b.cup_code));
            return { data: renamedData, error: null };
        })
        .catch((error) => ({ data: null, error }));

    if (scrWarehousesError || !scrWarehouses) {
        toast.error("Coś poszło nie tak (brak scraperow)", {
            autoClose: 3000,
        });
        setTimeout(() => {
            redirect(`/?lang=${lang}&cup=${cup}`);
        }, 3000);
        return;
    }

    return (
        <DashboardPages
            user={user}
            clientsInput={clients}
            adminsAndSalesmenInput={adminsAndSalesmen}
            available_color_pricings={available_color_pricings}
            available_cup_pricings={available_cup_pricings}
            additionalValues={additionalValues!}
            restrictions={restrictions}
            productsCard={productsCard}
            scrapersDataFinal={scrWarehouses}
        />
    );
}

export interface User {
    user_id: string;
    email: string;
    activated?: boolean | undefined;
    color_pricing?: string | null | undefined;
    cup_pricing?: string | null | undefined;
    role: "User" | "Salesman" | "Admin";
}

export interface Client {
    activated?: boolean | undefined;
    color_pricing?: string | null | undefined;
    cup_pricing?: string | null | undefined;
    salesman_id: string | null;
    warehouse_acces: "None" | "Actual" | "Fictional" | null;
    role: "User" | "Salesman" | "Admin";
    email: string;
    user_id: string;
    adress: string;
    city: string;
    company_name: string;
    country: string;
    eu: boolean;
    first_name: string;
    last_name: string;
    NIP: string;
    phone: string;
    postal_code: string;
    region: string;
}
