import { createClient } from "@/database/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const searchParams = new URLSearchParams();
	const redirect = searchParams.get("redirect");

	const clientSupabase = createClient();

	const { email, password } = await req.json();
	const { data, error } = await clientSupabase.auth.signInWithPassword({
		email: email,
		password: password,
	});

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 401 });
	}

	// set Set-Cookie header
	const cookiesObj = cookies();
	cookiesObj.set("sb-access-token", data.session.access_token, {
		sameSite: "none",
		secure: true,
	});
	cookiesObj.set("sb-refresh-token", data.session.refresh_token, {
		sameSite: "none",
		secure: true,
	});
	const base64token = btoa(JSON.stringify(data.session));
	cookiesObj.set("sb-cqtyyyzavzbzcuqrrkri-auth-token", "base64-" + base64token, {
		sameSite: "none",
		secure: true,
	});

	if (redirect) {
		return NextResponse.redirect("https://kubki.com.pl" + redirect, {
			headers: {
				"Set-Cookie": cookiesObj.toString(),
			},
		});
	}

	return NextResponse.json(
		{ data },
		{
			status: 200,
			headers: {
				"Set-Cookie": cookiesObj.toString(),
			},
		}
	);
};
