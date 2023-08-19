"use client";

import { Cup } from "@/app/api/updatecups/route";
import Image from "next/image";
import { useState } from "react";
import { Database } from "@/database/types";

export const Calculator = ({
    cupData,
    colorPricing,
}: {
    cupData: Cup[];
    colorPricing: Database["public"]["Tables"]["color_pricings"]["Row"];
}) => {
    const [color, setColor] = useState(cupData[0]);
    
    return (
        <div>
            <h1>Calculator</h1>
            {color.icon ? (
                <Image src={color.icon} alt={""} />
            ) : (
                <Image src={"/noimage.png"} alt={""} />
            )}
        </div>
    );
};
