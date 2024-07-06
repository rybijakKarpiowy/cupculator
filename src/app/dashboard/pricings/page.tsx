import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { Pricings } from "@/components/dashboardPages/pricings";
import { redirect } from "next/navigation";
import { User } from "../page";
import { getPricings, getUserData } from "../activationRequests/page";
import { createClient } from "@/database/supabase/server";

const PricingsPage = async ({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) => {
    const lang = searchParams?.lang || "1";
    const cup = searchParams?.cup?.trim().replaceAll(" ", "_") || "";
    const embed = searchParams?.embed == 'true' ? true : false;

    const supabase = createClient()
    const authUser = (await supabase.auth.getUser()).data.user;

    if (!authUser) {
        window.location.href = `/?lang=${lang}&cup=${cup}&embed=${embed}`;
        return;
    }

    const { e, ...userData } = (await getUserData(authUser, lang, cup, embed, false, false).catch((e) => {
        return { e };
    })) as { e?: any; user: User };
    if (e || !userData) {
        redirect(`/?lang=${lang}&cup=${cup}&embed=${embed}`);
    }

    const { user } = userData;
    if (user.role !== "Admin") {
        redirect(`/?lang=${lang}&cup=${cup}&embed=${embed}`);
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