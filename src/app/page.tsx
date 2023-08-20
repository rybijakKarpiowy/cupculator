import { Calculator } from "@/components/calculator/calculator";
import { UserSelector } from "@/components/calculator/userSelector";
import { Database } from "@/database/types";
import { getUserPricings } from "@/lib/getUserPricings";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

export default async function Home({
    searchParams,
}: {
    params: {};
    searchParams: { cup: string; lang: string };
}) {
    const lang = searchParams.lang || "1";
    const cup = searchParams.cup as string;

    const supabase = createServerComponentClient<Database>({ cookies });
    const authUser = (await supabase.auth.getUser()).data.user;
    const authId = authUser?.id as string;

    const { data: userData, error: error1 } = await supabase
        .from("users")
        .select("*, users_restricted(*)")
        .eq("user_id", authId)
        .single();
    if (error1) {
        console.log(error1);
        return <div>{lang === "1" ? "Wystąpił błąd" : "An error occured"}</div>;
    }
    if (!userData) {
        return <div>{lang === "1" ? "Wystąpił błąd" : "An error occured"}</div>;
    }

    // If role is User, show calculator with his/her data
    // @ts-ignore
    if (userData.users_restricted.role === "User") {
        const pricingsData = await getUserPricings(authId, cup);
        if (!pricingsData) {
            return <div>{lang === "1" ? "Wystąpił błąd" : "An error occured"}</div>;
        }
        const { cupData, colorPricing } = pricingsData;

        return <Calculator cupData={cupData} colorPricing={colorPricing} lang={lang} clientPriceUnit={userData.eu ? "EUR" : "zł"} />;
    }

    // If role is Salesman or Admin, show select with all users, and calculator with selected user's data
    const allUserDataRes = await fetch("http://localhost:3000/api/getallusers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ authId }),
    });

    if (!allUserDataRes.ok) {
        console.log(await allUserDataRes.text());
        return <div>{lang === "1" ? "Wystąpił błąd" : "An error occured"}</div>;
    }

    const allUsersData =
        (await allUserDataRes.json()) as (Database["public"]["Tables"]["users"]["Row"] &
            pricingsInterface)[];

    return (
        <UserSelector allUsersData={allUsersData} cup={cup} lang={lang} />
    );
}

export interface pricingsInterface {
    cup_pricing: string;
    color_pricing: string;
}
