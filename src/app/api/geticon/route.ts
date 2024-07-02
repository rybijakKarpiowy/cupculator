import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { icon } = (await req.json()) as { icon: string }

    const url = new URL(icon)

    const res = await fetch(url)

    const iconBlob = await res.blob()

    return new NextResponse(iconBlob, {
        headers: {
            "Content-Type": "image/jpg",
            "Cache-Control": "public, max-age=360000, immutable",
        },
    });
};
