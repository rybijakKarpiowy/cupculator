import { Navbar } from "@/components/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database/types";
import { cookies } from "next/dist/client/components/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Kalkulator",
    description: "Kalulator do obliczania cen kubków",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const supabase = createServerComponentClient<Database>({ cookies });
    const authUser = (await supabase.auth.getUser()).data.user;

    return (
        <html lang="en">
            <body className={`overflow-y-scroll bg-[url('https://kubki.com.pl/img/bg.jpg')] bg-repeat-x bg-[center_115px] bg-white`}>
                <Navbar authUser={authUser} />
                <main className="mt-[115px]">{children}</main>
            </body>
        </html>
    );
}
