/** @type {import('next').NextConfig} */

const withFonts = require("next-fonts");

const nextConfig = withFonts({
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "kubki.com.pl",
            },
        ],
    },
    env: {
        PROD: process.env.PROD,
        DEV: process.env.DEV,
    },
});

module.exports = nextConfig;
