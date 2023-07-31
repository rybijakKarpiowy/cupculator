import { DashboardPages } from "@/components/dashboardPages";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";
import { User as AuthUser } from "@supabase/supabase-js"

const getUserData = async (authUser: AuthUser, lang: string, cup: string) => {

    const res = await fetch("http://localhost:3000/api/dashboard", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: authUser?.id }),
    });

    if (!res.ok) {
        alert("Something went wrong");
    }

    const { userInfo, clients, adminsAndSalesmen } : {userInfo: any, clients: Client[], adminsAndSalesmen: Client[]} = await res.json();

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
    return
};

const getPricings = async (authUser: AuthUser) => {
    const res = await fetch("http://localhost:3000/api/pricings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: authUser?.id }),
    });

    if (!res.ok) {
        console.log("Something went wrong (no pricings)")
        return { available_cup_pricings: [], available_color_pricings: [] };
    }

    const { available_cup_pricings, available_color_pricings } = await res.json();

    return { available_cup_pricings, available_color_pricings };
}

export default async function Dashboard({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const lang = searchParams?.lang || "1";
    const cup = searchParams?.cup || "";

    const supabase = createServerComponentClient<Database>({cookies});
    const authUser = (await supabase.auth.getUser()).data.user

    if (!authUser) {
        window.location.href = `/?lang=${lang}&cup=${cup}`;
        return;
    }

    const userData = await getUserData(authUser, lang, cup) as { user: User, clients: Client[], adminsAndSalesmen?: Client[] };
    const { user, clients, adminsAndSalesmen } = userData;

    const pricings = await getPricings(authUser);
    const { available_color_pricings, available_cup_pricings } = pricings;

    return (
        <DashboardPages user={user} clients={clients} adminsAndSalesmen={adminsAndSalesmen} available_color_pricings={available_color_pricings} available_cup_pricings={available_cup_pricings} />
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
