import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { redirect } from "next/navigation";
import { getPricings, getUserData } from "../activationRequests/page";
import { Client, User } from "../page";
import { ClientsTabled } from "@/components/dashboardPages/clients/clientsTabled";
import { createClient } from "@/database/supabase/server";

const ClientsPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
	const lang = searchParams?.lang || "1";
	const cup = searchParams?.cup?.trim().replaceAll(" ", "_") || "";
	const embed = searchParams?.embed == 'true' ? true : false;

	const supabase = createClient();
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
	const salesmenEmails =
		adminsAndSalesmen
			?.filter((client) => client.role === "Salesman")
			.map((client) => ({ user_id: client.user_id, email: client.email })) || [];
	const { available_cup_pricings, available_color_pricings } = await getPricings(authUser);

	return (
		<div>
			<DashBoardNav url={"/clients"} user={user} />
			<ClientsTabled
				clientsInput={clients.filter((client) => client.activated)}
				salesmenEmails={salesmenEmails}
				available_cup_pricings={available_cup_pricings}
				available_color_pricings={available_color_pricings}
			/>
		</div>
	);
};

export default ClientsPage;
