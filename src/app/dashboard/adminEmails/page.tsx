import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { redirect } from "next/navigation";
import { User } from "../page";
import { getUserData } from "../activationRequests/page";
import { AdminEmailsTab } from "@/components/dashboardPages/adminEmailsTab";
import { pgsql } from "@/database/pgsql";
import { createClient } from "@/database/supabase/server";

const AdminEmailsPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
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

    const { data: adminEmails, error: adminEmailsError } = await pgsql.query.admin_emails
        .findMany()
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (adminEmailsError || !adminEmails) {
        console.log(adminEmailsError);
        redirect(`/dashboard?lang=${lang}&cup=${cup}&embed=${embed}`);
    }

	return (
		<div>
			<DashBoardNav url={"/adminEmails"} user={user} />
			<AdminEmailsTab adminEmails={adminEmails.map((item) => item.email)} />
		</div>
	);
};

export default AdminEmailsPage;
