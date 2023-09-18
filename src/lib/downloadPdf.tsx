import { Cup } from "@/app/api/updatecups/route";
import { CupConfigInterface } from "@/components/calculator/calculator";
import { ColorPricing } from "./colorPricingType";
import { Database } from "@/database/types";
import { saveAs } from "file-saver";
import { Document, pdf } from "@react-pdf/renderer";
import { PdfPage } from "@/components/calculator/pdfPage";

export const downloadPdf = async ({
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
    const fileName = `${selectedCup.name}-${lang === "1" ? "cena" : "price"}.pdf`;

    const DownloadDocument = () => {
        return (
            <Document>
                <PdfPage
                    amounts={amounts}
                    selectedCup={selectedCup}
                    colorPricing={colorPricing}
                    additionalValues={additionalValues}
                    cupConfig={cupConfig}
                    lang={lang}
                    clientPriceUnit={clientPriceUnit}
                />
            </Document>
        );
    };

    const blob = await pdf(<DownloadDocument />).toBlob();
    saveAs(blob, fileName);
};
