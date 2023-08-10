import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

export const colorSheetParser = async (sheet: GoogleSpreadsheetWorksheet) => {
    const transfer_plus_raw = await sheet.getCellsInRange("B6:Y12") as string[][];
    const polylux_raw = await sheet.getCellsInRange("B17:Y23") as string[][];
    const direct_print_raw = await sheet.getCellsInRange("B28:K31") as string[][];
    const trend_color_raw = await sheet.getCellsInRange("B36:K37") as string[][];
    const pro_color_raw = await sheet.getCellsInRange("B42:K43") as string[][];
    const deep_effect_raw = await sheet.getCellsInRange("B48:K49") as string[][];
    const digital_print_raw = await sheet.getCellsInRange("B54:K54") as string[][];
    const cardboard_print_raw = await sheet.getCellsInRange("B59:K60") as string[][];
    const soft_touch_raw = await sheet.getCellsInRange("B65:K65") as string[][];
    const deep_effect_plus_raw = await sheet.getCellsInRange("B70:K71") as string[][];
    const trend_color_lowered_edge_raw = await sheet.getCellsInRange("B76:K76") as string[][];
    const additional_costs_raw = await sheet.getCellsInRange("N26:U42") as string[][];
    const cardboards_raw = await sheet.getCellsInRange("N50:Y54") as string[][];


    // handle raw data here
    const transfer_plus = transfer_plus_raw.map((row) => {
        while (row.length < 24) {
            row.push("0");
        }
        const obj = {
            colorCount: row[0],
            prepCost: parseFloat(row[1].replace(",", ".")),
            nextOrderCost: parseFloat(row[2].replace(",", ".")),
            prices: {
                24: {
                    1: parseFloat(row[3].replace(",", ".")),
                    2: parseFloat(row[4].replace(",", ".")),
                    wallpaper: parseFloat(row[5].replace(",", ".")),
                },
                72: {
                    1: parseFloat(row[6].replace(",", ".")),
                    2: parseFloat(row[7].replace(",", ".")),
                    wallpaper: parseFloat(row[8].replace(",", ".")),
                },
                108: {
                    1: parseFloat(row[9].replace(",", ".")),
                    2: parseFloat(row[10].replace(",", ".")),
                    wallpaper: parseFloat(row[11].replace(",", ".")),
                },
                216: {
                    1: parseFloat(row[12].replace(",", ".")),
                    2: parseFloat(row[13].replace(",", ".")),
                    wallpaper: parseFloat(row[14].replace(",", ".")),
                },
                504: {
                    1: parseFloat(row[15].replace(",", ".")),
                    2: parseFloat(row[16].replace(",", ".")),
                    wallpaper: parseFloat(row[17].replace(",", ".")),
                },
                1008: {
                    1: parseFloat(row[18].replace(",", ".")),
                    2: parseFloat(row[19].replace(",", ".")),
                    wallpaper: parseFloat(row[20].replace(",", ".")),
                },
                2520: {
                    1: parseFloat(row[21].replace(",", ".")),
                    2: parseFloat(row[22].replace(",", ".")),
                    wallpaper: parseFloat(row[23].replace(",", ".")),
                },
            }
        }
        return obj;
    })

    const polylux = polylux_raw.map((row) => {
        while (row.length < 24) {
            row.push("0");
        }
        const obj = {
            colorCount: row[0],
            prepCost: parseFloat(row[1].replace(",", ".")),
            nextOrderCost: parseFloat(row[2].replace(",", ".")),
            prices: {
                24: {
                    1: parseFloat(row[3].replace(",", ".")),
                    2: parseFloat(row[4].replace(",", ".")),
                    wallpaper: parseFloat(row[5].replace(",", ".")),
                },
                72: {
                    1: parseFloat(row[6].replace(",", ".")),
                    2: parseFloat(row[7].replace(",", ".")),
                    wallpaper: parseFloat(row[8].replace(",", ".")),
                },
                108: {
                    1: parseFloat(row[9].replace(",", ".")),
                    2: parseFloat(row[10].replace(",", ".")),
                    wallpaper: parseFloat(row[11].replace(",", ".")),
                },
                216: {
                    1: parseFloat(row[12].replace(",", ".")),
                    2: parseFloat(row[13].replace(",", ".")),
                    wallpaper: parseFloat(row[14].replace(",", ".")),
                },
                504: {
                    1: parseFloat(row[15].replace(",", ".")),
                    2: parseFloat(row[16].replace(",", ".")),
                    wallpaper: parseFloat(row[17].replace(",", ".")),
                },
                1008: {
                    1: parseFloat(row[18].replace(",", ".")),
                    2: parseFloat(row[19].replace(",", ".")),
                    wallpaper: parseFloat(row[20].replace(",", ".")),
                },
                2520: {
                    1: parseFloat(row[21].replace(",", ".")),
                    2: parseFloat(row[22].replace(",", ".")),
                    wallpaper: parseFloat(row[23].replace(",", ".")),
                },
            }
        }
        return obj;
    })

    const direct_print = direct_print_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            colorCount: row[0],
            prepCost: parseFloat(row[1].replace(",", ".")),
            nextOrderCost: parseFloat(row[2].replace(",", ".")),
            prices: {
                ...(row[4] && { 72: parseFloat(row[4].replace(",", ".")) }),
                ...(row[5] && { 108: parseFloat(row[5].replace(",", ".")) }),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })

    const trend_color = trend_color_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            inOut: row[0],
            prices: {
                24: parseFloat(row[3].replace(",", ".")),
                72: parseFloat(row[4].replace(",", ".")),
                108: parseFloat(row[5].replace(",", ".")),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })

    const pro_color = pro_color_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            inOut: row[0],
            prices: {
                24: parseFloat(row[3].replace(",", ".")),
                72: parseFloat(row[4].replace(",", ".")),
                108: parseFloat(row[5].replace(",", ".")),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })

    const deep_effect = deep_effect_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            sidesCount: row[0],
            prepCost: parseFloat(row[1].replace(",", ".")),
            prices: {
                24: parseFloat(row[3].replace(",", ".")),
                72: parseFloat(row[4].replace(",", ".")),
                108: parseFloat(row[5].replace(",", ".")),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })

    const digital_print = digital_print_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            prepCost: parseFloat(row[1].replace(",", ".")),
            prices: {
                24: parseFloat(row[3].replace(",", ".")),
                72: parseFloat(row[4].replace(",", ".")),
                108: parseFloat(row[5].replace(",", ".")),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })[0]

    const cardboard_print = cardboard_print_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            colorCount: row[0],
            prepCost: parseFloat(row[1].replace(",", ".")),
            nextOrderCost: parseFloat(row[2].replace(",", ".")),
            prices: {
                24: parseFloat(row[3].replace(",", ".")),
                72: parseFloat(row[4].replace(",", ".")),
                108: parseFloat(row[5].replace(",", ".")),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })

    const soft_touch = soft_touch_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            inOut: row[0],
            prices: {
                24: parseFloat(row[3].replace(",", ".")),
                72: parseFloat(row[4].replace(",", ".")),
                108: parseFloat(row[5].replace(",", ".")),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })[0]

    const deep_effect_plus = deep_effect_plus_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            sidesCount: row[0],
            prepCost: parseFloat(row[1].replace(",", ".")),
            prices: {
                24: parseFloat(row[3].replace(",", ".")),
                72: parseFloat(row[4].replace(",", ".")),
                108: parseFloat(row[5].replace(",", ".")),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })

    const trend_color_lowered_edge = trend_color_lowered_edge_raw.map((row) => {
        while (row.length < 10) {
            row.push("0");
        }
        const obj = {
            inOut: row[0],
            prices: {
                24: parseFloat(row[3].replace(",", ".")),
                72: parseFloat(row[4].replace(",", ".")),
                108: parseFloat(row[5].replace(",", ".")),
                216: parseFloat(row[6].replace(",", ".")),
                504: parseFloat(row[7].replace(",", ".")),
                1008: parseFloat(row[8].replace(",", ".")),
                2520: parseFloat(row[9].replace(",", ".")),
            }
        }
        return obj;
    })[0]

    const additional_costs = additional_costs_raw.map((row) => {
        while (row.length < 8) {
            row.push("0");
        }
        const obj = {
            name: row[0],
            price: parseFloat(row[7].replace(",", ".")),
        }
        return obj;
    })

    const cardboards = cardboards_raw.map((row) => {
        while (row.length < 12) {
            row.push("0");
        }
        const obj = {
            name: row[0],
            material: row[3],
            prices: {
                24: parseFloat(row[5].replace(",", ".")),
                72: parseFloat(row[6].replace(",", ".")),
                108: parseFloat(row[7].replace(",", ".")),
                216: parseFloat(row[8].replace(",", ".")),
                504: parseFloat(row[9].replace(",", ".")),
                1008: parseFloat(row[10].replace(",", ".")),
                2520: parseFloat(row[11].replace(",", ".")),
            }
        }
        return obj;
    })

    return {
        transfer_plus,
        polylux,
        direct_print,
        trend_color,
        pro_color,
        deep_effect,
        digital_print,
        cardboard_print,
        soft_touch,
        deep_effect_plus,
        trend_color_lowered_edge,
        additional_costs,
        cardboards,
    }
}