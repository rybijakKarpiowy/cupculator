"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Pricings = ({
	available_cup_pricings,
	available_color_pricings,
}: {
	available_cup_pricings: string[];
	available_color_pricings: string[];
}) => {
	const [loading, setLoading] = useState(false);
	const [cups_or_colors, setCups_or_colors] = useState<"cups" | "colors" | "">("");
	const [pricing_name, setPricing_name] = useState("");
	const [newPricing, setNewPricing] = useState(false);

    useEffect(() => {
        const cupsOrColorsDiv = document.querySelector("#cups_or_colors") as HTMLSelectElement;
        if (cupsOrColorsDiv) cupsOrColorsDiv.value = cups_or_colors;
        const pricingNameDiv = document.querySelector("#pricing_name") as HTMLSelectElement;
        if (pricingNameDiv) pricingNameDiv.value = pricing_name;
    }, [cups_or_colors, pricing_name]);

	const handleAddPricing = async () => {
		setLoading(true);

		const sheet_url = (document.querySelector("#sheet_url") as HTMLInputElement)?.value;

		if (!cups_or_colors || !pricing_name || !sheet_url) {
			toast.warn("Uzupełnij wszystkie pola");
			setLoading(false);
			return;
		}

		if (sheet_url && !sheet_url.includes("docs.google.com/spreadsheets/d/")) {
			toast.warn("Niepoprawny link do arkusza");
			setLoading(false);
			return;
		}

		if (pricing_name.length > 32) {
			toast.warn("Nazwa cennika jest za długa");
			setLoading(false);
			return;
		}

		if (
			((cups_or_colors === "cups" && available_cup_pricings?.includes(pricing_name)) ||
				(cups_or_colors === "colors" && available_color_pricings?.includes(pricing_name))) &&
			newPricing
		) {
			toast.warn("Taki cennik już istnieje, proszę wybrać go z listy");
			setLoading(false);
			return;
		}

		let res = {} as Response;
		if (cups_or_colors === "cups") {
			res = await fetch("/api/updatecups", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pricing_name,
					sheet_url,
				}),
			});

			if (res.ok) {
				const data = await res.json();
				const { incompleteCups, cupsWithoutPrices, lastCellEmpty } = data as {
					incompleteCups: string[];
					cupsWithoutPrices: string[];
					lastCellEmpty: string[];
				};
				toast.success(
					`Cennik został dodany. ${
						lastCellEmpty.length > 0
							? `Uzupełnij ostatnią kolumnę w wierszach: ${lastCellEmpty.join(", ")} - inaczej zostaną pominięte. `
							: ""
					}${
						incompleteCups.length > 0
							? `Kubki z niepełnymi danymi (zostaną pominięte) w wierszach: ${incompleteCups.join(", ")}. `
							: ""
					}${cupsWithoutPrices.length > 0 ? `Kubki bez cen w wierszach: ${cupsWithoutPrices.join(", ")}. ` : ""}
                Odśwież stronę, aby zobaczyć zmiany.`,
					{
						autoClose: false,
					}
				);
			}
		} else if (cups_or_colors === "colors") {
			res = await fetch("/api/updatecolors", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pricing_name,
					sheet_url,
				}),
			});

			if (res.ok) {
				toast.success("Cennik został dodany. Odśwież stronę, aby zobaczyć zmiany.");
			}
		}

		if (res.ok) {
			setCups_or_colors("");
			setLoading(false);
			setPricing_name("");
			setNewPricing(false);
			return;
		}

		if (res.status === 400) {
			const data = await res.json();
			const { duplicateCodes } = data as { duplicateCodes: string[] };
			toast.error("Cennik zawiera duplikaty kodów, proszę je usunąć i spróbować ponownie. Duplikaty: " + duplicateCodes.join(", "), {
				autoClose: false,
			});
		} else {
			toast.error("Wystąpił błąd");
		}

		setLoading(false);
		setPricing_name("");
		setNewPricing(false);
		return;
	};

	return (
		<>
			<h2>Aktualizuj/dodaj cennik</h2>
			<hr />
			<br />
			<div className="px-4 mb-4">
				<select
					id="cups_or_colors"
					defaultValue=""
					onChange={(e) => setCups_or_colors(e.target.value as "cups" | "colors")}
					disabled={loading}
					className="border border-black"
				>
					<option value="" disabled hidden>
						Kubki/nadruki
					</option>
					<option value="cups">Kubki</option>
					<option value="colors">Nadruki</option>
				</select>
			</div>
			<div className="flex flex-row gap-4 px-4 mb-4">
				<p>Aktualizuj/dodaj cennik:</p>
				<select
					id="pricing_name"
					defaultValue=""
					disabled={!cups_or_colors || loading}
					onChange={(e) => {
						if (e.target.value === "new") setNewPricing(true);
						else setNewPricing(false);
						setPricing_name(e.target.value as string);
					}}
					className="border border-black"
				>
					<option value="" disabled hidden>
						Wybierz cennik
					</option>
					{cups_or_colors === "cups" &&
						available_cup_pricings.sort().map((pricing) => (
							<option key={pricing} value={pricing}>
								{pricing}
							</option>
						))}
					{cups_or_colors === "colors" &&
						available_color_pricings.map((pricing) => (
							<option key={pricing} value={pricing}>
								{pricing}
							</option>
						))}
					<option value="new">Nowy cennik</option>
				</select>
				{newPricing && (
					<input
						type="text"
						id="new_pricing_name"
						placeholder="Nazwa nowego cennika"
						disabled={!cups_or_colors || loading}
						onChange={(e) => setPricing_name(e.target.value)}
						className="border border-black"
					/>
				)}
				<input
					type="text"
					id="sheet_url"
					disabled={!cups_or_colors || !pricing_name || loading}
					placeholder="Link do arkusza google"
					className="w-96 border border-black px-2"
				/>
				<button
					onClick={() => handleAddPricing()}
					disabled={!cups_or_colors || !pricing_name || loading}
					className={`px-2 w-24 rounded-md ${loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"}`}
				>
					Wyślij
				</button>
			</div>
			<div className="flex flex-row gap-4 px-4">
				<p>Zmień nazwę cennika:</p>
				<form
					className="flex flex-row gap-4"
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);

						const pricing_name = (e.target as HTMLFormElement).elements.namedItem("change_pricing_name") as HTMLSelectElement;
						const new_pricing_name = (e.target as HTMLFormElement).elements.namedItem(
							"new_change_pricing_name"
						) as HTMLInputElement;

						if (!pricing_name.value || !new_pricing_name.value) {
							toast.warn("Wypełnij wszystkie pola");
							setLoading(false);
							return;
						}

						const res = await fetch("/api/changepricingname", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								pricing_name: pricing_name.value,
								new_pricing_name: new_pricing_name.value,
								cups_or_colors,
							}),
						});
						if (res.ok) {
							toast.success("Nazwa cennika została zmieniona, odśwież stronę aby zobaczyć zmiany");
							setPricing_name("");
							setCups_or_colors("");
							setNewPricing(false);
						} else {
							toast.error("Wystąpił błąd");
						}
						setLoading(false);
						return;
					}}
				>
					<select
						defaultValue=""
						id="change_pricing_name"
						disabled={!cups_or_colors || loading}
						className="border border-black ml-[13px]"
					>
						<option value="" disabled hidden>
							Wybierz cennik
						</option>
						{cups_or_colors === "cups" &&
							available_cup_pricings.map((pricing) => (
								<option key={pricing} value={pricing}>
									{pricing}
								</option>
							))}
						{cups_or_colors === "colors" &&
							available_color_pricings.sort().map((pricing) => (
								<option key={pricing} value={pricing}>
									{pricing}
								</option>
							))}
					</select>
					<input
						id="new_change_pricing_name"
						type="text"
						placeholder="Nowa nazwa cennika"
						disabled={!cups_or_colors || loading}
						className="w-96 border border-black px-2"
					/>
					<button
						type="submit"
						disabled={!cups_or_colors || loading}
						className={`px-2 w-24 rounded-md ${loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"}`}
					>
						Wyślij
					</button>
				</form>
			</div>
		</>
	);
};
