"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ClientEntry } from "../clients/columns";

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
	},
];
