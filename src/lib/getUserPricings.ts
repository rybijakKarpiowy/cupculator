'use server'

import { supabase } from "@/database/supabase"

export const getUserPricings = async (authId: string, cupCode: string) => {
    // get user data
    const { data: userData, error: error1 } = await supabase.from("users_restricted").select("*").eq("user_id", authId);
    if (error1) {
        console.log(error1);
        return null;
    }
    const user = userData[0];

    const { data: cupDataRaw, error: error2 } = await supabase.from("cups").select("*").eq("code", cupCode);
    if (error2) {
        console.log(error2);
        return null;
    }
    if (!cupDataRaw || cupDataRaw.length === 0) {
        return null;
    }
    const cupData = cupDataRaw[0];

    const { data: cupPricingData, error: error3 } = await supabase.from("cup_pricings").select("*").eq("cup_id", cupData.id).eq("pricing_name", user.cup_pricing);
    if (error3) {
        console.log(error3);
        return null;
    }
    if (!cupPricingData || cupPricingData.length === 0) {
        return null;
    }
    const cupPricing = cupPricingData[0];

    const { data: colorPricingData, error: error4 } = await supabase.from("color_pricings").select("*").eq("pricing_name", user.color_pricing);
    if (error4) {
        console.log(error4);
        return null;
    }
    if (!colorPricingData || colorPricingData.length === 0) {
        return null;
    }
    const colorPricing = colorPricingData[0];


    return {
        cupData,
        cupPricing,
        colorPricing
    }
}