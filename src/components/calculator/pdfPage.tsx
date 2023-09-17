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
    amount,
    selectedCup,
    colorPricing,
    additionalValues,
    cupConfig,
    lang,
    clientPriceUnit,
}: {
    amount: number;
    selectedCup: Cup;
    colorPricing: ColorPricing;
    additionalValues: Database["public"]["Tables"]["additional_values"]["Row"];
    cupConfig: CupConfigInterface;
    lang: "1" | "2";
    clientPriceUnit: "zł" | "EUR";
}) => {
    const { data: calculatedPrices } = calculatePrices({
        amount,
        selectedCup,
        colorPricing,
        additionalValues,
        cupConfig,
        lang,
        clientPriceUnit,
    });

    let singleCardboardPrice = 0;
    if (calculatedPrices.cardboard) {
        if (cupConfig.cardboard === "6pack_klapowy" || cupConfig.cardboard === "6pack_wykrojnik") {
            const cardboardCount = Math.ceil((amount || 0) / 6);
            singleCardboardPrice = amount
                ? (calculatedPrices.cardboard * cardboardCount) / amount
                : 0;
        } else {
            singleCardboardPrice = calculatedPrices.cardboard;
        }
    }

    const palletQuantities = getPalletQuantities(amount, selectedCup, cupConfig.cardboard);

    Font.register({
        family: "Abhaya Libre",
        fonts: [
            {
                src: "/fonts/AbhayaLibre-Regular.ttf",
            },
            {
                src: "/fonts/AbhayaLibre-Bold.ttf",
                fontWeight: "bold",
            },
            {
                src: "/fonts/AbhayaLibre-Medium.ttf",
                fontWeight: "medium",
            },
            {
                src: "/fonts/AbhayaLibre-SemiBold.ttf",
                fontWeight: "semibold",
            },
            {
                src: "/fonts/AbhayaLibre-ExtraBold.ttf",
                fontWeight: "ultrabold",
            },
        ],
    });

    const styles = StyleSheet.create({
        page: {
            flexDirection: "column",
            backgroundColor: "#fff",
            fontFamily: "Abhaya Libre",
            height: "100%",
        },
        p: {
            fontSize: 12,
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
                    justifyContent: "space-between",
                }}
            >
                <Text style={{ ...styles.p, margin: 10 }}>
                    {lang === "1" ? "Data: " : "Date: "}
                    {new Date().toLocaleDateString("pl-PL")}
                </Text>
                <Text style={{ ...styles.p, margin: 10, color: "#c00418" }}>
                    {lang === "1" ? "Oferta jest ważna 14 dni" : "Offer is valid for 14 days"}
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
                    <Text style={styles.p}>
                        {lang === "1" ? "Ilość: " : "Amount: "}
                        {amount}
                    </Text>
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
                                        ? `Nadruk wewnątrz na ściance: ${cupConfig.nadruk_wewnatrz_na_sciance}`
                                        : `Print on the wall inside: ${cupConfig.nadruk_wewnatrz_na_sciance}`}
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
                            (lang === "1" ? "Kartoniki jednostkowe" : "Unit cartons")}
                        {cupConfig.cardboard === "6pack_klapowy" &&
                            (lang === "1" ? "6-pak klapowy" : "6-pack flap")}
                        {cupConfig.cardboard === "6pack_wykrojnik" &&
                            (lang === "1" ? "6-pak z wykrojnika" : "6-pack from a die")}
                        {!cupConfig.cardboard &&
                            (lang === "1" ? "Opakowanie zbiorcze" : "Bulk packaging")}
                    </Text>
                </View>
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
                <Text style={styles.p}>
                    {lang === "1"
                        ? "Produkt z nadrukiem (1 szt, netto): "
                        : "Product with imprint (1 pcs, netto): "}
                    {calculatedPrices.unit === null ? "" : priceToString(calculatedPrices.unit)}
                    {clientPriceUnit}
                </Text>
                <Text style={styles.p}>
                    {lang === "1" ? "Opakowanie (1 szt, netto): " : "Packaging (1 pcs, netto): "}
                    {singleCardboardPrice ? priceToString(singleCardboardPrice) : "0.00"}
                    {clientPriceUnit}
                </Text>
                <Text style={styles.p}>
                    {lang === "1" ? "Przygotowalnia: " : "Set-up: "}
                    {priceToString(calculatedPrices.prep)}
                    {clientPriceUnit}
                </Text>
                <Text style={styles.p}>
                    {"Transport: "}
                    {clientPriceUnit === "zł"
                        ? `${priceToString(calculatedPrices.transport)} ${clientPriceUnit}`
                        : "Please contact your advisor"}
                </Text>
                <Text style={styles.p}>
                    {lang === "1"
                        ? "Całkowita wartość kalkulacji netto: "
                        : "Total sum of the calculation netto: "}
                    {calculatedPrices.prep !== null && calculatedPrices.unit !== null && amount
                        ? calculatedPrices.transport
                            ? priceToString(
                                  Math.round(
                                      (calculatedPrices.prep +
                                          (calculatedPrices.unit + singleCardboardPrice) * amount +
                                          calculatedPrices.transport) *
                                          100
                                  ) / 100
                              )
                            : priceToString(
                                  Math.round(
                                      (calculatedPrices.prep +
                                          (calculatedPrices.unit + singleCardboardPrice) * amount) *
                                          100
                                  ) / 100
                              )
                        : "0.00"}
                    {clientPriceUnit}
                </Text>
                <Text style={{ ...styles.p, marginTop: 20, marginBottom: 8, fontWeight: "bold" }}>
                    {lang === "1" ? "Dane logistyczne" : "Logistic details"}
                </Text>
                <Text style={styles.p}>
                    {lang === "1" ? "Liczba palet MINI: " : "Quantity of pallets MINI: "}
                    {palletQuantities.mini}
                </Text>
                <Text style={styles.p}>
                    {lang === "1" ? "Liczba półpalet: " : "Quantity of half-pallets: "}
                    {palletQuantities.half}
                </Text>
                <Text style={styles.p}>
                    {lang === "1" ? "Liczba palet EUR: " : "Quantity of pallets EUR: "}
                    {palletQuantities.full}
                </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column", alignSelf: "flex-end" }}>
                <Text style={styles.p}>
                    {lang === "1"
                        ? "Cena do potwierdzenia po przesłaniu plików graficznych."
                        : "We will confirm the price aer sending the vector files for checking."}
                </Text>
                {clientPriceUnit === "zł" && (
                    <Text style={styles.p}>
                        {lang === "1"
                            ? "Do podanych cen neo należy doliczyć podatek VAT (23%)."
                            : "The prices do not include VAT (23%)."}
                    </Text>
                )}
            </View>
        </Page>
    );
};
