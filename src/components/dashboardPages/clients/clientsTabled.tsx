"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Client } from "@/app/dashboard/page";
import { DataTable } from "@/components/dashboardPages/clients/data-table";
import { columns } from "@/components/dashboardPages/clients/columns";

export const ClientsTabled = ({
	clientsInput,
	salesmenEmails,
	available_cup_pricings,
	available_color_pricings,
}: {
	clientsInput: Client[];
	salesmenEmails: {
		user_id: string;
		email: string;
	}[];
	available_cup_pricings: string[];
	available_color_pricings: string[];
}) => {
	const [loading, setLoading] = useState(false);
	const [clients, setClients] = useState(clientsInput);

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
			color_pricing = (clientDiv?.querySelector("#color_pricing") as HTMLSelectElement)?.value;
			salesman_id = (clientDiv?.querySelector("#assigned_salesman") as HTMLSelectElement)?.value;
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

	const data = clients.map((client) => ({
		name: `${client.first_name} ${client.last_name}`,
		company_name: client.company_name,
		adress: client.adress,
		postal_code: client.postal_code,
		city: client.city,
		region: client.region,
		phone: client.phone,
		NIP: client.NIP,
		eu: client.eu ? "EUR" : "PLN",
		country: client.country,
		email: client.email,
		cup_pricing: client.cup_pricing || "",
		color_pricing: client.color_pricing || "",
		assigned_salesman: client.salesman_id || "",
		warehouse_acces: client.warehouse_acces,
		user_id: client.user_id,
	}));

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={loading}
			setLoading={setLoading}
			available_cup_pricings={available_cup_pricings}
			available_color_pricings={available_color_pricings}
			salesmenEmails={salesmenEmails}
			handleActivation={handleActivation}
			handleDeleteUser={handleDeleteUser}
		/>
	);
};
