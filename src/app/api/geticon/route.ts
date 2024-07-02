import { NextRequest, NextResponse } from "next/server";
import https from 'https';

export const POST = async (req: NextRequest) => {
    const { icon } = (await req.json()) as { icon: string }

    const options = {
        hostname: 'kubki.com.pl',
        path: icon,
        headers: {
            'Accept-Language': 'en-US,en;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Host': 'kubki.com.pl'
        }
    };

    let promise = new Promise((resolve, reject) => {
        const my_req = https.get(options, function (res) {
            const chunks: Buffer[] = [];
    
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
    
            res.on('end', function () {
                const body = Buffer.concat(chunks);
                const blob = new Blob([body], {type: "image/jpeg"});
                resolve(blob)
            });
        });
        my_req.on("error", (e) => reject(e));
    })

    const iconBlob = await promise as Blob
    
    return new NextResponse(iconBlob, {
        headers: {
            "Content-Type": "image/jpg",
            "Cache-Control": "public, max-age=360000, immutable",
        },
    });
};
