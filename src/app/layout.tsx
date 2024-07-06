import { Navbar } from "@/components/navbar";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ToastContainer } from "react-toastify";
import { pgsql } from "@/database/pgsql";
import { createClient } from "@/database/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Kalkulator",
    description: "Kalulator do obliczania cen kubków",
};

export const viewport: Viewport = {
    width: 1920,
    initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const authUser = (await supabase.auth.getUser()).data.user?.id;
    let userRestrictedData = null;

    if (authUser) {
        const { data, error } = await pgsql.query.users_restricted
            .findMany({
                where: (users_restricted, { eq }) => eq(users_restricted.user_id, authUser),
            })
            .then((data) => ({ data, error: null }))
            .catch((error) => ({ data: null, error }));

        if (error) {
            console.log(error);
        }
        if (data && data.length > 0) {
            userRestrictedData = data[0];
        }
    }

    return (
        <html lang="en">
            <body data-embed="false" className={`overflow-y-scroll data-[embed=false]:bg-[url('https://kubki.com.pl/img/bg.jpg')] bg-repeat-x bg-[center_115px] bg-white group`}>
                <Navbar authUser={authUser} role={userRestrictedData?.role} />
                <main data-embed="false" className={"group-data-[embed=false]:mt-[115px] group-data-[embed=true]:h-max"}>{children}</main>
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover
                    theme="light"
                />
            </body>
        </html>
    );
}
