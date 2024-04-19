"use client";

import { Client } from "@/app/dashboard/page";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ClientEntry } from "../clients/columns";

export const ActivationRequestsTabled = ({
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

	const handleActivation = async (entry: ClientEntry) => {
		setLoading(true);

		const cup_pricing = entry.cup_pricing;
		const color_pricing = entry.color_pricing;
		const salesman_id = entry.assigned_salesman;
		const warehouse_acces = entry.warehouse_acces;
		const eu = entry.eu as "EUR" | "PLN" | "brak";

		if (eu === "brak") {
			toast.warn("Wybierz walutę klienta");
			setLoading(false);
			return;
		}

		if (!cup_pricing || !color_pricing || !salesman_id || !warehouse_acces || !eu) {
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
				user_id: entry.user_id,
				cup_pricing,
				color_pricing,
				salesman_id,
				warehouse_acces,
				eu: eu === "EUR",
			}),
		});

		if (res.ok) {
			toast.success("Klient został aktywowany");
			clients?.forEach((client) => {
				if (client.user_id === entry.user_id) {
					client.activated = true;
					client.cup_pricing = cup_pricing;
					client.color_pricing = color_pricing;
					client.salesman_id = salesman_id;
					client.warehouse_acces = warehouse_acces as "None" | "Actual" | "Fictional";
					client.eu = eu === "EUR";

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

	const data =
		clients?.map((client) => ({
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
		})) || [];

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={loading}
			available_cup_pricings={available_cup_pricings}
			available_color_pricings={available_color_pricings}
			salesmenEmails={
				adminsAndSalesmen?.filter((item) => item.role === "Salesman").sort((a, b) => a.email.localeCompare(b.email)) || []
			}
			handleActivation={handleActivation}
			handleDeleteUser={handleDeleteUser}
		/>
	);
};
