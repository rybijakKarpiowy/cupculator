import { Database } from "@/database/types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";
import * as schema from "@/database/schema";
import sgmail from "@sendgrid/mail";

export const GET = async (req: NextRequest) => {
    const res = NextResponse.next();
    const clientSupabase = createMiddlewareClient<Database>({ req, res });
    const auth_id = (await clientSupabase.auth.getSession()).data.session?.user.id;

    if (!auth_id) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { error } = await pgsql
        .insert(schema.users_restricted)
        .values({ user_id: auth_id })
        .onConflictDoNothing({ target: schema.users_restricted.user_id })
        .then(() => ({ error: null }))
        .catch((error) => ({ error }));

    if (error) {
        return NextResponse.json(error.message, { status: 500 });
    }

    const { data: activatedUserEmail, error: error2 } = await pgsql.query.users
        .findFirst({
            where: (users, { eq }) => eq(users.user_id, auth_id),
            columns: {
                email: true,
                eu: true,
                company_name: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    if (!activatedUserEmail) {
        return NextResponse.json("User not found", { status: 500 });
    }

    const { data: emailsToSendTo, error: error3 } = await pgsql.query.admin_emails
        .findMany({
            columns: {
                email: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error3) {
        console.log(error3);
        return NextResponse.json(error3.message, { status: 500 });
    }

    if (!emailsToSendTo) {
        return NextResponse.json("No emails to send to", { status: 500 });
    }

    const msgtoAdmin = {
        to: emailsToSendTo.map((email) => email.email),
        from: {
            name: "Pro Media",
            email: "biuro@kubki.com.pl",
        },
        subject: `${activatedUserEmail.company_name} czeka na aktywację`,
        text: `${activatedUserEmail.company_name} czeka na aktywację`,
        html: `<!DOCTYPE html><html><body><h1>${activatedUserEmail.company_name} czeka na aktywację</h1></body></html>`,
    };

    sgmail.setApiKey(process.env.SENDGRID_KEY!);
    // send email to admin/specified email
    await sgmail
        .send(msgtoAdmin)
        .then(() => {
            console.log("Email to admin sent");
        })
        .catch((error: any) => {
            console.error(error);
        });

    return NextResponse.json({ status: 201 });
};
