"use client";

import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AdditionalValues = ({
	additionalValues,
}: {
	additionalValues: {
		plain_cup_markup_percent: number;
		mini_pallet_price: number;
		half_pallet_price: number;
		full_pallet_price: number;
		id: number;
	};
}) => {
	const [loading, setLoading] = useState(false);
	const [additionalValuesState, setAdditionalValuesState] = useState(additionalValues);

	const changeAdditionalValue = async (
		e: FormEvent<HTMLFormElement>,
		attr: "plain_cup_markup_percent" | "mini_pallet_price" | "half_pallet_price" | "full_pallet_price"
	) => {
		e.preventDefault();
		setLoading(true);
		const value = parseFloat((e.currentTarget.querySelector(`#${attr}`) as HTMLInputElement).value as string);
		if (isNaN(value)) {
			toast.warn("Wartość musi być liczbą");
			setLoading(false);
			return;
		}
		if (value <= 0) {
			toast.warn("Wartość musi być większa od 0");
			setLoading(false);
			return;
		}

		const res = await fetch("/api/updateadditionalvalues", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				attr,
				value,
				id: additionalValuesState.id,
			}),
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

		toast.success("Wartość została zmieniona");
		setAdditionalValuesState({ ...additionalValuesState, [attr]: value });
		setLoading(false);
		return;
	};

	return (
		<div>
			<h2>Dodatkowe wartości</h2>
			<hr />
			<br />
			<ul className="w-[25%] flex flex-col px-4 gap-4">
				<li className="flex flex-row gap-4 justify-between">
					<p>Narzut na kubki bez nadruku:</p>
					<form
						className="flex flex-row"
						onSubmit={(e) => {
							changeAdditionalValue(e, "plain_cup_markup_percent");
						}}
					>
						<input
							className="border border-black text-right"
							placeholder={additionalValuesState?.plain_cup_markup_percent.toString()}
							type="number"
							id="plain_cup_markup_percent"
						/>
						<p className="w-4">%</p>
						<button
							className={`px-2 rounded-md ${loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"} ml-4`}
							type="submit"
							disabled={loading}
						>
							Zapisz
						</button>
					</form>
				</li>
				<li className="flex flex-row gap-4 justify-between">
					<p>Koszt wysyłki mini palety:</p>
					<form
						className="flex flex-row"
						onSubmit={(e) => {
							changeAdditionalValue(e, "mini_pallet_price");
						}}
					>
						<input
							className="border border-black text-right"
							placeholder={additionalValuesState?.mini_pallet_price.toString()}
							type="number"
							id="mini_pallet_price"
						/>
						<p className="w-4">zł</p>
						<button
							className={`px-2 rounded-md ${loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"} ml-4`}
							type="submit"
							disabled={loading}
						>
							Zapisz
						</button>
					</form>
				</li>
				<li className="flex flex-row gap-4 justify-between">
					<p>Koszt wysyłki pół palety:</p>
					<form
						className="flex flex-row"
						onSubmit={(e) => {
							changeAdditionalValue(e, "half_pallet_price");
						}}
					>
						<input
							className="border border-black text-right"
							placeholder={additionalValuesState?.half_pallet_price.toString()}
							type="number"
							id="half_pallet_price"
						/>
						<p className="w-4">zł</p>
						<button
							className={`px-2 rounded-md ${loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"} ml-4`}
							type="submit"
							disabled={loading}
						>
							Zapisz
						</button>
					</form>
				</li>
				<li className="flex flex-row gap-4 justify-between">
					<p>Koszt wysyłki pełnej palety:</p>
					<form
						className="flex flex-row"
						onSubmit={(e) => {
							changeAdditionalValue(e, "full_pallet_price");
						}}
					>
						<input
							className="border border-black text-right"
							placeholder={additionalValuesState?.full_pallet_price.toString()}
							type="number"
							id="full_pallet_price"
						/>
						<p className="w-4">zł</p>
						<button
							className={`px-2 rounded-md ${loading ? "bg-slate-400" : "bg-green-300 hover:bg-green-400"} ml-4`}
							type="submit"
							disabled={loading}
						>
							Zapisz
						</button>
					</form>
				</li>
			</ul>
		</div>
	);
};
