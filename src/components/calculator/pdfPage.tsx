import { Cup } from "@/app/api/updatecups/route";
import { Database } from "@/database/types";
import { ColorPricing } from "@/lib/colorPricingType";
import { translateColor } from "@/lib/translateColor";
import { Font, Page, View, StyleSheet, Image, Text } from "@react-pdf/renderer";
import { CupConfigInterface } from "./calculator";
import { calculatePrices } from "@/lib/calculatePrices";
import { priceToString } from "@/lib/priceToString";
import { getPalletQuantities } from "@/lib/getPalletQuantities";

export const PdfPage = ({
    amounts,
    selectedCup,
    colorPricing,
    additionalValues,
    cupConfig,
    lang,
    clientPriceUnit,
}: {
    amounts: {
        amount1: number | null;
        amount2: number | null;
        amount3: number | null;
        inputs: number;
    };
    selectedCup: Cup;
    colorPricing: ColorPricing;
    additionalValues: Database["public"]["Tables"]["additional_values"]["Row"];
    cupConfig: CupConfigInterface;
    lang: "1" | "2";
    clientPriceUnit: "zł" | "EUR";
}) => {
    let calculatedPrices = {
        1: {
            unit: null as number | null,
            prep: null as number | null,
            transport: null as number | null,
            cardboard: null as number | null,
            singleCardboardPrice: null as number | null,
        },
        2: {
            unit: null as number | null,
            prep: null as number | null,
            transport: null as number | null,
            cardboard: null as number | null,
            singleCardboardPrice: null as number | null,
        },
        3: {
            unit: null as number | null,
            prep: null as number | null,
            transport: null as number | null,
            cardboard: null as number | null,
            singleCardboardPrice: null as number | null,
        },
    };

    for (let i = 1; i <= 3; i++) {
        if (!amounts[`amount${i as 1 | 2 | 3}`]) continue;
        const { data } = calculatePrices({
            amount: amounts[`amount${i as 1 | 2 | 3}`],
            selectedCup,
            colorPricing,
            additionalValues,
            cupConfig,
            lang,
            clientPriceUnit,
        });
        let singleCardboardPrice = 0;
        if (data.cardboard) {
            if (
                cupConfig.cardboard === "6pack_klapowy" ||
                cupConfig.cardboard === "6pack_wykrojnik"
            ) {
                const cardboardCount = Math.ceil((amounts[`amount${i as 1 | 2 | 3}`] || 0) / 6);
                singleCardboardPrice = amounts[`amount${i as 1 | 2 | 3}`]
                    ? Math.round(
                          ((data.cardboard * cardboardCount) /
                              amounts[`amount${i as 1 | 2 | 3}`]!) *
                              100
                      ) / 100
                    : 0;
            } else {
                singleCardboardPrice = data.cardboard;
            }
        }

        calculatedPrices[i as 1 | 2 | 3] = {
            unit: data.unit,
            prep: data.prep,
            transport: data.transport,
            cardboard: data.cardboard,
            singleCardboardPrice,
        };
    }

    const palletQuantities = {
        1: getPalletQuantities(amounts.amount1, selectedCup, cupConfig.cardboard),
        2: getPalletQuantities(amounts.amount2, selectedCup, cupConfig.cardboard),
        3: getPalletQuantities(amounts.amount3, selectedCup, cupConfig.cardboard),
    };

    Font.register({
        family: "Calibri",
        fonts: [
            {
                src: "/fonts/Calibri.ttf",
            },
            {
                src: "/fonts/calibrib.ttf",
                fontWeight: "bold",
            },
            {
                src: "/fonts/calibril.ttf",
                fontWeight: "light",
            },
        ],
    });

    const styles = StyleSheet.create({
        page: {
            flexDirection: "column",
            backgroundColor: "#fff",
            fontFamily: "Calibri",
            height: "100%",
            padding: 20,
        },
        p: {
            fontSize: 10,
            color: "#000",
        },
        psmall: {
            fontSize: 9,
            color: "#000",
        },
    });

    return (
        <Page size="A4" style={styles.page}>
            <Image
                src="/logo-20lat.png"
                style={{ height: "63px", width: "200px", margin: "10 10 0 10" }}
            />
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                <Text style={{ ...styles.p, margin: 10 }}>
                    {lang === "1" ? "Data: " : "Date: "}
                    {new Date().toLocaleDateString("pl-PL")}
                </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                <Text style={{ ...styles.p, fontWeight: "bold" }}>
                    {lang === "1" ? "Specyfikacja" : "Specification"}
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Image
                        src={"/noimage.png"}
                        style={{ height: "125px", width: "100px", objectFit: "cover" }}
                    />
                    <View style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                        <Text style={styles.p}>{selectedCup.code}</Text>
                        <Text style={styles.p}>{selectedCup.name}</Text>
                        <Text style={styles.p}>{selectedCup.volume}</Text>
                        <Text style={styles.p}>
                            {lang === "1" ? selectedCup.color : translateColor(selectedCup.color)}
                        </Text>
                    </View>
                </View>
                <View style={{ display: "flex", flexDirection: "column" }}>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        {amounts.amount1 && (
                            <Text style={styles.p}>
                                {lang === "1" ? "Ilość: " : "Amount: "}
                                {amounts.amount1}
                            </Text>
                        )}
                        {amounts.amount2 && (
                            <Text style={styles.p}>
                                {lang === "1" ? "Ilość: " : "Amount: "}
                                {amounts.amount2}
                            </Text>
                        )}
                        {amounts.amount3 && (
                            <Text style={styles.p}>
                                {lang === "1" ? "Ilość: " : "Amount: "}
                                {amounts.amount3}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.p}>
                        {lang === "1" ? "Nadruk: " : "Print type: "}
                        {cupConfig.imprintType === "direct_print" &&
                            (lang === "1" ? "Nadruk bezpośredni" : "Direct print")}
                        {cupConfig.imprintType === "transfer_plus_1" &&
                            (lang === "1" ? "Transfer Plus 1 strona" : "Transfer Plus 1 side")}
                        {cupConfig.imprintType === "transfer_plus_2" &&
                            (lang === "1" ? "Transfer Plus 2 strony" : "Transfer Plus 2 sides")}
                        {cupConfig.imprintType === "transfer_plus_round" &&
                            (lang === "1" ? "Transfer Plus tapeta" : "Transfer Plus wallpaper")}
                        {cupConfig.imprintType === "polylux_1" &&
                            (lang === "1" ? "Polylux 1 strona" : "Polylux 1 side")}
                        {cupConfig.imprintType === "polylux_2" &&
                            (lang === "1" ? "Polylux 2 strony" : "Polylux 2 sides")}
                        {cupConfig.imprintType === "polylux_round" &&
                            (lang === "1" ? "Polylux tapeta" : "Polylux wallpaper")}
                        {cupConfig.imprintType === "digital_print" &&
                            (lang === "1" ? "Nadruk cyfrowy" : "Digital print")}
                        {cupConfig.imprintType === "deep_effect_1" &&
                            (lang === "1" ? "Deep Effect 1 strona" : "Deep Effect 1 side")}
                        {cupConfig.imprintType === "deep_effect_2" &&
                            (lang === "1" ? "Deep Effect 2 strony" : "Deep Effect 2 sides")}
                        {cupConfig.imprintType === "deep_effect_plus_1" &&
                            (lang === "1"
                                ? "Deep Effect Plus 1 strona"
                                : "Deep Effect Plus 1 side")}
                        {cupConfig.imprintType === "deep_effect_plus_2" &&
                            (lang === "1"
                                ? "Deep Effect Plus 2 strony"
                                : "Deep Effect Plus 2 sides")}
                        {!cupConfig.imprintType && "Brak"}
                    </Text>
                    {cupConfig.imprintType === "digital_print" && (
                        <Text style={styles.p}>
                            {lang === "1"
                                ? "Liczba kolorów: Pełny kolor"
                                : "Number of colors: Full color"}
                        </Text>
                    )}
                    {[
                        "direct_print",
                        "transfer_plus_1",
                        "transfer_plus_2",
                        "transfer_plus_round",
                        "polylux_1",
                        "polylux_2",
                        "polylux_round",
                    ].includes(cupConfig.imprintType) && (
                        <Text style={styles.p}>
                            {lang === "1" ? "Liczba kolorów: " : "Number of colors: "}
                            {cupConfig.imprintColors}
                        </Text>
                    )}
                    <Text style={styles.p}>
                        {"TrendColor: "}
                        {cupConfig.trend_color === "inside" &&
                            (lang === "1" ? "Wewnątrz" : "Inside")}
                        {cupConfig.trend_color === "outside" &&
                            (lang === "1" ? "Na zewnątrz" : "Outside")}
                        {cupConfig.trend_color === "both" &&
                            (lang === "1" ? "Wewnątrz i na zewnątrz" : "Inside and outside")}
                        {cupConfig.trend_color === "lowered_edge" &&
                            (lang === "1" ? "Z obniżonym ranten" : "With lowered edge")}
                        {!cupConfig.trend_color && (lang === "1" ? "Brak" : "None")}
                    </Text>
                    <Text style={styles.p}>
                        {"ProColor: "}
                        {cupConfig.pro_color
                            ? lang === "1"
                                ? "Wewnątrz"
                                : "Inside"
                            : lang === "1"
                            ? "Brak"
                            : "None"}
                    </Text>
                    <Text style={styles.p}>
                        {"SoftTouch: "}
                        {cupConfig.soft_touch
                            ? lang === "1"
                                ? "Zewnątrz"
                                : "Outside"
                            : lang === "1"
                            ? "Brak"
                            : "None"}
                    </Text>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={styles.p}>
                            {lang === "1" ? "Dodatkowe zdobienia: " : "Additional decorations: "}
                        </Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {cupConfig.nadruk_wewnatrz_na_sciance && (
                                <Text style={styles.p}>
                                    •{" "}
                                    {lang === "1"
                                        ? `Nadruk wewnątrz na ściance: ${cupConfig.nadruk_wewnatrz_na_sciance} szt.`
                                        : `Print on the wall inside: ${cupConfig.nadruk_wewnatrz_na_sciance} pcs.`}
                                </Text>
                            )}
                            {cupConfig.nadruk_na_uchu && (
                                <Text style={styles.p}>
                                    • {lang === "1" ? "Nadruk na uchu" : "Print on the handle"}
                                </Text>
                            )}
                            {cupConfig.nadruk_na_spodzie && (
                                <Text style={styles.p}>
                                    •{" "}
                                    {lang === "1"
                                        ? "Nadruk na spodzie (zewn.)"
                                        : "Print on the bottom outside"}
                                </Text>
                            )}
                            {cupConfig.nadruk_na_dnie && (
                                <Text style={styles.p}>
                                    •{" "}
                                    {lang === "1"
                                        ? "Nadruk na spodzie (wewn.)"
                                        : "Print on the bottom inside"}
                                </Text>
                            )}
                            {cupConfig.nadruk_przez_rant && (
                                <Text style={styles.p}>
                                    • {lang === "1" ? "Nadruk przez rant" : "Over the rim imprint"}
                                </Text>
                            )}
                            {cupConfig.nadruk_apla && (
                                <Text style={styles.p}>
                                    • {lang === "1" ? "Nadruk apla" : "Apla print"}
                                </Text>
                            )}
                            {cupConfig.nadruk_zlotem && cupConfig.nadruk_zlotem !== true && (
                                <Text style={styles.p}>
                                    • {lang === "1" ? "Nadruk złotem: " : "Gold print: "}
                                    {cupConfig.nadruk_zlotem}
                                    {"cm2"}
                                </Text>
                            )}
                            {cupConfig.personalizacja && (
                                <Text style={styles.p}>
                                    • {lang === "1" ? "Personalizacja" : "Personalization"}
                                </Text>
                            )}
                            {cupConfig.zdobienie_paskiem &&
                                cupConfig.zdobienie_paskiem !== true && (
                                    <Text style={styles.p}>
                                        •{" "}
                                        {lang === "1"
                                            ? "Zdobienie paskiem: "
                                            : "Decoration with stripe: "}
                                        {cupConfig.zdobienie_paskiem === "bez_laczenia" &&
                                            (lang === "1" ? "bez łączenia" : "without conection")}
                                        {cupConfig.zdobienie_paskiem === "z_laczeniem" &&
                                            (lang === "1" ? "z łączeniem" : "with conection")}
                                    </Text>
                                )}
                            {cupConfig.nadruk_na_powloce_magicznej_1_kolor && (
                                <Text style={styles.p}>
                                    •{" "}
                                    {lang === "1"
                                        ? "Nadruk na powłoce magicznej (1 kolor)"
                                        : "Print on magic coating (1 color)"}
                                </Text>
                            )}
                            {cupConfig.zdobienie_tapeta_na_barylce &&
                                cupConfig.zdobienie_tapeta_na_barylce !== true && (
                                    <Text style={styles.p}>
                                        •{" "}
                                        {lang === "1"
                                            ? `Zdobienie tapeta na barylce: ${
                                                  cupConfig.zdobienie_tapeta_na_barylce.split(
                                                      "_"
                                                  )[0]
                                              } poziom trudności`
                                            : `Decoration with tape on the barrel: ${
                                                  cupConfig.zdobienie_tapeta_na_barylce.split(
                                                      "_"
                                                  )[0]
                                              } degree of difficulty`}
                                    </Text>
                                )}
                            {cupConfig.naklejka_papierowa_z_nadrukiem && (
                                <Text style={styles.p}>
                                    •{" "}
                                    {lang === "1"
                                        ? "Naklejka papierowa z nadrukiem"
                                        : "Paper sticker with imprint"}
                                </Text>
                            )}
                            {cupConfig.wkladanie_ulotek_do_kubka && (
                                <Text style={styles.p}>
                                    •{" "}
                                    {lang === "1"
                                        ? "Wkładanie ulotek do kubka"
                                        : "Inserting leaflets into the mug"}
                                </Text>
                            )}
                        </View>
                    </View>
                    <Text style={styles.p}>
                        {lang === "1" ? "Sposób pakowania: " : "Packaging type: "}
                        {cupConfig.cardboard === "singular" &&
                            (lang === "1" ? "Kartoniki jednostkowe" : "Single boxes")}
                        {cupConfig.cardboard === "6pack_klapowy" &&
                            (lang === "1" ? "6-pak klapowy" : "6-pack flap")}
                        {cupConfig.cardboard === "6pack_wykrojnik" &&
                            (lang === "1" ? "6-pak z wykrojnika" : "6-pack from a die")}
                        {!cupConfig.cardboard &&
                            (lang === "1" ? "Opakowanie zbiorcze" : "Bulk packaging")}
                    </Text>
                    <Text
                        style={{
                            ...styles.p,
                            fontWeight: "bold",
                            marginTop: 20,
                            marginBottom: 8,
                        }}
                    >
                        {lang === "1" ? "Cena" : "Price"}
                    </Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {amounts.amount1 && (
                        <View style={{ display: "flex", flexDirection: "column" }}>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Produkt z nadrukiem (1 szt. netto): "
                                    : "Product with imprint (1 pcs. net): "}
                                {calculatedPrices[1].unit === null
                                    ? ""
                                    : priceToString(calculatedPrices[1].unit)}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Opakowanie (1 szt. netto): "
                                    : "Packaging (1 pcs. net): "}
                                {calculatedPrices[1].singleCardboardPrice
                                    ? priceToString(calculatedPrices[1].singleCardboardPrice)
                                    : "0.00"}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1" ? "Przygotowalnia: " : "Set-up: "}
                                {priceToString(calculatedPrices[1].prep)}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {"Transport: "}
                                {clientPriceUnit === "zł"
                                    ? `${priceToString(
                                          calculatedPrices[1].transport
                                      )} ${clientPriceUnit}`
                                    : "Please contact your advisor"}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Całkowita wartość kalkulacji netto: "
                                    : "Total sum of the calculation net: "}
                                {calculatedPrices[1].prep !== null &&
                                calculatedPrices[1].unit !== null &&
                                amounts.amount1
                                    ? calculatedPrices[1].transport
                                        ? priceToString(
                                              Math.round(
                                                  (calculatedPrices[1].prep +
                                                      (calculatedPrices[1].unit +
                                                          (calculatedPrices[1]
                                                              .singleCardboardPrice || 0)) *
                                                          amounts.amount1 +
                                                      calculatedPrices[1].transport) *
                                                      100
                                              ) / 100
                                          )
                                        : priceToString(
                                              Math.round(
                                                  (calculatedPrices[1].prep +
                                                      (calculatedPrices[1].unit +
                                                          (calculatedPrices[1]
                                                              .singleCardboardPrice || 0)) *
                                                          amounts.amount1) *
                                                      100
                                              ) / 100
                                          )
                                    : "0.00"}
                                {clientPriceUnit}
                            </Text>
                            <Text
                                style={{
                                    ...styles.p,
                                    marginTop: 20,
                                    marginBottom: 8,
                                    fontWeight: "bold",
                                }}
                            >
                                {lang === "1" ? "Dane logistyczne" : "Logistic details"}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1"
                                    ? "Liczba palet MINI: "
                                    : "Quantity of pallets MINI: "}
                                {palletQuantities[1].mini}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1" ? "Liczba półpalet: " : "Quantity of half-pallets: "}
                                {palletQuantities[1].half}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1" ? "Liczba palet EURO: " : "Quantity of pallets EUR: "}
                                {palletQuantities[1].full}
                            </Text>
                        </View>
                    )}
                    {amounts.amount2 && (
                        <View style={{ display: "flex", flexDirection: "column" }}>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Produkt z nadrukiem (1 szt. netto): "
                                    : "Product with imprint (1 pcs. net): "}
                                {calculatedPrices[2].unit === null
                                    ? ""
                                    : priceToString(calculatedPrices[2].unit)}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Opakowanie (1 szt. netto): "
                                    : "Packaging (1 pcs. net): "}
                                {calculatedPrices[2].singleCardboardPrice
                                    ? priceToString(calculatedPrices[2].singleCardboardPrice)
                                    : "0.00"}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1" ? "Przygotowalnia: " : "Set-up: "}
                                {priceToString(calculatedPrices[2].prep)}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {"Transport: "}
                                {clientPriceUnit === "zł"
                                    ? `${priceToString(
                                          calculatedPrices[2].transport
                                      )} ${clientPriceUnit}`
                                    : "Please contact your advisor"}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Całkowita wartość kalkulacji netto: "
                                    : "Total sum of the calculation net: "}
                                {calculatedPrices[2].prep !== null &&
                                calculatedPrices[2].unit !== null &&
                                amounts.amount2
                                    ? calculatedPrices[2].transport
                                        ? priceToString(
                                              Math.round(
                                                  (calculatedPrices[2].prep +
                                                      (calculatedPrices[2].unit +
                                                          (calculatedPrices[2]
                                                              .singleCardboardPrice || 0)) *
                                                          amounts.amount2 +
                                                      calculatedPrices[2].transport) *
                                                      100
                                              ) / 100
                                          )
                                        : priceToString(
                                              Math.round(
                                                  (calculatedPrices[2].prep +
                                                      (calculatedPrices[2].unit +
                                                          (calculatedPrices[2]
                                                              .singleCardboardPrice || 0)) *
                                                          amounts.amount2) *
                                                      100
                                              ) / 100
                                          )
                                    : "0.00"}
                                {clientPriceUnit}
                            </Text>
                            <Text
                                style={{
                                    ...styles.p,
                                    marginTop: 20,
                                    marginBottom: 8,
                                    fontWeight: "bold",
                                }}
                            >
                                {lang === "1" ? "Dane logistyczne" : "Logistic details"}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1"
                                    ? "Liczba palet MINI: "
                                    : "Quantity of pallets MINI: "}
                                {palletQuantities[2].mini}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1" ? "Liczba półpalet: " : "Quantity of half-pallets: "}
                                {palletQuantities[2].half}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1" ? "Liczba palet EURO: " : "Quantity of pallets EUR: "}
                                {palletQuantities[2].full}
                            </Text>
                        </View>
                    )}
                    {amounts.amount3 && (
                        <View style={{ display: "flex", flexDirection: "column" }}>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Produkt z nadrukiem (1 szt. netto): "
                                    : "Product with imprint (1 pcs. net): "}
                                {calculatedPrices[3].unit === null
                                    ? ""
                                    : priceToString(calculatedPrices[3].unit)}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Opakowanie (1 szt. netto): "
                                    : "Packaging (1 pcs. net): "}
                                {calculatedPrices[3].singleCardboardPrice
                                    ? priceToString(calculatedPrices[3].singleCardboardPrice)
                                    : "0.00"}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1" ? "Przygotowalnia: " : "Set-up: "}
                                {priceToString(calculatedPrices[3].prep)}
                                {clientPriceUnit}
                            </Text>
                            <Text style={styles.psmall}>
                                {"Transport: "}
                                {clientPriceUnit === "zł"
                                    ? `${priceToString(
                                          calculatedPrices[3].transport
                                      )} ${clientPriceUnit}`
                                    : "Please contact your advisor"}
                            </Text>
                            <Text style={styles.psmall}>
                                {lang === "1"
                                    ? "Całkowita wartość kalkulacji netto: "
                                    : "Total sum of the calculation net: "}
                                {calculatedPrices[3].prep !== null &&
                                calculatedPrices[3].unit !== null &&
                                amounts.amount3
                                    ? calculatedPrices[3].transport
                                        ? priceToString(
                                              Math.round(
                                                  (calculatedPrices[3].prep +
                                                      (calculatedPrices[3].unit +
                                                          (calculatedPrices[3]
                                                              .singleCardboardPrice || 0)) *
                                                          amounts.amount3 +
                                                      calculatedPrices[3].transport) *
                                                      100
                                              ) / 100
                                          )
                                        : priceToString(
                                              Math.round(
                                                  (calculatedPrices[3].prep +
                                                      (calculatedPrices[3].unit +
                                                          (calculatedPrices[3]
                                                              .singleCardboardPrice || 0)) *
                                                          amounts.amount3) *
                                                      100
                                              ) / 100
                                          )
                                    : "0.00"}
                                {clientPriceUnit}
                            </Text>
                            <Text
                                style={{
                                    ...styles.p,
                                    marginTop: 20,
                                    marginBottom: 8,
                                    fontWeight: "bold",
                                }}
                            >
                                {lang === "1" ? "Dane logistyczne" : "Logistic details"}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1"
                                    ? "Liczba palet MINI: "
                                    : "Quantity of pallets MINI: "}
                                {palletQuantities[3].mini}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1" ? "Liczba półpalet: " : "Quantity of half-pallets: "}
                                {palletQuantities[3].half}
                            </Text>
                            <Text style={styles.p}>
                                {lang === "1" ? "Liczba palet EURO: " : "Quantity of pallets EUR: "}
                                {palletQuantities[3].full}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Text style={{ ...styles.p, margin: 10, color: "#c00418" }}>
                    {lang === "1" ? "Oferta jest ważna 14 dni" : "Offer is valid for 14 days"}
                </Text>
                <Text style={styles.p}>
                    {lang === "1"
                        ? "Cena zostanie potwierdzona po przesłaniu plików graficznych."
                        : "We will confirm the price after sending the vector files for checking."}
                </Text>
                {clientPriceUnit === "zł" && (
                    <Text style={styles.p}>
                        {lang === "1"
                            ? "Do podanych cen netto należy doliczyć podatek VAT (23%)."
                            : "The prices do not include VAT (23%)."}
                    </Text>
                )}
            </View>
        </Page>
    );
};
