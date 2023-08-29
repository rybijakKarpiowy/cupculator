"use server";

import { supabase } from "@/database/supabase";
import { ColorPricing } from "./colorPricingType";
import { PostgrestError } from "@supabase/supabase-js";
import { Cup } from "@/app/api/updatecups/route";

export const getUserPricings = async (authId: string, cupLink: string) => {
    // get user data
    const { data: user, error: error1 } = await supabase
        .from("users_restricted")
        .select("*")
        .eq("user_id", authId)
        .single();
    if (error1) {
        console.log(error1);
        return null;
    }
    if (!user) {
        return null;
    }

    // get cups (it is one cup in multiple color variants) and its pricings
    const { data: cupDataRaw, error: error2 } = await supabase
        .from("cups")
        .select(
            "*, cup_pricings(pricing_name, price_24, price_72, price_108, price_216, price_504, price_1008, price_2520)"
        )
        .eq("link", cupLink);
    if (error2) {
        console.log(error2);
        return null;
    }
    if (!cupDataRaw || cupDataRaw.length === 0) {
        return null;
    }

    // leave only one cup pricing per cup
    const cupData = cupDataRaw.map((cup) => {
        const cupPricingsRaw = cup.cup_pricings;
        const cupPricingsFiltered = cupPricingsRaw.filter((cupPricing) => {
            return cupPricing.pricing_name === user.cup_pricing;
        });

        const { cup_pricings, ...rest } = cup;
        if (cupPricingsFiltered.length === 0) {
            return {
                ...rest,
                prices: {
                    price_24: 0,
                    price_72: 0,
                    price_108: 0,
                    price_216: 0,
                    price_504: 0,
                    price_1008: 0,
                    price_2520: 0,
                },
            } as Cup;
        }
    
        const { pricing_name, ...cupPricing } = cupPricingsFiltered[0];
        return {
            ...rest,
            prices: cupPricing,
        } as Cup;
    });

    // get color pricing
    const { data: colorPricing, error: error4 } = (await supabase
        .from("color_pricings")
        .select("*")
        .eq("pricing_name", user.color_pricing)
        .single()) as { data: ColorPricing | null, error: PostgrestError | null}
    if (error4) {
        console.log(error4);
        return null;
    }
    if (!colorPricing) {
        return null;
    }

    return {
        cupData,
        colorPricing,
    };
};
