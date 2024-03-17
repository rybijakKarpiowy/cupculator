import { redirect } from "next/navigation";


export const dynamic = "force-dynamic";

export default async function Dashboard({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const lang = searchParams?.lang || "1";
    const cup = searchParams?.cup?.trim().replaceAll(" ", "_") || "";

    redirect(`/dashboard/activationRequests?lang=${lang}&cup=${cup}`);
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
