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
import { ClientEntry } from "./columns";
import { validateInfo } from "@/lib/validateInfo";
import { toast } from "react-toastify";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	loading: boolean;
	setLoading: (loading: boolean) => void;
	available_cup_pricings: string[];
	available_color_pricings: string[];
	salesmenEmails: { email: string; user_id: string }[];
	handleInstantChange: (user_id: string) => Promise<void>;
	handleDeleteUser: (user_id: string) => Promise<void>;
}

export function DataTable<TData extends ClientEntry, TValue>({
	columns,
	data,
	loading,
	setLoading,
	available_cup_pricings,
	available_color_pricings,
	salesmenEmails,
	handleInstantChange,
	handleDeleteUser,
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		/* "name": true,
		"company_name": true, */
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
	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const [editingData, setEditingData] = useState<ClientEditData>(null);

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
								<TableRow
									key={row.id}
									id={row.original.user_id}
									data-state={row.getIsSelected() && "selected"}
									className={row.id == editingRowId ? "bg-slate-100 hover:bg-slate-200" : ""}
								>
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
														handleInstantChange={handleInstantChange}
														user_id={row.original.user_id}
													/>
												);
											case "color_pricing":
												return (
													<ColorPricingCell
														key={cell.id}
														loading={loading}
														pricing={row.original.color_pricing}
														available_pricings={available_color_pricings}
														handleInstantChange={handleInstantChange}
														user_id={row.original.user_id}
													/>
												);
											case "assigned_salesman":
												return (
													<SalesmanCell
														key={cell.id}
														loading={loading}
														salesman_id={row.original.assigned_salesman}
														salesmenEmails={salesmenEmails}
														handleInstantChange={handleInstantChange}
														user_id={row.original.user_id}
													/>
												);
											case "warehouse_acces":
												return (
													<WarehouseCell
														key={cell.id}
														loading={loading}
														warehouse_acces={row.original.warehouse_acces}
														handleInstantChange={handleInstantChange}
														user_id={row.original.user_id}
													/>
												);
											case "actions":
												return (
													<ActionsCell
														key={cell.id}
														row={row as Row<ClientEntry>}
														loading={loading}
														setLoading={setLoading}
														handleDeleteUser={handleDeleteUser}
														editingRowId={editingRowId}
														setEditingRowId={setEditingRowId}
														editingData={editingData}
														setEditingData={setEditingData}
														setColumnVisibility={setColumnVisibility}
														columnVisibility={columnVisibility}
													/>
												);
											default:
												return row.id != editingRowId ? (
													<TableCell key={cell.id}>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
												) : // @ts-ignore
												cell.column.columnDef.accessorKey == "eu" ? (
													<TableCell key={cell.id}>
														<select
															id="eu"
															disabled={loading}
															defaultValue={row.getValue(cell.column.id)}
															onChange={(e) => {
																const eu = e.target.value === "EUR" ? true : false;
																setEditingData({ ...editingData!, eu });
															}}
															className="px-2 py-2 rounded-md border border-slate-200 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:ring-opacity-50"
														>
															<option value="EUR">EUR</option>
															<option value="PLN">PLN</option>
														</select>
													</TableCell>
												) : // @ts-ignore
												cell.column.columnDef.accessorKey == "country" ? (
													<TableCell key={cell.id}>
														<select
															id="country"
															disabled={loading}
															defaultValue={row.getValue(cell.column.id)}
															onChange={(e) => setEditingData({ ...editingData!, country: e.target.value })}
															className="px-2 py-2 rounded-md border border-slate-200 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:ring-opacity-50"
														>
															<option value="Polska">Polska</option>
															<option value="Albania">Albania</option>
															<option value="Księstwo Andory">Księstwo Andory</option>
															<option value="Armenia">Armenia</option>
															<option value="Austria">Austria</option>
															<option value="Azerbejdżan">Azerbejdżan</option>
															<option value="Białoruś">Białoruś</option>
															<option value="Belgia">Belgia</option>
															<option value="Bośnia i Hercegowina">Bośnia i Hercegowina</option>
															<option value="Bułgaria">Bułgaria</option>
															<option value="Chorwacja">Chorwacja</option>
															<option value="Cypr">Cypr</option>
															<option value="Czechy">Czechy</option>
															<option value="Dania">DenmDaniaark</option>
															<option value="Estonia">Estonia</option>
															<option value="Finlandia">Finlandia</option>
															<option value="Francja">Francja</option>
															<option value="Gruzja">Gruzja</option>
															<option value="Niemcy">Niemcy</option>
															<option value="Grecja">Grecja</option>
															<option value="Węgry">Węgry</option>
															<option value="Islandia">Islandia</option>
															<option value="Irladnia">Irladnia</option>
															<option value="Włochy">Włochy</option>
															<option value="Jordania">Jordania</option>
															<option value="Kosowo">Kosowo</option>
															<option value="Kuwejt">Kuwejt</option>
															<option value="Łotwa">Łotwa</option>
															<option value="Liechtenstein">Liechtenstein</option>
															<option value="Litwa">Litwa</option>
															<option value="Luksemburg">Luksemburg</option>
															<option value="Macedonia">Macedonia</option>
															<option value="Malta">Malta</option>
															<option value="Mołdawia">Mołdawia</option>
															<option value="Monako">Monako</option>
															<option value="Montenegro">Montenegro</option>
															<option value="Niderlandy">Niderlandy</option>
															<option value="Nigeria">Nigeria</option>
															<option value="Norwegia">Norwegia</option>
															<option value="Portugalia">Portugalia</option>
															<option value="Katar">Katar</option>
															<option value="Rumunia">Rumunia</option>
															<option value="Rosja">Rosja</option>
															<option value="San Marino">San Marino</option>
															<option value="Arabia Saudyjska">Arabia Saudyjska</option>
															<option value="Senegal">Senegal</option>
															<option value="Serbia">Serbia</option>
															<option value="Słowacja">Słowacja</option>
															<option value="Słowenia">Słowenia</option>
															<option value="Hiszpania">Hiszpania</option>
															<option value="Szwecja">Szwecja</option>
															<option value="Szwajcaria">Szwajcaria</option>
															<option value="Trynidad i Tobago">Trynidad i Tobago</option>
															<option value="Turcja">Turcja</option>
															<option value="Ukraina">Ukraina</option>
															<option value="Zjednoczone Emiraty Arabskie">
																Zjednoczone Emiraty Arabskie
															</option>
															<option value="Wielka Brytania">Wielka Brytania</option>
															<option value="Watykan">Watykan</option>
														</select>
													</TableCell>
												) : (
													<TableCell key={cell.id}>
														<Input
															defaultValue={row.getValue(cell.column.id)}
															onChange={(e) => {
																// @ts-ignore
																if (cell.column.columnDef.accessorKey === "name") {
																	const name = e.target.value.trim().split(" ");
																	const first_name = name[0];
																	const last_name = name.slice(1).join(" ");
																	setEditingData({ ...editingData!, first_name, last_name });
																} else
																	setEditingData({
																		...editingData!,
																		// @ts-ignore
																		[cell.column.columnDef.accessorKey]: e.target.value,
																	});
															}}
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

const CupPricingCell = ({
	loading,
	handleInstantChange,
	pricing: cup_pricing,
	available_pricings: available_cup_pricings,
	user_id,
}: CPCInterface) => (
	<td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
		<select
			id="cup_pricing"
			disabled={loading}
			onChange={() => handleInstantChange(user_id)}
			className={`${loading && "bg-slate-400"}`}
			defaultValue={cup_pricing ? cup_pricing : ""}
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

const ColorPricingCell = ({
	loading,
	handleInstantChange,
	pricing: color_pricing,
	available_pricings: available_color_pricings,
	user_id,
}: CPCInterface) => (
	<td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
		<select
			id="color_pricing"
			disabled={loading}
			onChange={() => handleInstantChange(user_id)}
			className={`${loading && "bg-slate-400"}`}
			defaultValue={color_pricing ? color_pricing : ""}
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

const SalesmanCell = ({ loading, handleInstantChange, salesman_id, salesmenEmails, user_id }: SalesmanCell) => (
	<td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
		<select
			id="assigned_salesman"
			disabled={loading}
			onChange={() => handleInstantChange(user_id)}
			className={`${loading && "bg-slate-400"}`}
			defaultValue={salesman_id ? salesman_id : ""}
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

const WarehouseCell = ({ loading, handleInstantChange, warehouse_acces, user_id }: WarehouseCell) => (
	<td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
		<select
			id="warehouse_acces"
			disabled={loading}
			onChange={() => handleInstantChange(user_id)}
			className={`${loading && "bg-slate-400"} text-center`}
			defaultValue={warehouse_acces ? warehouse_acces : ""}
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
	loading,
	setLoading,
	handleDeleteUser,
	editingRowId,
	setEditingRowId,
	editingData,
	setEditingData,
	setColumnVisibility,
	columnVisibility,
}: {
	row: Row<ClientEntry>;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	handleDeleteUser: (user_id: string) => Promise<void>;
	editingRowId: string | null;
	setEditingRowId: (id: string | null) => void;
	editingData: ClientEditData;
	setEditingData: (data: ClientEditData) => void;
	setColumnVisibility: (visibility: VisibilityState) => void;
	columnVisibility: VisibilityState;
}) => (
	<TableCell key="actions" className="border-l-4 w-44 h-full bg-slate-50">
		<div className="flex gap-1 items-center">
			{row.id != editingRowId ? (
				<>
					<Button
						type="button"
						disabled={loading}
						variant="destructive"
						onClick={() => handleDeleteUser(row.original.user_id)}
					>
						Usuń
					</Button>
					<Button
						type="button"
						disabled={loading}
						variant="default"
						onClick={() => {
							setEditingRowId(row.id);
							const newColumnVisibility = { ...columnVisibility };
							newColumnVisibility.cup_pricing = false;
							newColumnVisibility.color_pricing = false;
							newColumnVisibility.assigned_salesman = false;
							newColumnVisibility.warehouse_acces = false;
							setColumnVisibility(newColumnVisibility);

							setEditingData({
								first_name: row.original.name.split(" ")[0],
								last_name: row.original.name.split(" ").slice(1).join(" "),
								company_name: row.original.company_name,
								adress: row.original.adress,
								postal_code: row.original.postal_code,
								city: row.original.city,
								region: row.original.region,
								phone: row.original.phone,
								NIP: row.original.NIP,
								eu: row.original.eu === "EUR" ? true : false,
								country: row.original.country,
								email: row.original.email,
							});
						}}
					>
						Edytuj
					</Button>
				</>
			) : (
				<>
					<Button
						type="button"
						disabled={loading}
						variant="destructive"
						className="bg-red-500 hover:bg-red-400"
						onClick={() => {
							setEditingRowId(null);
							setEditingData(null);
						}}
					>
						Anuluj
					</Button>
					<Button
						type="button"
						disabled={loading}
						variant="default"
						className="bg-green-600 hover:bg-green-500"

						onClick={async () => {
							setLoading(true);
							if (!editingData) {
								toast.error("Brak danych");
								return;
							};
							const notValid = validateInfo(editingData);
							if (notValid) {
								toast.error(notValid);
								setLoading(false);
								return;
							}

							const res = await fetch("/api/updateclientinfo", {
								method: "POST",
								body: JSON.stringify({
									...editingData,
									user_id: row.original.user_id,
								}),
								headers: {
									"Content-Type": "application/json",
								},
							});
							
							if (res.status === 400) {
								toast.error("Brakujące dane");
                        		setLoading(false);
								return;
							}
							if (res.status === 500) {
								toast.error("Błąd serwera");
								setLoading(false);
								return;
							}
							if (!res.ok) {
								toast.error("Nieznany błąd");
								setLoading(false);
								return;
							}
							
							toast.success("Zaktualizowano dane, odśwież stronę aby zobaczyć zmiany", {
								autoClose: 5000,
							});
							setEditingRowId(null);
							setEditingData(null);
							setLoading(false);
						}}
					>
						Zapisz
					</Button>
				</>
			)}
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
	handleInstantChange: (user_id: string) => Promise<void>;
	pricing: string;
	available_pricings: string[];
	user_id: string;
}

interface SalesmanCell {
	loading: boolean;
	handleInstantChange: (user_id: string) => Promise<void>;
	salesman_id: string | null;
	salesmenEmails: { email: string; user_id: string }[];
	user_id: string;
}

interface WarehouseCell {
	loading: boolean;
	handleInstantChange: (user_id: string) => Promise<void>;
	warehouse_acces: "None" | "Actual" | "Fictional" | null;
	user_id: string;
}

type ClientEditData = {
	first_name: string;
	last_name: string;
	company_name: string;
	adress: string;
	postal_code: string;
	city: string;
	region: string;
	phone: string;
	NIP: string;
	eu: boolean;
	country: string;
	email: string;
} | null;
