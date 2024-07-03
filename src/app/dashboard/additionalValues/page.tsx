import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { redirect } from "next/navigation";
import { User } from "../page";
import { getUserData } from "../activationRequests/page";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AdditionalValues } from "@/components/dashboardPages/additionalValues";
import { pgsql } from "@/database/pgsql";

const AdditionalValuesPage = async ({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) => {
    const lang = searchParams?.lang || "1";
    const cup = searchParams?.cup?.trim().replaceAll(" ", "_") || "";
    const embed = searchParams?.embed == 'true' ? true : false;

    const supabase = createServerComponentClient<Database>({ cookies });
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

    const { data: additionalValues, error } = await pgsql.query.additional_values
        .findFirst()
        .then((data) => ({ data, error: null }))
        .catch((e) => ({ data: null, error: e }));
    if (error) {
        console.log(error);
        redirect(`/?lang=${lang}&cup=${cup}&embed=${embed}`);
    }

    return (
        <div>
            <DashBoardNav url={"/additionalValues"} user={user} />
            <AdditionalValues additionalValues={additionalValues!} />
        </div>
    )
};


export default AdditionalValuesPage