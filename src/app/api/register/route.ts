import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const supabase = createRouteHandlerClient({cookies}, {supabaseKey: process.env.SUPABASE_SERVICE_KEY as string})

    const userInfo = await req.json()
    
    const res = supabase.from('profiles').insert({
        user_id: '5241d09f-008e-486e-86a9-930ad1e86e4c',
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        company_name: userInfo.company_name,
        country: userInfo.country,
        region: userInfo.region,
        adress: userInfo.adress,
        postal_code: userInfo.postal_code,
        city: userInfo.city,
        phone: userInfo.phone,
        NIP: userInfo.NIP,
        eu: userInfo.eu,
    })
    // const res = await supabase.from('profiles').select('*')
    console.log(res)

    return new Response("ok", {
        status: 200,
    });
};
