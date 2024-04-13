"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ClientEntry = {
	name: string;
	company_name: string;
	adress: string;
	postal_code: string;
	city: string;
	region: string;
	phone: string;
	NIP: string;
	eu: string;
	country: string;
	email: string;
	cup_pricing: string;
	color_pricing: string;
	assigned_salesman: string;
	warehouse_acces: "None" | "Actual" | "Fictional" | null;
  user_id: string;
};

export const columns: ColumnDef<ClientEntry>[] = [
	{
		accessorKey: "name",
		header: "Imię i nazwisko",
	},
	{
		accessorKey: "company_name",
		header: "Nazwa firmy",
	},
	{
		accessorKey: "adress",
		header: "Adres",
	},
	{
		accessorKey: "postal_code",
		header: "Kod pocztowy",
	},
	{
		accessorKey: "city",
		header: "Miasto",
	},
	{
		accessorKey: "region",
		header: "Województwo / Region",
	},
	{
		accessorKey: "phone",
		header: "Telefon",
	},
	{
		accessorKey: "NIP",
		header: "NIP",
	},
	{
		accessorKey: "eu",
		header: "Waluta",
	},
	{
		accessorKey: "country",
		header: "Kraj",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "cup_pricing",
		header: "Cennik kubków",
	},
	{
		accessorKey: "color_pricing",
		header: "Cennik nadruków",
	},
	{
		accessorKey: "assigned_salesman",
		header: "Przypisany Handlowiec",
	},
	{
		accessorKey: "warehouse_acces",
		header: "Dostęp do stanów magazynowych",
	},
	{
		accessorKey: "actions",
		header: "Akcje",
	}
];
