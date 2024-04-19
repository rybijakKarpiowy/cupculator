"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CupEntry = {
	category: string;
	code: string;
	color: string;
	deep_effect: boolean | null;
	deep_effect_plus: boolean | null;
	digital_print: boolean | null;
	digital_print_additional: boolean | null;
	direct_print: boolean | null;
	full_pallet: number | null;
	full_pallet_singular: number | null;
	half_pallet: number | null;
	half_pallet_singular: number | null;
	icon: string | null;
	id: number;
	link: string;
	material: string;
	mini_pallet: number | null;
	mini_pallet_singular: number | null;
	nadruk_apla: boolean | null;
	nadruk_dookola_pod_uchem: boolean | null;
	nadruk_na_dnie: boolean | null;
	nadruk_na_powloce_magicznej_1_kolor: boolean | null;
	nadruk_na_spodzie: boolean | null;
	nadruk_na_uchu: boolean | null;
	nadruk_przez_rant: boolean | null;
	nadruk_wewnatrz_na_sciance: boolean | null;
	nadruk_zlotem_do_25cm2: boolean | null;
	nadruk_zlotem_do_50cm2: boolean | null;
	naklejka_papierowa_z_nadrukiem: boolean | null;
	name: string;
	personalizacja: boolean | null;
	polylux: boolean | null;
	pro_color: boolean | null;
	soft_touch: boolean | null;
	supplier: string | null;
	supplier_code: string | null;
	transfer_plus: boolean | null;
	trend_color: boolean | null;
	trend_color_lowered_edge: boolean | null;
	volume: string;
	wkladanie_ulotek_do_kubka: boolean | null;
	zdobienie_paskiem_bez_laczenia: boolean | null;
	zdobienie_paskiem_z_laczeniem: boolean | null;
	zdobienie_tapeta_na_barylce_I_stopien_trudnosci: boolean | null;
	zdobienie_tapeta_na_barylce_II_stopien_trudnosci: boolean | null;
};

export const columns: ColumnDef<CupEntry>[] = [
	{
		accessorKey: "code",
		header: "Kod",
	},
	{
		accessorKey: "name",
		header: "Nazwa",
	},
	{
		accessorKey: "color",
		header: "Kolor",
	},
	{
		accessorKey: "material",
		header: "Materiał",
	},
	{
		accessorKey: "category",
		header: "Kategoria",
	},
	{
		accessorKey: "icon",
		header: "Link do zdjęcia",
	},
	{
		accessorKey: "link",
		header: "Końcówka linku do kubka",
	},
	{
		accessorKey: "volume",
		header: "Objętość",
	},
	{
		accessorKey: "supplier",
		header: "Dostawca",
	},
	{
		accessorKey: "supplier_code",
		header: "Kod u dostawcy",
	},
	{
		accessorKey: "mini_pallet",
		header: "Mini paleta",
	},
	{
		accessorKey: "half_pallet",
		header: "Pół paleta",
	},
	{
		accessorKey: "full_pallet",
		header: "Pełna paleta",
	},
	{
		accessorKey: "mini_pallet_singular",
		header: "Mini paleta jednostkowe",
	},
	{
		accessorKey: "half_pallet_singular",
		header: "Pół paleta jednostkowe",
	},
	{
		accessorKey: "full_pallet_singular",
		header: "Pełna paleta jednostkowe",
	},
    {
        accessorKey: "deep_effect",
        header: "Deep effect",
    },
    {
        accessorKey: "deep_effect_plus",
        header: "Deep effect plus",
    },
    {
        accessorKey: "digital_print",
        header: "Digital print",
    },
    {
        accessorKey: "digital_print_additional",
        header: "Digital print dodatkowy",
    },
    {
        accessorKey: "direct_print",
        header: "Direct print",
    },
    {
        accessorKey: "polylux",
        header: "Polylux",
    },
    {
        accessorKey: "transfer_plus",
        header: "Transfer plus",
    },
    {
        accessorKey: "nadruk_apla",
        header: "Nadruk apla",
    },
    {
        accessorKey: "nadruk_dookola_pod_uchem",
        header: "Nadruk dookoła pod uchem",
    },
    {
        accessorKey: "nadruk_na_dnie",
        header: "Nadruk na dnie",
    },
    {
        accessorKey: "nadruk_na_spodzie",
        header: "Nadruk na spodzie",
    },
    {
        accessorKey: "nadruk_na_powloce_magicznej_1_kolor",
        header: "Nadruk na powłoce magicznej",
    },
    {
        accessorKey: "nadruk_na_uchu",
        header: "Nadruk na uchu",
    },
    {
        accessorKey: "nadruk_przez_rant",
        header: "Nadruk przez rant",
    },
    {
        accessorKey: "nadruk_wewnatrz_na_sciance",
        header: "Nadruk wewnątrz na ściance",
    },
    {
        accessorKey: "nadruk_zlotem_do_25cm2",
        header: "Nadruk złotem do 25cm2",
    },
    {
        accessorKey: "nadruk_zlotem_do_50cm2",
        header: "Nadruk złotem do 50cm2",
    },
    {
        accessorKey: "naklejka_papierowa_z_nadrukiem",
        header: "Naklejka papierowa z nadrukiem",
    },
    {
        accessorKey: "personalizacja",
        header: "Personalizacja",
    },
    {
        accessorKey: "pro_color",
        header: "Pro color",
    },
    {
        accessorKey: "soft_touch",
        header: "Soft touch",
    },
    {
        accessorKey: "trend_color",
        header: "Trend color",
    },
    {
        accessorKey: "trend_color_lowered_edge",
        header: "Trend color z obniżonym rantem",
    },
    {
        accessorKey: "wkladanie_ulotek_do_kubka",
        header: "Wkładanie ulotek do kubka",
    },
    {
        accessorKey: "zdobienie_paskiem_bez_laczenia",
        header: "Zdobienie paskiem bez łączenia",
    },
    {
        accessorKey: "zdobienie_paskiem_z_laczeniem",
        header: "Zdobienie paskiem z łączeniem",
    },
    {
        accessorKey: "zdobienie_tapeta_na_barylce_I_stopien_trudnosci",
        header: "Zdobienie tapetą na baryłce I stopień trudności",
    },
    {
        accessorKey: "zdobienie_tapeta_na_barylce_II_stopien_trudnosci",
        header: "Zdobienie tapetą na baryłce II stopień trudności",
    },
    {
        accessorKey: "actions",
        header: "Akcje",
    }
];
