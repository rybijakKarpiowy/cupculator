import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { icon } = (await req.json()) as { icon: string }

    const response = await axios({
        method: "get",
        url: icon,
        headers: {
            "Host": "kubki.com.pl",
            "Cache-Control": "no-cache",
            "Accept": "*/*"
        },
        responseType: "arraybuffer"
    })

    const arrayBuffer = response.data as ArrayBuffer
    const iconBlob = new Blob([arrayBuffer])
    
    return new NextResponse(iconBlob, {
        headers: {
            "Content-Type": "image/jpg",
            "Cache-Control": "public, max-age=360000, immutable",
        },
    });
};
