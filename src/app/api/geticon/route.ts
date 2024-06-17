import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { icon } = (await req.json()) as { icon: string }

    let res = await fetch(icon)

    if (!res.ok) {
        if (icon.slice(4, 5) != "s") {
            return new NextResponse("error", {status: 500})
        }
        const iconHttp = icon.slice(0, 4) + icon.slice(5);
        res = await fetch(iconHttp)
    }

    const iconImg = await res.blob()

    return new NextResponse(iconImg, {
        headers: {
            "Content-Type": "image/jpg",
            "Cache-Control": "public, max-age=360000, immutable",
        },
    });
};
