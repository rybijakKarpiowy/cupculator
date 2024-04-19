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
import { ClientEntry } from "../clients/columns";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	loading: boolean;
	available_cup_pricings: string[];
	available_color_pricings: string[];
	salesmenEmails: { email: string; user_id: string }[];
	handleActivation: (row: ClientEntry) => Promise<void>;
	handleDeleteUser: (user_id: string) => Promise<void>;
}

export function DataTable<TData extends ClientEntry, TValue>({
	columns,
	data,
	loading,
	available_cup_pricings,
	available_color_pricings,
	salesmenEmails,
	handleActivation,
	handleDeleteUser,
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		/* "name": true,
		"company_name": true,
		adress: false,
		postal_code: false,
		city: false,
		region: false,
		/* "phone": true,
		"NIP": true,
		"eu": true,
		"country": true,
		"email": true,
		"cup_pricing": true,
		"color_pricing": true,
		"assigned_salesman": true,
		"warehouse_acces": true, */
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
					placeholder="Filtruj nazwiska"
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<Input
					placeholder="Filtruj nazwy firm"
					value={(table.getColumn("company_name")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("company_name")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Kolumny</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
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
										{IdTranslate[column.id]}
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
								<TableRow key={row.id} id={row.original.user_id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => {
										// @ts-ignore
										switch (cell.column.columnDef.accessorKey) {
											case "cup_pricing":
												return (
													<CupPricingCell
														key={cell.id}
														loading={loading}
														pricing={row.original.cup_pricing}
														available_pricings={available_cup_pricings}
														row={row}
													/>
												);
											case "color_pricing":
												return (
													<ColorPricingCell
														key={cell.id}
														loading={loading}
														pricing={row.original.color_pricing}
														available_pricings={available_color_pricings}
														row={row}
													/>
												);
											case "assigned_salesman":
												return (
													<SalesmanCell
														key={cell.id}
														loading={loading}
														salesman_id={row.original.assigned_salesman}
														salesmenEmails={salesmenEmails}
														row={row}
													/>
												);
											case "warehouse_acces":
												return (
													<WarehouseCell
														key={cell.id}
														loading={loading}
														warehouse_acces={row.original.warehouse_acces}
														row={row}
													/>
												);
											case "actions":
												return (
													<ActionsCell
														row={row}
														handleActivation={handleActivation}
														handleDeleteUser={handleDeleteUser}
														loading={loading}
													/>
												);
											case "eu":
												return (
													<TableCell key={cell.id}>
														<select
															id="eu"
															disabled={loading}
															defaultValue="brak"
															className={`${
																loading ? "bg-slate-400" : ""
															} px-2 py-2 rounded-md border border-slate-200 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:ring-opacity-50`}
															onChange={(e) => (row.original.eu = e.target.value)}
														>
															<option value="brak" hidden disabled>
																-
															</option>
															<option value="EUR">EUR</option>
															<option value="PLN">PLN</option>
														</select>
													</TableCell>
												);
											default:
												return (
													<TableCell key={cell.id}>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
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

const CupPricingCell = ({ loading, pricing: cup_pricing, available_pricings: available_cup_pricings, row }: CPCInterface) => (
	<td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
		<select
			id="cup_pricing"
			disabled={loading}
			className={`${loading && "bg-slate-400"}`}
			defaultValue={cup_pricing ? cup_pricing : ""}
			onChange={(e) => (row.original.cup_pricing = e.target.value)}
		>
			<option value="" key="brak" disabled hidden>
				Brak
			</option>
			{available_cup_pricings.sort().map((cup_pricing) => (
				<option key={cup_pricing} value={cup_pricing}>
					{cup_pricing}
				</option>
			))}
		</select>
	</td>
);

const ColorPricingCell = ({ loading, pricing: color_pricing, available_pricings: available_color_pricings, row }: CPCInterface) => (
	<td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
		<select
			id="color_pricing"
			disabled={loading}
			className={`${loading && "bg-slate-400"}`}
			defaultValue={color_pricing ? color_pricing : ""}
			onChange={(e) => (row.original.color_pricing = e.target.value)}
		>
			<option value="" key="brak" disabled hidden>
				Brak
			</option>
			{available_color_pricings.sort().map((color_pricing) => (
				<option key={color_pricing} value={color_pricing}>
					{color_pricing}
				</option>
			))}
		</select>
	</td>
);

const SalesmanCell = ({ loading, salesman_id, salesmenEmails, row }: SalesmanCell) => (
	<td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
		<select
			id="assigned_salesman"
			disabled={loading}
			className={`${loading && "bg-slate-400"}`}
			defaultValue={salesman_id ? salesman_id : ""}
			onChange={(e) => (row.original.assigned_salesman = e.target.value)}
		>
			<option value="" key="brak" disabled hidden>
				Brak
			</option>
			{salesmenEmails
				?.sort((a, b) => a.email.localeCompare(b.email))
				.map((salesman) => (
					<option key={salesman.user_id} value={salesman.user_id}>
						{salesman.email}
					</option>
				))}
		</select>
	</td>
);

const WarehouseCell = ({ loading, warehouse_acces, row }: WarehouseCell) => (
	<td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
		<select
			id="warehouse_acces"
			disabled={loading}
			className={`${loading && "bg-slate-400"} text-center`}
			defaultValue={warehouse_acces ? warehouse_acces : ""}
			onChange={(e) => (row.original.warehouse_acces = e.target.value as "None" | "Actual" | "Fictional" | null)}
		>
			<option value="" key="brak" disabled hidden>
				-
			</option>
			<option value="None">Brak dostępu</option>
			<option value="Actual">Faktyczne stany</option>
			<option value="Fictional">Fikcyjne stany</option>
		</select>
	</td>
);

const ActionsCell = ({
	row,
	handleActivation,
	handleDeleteUser,
	loading,
}: {
	row: Row<ClientEntry>;
	handleActivation: (row: ClientEntry) => void;
	handleDeleteUser: (user_id: string) => void;
	loading: boolean;
}) => (
	<TableCell key="actions" className="border-l-4 w-44 h-full bg-slate-50">
		<div className="flex gap-1 items-center">
		<Button type="button" disabled={loading} variant="default" onClick={() => handleActivation(row.original)}>
			Aktywuj
		</Button>
		<Button type="button" disabled={loading} variant="destructive" onClick={() => handleDeleteUser(row.original.user_id)}>
			Usuń
		</Button>
		</div>
	</TableCell>
);

const IdTranslate = {
	name: "Imię i nazwisko",
	company_name: "Nazwa firmy",
	adress: "Adres",
	postal_code: "Kod pocztowy",
	city: "Miasto",
	region: "Województwo / Region",
	phone: "Telefon",
	NIP: "NIP",
	eu: "Waluta",
	country: "Kraj",
	email: "Email",
	cup_pricing: "Cennik kubków",
	color_pricing: "Cennik nadruków",
	assigned_salesman: "Przydzielony Handlowiec",
	warehouse_acces: "Dostęp do stanów magazynowych",
	actions: "Akcje",
};

interface CPCInterface {
	loading: boolean;
	pricing: string;
	available_pricings: string[];
	row: Row<ClientEntry>;
}

interface SalesmanCell {
	loading: boolean;
	salesman_id: string | null;
	salesmenEmails: { email: string; user_id: string }[];
	row: Row<ClientEntry>;
}

interface WarehouseCell {
	loading: boolean;
	warehouse_acces: "None" | "Actual" | "Fictional" | null;
	row: Row<ClientEntry>;
}
