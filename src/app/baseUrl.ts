export const baseUrl = (
    process.env.PROD === "true"
        ? "https://calculator.kubki.com.pl"
        : process.env.DEV === "true"
        ? "https://cupculator-rybijakkarpiowy.vercel.app"
        : "http://localhost:3000"
) as string;