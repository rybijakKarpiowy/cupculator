"use client";

import { Client } from "@/app/dashboard/page";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ActivationRequests = ({
	clientsInput,
	adminsAndSalesmenInput,
	available_cup_pricings,
	available_color_pricings,
}: {
	clientsInput?: Client[];
	adminsAndSalesmenInput?: Client[];
	available_cup_pricings: string[];
	available_color_pricings: string[];
}) => {
	const [loading, setLoading] = useState(false);
	const [clients, setClients] = useState(clientsInput);
	const [adminsAndSalesmen, setAdminsAndSalesmen] = useState(adminsAndSalesmenInput);

	const handleDeleteUser = async (user_id: string) => {
		if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

		setLoading(true);

		const res = await fetch("/api/deleteuser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id,
			}),
		});

		if (res.ok) {
			toast.success("Użytkownik został usunięty");
			adminsAndSalesmen?.forEach((client, index) => {
				if (client.user_id === user_id) {
					adminsAndSalesmen.splice(index, 1);
					setAdminsAndSalesmen([...adminsAndSalesmen]);
					return;
				}
			});
			clients?.forEach((client, index) => {
				if (client.user_id === user_id) {
					clients.splice(index, 1);
					setClients([...clients]);
					return;
				}
			});
			setLoading(false);
			return;
		}

		toast.error(await res.text());
		setLoading(false);
		return;
	};

	const handleActivation = async (user_id: string, e?: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		let cup_pricing = "";
		let color_pricing = "";
		let salesman_id = "";
		let warehouse_acces = "";
		let eu = "" as "EU" | "PL" | "brak" | boolean;

		if (e) {
			e.preventDefault();
			cup_pricing = (e.currentTarget.querySelector("#cup_pricing") as HTMLSelectElement)?.value;
			color_pricing = (e.currentTarget.querySelector("#color_pricing") as HTMLSelectElement)?.value;
			salesman_id = (e.currentTarget.querySelector("#assigned_salesman") as HTMLSelectElement)?.value;
			warehouse_acces = (e.currentTarget.querySelector("#warehouse_acces") as HTMLSelectElement)?.value;
			eu = (e.currentTarget.querySelector("#eu") as HTMLSelectElement)?.value as "EU" | "PL" | "brak";
			if (eu === "brak") {
				toast.warn("Wybierz walutę klienta");
				setLoading(false);
				return;
			}
		} else {
			const clientDiv = document.getElementById(user_id) as HTMLDivElement;
			cup_pricing = (clientDiv?.querySelector("#cup_pricing") as HTMLSelectElement)?.value;
			color_pricing = (clientDiv?.querySelector("#color_pricing") as HTMLSelectElement).value;
			salesman_id = (clientDiv?.querySelector("#assigned_salesman") as HTMLSelectElement).value;
			warehouse_acces = (clientDiv?.querySelector("#warehouse_acces") as HTMLSelectElement)?.value;
		}

		if (!cup_pricing || !color_pricing || !salesman_id || !warehouse_acces) {
			toast.warn("Uzupełnij cennik klienta, przypisz handlowca i ustal dostęp do magazynu");
			setLoading(false);
			return;
		}

		const res = await fetch("/api/activateclient", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id,
				cup_pricing,
				color_pricing,
				salesman_id,
				warehouse_acces,
				...{ eu: eu === "EU" ? true : eu === "PL" ? false : undefined },
			}),
		});

		console.log(res);

		if (res.ok) {
			toast.success("Klient został aktywowany");
			clients?.forEach((client) => {
				if (client.user_id === user_id) {
					client.activated = true;
					client.cup_pricing = cup_pricing;
					client.color_pricing = color_pricing;
					client.salesman_id = salesman_id;
					client.warehouse_acces = warehouse_acces as "None" | "Actual" | "Fictional";

					setClients([...clients]);
					return;
				}
			});
			setLoading(false);
			return;
		}

		toast.error("Wystąpił błąd");
		setLoading(false);
		return;
	};

	return (
		<div>
			<h2>Aktywacja klientów</h2>
			<hr />
			<br />
			<ul className="overflow-x-auto px-4 w-auto">
				<li>
					<ul className="flex flex-row min-w-max">
						<li className="px-2 border border-black w-48 text-center">Imię i nazwisko</li>
						<li className="px-2 border border-black w-64 text-center">Nazwa firmy</li>
						<li className="px-2 border border-black w-64 text-center">Adres</li>
						<li className="px-2 border border-black w-24 text-center">Kod pocztowy</li>
						<li className="px-2 border border-black w-32 text-center">Miasto</li>
						<li className="px-2 border border-black w-32 text-center">Województwo / Region</li>
						<li className="px-2 border border-black w-48 text-center">Telefon</li>
						<li className="px-2 border border-black w-48 text-center">NIP</li>
						<li className="px-2 border border-black w-16 text-center">Waluta</li>
						<li className="px-2 border border-black w-32 text-center">Kraj</li>
						<li className="px-2 border border-black w-64 text-center">Email</li>
						<li className="px-2 border border-black w-80 text-center">Cennik kubków</li>
						<li className="px-2 border border-black w-80 text-center">Cennik nadruków</li>
						<li className="px-2 border border-black w-60 text-center">Przypisany Handlowiec</li>
						<li className="px-2 border border-black w-60 text-center">Dostęp do stanów magazynowych</li>
					</ul>
				</li>
				<li>
					{clients
						?.filter((client) => !client.activated)
						.map((client) => (
							<ul key={client.user_id}>
								<form
									// id={client.user_id}
									onSubmit={(e) => handleActivation(client.user_id, e)}
									className="flex flex-row w-max"
								>
									<li className="px-2 border border-black w-48 text-center">
										{client.first_name} {client.last_name}
									</li>
									<li className="px-2 border border-black w-64 text-center">{client.company_name}</li>
									<li className="px-2 border border-black w-64 text-center">{client.adress}</li>
									<li className="px-2 border border-black w-24 text-center">{client.postal_code}</li>
									<li className="px-2 border border-black w-32 text-center">{client.city}</li>
									<li className="px-2 border border-black w-32 text-center">{client.region}</li>
									<li className="px-2 border border-black w-48 text-center">{client.phone}</li>
									<li className="px-2 border border-black w-48 text-center">{client.NIP}</li>
									<li className="px-2 border border-black w-16 text-center">
										<select id="eu" disabled={loading} defaultValue="brak">
											<option value="brak" hidden disabled>
												-
											</option>
											<option value="PL">PLN</option>
											<option value="EU">EUR</option>
										</select>
									</li>
									<li className="px-2 border border-black w-32 text-center">{client.country}</li>
									<li className="px-2 border border-black w-64 text-center">{client.email}</li>
									<li className="px-2 border border-black w-80 text-center">
										<select
											id="cup_pricing"
											disabled={loading}
											defaultValue={client.cup_pricing ? client.cup_pricing : ""}
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
									</li>
									<li className="px-2 border border-black w-80 text-center">
										<select
											id="color_pricing"
											disabled={loading}
											defaultValue={client.color_pricing ? client.color_pricing : ""}
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
									</li>
									<li className="px-2 border border-black w-60 text-center">
										<select
											id="assigned_salesman"
											disabled={loading}
											defaultValue={client.salesman_id ? client.salesman_id : ""}
										>
											<option value="" key="brak" disabled hidden>
												Brak
											</option>
											{adminsAndSalesmen
												?.filter((item) => item.role === "Salesman")
												.sort((a, b) => a.email.localeCompare(b.email))
												.map((salesman) => (
													<option key={salesman.user_id} value={salesman.user_id}>
														{salesman.email}
													</option>
												))}
										</select>
									</li>
									<li className="px-2 border border-black w-60 text-center">
										<select
											id="warehouse_acces"
											disabled={loading}
											className="text-center"
											defaultValue={client.warehouse_acces ? client.warehouse_acces : ""}
										>
											<option value="" key="brak" disabled hidden>
												-
											</option>
											<option value="None">Brak dostępu</option>
											<option value="Actual">Faktyczne stany</option>
											<option value="Fictional">Fikcyjne stany</option>
										</select>
									</li>
									<button
										type="submit"
										disabled={loading}
										className={`px-2 w-20 rounded-md ${loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"}`}
									>
										Aktywuj
									</button>
									<button
										type="button"
										disabled={loading}
										onClick={() => handleDeleteUser(client.user_id)}
										className={`px-2 w-16 rounded-md ${loading ? "bg-slate-400" : "bg-red-300 hover:bg-red-400"}`}
									>
										Usuń
									</button>
								</form>
							</ul>
						))}
				</li>
			</ul>
		</div>
	);
};
