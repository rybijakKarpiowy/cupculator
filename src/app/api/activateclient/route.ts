import { supabase } from "@/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database/types";
import sgmail from "@sendgrid/mail";

const baseUrl = (
    process.env.PROD === "true"
        ? "https://cupculator.vercel.app"
        : process.env.DEV === "true"
        ? "https://cupculator-rybijakkarpiowy.vercel.app"
        : "http://localhost:3000"
) as string;

export const POST = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const data = (await req.json()) as {
        user_id: string;
        cup_pricing: string;
        color_pricing: string;
        eu?: boolean;
    };
    const { user_id, cup_pricing, color_pricing, eu } = data;

    const { data: roleData, error: error1 } = await supabase
        .from("users_restricted")
        .select("role")
        .eq("user_id", auth_id);

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const { error: error2 } = await supabase
        .from("users_restricted")
        .update({
            cup_pricing,
            color_pricing,
            activated: true,
            // salesman_id
        })
        .eq("user_id", user_id);
    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    // If Client is activated first time, send email
    if (eu !== undefined) {
        const { error: error3 } = await supabase
            .from("users")
            .update({ eu })
            .eq("user_id", user_id);
        if (error3) {
            return NextResponse.json(error3.message, { status: 500 });
        }

        const { data: activatedUserEmail, error: error4 } = await supabase
            .from("users")
            .select("email, eu")
            .eq("user_id", user_id)
            .single();
        if (error4) {
            return NextResponse.json(error4.message, { status: 500 });
        }

        const msg = {
            to: activatedUserEmail.email,
            from: {
                name: "Pro Media",
                email: "biuro@kubki.com.pl",
            },
            subject: "Your account has been activated",
            text: "Your account has been activated, you can now log in our calculator at https://kubki.com.pl",
            html: "Your account has been activated, you can now log in our calculator at https://kubki.com.pl",
        };

        sgmail.setApiKey(process.env.SENDGRID_KEY!);
        sgmail
            .send(msg)
            .then(() => {
                console.log("Email sent");
            })
            .catch((error: any) => {
                console.error(error);
            });
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
};
