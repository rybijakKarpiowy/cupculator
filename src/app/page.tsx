import { Calculator } from "@/components/calculator/calculator";
import { UserSelector } from "@/components/calculator/userSelector";
import { Database } from "@/database/types";
import { getUserPricings } from "@/lib/getUserPricings";
import { baseUrl } from "@/middleware";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

export default async function Home({
    searchParams,
}: {
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
        return (
            <div className="text-center text-2xl mt-72">
                {lang === "1" ? "Wystąpił błąd" : "An error occured"}
            </div>
        );
    }
    if (!userData) {
        return (
            <div className="text-center text-2xl mt-72">
                {lang === "1" ? "Wystąpił błąd" : "An error occured"}
            </div>
        );
    }

    const { data: additionalValues, error: error2 } = await supabase.from("additional_values").select("*").single();
    if (error2) {
        console.log(error2);
        return (
            <div className="text-center text-2xl mt-72">
                {lang === "1" ? "Wystąpił błąd" : "An error occured"}
            </div>
        );
    }

    // If role is User, show calculator with his/her data
    // @ts-ignore
    if (userData.users_restricted.role === "User") {
        // If account is not activated, show message
        // @ts-ignore
        if (!userData.users_restricted.activated) {
            return (
                <div className="text-center text-2xl mt-72">
                    {lang === "1"
                        ? "Konto nieaktywne, poczekaj aż dział handlowy aktywuje twoje konto, może to zająć kilka dni"
                        : "Account inactive, wait for the sales department to activate your account, it can take up to a few days"}
                </div>
            );
        }

        const pricingsData = await getUserPricings(authId, cup);
        if (!pricingsData) {
            return (
                <div className="text-center text-2xl mt-72">
                    {lang === "1" ? "Wystąpił błąd" : "An error occured"}
                </div>
            );
        }
        const { cupData, colorPricing } = pricingsData;

        return (
            <Calculator
                cupData={cupData}
                colorPricing={colorPricing}
                lang={lang}
                clientPriceUnit={userData.eu ? "EUR" : "zł"}
                additionalValues={additionalValues}
            />
        );
    }

    // If role is Salesman or Admin, show select with all users, and calculator with selected user's data
    const allUserDataRes = await fetch(`${baseUrl}api/getallusers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth_id: authId }),
    });

    if (!allUserDataRes.ok) {
        console.log(await allUserDataRes.text());
        return (
            <div className="text-center text-2xl mt-72">
                {lang === "1" ? "Wystąpił błąd" : "An error occured"}
            </div>
        );
    }

    const allUsersData =
        (await allUserDataRes.json()) as (Database["public"]["Tables"]["users"]["Row"] &
            pricingsInterface)[];

    return <UserSelector allUsersData={allUsersData} cup={cup} lang={lang} additionalValues={additionalValues} />;
}

export interface pricingsInterface {
    cup_pricing: string;
    color_pricing: string;
}
