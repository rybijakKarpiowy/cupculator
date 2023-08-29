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
};

module.exports = nextConfig;
