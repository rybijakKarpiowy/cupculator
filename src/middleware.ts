import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { baseUrl } from "@/app/baseUrl";
import { NextURL } from 'next/dist/server/web/next-url';

function setBaseParameters(url: NextURL, eu: boolean) {
    const lang = url.searchParams.get("lang");
    if (!lang || lang == "null" || lang == "undefined") {
      url.searchParams.set("lang", eu ? "2" : "1")
    }
    const cup = url.searchParams.get("cup");
    if (!cup || cup == "null" || cup == "undefined") {
      url.searchParams.set("cup", "null")
    }
    return url
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  const searchParams = request.nextUrl.searchParams;
  let lang = searchParams.get("lang");
  let cup = searchParams.get("cup")?.trim().replaceAll(" ", "_");
  const embed = searchParams.get("embed") == 'true' ? true : false;
  let setBaseParams = false;

  if (!lang || lang === "" || lang === "null" || lang === "undefined") {
      setBaseParams = true;
  }
  if (!cup || cup === "" || cup === "undefined") {
      setBaseParams = true;
  }

  let url = request.nextUrl.clone()
  if (setBaseParams) url = setBaseParameters(url, false)
    
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/recovery') &&
    !request.nextUrl.pathname.startsWith('/register')
    // && !request.nextUrl.pathname.startsWith('/resetpassword')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // user is logged in here
  if ((request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/recovery') || request.nextUrl.pathname.startsWith('/register')) && user) {
    // user tries to login while logged in
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if ((request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname == '/') && user) {
    const userRoleRes = await fetch(new URL("/api/getuserrole", baseUrl), {
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });

    if (!userRoleRes.ok) {
        url.pathname = "/account/details"
        return NextResponse.redirect(url);
    }

    const data = (await userRoleRes.json()) as {
        email: string;
        first_name: string;
        last_name: string;
        company_name: string;
        country: string;
        region: string;
        adress: string;
        postal_code: string;
        city: string;
        phone: string;
        NIP: string;
        eu: boolean;
        role: "User" | "Admin" | "Salesman";
        user_id: string;
    };

    if (!data || !data.role) {
        url.pathname = "/account/details"
        return NextResponse.redirect(url);
    }

    if (data.role === "User") {
        for (const key in data) {
            // @ts-ignore
            if (data[key] === null || data[key] === undefined || data[key] === "") {
                if (key === "region") {
                    continue;
                }

                url.pathname = "/account/details"
                return NextResponse.redirect(url);
            }
        }
    }

    if ((!cup || cup === "" || cup === "null" || cup === "undefined") && data.role === "User") {
        return NextResponse.redirect(new URL(`https://kubki.com.pl/Kubki?lang=${lang}&embed=${embed}`));
    }

    if (setBaseParams) {
        url = setBaseParameters(url, data.eu)
        return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/login",
        "/recovery",
        "/register",
        "/resetpassword",
        "/account/details",
    ],
};
