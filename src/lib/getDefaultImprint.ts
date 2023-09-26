import { Cup } from "@/app/api/updatecups/route";

export const getDefaultImprint = (selectedCup: Cup) => {
    if (selectedCup.digital_print) {
        return ""
    }
    if (selectedCup.transfer_plus) {
        return "transfer_plus_1"
    }
    if (selectedCup.polylux) {
        return "polylux_1"
    }
    return ""
}