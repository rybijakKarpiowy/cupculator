import { Navbar } from "@/components/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database/types";
import { cookies } from "next/dist/client/components/headers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
    title: "Kalkulator",
    description: "Kalulator do obliczania cen kubków",
    viewport: "width=1920, initial-scale=1",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const supabase = createServerComponentClient<Database>({ cookies });
    const authUser = (await supabase.auth.getUser()).data.user?.id;
    let userRestrictedData = null;

    if (authUser) {
        const { data, error } = await supabase
            .from("users_restricted")
            .select("*")
            .eq("user_id", authUser)
            .single();
        if (error) {
            console.log(error);
        }
        if (data) {
            userRestrictedData = data;
        }
    }

    return (
        <html lang="en">
            <body
                className={`overflow-y-scroll bg-[url('https://kubki.com.pl/img/bg.jpg')] bg-repeat-x bg-[center_115px] bg-white`}
            >
                <Navbar authUser={userRestrictedData} />
                <main className="mt-[115px]">{children}</main>
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
