import * as cheerio from "cheerio";

export const getICLWarehouse = async (cups: { cup_id: number; link: string }[]) => {
    const loginRes = await fetch("https://wielkopolanin.com.pl/pl/order/login.html", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `log_in=order&login=${process.env.ICL_USERNAME}&password=${process.env.ICL_PASSWORD}`,
    });

    const cookie = loginRes.headers.get("set-cookie")?.split(";")[0];

    // divide cups into 10-cup chunks
    const cupChunks = cups.reduce((acc: { cup_id: number; link: string }[][], cup, index) => {
        if (index % 10 === 0) {
            acc.push([]);
        }
        acc[acc.length - 1].push(cup);
        return acc;
    }, []);

    const cupPromises: Promise<
        | {
              error: string;
              body?: undefined;
              link?: undefined;
          }
        | {
              body: string;
              link: string;
              error?: undefined;
          }
    >[] = [];

    for (const chunk of cupChunks) {
        const chunkPromises = chunk.map(async (cup) => {
            const cupPromise = new Promise<
                | {
                      error: string;
                      body?: undefined;
                      link?: undefined;
                  }
                | {
                      body: string;
                      link: string;
                      error?: undefined;
                  }
            >(async (resolve) => {
                const res = await fetch(cup.link, {
                    headers: {
                        cookie: cookie || "",
                    },
                    cache: "no-cache",
                });
                if (!res.ok) {
                    resolve({ error: cup.link });
                }
                const raw = await res.text();
                resolve({ body: raw, link: cup.link });
            });
            return cupPromise;
        });
        cupPromises.push(...chunkPromises);
    }

    const promisesSettled = await Promise.allSettled(cupPromises);

    const cupPagesAndErrors = (
        promisesSettled.filter((promise) => promise.status === "fulfilled") as {
            status: "fulfilled";
            value: { body: string; link: string } | { error: string };
        }[]
    ).map((promise) => promise.value);

    const errorLinks = (cupPagesAndErrors.filter((el) => "error" in el) as { error: string }[]).map(
        (page) => page.error
    );

    const cupPagesBody = (
        cupPagesAndErrors.filter((el) => "body" in el) as { body: string; link: string }[]
    ).map((raw) => {
        return { body: cheerio.load(raw.body), link: raw.link };
    });

    const pageCups = cupPagesBody.map((page) => {
        const body = page.body;
        const amount = parseInt(body("ul.product_properties").find("b").text().trim()) || 0;

        return { code_link: page.link, amount };
    });

    const allCupsData = cups.map((cup) => {
        const cupData = pageCups.find((pageCup) => pageCup.code_link === cup.link);
        if (!cupData) {
            return {
                provider: "ICL",
                code_link: cup.link,
                cup_id: cup.cup_id,
                updated_at: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
                amount: "error",
            };
        }

        return {
            provider: "ICL",
            code_link: cup.link,
            cup_id: cup.cup_id,
            updated_at: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            amount: cupData.amount,
        };
    });

    return { data: allCupsData, error: errorLinks };
};
