import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { redirect } from "next/navigation";
import { Client, User } from "../page";
import { AdminsSalesmen } from "@/components/dashboardPages/adminsSalesmen";
import { getUserData } from "../activationRequests/page";
import { createClient } from "@/database/supabase/server";

const AdminsAndSalesmenPage = async ({
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

    const { e, ...userData } = (await getUserData(authUser, lang, cup, embed, false, true).catch((e) => {
        return { e };
    })) as { e?: any; user: User; adminsAndSalesmen: Client[] };
    if (e || !userData) {
        redirect(`/?lang=${lang}&cup=${cup}&embed=${embed}`);
    }

    const { user, adminsAndSalesmen } = userData;
    if (user.role !== "Admin") {
        redirect(`/?lang=${lang}&cup=${cup}&embed=${embed}`);
    }

    return (
        <div>
            <DashBoardNav url={"/adminsAndSalesmen"} user={user} />
            <AdminsSalesmen adminsAndSalesmenInput={adminsAndSalesmen} user={user} />
        </div>
    )
};

export default AdminsAndSalesmenPage;