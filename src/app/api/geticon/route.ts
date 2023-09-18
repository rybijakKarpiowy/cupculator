import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { icon } = await req.json();

    const iconImg = await fetch(icon).then((res) => res.blob());

    return new NextResponse(iconImg, {
        headers: {
            "Content-Type": "image/jpg",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
