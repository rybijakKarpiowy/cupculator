import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { Pricings } from "@/components/dashboardPages/pricings";
import { redirect } from "next/navigation";
import { User } from "../page";
import { getPricings, getUserData } from "../activationRequests/page";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const PricingsPage = async ({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) => {
    const lang = searchParams?.lang || "1";
    const cup = searchParams?.cup?.trim().replaceAll(" ", "_") || "";

    const supabase = createServerComponentClient<Database>({ cookies });
    const authUser = (await supabase.auth.getUser()).data.user;

    if (!authUser) {
        window.location.href = `/?lang=${lang}&cup=${cup}`;
        return;
    }

    const { e, ...userData } = (await getUserData(authUser, lang, cup, false, false).catch((e) => {
        return { e };
    })) as { e?: any; user: User };
    if (e || !userData) {
        redirect(`/?lang=${lang}&cup=${cup}`);
    }

    const { user } = userData;
    if (user.role !== "Admin") {
        redirect(`/?lang=${lang}&cup=${cup}`);
    }

    const { available_cup_pricings, available_color_pricings } = await getPricings(authUser);

    return (
        <div>
            <DashBoardNav url={"/pricings"} user={user} />
            <Pricings available_cup_pricings={available_cup_pricings} available_color_pricings={available_color_pricings} />
        </div>
    )
};


export default PricingsPage