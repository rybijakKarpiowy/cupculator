export const translateColor = (colorInput: string): string => {
    let color: string = colorInput;
    if (colorInput.includes("_")) {
        color = colorInput.trim().replace(" ", "");
    }

    // if color has space in it, return the color
    if (color.includes(" ")) return color;

    // if color is in two parts, translate both
    if (color.split("-").length === 2) {
        const [first, second] = color.split("-");
        return `${translateColor(first)}-${translateColor(second)}`;
    }

    // else, translate the color
    switch (color) {
        case "przezroczysty":
            return "transparent";
        case "biały":
            return "white";
        case "granatowy":
            return "navy";
        case "turkusowy":
            return "teal";
        case "czarny":
            return "black";
        case "czerwony":
            return "red";
        case "fioletowy":
            return "purple";
        case "pomarańczowy":
            return "orange";
        case "różowy":
            return "pink";
        case "szary":
            return "gray";
        case "jasnoszary":
            return "lightgray";
        case "jasnozielony":
            return "lime";
        case "żółty":
            return "yellow";
        case "niebieski":
            return "blue";
        case "miętowy":
            return "mint";
        case "kremowy":
            return "cream";
        case "pistacjowy":
            return "pistachio";
        case "stalowy":
            return "steel";
        case "ecru":
            return "ecru";
        case "bordowy":
            return "burgundy";
        case "błękitny":
            return "azure";
        case "magenta":
            return "magenta";
        case "lakierowany":
            return "lacquered";
        case "zielony":
            return "green";
        case "jasnoniebieski":
            return "skyblue";
        case "ciemnoniebieski":
            return "darkblue";
        case "koralowy":
            return "coral";
        case "ciemnogranatowy":
            return "darknavy";
        default:
            return color;
    }
};
