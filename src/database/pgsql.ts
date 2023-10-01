import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

// for migrations
// const migrationClient = postgres({
//     max: 1,
//     user: process.env.PGSQL_USERNAME!,
//     password: process.env.PGSQL_PASSWORD!,
//     database: process.env.PGSQL_DATABASE!,
//     host: process.env.PGSQL_HOST!,
//     port: parseInt(process.env.PGSQL_PORT!),
// });
// migrate(drizzle(migrationClient), {
//     migrationsFolder: "./src/database/migrations",
// });

// for the app
const queryClient = postgres({
    user: process.env.PGSQL_USERNAME!,
    password: process.env.PGSQL_PASSWORD!,
    database: process.env.PGSQL_DATABASE!,
    host: process.env.PGSQL_HOST!,
    port: parseInt(process.env.PGSQL_PORT!),
    connection: {
        application_name: "calculator"
    },
    max: 30,
});
export const pgsql = drizzle(queryClient, { schema });
