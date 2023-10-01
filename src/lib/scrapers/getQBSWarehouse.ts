import * as cheerio from "cheerio";

export const getQBSWarehouse = async (cups: { cup_id: number; code: string }[]) => {
    // const firstPageRes = await fetch("https://qubarts.pl/products-page/");
    // if (!firstPageRes.ok) {
    //     return { error: "1" };
    // }
    // const firstPageRaw = await firstPageRes.text();
    // const firstPageBody = cheerio.load(firstPageRaw);

    // const numberOfPages = firstPageBody("[title='Ostatnia strona']").attr("href")?.split("/")[4] || 5
    const numberOfPages = 6;

    const allPages = [];
    for (let i = 1; i <= Number(numberOfPages); i++) {
        allPages.push(i);
    }

    const pagesPromises = await Promise.allSettled(
        allPages.map(async (page) => {
            const res = await fetch(`https://qubarts.pl/products-page/${page}/`);
            if (!res.ok) {
                return { error: page.toString() };
            }
            const raw = await res.text();
            return raw;
        })
    );

    const allPagesFullfilled = (
        pagesPromises.filter((promise) => promise.status === "fulfilled") as {
            status: "fulfilled";
            value: string | { error: string };
        }[]
    ).map((promise) => promise.value);

    const errorPages = allPagesFullfilled.filter((page) => typeof page === "object") as {
        error: string;
    }[];
    // allPagesRaw.unshift(firstPageRaw);

    const allPagesBody = (
        allPagesFullfilled.filter((page) => typeof page === "string") as string[]
    ).map((raw) => {
        return cheerio.load(raw);
    });

    const pageCups = allPagesBody
        .map((body) => {
            const divs = body("[class='wpsc_product_price']");
            const cups = divs
                .map((_, div) => {
                    const cup = body(div);
                    const amount = parseInt(cup.children("p").children("span").text()) || 0;
                    const code_link = cup.children("div").attr("id")?.split("_").pop() || "";

                    return { code_link, amount };
                })
                .get();
            return cups;
        })
        .flat();

    const allCupsData = cups.map((cup) => {
        const cupData = pageCups.find((pageCup) => pageCup.code_link === cup.code);
        if (!cupData) {
            return {
                provider: "QBS",
                code_link: cup.code,
                cup_id: cup.cup_id,
                updated_at: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
                amount: "error",
            };
        }

        return {
            provider: "QBS",
            code_link: cup.code,
            cup_id: cup.cup_id,
            updated_at: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            amount: cupData.amount,
        };
    });

    return { data: allCupsData, error: errorPages };
};
