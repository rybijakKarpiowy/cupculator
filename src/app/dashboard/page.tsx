import { DashboardPages } from "@/components/dashboardPages";
import { Database } from "@/database/types";
import { SupabaseClient, createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getData = async (supabase: SupabaseClient<any, "public", any>) => {
    const authUser = (await supabase.auth.getUser()).data.user

    const res = await fetch("http://localhost:3000/api/dashboard", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: authUser?.id }),
    });

    if (!res.ok) {
        alert("Error");
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

    return { user };
};

export default async function Dashboard({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const lang = searchParams?.lang || "1";
    const cup = searchParams?.cup || "";

    const supabase = createServerComponentClient<Database>({cookies});

    const { user, clients, adminsAndSalesmen } = await getData(supabase);

    return (
        <DashboardPages user={user} clients={clients} adminsAndSalesmen={adminsAndSalesmen} />
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
