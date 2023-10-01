import type { Config } from "drizzle-kit";

export default {
    schema: "./src/database/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        user: process.env.PGSQL_USERNAME!,
        password: process.env.PGSQL_PASSWORD!,
        database: process.env.PGSQL_DATABASE!,
        host: process.env.PGSQL_HOST!,
        port: parseInt(process.env.PGSQL_PORT!),
    },
    driver: "pg",
} satisfies Config;
