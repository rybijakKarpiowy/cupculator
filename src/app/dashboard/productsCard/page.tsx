import { DashBoardNav } from "@/components/dashboardPages/components/dashBoardNav";
import { redirect } from "next/navigation";
import { User } from "../page";
import { getUserData } from "../activationRequests/page";
import { Database } from "@/database/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { pgsql } from "@/database/pgsql";
import { ProductsCardTabled } from "@/components/dashboardPages/productsCard/productsCardTabled";

const ProductsCardPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
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

    const { data: productsCard, error: productsCardError } = await pgsql.query.cups
        .findMany()
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));
    if (productsCardError || !productsCard) {
        console.log("Error: ", productsCardError);
        redirect(`/dashboard?lang=${lang}&cup=${cup}`);
    }

	return (
		<div>
			<DashBoardNav url={"/productsCard"} user={user} />
			<ProductsCardTabled cupsData={productsCard} />
		</div>
	);
};

export default ProductsCardPage;
