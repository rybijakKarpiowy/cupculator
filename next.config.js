/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "kubki.com.pl",
          },
        ]
    },
    env: {
        PROD: process.env.PROD,
        DEV: process.env.DEV,
    },
};

module.exports = nextConfig;
