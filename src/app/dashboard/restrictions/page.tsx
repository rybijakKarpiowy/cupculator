import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { redirect } from "next/navigation";
import { User } from "../page";
import { getUserData } from "../activationRequests/page";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Restrictions } from "@/components/dashboardPages/restrictions";
import { Restriction } from "@/lib/checkRestriction";
import { pgsql } from "@/database/pgsql";

const RestrictionsPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
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

	const { data: restrictions, error: error2 } = await pgsql.query.restrictions
		.findMany()
		.then(
			(data) =>
				({
					data: data.sort((a, b) => a.imprintType.localeCompare(b.imprintType)),
					error: null,
				} as { data: Restriction[]; error: null })
		)
		.catch((error) => ({ data: null, error }));
	if (error2 || !restrictions) {
		console.log(error2);
		redirect(`/dashboard?lang=${lang}&cup=${cup}&embed=${embed}`);
	}

	return (
		<div>
			<DashBoardNav url={"/restrictions"} user={user} />
			<Restrictions restrictions={restrictions} />
		</div>
	);
};

export default RestrictionsPage;
