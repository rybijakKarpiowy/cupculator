"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	Row,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CupEntry } from "./columns";
import { toast } from "react-toastify";
import { Database } from "@/database/types";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	loading: boolean;
	setLoading: (loading: boolean) => void;
}

const handleSubmit = async (row: Row<CupEntry>, setLoading: (loading: boolean) => void) => {
	setLoading(true);
	const {
		supplier,
		supplier_code,
		mini_pallet,
		half_pallet,
		full_pallet,
		mini_pallet_singular,
		half_pallet_singular,
		full_pallet_singular,
		deep_effect,
		deep_effect_plus,
		digital_print,
		digital_print_additional,
		direct_print,
		polylux,
		transfer_plus,
		nadruk_apla,
		nadruk_dookola_pod_uchem,
		nadruk_na_dnie,
		nadruk_na_spodzie,
		nadruk_na_powloce_magicznej_1_kolor,
		nadruk_na_uchu,
		nadruk_przez_rant,
		nadruk_wewnatrz_na_sciance,
		nadruk_zlotem_do_25cm2,
		nadruk_zlotem_do_50cm2,
		naklejka_papierowa_z_nadrukiem,
		personalizacja,
		pro_color,
		soft_touch,
		trend_color,
		trend_color_lowered_edge,
		wkladanie_ulotek_do_kubka,
		zdobienie_paskiem_bez_laczenia,
		zdobienie_paskiem_z_laczeniem,
		zdobienie_tapeta_na_barylce_I_stopien_trudnosci,
		zdobienie_tapeta_na_barylce_II_stopien_trudnosci,
		id,
		category,
		code,
		color,
		icon,
		link,
		material,
		name,
		volume
	} = row.original;

	const rowData: Database["public"]["Tables"]["cups"]["Row"] = {
		id: id,
		supplier: supplier ? supplier.trim() : null,
		supplier_code: supplier_code ? supplier_code.trim() : null,
		mini_pallet: mini_pallet ? mini_pallet : null,
		half_pallet: half_pallet ? half_pallet : null,
		full_pallet: full_pallet ? full_pallet : null,
		mini_pallet_singular: mini_pallet_singular ? mini_pallet_singular : null,
		half_pallet_singular: half_pallet_singular ? half_pallet_singular : null,
		full_pallet_singular: full_pallet_singular ? full_pallet_singular : null,
		deep_effect: !!deep_effect,
		deep_effect_plus: !!deep_effect_plus,
		digital_print: !!digital_print,
		digital_print_additional: !!digital_print_additional,
		direct_print: !!direct_print,
		polylux: !!polylux,
		transfer_plus: !!transfer_plus,
		nadruk_apla: !!nadruk_apla,
		nadruk_dookola_pod_uchem: !!nadruk_dookola_pod_uchem,
		nadruk_na_dnie: !!nadruk_na_dnie,
		nadruk_na_spodzie: !!nadruk_na_spodzie,
		nadruk_na_powloce_magicznej_1_kolor: !!nadruk_na_powloce_magicznej_1_kolor,
		nadruk_na_uchu: !!nadruk_na_uchu,
		nadruk_przez_rant: !!nadruk_przez_rant,
		nadruk_wewnatrz_na_sciance: !!nadruk_wewnatrz_na_sciance,
		nadruk_zlotem_do_25cm2: !!nadruk_zlotem_do_25cm2,
		nadruk_zlotem_do_50cm2: !!nadruk_zlotem_do_50cm2,
		naklejka_papierowa_z_nadrukiem: !!naklejka_papierowa_z_nadrukiem,
		personalizacja: !!personalizacja,
		pro_color: !!pro_color,
		soft_touch: !!soft_touch,
		trend_color: !!trend_color,
		trend_color_lowered_edge: !!trend_color_lowered_edge,
		wkladanie_ulotek_do_kubka: !!wkladanie_ulotek_do_kubka,
		zdobienie_paskiem_bez_laczenia: !!zdobienie_paskiem_bez_laczenia,
		zdobienie_paskiem_z_laczeniem: !!zdobienie_paskiem_z_laczeniem,
		zdobienie_tapeta_na_barylce_I_stopien_trudnosci: !!zdobienie_tapeta_na_barylce_I_stopien_trudnosci,
		zdobienie_tapeta_na_barylce_II_stopien_trudnosci: !!zdobienie_tapeta_na_barylce_II_stopien_trudnosci,
		category,
		code,
		color,
		icon,
		link,
		material,
		name,
		volume
	};

	if (isInvalid(rowData)) {
		setLoading(false);
		return;
	}

	const res = await fetch("/api/updateproductstab", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(rowData),
	});

	if (res.status === 500) {
		toast.error("Błąd serwera");
		setLoading(false);
		return;
	}
	if (res.status === 400) {
		toast.error("Błędne dane");
		setLoading(false);
		return;
	}
	if (!res.ok) {
		toast.error("Wystąpił błąd");
		setLoading(false);
		return;
	}
	toast.success("Zaktualizowano");
	setLoading(false);
};

const isInvalid = (data: Database["public"]["Tables"]["cups"]["Row"]) => {
	if (data.mini_pallet && data.mini_pallet < 0) {
		toast.error("Niepoprawna wartość mini palety");
		return true;
	}
	if (data.half_pallet && data.half_pallet < 0) {
		toast.error("Niepoprawna wartość pół palety");
		return true;
	}
	if (data.full_pallet && data.full_pallet < 0) {
		toast.error("Niepoprawna wartość pełnej palety");
		return true;
	}
	if (data.mini_pallet_singular && data.mini_pallet_singular < 0) {
		toast.error("Niepoprawna wartość mini palety jednostkowej");
		return true;
	}
	if (data.half_pallet_singular && data.half_pallet_singular < 0) {
		toast.error("Niepoprawna wartość pół palety jednostkowej");
		return true;
	}
	if (data.full_pallet_singular && data.full_pallet_singular < 0) {
		toast.error("Niepoprawna wartość pełnej palety jednostkowej");
		return true;
	}
	return false;
}

export function DataTable<TData extends CupEntry, TValue>({ columns, data, loading, setLoading }: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		material: false,
		category: false,
		supplier: false,
		supplier_code: false,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			columnFilters,
			columnVisibility,
		},
	});

	return (
		<>
			<div className="flex items-center py-4 gap-2">
				<Input
					placeholder="Filtruj kody kubków"
					value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("code")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<Input
					placeholder="Filtruj nazwy kubków"
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Kolumny</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="overflow-y-auto max-h-[50vh]">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
									>
										{/* @ts-ignore */}
										{columns.find((col) => col.accessorKey === column.id)?.header ?? column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} id={row.original.id.toString()} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => {
										switch (cell.column.id) {
											case "mini_pallet":
											case "half_pallet":
											case "full_pallet":
											case "mini_pallet_singular":
											case "half_pallet_singular":
											case "full_pallet_singular":
												return (
													<TableCell key={cell.id}>
														<Input
															className="w-fit"
															type="number"
															disabled={loading}
															defaultValue={(row.original[cell.column.id] || 0) as number}
															// @ts-ignore
															onChange={(e) => row.original[cell.column.id] = e.target.value}
														/>
													</TableCell>
												);
											case "volume":
												return (
													<TableCell key={cell.id}>
														<Input
															className="w-fit"
															type="number"
															disabled={loading}
															defaultValue={parseInt(row.original[cell.column.id] as string)}
															// @ts-ignore
															onChange={(e) => row.original[cell.column.id] = e.target.value.toString()}
														/>
													</TableCell>
												);
											case "code":
											case "name":
											case "color":
											case "material":
											case "category":
											case "icon":
											case "link":
											case "supplier":
											case "supplier_code":
												return (
													<TableCell key={cell.id}>
														{flexRender(cell.column.columnDef.cell, cell.getContext() || "brak")}
													</TableCell>
												);
											case "actions":
												return (
													<TableCell key={cell.id}>
														<Button disabled={loading} onClick={() => handleSubmit(row, setLoading)}>
															Zapisz
														</Button>
													</TableCell>
												);
											default:
												return (
													<TableCell key={cell.id}>
														<Input
															type="checkbox"
															disabled={loading}
															// @ts-ignore
															defaultChecked={row.original[cell.column.id] as boolean}
															// @ts-ignore
															onChange={(e) => (row.original[cell.column.id] = e.target.checked)}
														/>
													</TableCell>
												);
										}
									})}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Brak danych.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
					Poprzednia
				</Button>
				<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					Następna
				</Button>
			</div>
		</>
	);
}
