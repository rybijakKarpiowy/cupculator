import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Client, User } from "../page";
import { AuthUser } from "@supabase/supabase-js";
import { baseUrl } from "@/app/baseUrl";
import { ActivationRequestsTabled } from "@/components/dashboardPages/activationRequests/activationRequestsTabled";

export const getUserData = async (authUser: AuthUser, lang: string, cup: string, embed: boolean, clientsToo: boolean, salesmenToo: boolean) => {
	const res = await fetch(`${baseUrl}/api/dashboard`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ auth_id: authUser?.id, key: process.env.SERVER_KEY, clientsToo, salesmenToo }),
	});

	if (!res.ok) {
		throw new Error("Something went wrong (no user data)");
	}

	const { userInfo, clients, adminsAndSalesmen }: { userInfo: any; clients?: Client[]; adminsAndSalesmen?: Client[] } = await res.json();

	const user = {
		...userInfo,
		email: authUser?.email,
	} as User;

	if (user.role === "Admin") {
		return { user, ...(clientsToo && { clients }), ...(salesmenToo && { adminsAndSalesmen }) };
	}

	if (user.role === "Salesman") {
		return { user, ...(clientsToo && { clients }) };
	}

	window.location.href = `/?lang=${lang}&cup=${cup}&embed=${embed}`;
	return;
};

export const getPricings = async (authUser: AuthUser) => {
	const res = await fetch(`${baseUrl}/api/pricings`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ auth_id: authUser?.id, key: process.env.SERVER_KEY }),
	});

	if (!res.ok) {
		console.log("Something went wrong (no pricings)");
		return { available_cup_pricings: [], available_color_pricings: [] };
	}

	const { available_cup_pricings, available_color_pricings } = await res.json();

	return { available_cup_pricings, available_color_pricings } as { available_cup_pricings: string[]; available_color_pricings: string[] };
};

const ActivationRequestsPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
	const lang = searchParams?.lang || "1";
	const cup = searchParams?.cup?.trim().replaceAll(" ", "_") || "";
	const embed = searchParams?.embed == 'true' ? true : false;

	const supabase = createServerComponentClient<Database>({ cookies });
	const authUser = (await supabase.auth.getUser()).data.user;

	if (!authUser) {
		window.location.href = `/?lang=${lang}&cup=${cup}&embed=${embed}`;
		return;
	}

	const { e, ...userData } = (await getUserData(authUser, lang, cup, embed, true, true).catch((e) => {
		return { e };
	})) as { e?: any; user: User; clients: Client[]; adminsAndSalesmen?: Client[] };
	if (e || !userData) {
		redirect(`/?lang=${lang}&cup=${cup}&embed=${embed}`);
	}

	const { user, clients, adminsAndSalesmen } = userData;
	const { available_cup_pricings, available_color_pricings } = await getPricings(authUser);

	return (
		<div>
			<DashBoardNav url={"/activationRequests"} user={user} />
			<ActivationRequestsTabled
				clientsInput={clients.filter((client) => !client.activated)}
				adminsAndSalesmenInput={adminsAndSalesmen}
				available_cup_pricings={available_cup_pricings}
				available_color_pricings={available_color_pricings}
			/>
		</div>
	);
};

export default ActivationRequestsPage;
