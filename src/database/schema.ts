import {
    pgTable,
    serial,
    real,
    unique,
    text,
    json,
    bigint,
    foreignKey,
    smallint,
    boolean,
    primaryKey,
    timestamp,
    integer,
    uuid,
    pgEnum,
} from "drizzle-orm/pg-core";

import { relations, sql } from "drizzle-orm";
export const roleEnum = pgEnum("role_enum", ["User", "Salesman", "Admin"]);
export const warehouseAccesEnum = pgEnum("warehouse_acces_enum", ["None", "Actual", "Fictional"]);

export const additional_values = pgTable("additional_values", {
    id: serial("id").primaryKey().notNull(),
    plain_cup_markup_percent: real("plain_cup_markup_percent").default(20).notNull(),
    mini_pallet_price: real("mini_pallet_price").notNull(),
    half_pallet_price: real("half_pallet_price").notNull(),
    full_pallet_price: real("full_pallet_price").notNull(),
});

export const color_pricings = pgTable(
    "color_pricings",
    {
        id: serial("id").primaryKey().notNull(),
        pricing_name: text("pricing_name").notNull(),
        // TODO: failed to parse database type 'json[]'
        transfer_plus: json("transfer_plus").array().notNull(),
        // TODO: failed to parse database type 'json[]'
        polylux: json("polylux").array().notNull(),
        // TODO: failed to parse database type 'json[]'
        direct_print: json("direct_print").array().notNull(),
        // TODO: failed to parse database type 'json[]'
        trend_color: json("trend_color").array().notNull(),
        // TODO: failed to parse database type 'json[]'
        pro_color: json("pro_color").array().notNull(),
        // TODO: failed to parse database type 'json[]'
        deep_effect: json("deep_effect").array().notNull(),
        digital_print: json("digital_print").notNull(),
        // TODO: failed to parse database type 'json[]'
        cardboard_print: json("cardboard_print").array().notNull(),
        soft_touch: json("soft_touch").notNull(),
        // TODO: failed to parse database type 'json[]'
        deep_effect_plus: json("deep_effect_plus").array().notNull(),
        trend_color_lowered_edge: json("trend_color_lowered_edge").notNull(),
        additional_costs: json("additional_costs").notNull(),
        // TODO: failed to parse database type 'json[]'
        cardboards: json("cardboards").array().notNull(),
    },
    (table) => {
        return {
            color_pricings_pricing_name_key: unique("color_pricings_pricing_name_key").on(
                table.pricing_name
            ),
        };
    }
);

export const available_color_pricings = pgTable("available_color_pricings", {
    pricing_name: text("pricing_name"),
});

export const available_cup_pricings = pgTable("available_cup_pricings", {
    pricing_name: text("pricing_name"),
});

export const cup_ids_in_pricings = pgTable("cup_ids_in_pricings", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    cup_id: bigint("cup_id", { mode: "number" }),
});

export const cup_pricings = pgTable(
    "cup_pricings",
    {
        id: serial("id").primaryKey().notNull(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        cup_id: bigint("cup_id", { mode: "number" })
            .notNull()
            .references(() => cups.id, { onDelete: "cascade" }),
        pricing_name: text("pricing_name").notNull(),
        price_24: real("price_24").notNull(),
        price_72: real("price_72").notNull(),
        price_108: real("price_108").notNull(),
        price_216: real("price_216").notNull(),
        price_504: real("price_504").notNull(),
        price_1008: real("price_1008").notNull(),
        price_2520: real("price_2520").notNull(),
    },
    (table) => {
        return {
            cup_pricings_cup_id_pricing_name_key: unique("cup_pricings_cup_id_pricing_name_key").on(
                table.cup_id,
                table.pricing_name
            ),
        };
    }
);

export const restrictions = pgTable("restrictions", {
    id: serial("id").primaryKey().notNull(),
    imprintType: text("imprintType").notNull(),
    anotherValue: text("anotherValue").notNull(),
});

export const cups = pgTable(
    "cups",
    {
        id: serial("id").primaryKey().notNull(),
        code: text("code").notNull(),
        name: text("name").notNull(),
        color: text("color").notNull(),
        material: text("material").notNull(),
        category: text("category").notNull(),
        icon: text("icon"),
        volume: text("volume").notNull(),
        supplier: text("supplier"),
        supplier_code: text("supplier_code"),
        mini_pallet: smallint("mini_pallet").default(0),
        half_pallet: smallint("half_pallet").default(0),
        full_pallet: smallint("full_pallet").default(0),
        deep_effect: boolean("deep_effect").default(false),
        deep_effect_plus: boolean("deep_effect_plus").default(false),
        digital_print: boolean("digital_print").default(false),
        direct_print: boolean("direct_print").default(false),
        polylux: boolean("polylux").default(false),
        transfer_plus: boolean("transfer_plus").default(false),
        nadruk_apla: boolean("nadruk_apla").default(false),
        nadruk_dookola_pod_uchem: boolean("nadruk_dookola_pod_uchem").default(false),
        nadruk_na_dnie: boolean("nadruk_na_dnie").default(false),
        nadruk_na_powloce_magicznej_1_kolor: boolean("nadruk_na_powloce_magicznej_1_kolor").default(
            false
        ),
        nadruk_na_uchu: boolean("nadruk_na_uchu").default(false),
        nadruk_przez_rant: boolean("nadruk_przez_rant").default(false),
        nadruk_wewnatrz_na_sciance: boolean("nadruk_wewnatrz_na_sciance").default(false),
        nadruk_zlotem_do_25cm2: boolean("nadruk_zlotem_do_25cm2").default(false),
        nadruk_zlotem_do_50cm2: boolean("nadruk_zlotem_do_50cm2").default(false),
        naklejka_papierowa_z_nadrukiem: boolean("naklejka_papierowa_z_nadrukiem").default(false),
        personalizacja: boolean("personalizacja").default(false),
        pro_color: boolean("pro_color").default(false),
        soft_touch: boolean("soft_touch").default(false),
        trend_color: boolean("trend_color").default(false),
        trend_color_lowered_edge: boolean("trend_color_lowered_edge").default(false),
        wkladanie_ulotek_do_kubka: boolean("wkladanie_ulotek_do_kubka").default(false),
        zdobienie_paskiem_bez_laczenia: boolean("zdobienie_paskiem_bez_laczenia").default(false),
        zdobienie_paskiem_z_laczeniem: boolean("zdobienie_paskiem_z_laczeniem").default(false),
        zdobienie_tapeta_na_barylce_II_stopien_trudnosci: boolean(
            "zdobienie_tapeta_na_barylce_II_stopien_trudnosci"
        ).default(false),
        zdobienie_tapeta_na_barylce_I_stopien_trudnosci: boolean(
            "zdobienie_tapeta_na_barylce_I_stopien_trudnosci"
        ).default(false),
        digital_print_additional: boolean("digital_print_additional").default(false),
        nadruk_na_spodzie: boolean("nadruk_na_spodzie").default(false),
        link: text("link").notNull(),
        mini_pallet_singular: smallint("mini_pallet_singular").default(0),
        half_pallet_singular: smallint("half_pallet_singular").default(0),
        full_pallet_singular: smallint("full_pallet_singular").default(0),
    },
    (table) => {
        return {
            cups_code_key: unique("cups_code_key").on(table.code),
        };
    }
);

export const scraped_warehouses = pgTable(
    "scraped_warehouses",
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        cup_id: bigint("cup_id", { mode: "number" })
            .notNull()
            .references(() => cups.id, { onDelete: "cascade", onUpdate: "cascade" }),
        provider: text("provider").notNull(),
        code_link: text("code_link").notNull(),
        updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
            .defaultNow()
            .notNull(),
        amount: integer("amount").default(0).notNull(),
    },
    (table) => {
        return {
            scrapedWarehousesPkey: primaryKey(table.provider, table.code_link),
        };
    }
);

export const users = pgTable("users", {
    user_id: uuid("user_id").primaryKey().notNull(),
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    company_name: text("company_name").notNull(),
    adress: text("adress").notNull(),
    postal_code: text("postal_code").notNull(),
    city: text("city").notNull(),
    region: text("region").notNull(),
    phone: text("phone").notNull(),
    NIP: text("NIP").notNull(),
    eu: boolean("eu").notNull(),
    country: text("country").notNull(),
    email: text("email").notNull(),
});

export const users_restricted = pgTable("users_restricted", {
    user_id: uuid("user_id")
        .primaryKey()
        .notNull()
        .references(() => users.user_id, { onDelete: "cascade" }),
    role: roleEnum("role").default("User").notNull(),
    cup_pricing: text("cup_pricing"),
    color_pricing: text("color_pricing"),
    activated: boolean("activated").default(false).notNull(),
    salesman_id: uuid("salesman_id"),
    warehouse_acces: warehouseAccesEnum("warehouse_acces"),
});

export const admin_emails = pgTable("admin_emails", {
    id: serial("id").primaryKey().notNull(),
    email: text("email").unique().notNull(),
})

export const cupPricingRelations = relations(cup_pricings, ({ one }) => ({
    cup: one(cups, {
        fields: [cup_pricings.cup_id],
        references: [cups.id],
    }),
}));

export const scrapedWarehousesRelations = relations(scraped_warehouses, ({ one }) => ({
    cup: one(cups, {
        fields: [scraped_warehouses.cup_id],
        references: [cups.id],
    }),
}));

export const cupRelation = relations(cups, ({ many }) => ({
    cup_pricings: many(cup_pricings),
    scraped_warehouses: many(scraped_warehouses),
}));

export const userRelation = relations(users, ({ one }) => ({
    users_restricted: one(users_restricted, {
        fields: [users.user_id],
        references: [users_restricted.user_id],
    }),
}));
