import Image from "next/image";
import { getUserPricings } from "@/lib/getUserPricings";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

export default async function Home({searchParams}: {params: {}, searchParams: {cup: string, lang: string}}) {
    const lang = searchParams.lang || "1";
    const cup = searchParams.cup as string;

    const supabase = createServerComponentClient({ cookies });
    const authUser = (await supabase.auth.getUser()).data.user;
    const authId = authUser?.id as string;

    const pricingsData = await getUserPricings(authId, cup);
    if (!pricingsData) {
        return <div>loading...</div>;
    }
    const { cupData, cupPricing, colorPricing } = pricingsData;

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <></>
        </main>
    );
}
