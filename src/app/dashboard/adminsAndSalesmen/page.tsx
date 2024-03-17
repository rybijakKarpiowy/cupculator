import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Client, User } from "../page";
import { AdminsSalesmen } from "@/components/dashboardPages/adminsSalesmen";
import { getUserData } from "../activationRequests/page";

const AdminsAndSalesmenPage = async ({
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

    const { e, ...userData } = (await getUserData(authUser, lang, cup, false, true).catch((e) => {
        return { e };
    })) as { e?: any; user: User; adminsAndSalesmen: Client[] };
    if (e || !userData) {
        redirect(`/?lang=${lang}&cup=${cup}`);
    }

    const { user, adminsAndSalesmen } = userData;
    if (user.role !== "Admin") {
        redirect(`/?lang=${lang}&cup=${cup}`);
    }

    return (
        <div>
            <DashBoardNav url={"/adminsAndSalesmen"} user={user} />
            <AdminsSalesmen adminsAndSalesmenInput={adminsAndSalesmen} user={user} />
        </div>
    )
};

export default AdminsAndSalesmenPage;