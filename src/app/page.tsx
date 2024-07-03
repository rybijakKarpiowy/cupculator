import { Calculator } from "@/components/calculator/calculator";
import { UserSelector } from "@/components/calculator/userSelector";
import { Database } from "@/database/types";
import { Restriction } from "@/lib/checkRestriction";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";
import { baseUrl } from "@/app/baseUrl";
import { Cup } from "./api/updatecups/route";
import { ColorPricing } from "@/lib/colorPricingType";
import { pgsql } from "@/database/pgsql";

export const dynamic = "force-dynamic";

export default async function Home({
    searchParams,
}: {
    searchParams: { cup: string; lang: string, embed: string };
}) {
    const lang = (searchParams.lang || "1") as "1" | "2";
    const cup = searchParams.cup?.trim().replaceAll(" ", "_") as string;
    const embed = searchParams.embed == 'true' ? true : false;

    const supabase = createServerComponentClient<Database>({ cookies });
    const authUser = (await supabase.auth.getUser()).data.user;
    const authId = authUser?.id as string;

    const { data: userData, error: error1 } = await pgsql.query.users
        .findFirst({
            where: (users, { eq }) => eq(users.user_id, authId),
            with: {
                users_restricted: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

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

    const { data: additionalValues, error: error2 } = await pgsql.query.additional_values
        .findFirst()
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));
    if (error2) {
        console.log(error2);
        return (
            <div className="text-center text-2xl mt-72">
                {lang === "1" ? "Wystąpił błąd" : "An error occured"}
            </div>
        );
    }

    const { data: restrictions, error: error3 } = await pgsql.query.restrictions
        .findMany()
        .then((data) => ({ data, error: null } as { data: Restriction[]; error: null }))
        .catch((error) => ({ data: null, error }));
    if (error3 || !restrictions) {
        console.log(error3);
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

        const pricingsDataRes = await fetch(`${baseUrl}/api/getuserpricings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: authId, cupLink: cup, key: process.env.SERVER_KEY }),
        });

        if (!pricingsDataRes.ok) {
            console.log(await pricingsDataRes.text());
            return (
                <div className="text-center text-2xl mt-72">
                    {lang === "1"
                        ? "Wystąpił błąd, w celu uzyskania kalkulacji skontaktuj się z działem handlowym"
                        : "An error occured, please contact the sales department for a calculation"}
                </div>
            );
        }

        const pricingsData = (await pricingsDataRes.json()) as {
            cupData: Cup[];
            colorPricing: ColorPricing;
        };

        const { cupData, colorPricing } = pricingsData;

        return (
            <Calculator
                cupData={cupData}
                colorPricing={colorPricing}
                lang={lang}
                embed={embed}
                clientPriceUnit={userData.eu ? "EUR" : "zł"}
                additionalValues={additionalValues!}
                restrictions={restrictions!}
            />
        );
    }

    // If role is Salesman or Admin, show select with all users, and calculator with selected user's data
    const allUserDataRes = await fetch(`${baseUrl}/api/getallusers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth_id: authId, key: process.env.SERVER_KEY }),
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

    return (
        <UserSelector
            allUsersData={allUsersData}
            cup={cup}
            lang={lang}
            embed={embed}
            additionalValues={additionalValues!}
            restrictions={restrictions!}
        />
    );
}

export interface pricingsInterface {
    cup_pricing: string;
    color_pricing: string;
}
