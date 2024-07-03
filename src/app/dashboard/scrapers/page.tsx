import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { redirect } from "next/navigation";
import { User } from "../page";
import { getUserData } from "../activationRequests/page";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { pgsql } from "@/database/pgsql";
import { ScrapersTab } from "@/components/dashboardPages/scrapersTab";

const ScrapersPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
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

    const { data: scrWarehouses, error: scrWarehousesError } = await pgsql.query.cups
        .findMany({
            columns: {
                id: true,
                code: true,
            },
            with: {
                scraped_warehouses: {
                    columns: {
                        provider: true,
                        code_link: true,
                    },
                },
            },
        })
        .then((data) => {
            const renamedData = data
                .map((item) => ({
                    cup_id: item.id,
                    cup_code: item.code,
                    scrapers: item.scraped_warehouses,
                }))
                .sort((a, b) => a.cup_code.localeCompare(b.cup_code));
            return { data: renamedData, error: null };
        })
        .catch((error) => ({ data: null, error }));

    if (scrWarehousesError || !scrWarehouses) {
        console.log("Error: ", scrWarehousesError);
        redirect(`/dashboard?lang=${lang}&cup=${cup}&embed=${embed}`);
    }

	return (
		<div>
			<DashBoardNav url={"/scrapers"} user={user} />
			<ScrapersTab scrapersDataInput={scrWarehouses} />
		</div>
	);
};

export default ScrapersPage;
