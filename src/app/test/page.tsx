// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { Cup } from "../api/updatecups/route";
// import noImage from "@/../public/noimage.png";
// import { PricesDisplay } from "@/components/calculator/pricesDisplay";
// import { PalletQuantities } from "@/components/calculator/palletQuantities";
// import { Restriction, checkRestriction } from "@/lib/checkRestriction";

// export default function Test({
//     searchParams,
// }: {
//     searchParams: {
//         lang: "1" | "2";
//     };
// }) {
//     const lang = searchParams.lang;
//     const clientPriceUnit: "zł" | "EUR" = "zł";
//     const cupData: Cup[] = [
//         {
//             // example of a Cup
//             code: "K002.18.01",
//             name: "Tomek EU",
//             color: "niebieski",
//             volume: "350ml",
//             icon: "",
//             trend_color: true,
//             soft_touch: true,
//             pro_color: true,
//             category: "kubek",
//             link: "Tomek_EU",
//             material: "ceramika",
//             deep_effect: true,
//             deep_effect_plus: true,
//             direct_print: true,
//             polylux: true,
//             transfer_plus: true,
//             digital_print: true,
//             digital_print_additional: false,
//             nadruk_apla: true,
//             nadruk_dookola_pod_uchem: true,
//             nadruk_na_dnie: true,
//             nadruk_na_spodzie: true,
//             nadruk_na_uchu: true,
//             nadruk_na_powloce_magicznej_1_kolor: true,
//             nadruk_wewnatrz_na_sciance: true,
//             personalizacja: true,
//             nadruk_przez_rant: true,
//             naklejka_papierowa_z_nadrukiem: true,
//             zdobienie_paskiem_bez_laczenia: true,
//             zdobienie_paskiem_z_laczeniem: true,
//             zdobienie_tapeta_na_barylce_I_stopien_trudnosci: true,
//             zdobienie_tapeta_na_barylce_II_stopien_trudnosci: true,
//             wkladanie_ulotek_do_kubka: true,
//             nadruk_zlotem_do_25cm2: true,
//             nadruk_zlotem_do_50cm2: true,
//             trend_color_lowered_edge: true,
//             prices: {
//                 price_24: 7,
//                 price_72: 6.5,
//                 price_108: 6,
//                 price_216: 5.5,
//                 price_504: 5,
//                 price_1008: 4.5,
//                 price_2520: 4,
//             },
//             supplier: null,
//             supplier_code: null,
//             mini_pallet: 108,
//             half_pallet: 432,
//             full_pallet: 1440,
//             mini_pallet_singular: 72,
//             half_pallet_singular: 288,
//             full_pallet_singular: 960,
//         },
//     ];
//     const restrictions = [
//         {
//             imprintType: "direct_print",
//             anotherValue: "trend_color_inside",
//         },
//     ] as Restriction[];

//     const [selectedCup, setSelectedCup] = useState<Cup>(cupData[0]);
//     const [amounts, setAmounts] = useState<{
//         amount1: number | null;
//         amount2: number | null;
//         amount3: number | null;
//         inputs: number;
//     }>({
//         amount1: null,
//         amount2: null,
//         amount3: null,
//         inputs: 1,
//     });
//     const [cupConfig, setCupConfig] = useState<CupConfigInterface>({
//         trend_color: "",
//         soft_touch: false,
//         pro_color: false,
//         imprintType: "",
//         imprintColors: 0,
//         nadruk_wewnatrz_na_sciance: 0,
//         nadruk_na_uchu: false,
//         nadruk_na_spodzie: false,
//         nadruk_na_dnie: false,
//         nadruk_przez_rant: false,
//         nadruk_apla: false,
//         nadruk_dookola_pod_uchem: false,
//         nadruk_zlotem: false,
//         personalizacja: false,
//         zdobienie_paskiem: false,
//         zdobienie_tapeta_na_barylce: false,
//         nadruk_na_powloce_magicznej_1_kolor: false,
//         naklejka_papierowa_z_nadrukiem: false,
//         wkladanie_ulotek_do_kubka: false,
//         cardboard: "",
//     });

//     const amountAlerts = (amount: number | null, inputId: number) => {
//         if (!amount) return;
//         if (amount < 24) {
//             switch (inputId) {
//                 case 1:
//                     setAmounts({ ...amounts, amount1: null });
//                     break;
//                 case 2:
//                     setAmounts({ ...amounts, amount2: null });
//                     break;
//                 case 3:
//                     setAmounts({ ...amounts, amount3: null });
//                     break;
//             }
//             toast.warn(
//                 lang === "1" ? "Minimalna ilość to 24 sztuki" : "Minimum amount is 24 pieces"
//             );
//             return;
//         }
//         if (amount >= 50 && amount < 72) {
//             toast.info(
//                 lang === "1" ? "Lepsza cena przy 72 sztukach" : "You get better price for 72 pieces"
//             );
//             return;
//         }
//         if (amount >= 100 && amount < 108) {
//             toast.info(
//                 lang === "1"
//                     ? "Lepsza cena przy 108 sztukach"
//                     : "You get better price for 108 pieces"
//             );
//             return;
//         }
//         if (amount >= 200 && amount < 216) {
//             toast.info(
//                 lang === "1"
//                     ? "Lepsza cena przy 216 sztukach"
//                     : "You get better price for 216 pieces"
//             );
//             return;
//         }
//         if (amount >= 500 && amount < 504) {
//             toast.info(
//                 lang === "1"
//                     ? "Lepsza cena przy 504 sztukach"
//                     : "You get better price for 504 pieces"
//             );
//             return;
//         }
//         if (amount >= 1000 && amount < 1008) {
//             toast.info(
//                 lang === "1"
//                     ? "Lepsza cena przy 1008 sztukach"
//                     : "You get better price for 1008 pieces"
//             );
//             return;
//         }
//         if (amount >= 2500 && amount < 2520) {
//             toast.info(
//                 lang === "1"
//                     ? "Lepsza cena przy 2520 sztukach"
//                     : "You get better price for 2520 pieces"
//             );
//             return;
//         }
//         if (amount >= 5040) {
//             switch (inputId) {
//                 case 1:
//                     setAmounts({ ...amounts, amount1: null });
//                     break;
//                 case 2:
//                     setAmounts({ ...amounts, amount2: null });
//                     break;
//                 case 3:
//                     setAmounts({ ...amounts, amount3: null });
//                     break;
//             }
//             toast.info(
//                 lang === "1"
//                     ? "Skontaktuj się z działem handlowym w celu uzyskania indywidualnej kalkulacji (co najmniej 5040 sztuk)"
//                     : "Contact our sales department for individual pricing (at least 5040 pieces)"
//             );
//             return;
//         }
//     };
//     return (
//         <div className="flex flex-col items-start pt-12 pb-16">
//             <div className="flex flex-row pr-[400px] w-full items-center justify-center gap-8">
//                 {selectedCup.icon ? (
//                     <Image src={selectedCup.icon} alt={""} width={200} height={250} />
//                 ) : (
//                     <Image src={noImage} alt={""} width={200} height={250} />
//                 )}
//                 <div className="flex flex-col">
//                     <div className="border border-[#c00418] pl-2 pr-8 py-2 w-max rounded-md">
//                         <p>{selectedCup.code}</p>
//                         <p>{selectedCup.name}</p>
//                         <p>{selectedCup.volume}</p>
//                     </div>
//                     <br />
//                     <div className="flex flex-col relative w-80">
//                         <p>{lang === "1" ? "Ilość: " : "Amount: "}</p>
//                         <p>{lang === "1" ? "Jednostkowa cena produktu: " : "Price per unit: "}</p>
//                         <p>{lang === "1" ? "Koszt przygotowalni: " : "Preparation cost: "}</p>
//                         {clientPriceUnit === "zł" && (
//                             <p>{lang === "1" ? "Koszt transportu: " : "Transport cost: "}</p>
//                         )}
//                         <p>{lang === "1" ? "Całkowity koszt: " : "Total cost: "}</p>
//                         <div className="absolute -right-[128px] flex flex-row">
//                             <PricesDisplay
//                                 amount={amounts.amount1}
//                                 lang={lang}
//                                 clientPriceUnit={clientPriceUnit}
//                                 keep={amounts.inputs > 0}
//                                 selectedCup={selectedCup}
//                                 colorPricing={{}}
//                                 additionalValues={{}}
//                                 cupConfig={cupConfig}
//                             />
//                         </div>
//                         <div className="absolute -right-[320px] flex flex-row">
//                             <PricesDisplay
//                                 amount={amounts.amount2}
//                                 lang={lang}
//                                 clientPriceUnit={clientPriceUnit}
//                                 keep={amounts.inputs > 1}
//                                 selectedCup={selectedCup}
//                                 colorPricing={{}}
//                                 additionalValues={{}}
//                                 cupConfig={cupConfig}
//                             />
//                         </div>
//                         <div className="absolute -right-[512px] flex flex-row">
//                             <PricesDisplay
//                                 amount={amounts.amount3}
//                                 lang={lang}
//                                 clientPriceUnit={clientPriceUnit}
//                                 keep={amounts.inputs > 2}
//                                 selectedCup={selectedCup}
//                                 colorPricing={{}}
//                                 additionalValues={{}}
//                                 cupConfig={cupConfig}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="ml-[40%] flex flex-col gap-4">
//                 <div className="absolute right-[62vw] mr-4 mt-4 flex flex-row gap-2 items-center">
//                     {lang == "1" ? "Wybierz kolor: " : "Select color: "}
//                     <select
//                         onChange={(e) => {
//                             if (e.target.value === selectedCup.code) return;
//                             setCupConfig({
//                                 trend_color: "",
//                                 soft_touch: false,
//                                 pro_color: false,
//                                 imprintType: "",
//                                 imprintColors: 0,
//                                 nadruk_wewnatrz_na_sciance: 0,
//                                 nadruk_na_uchu: false,
//                                 nadruk_na_spodzie: false,
//                                 nadruk_na_dnie: false,
//                                 nadruk_przez_rant: false,
//                                 nadruk_apla: false,
//                                 nadruk_dookola_pod_uchem: false,
//                                 nadruk_zlotem: false,
//                                 personalizacja: false,
//                                 zdobienie_paskiem: false,
//                                 zdobienie_tapeta_na_barylce: false,
//                                 nadruk_na_powloce_magicznej_1_kolor: false,
//                                 naklejka_papierowa_z_nadrukiem: false,
//                                 wkladanie_ulotek_do_kubka: false,
//                                 cardboard: "",
//                             });
//                             setSelectedCup(
//                                 cupData.find((cup) => cup.code === e.target.value) as Cup
//                             );
//                         }}
//                         defaultValue={cupData[0].code}
//                         className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                     >
//                         {cupData.map((cup) => (
//                             <option key={cup.code} value={cup.code}>
//                                 {cup.color}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="relative">
//                     {lang === "1" ? "Ilość: " : "Amount: "}
//                     <div className="flex flex-row absolute ml-2 top-0 left-[11vw] ">
//                         <div className="flex flex-row gap-[24px]">
//                             <input
//                                 type="number"
//                                 min="1"
//                                 className="text-right border border-[#bbb] bg-slate-50 text-black px-2 rounded-md"
//                                 onBlur={(e) => {
//                                     e.target.value
//                                         ? setAmounts({
//                                               ...amounts,
//                                               amount1: parseInt(e.target.value),
//                                           })
//                                         : setAmounts({ ...amounts, amount1: null });
//                                     amountAlerts(parseInt(e.target.value), 1);
//                                 }}
//                                 onKeyUp={(e) => {
//                                     if (e.key === "Enter" || e.key === "Escape") {
//                                         (e.target as HTMLInputElement).blur();
//                                     }
//                                 }}
//                             />
//                             {amounts.inputs > 1 && (
//                                 <input
//                                     type="number"
//                                     min="1"
//                                     className="text-right border border-[#bbb] bg-slate-50 text-black px-2 rounded-md"
//                                     onBlur={(e) => {
//                                         e.target.value
//                                             ? setAmounts({
//                                                   ...amounts,
//                                                   amount2: parseInt(e.target.value),
//                                               })
//                                             : setAmounts({ ...amounts, amount2: null });
//                                         amountAlerts(parseInt(e.target.value), 2);
//                                     }}
//                                     onKeyUp={(e) => {
//                                         if (e.key === "Enter" || e.key === "Escape") {
//                                             (e.target as HTMLInputElement).blur();
//                                         }
//                                     }}
//                                 />
//                             )}
//                             {amounts.inputs > 2 && (
//                                 <input
//                                     type="number"
//                                     min="1"
//                                     className="text-right border border-[#bbb] bg-slate-50 text-black px-2 rounded-md"
//                                     onBlur={(e) => {
//                                         e.target.value
//                                             ? setAmounts({
//                                                   ...amounts,
//                                                   amount3: parseInt(e.target.value),
//                                               })
//                                             : setAmounts({ ...amounts, amount3: null });
//                                         amountAlerts(parseInt(e.target.value), 3);
//                                     }}
//                                     onKeyUp={(e) => {
//                                         if (e.key === "Enter" || e.key === "Escape") {
//                                             (e.target as HTMLInputElement).blur();
//                                         }
//                                     }}
//                                 />
//                             )}
//                         </div>
//                         <div className="flex flex-row ml-2 gap-1">
//                             {amounts.inputs < 3 && (
//                                 <button
//                                     onClick={() =>
//                                         setAmounts({ ...amounts, inputs: amounts.inputs + 1 })
//                                     }
//                                     className="w-[24px] h-[24px] rounded-md bg-green-300 hover:bg-green-400 flex items-center justify-center"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 20 20"
//                                         fill="currentColor"
//                                         className="w-5 h-5"
//                                     >
//                                         <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
//                                     </svg>
//                                 </button>
//                             )}
//                             {amounts.inputs > 1 && (
//                                 <button
//                                     onClick={() => {
//                                         if (amounts.inputs === 3) {
//                                             setAmounts({
//                                                 ...amounts,
//                                                 amount3: null,
//                                                 inputs: amounts.inputs - 1,
//                                             });
//                                         } else if (amounts.inputs === 2) {
//                                             setAmounts({
//                                                 ...amounts,
//                                                 amount2: null,
//                                                 inputs: amounts.inputs - 1,
//                                             });
//                                         }
//                                     }}
//                                     className="w-[24px] h-[24px] rounded-md bg-red-300 hover:bg-red-400 flex items-center justify-center"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 20 20"
//                                         fill="currentColor"
//                                         className="w-5 h-5"
//                                     >
//                                         <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
//                                     </svg>
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex flex-col gap-2 w-[386px] bg-slate-100 p-4">
//                     {selectedCup.trend_color && (
//                         <div className="flex flex-row justify-between items-center">
//                             Trend Color:
//                             <select
//                                 defaultValue=""
//                                 onChange={(e) => {
//                                     if (e.target.value === cupConfig.trend_color) return;
//                                     setCupConfig({
//                                         ...cupConfig,
//                                         trend_color: e.target
//                                             .value as CupConfigInterface["trend_color"],
//                                         imprintType: "",
//                                         imprintColors: 0,
//                                         nadruk_wewnatrz_na_sciance: 0,
//                                         nadruk_na_uchu: false,
//                                         nadruk_na_spodzie: false,
//                                         nadruk_na_dnie: false,
//                                         nadruk_przez_rant: false,
//                                         nadruk_apla: false,
//                                         nadruk_dookola_pod_uchem: false,
//                                         nadruk_zlotem: false,
//                                         personalizacja: false,
//                                         zdobienie_paskiem: false,
//                                         zdobienie_tapeta_na_barylce: false,
//                                         nadruk_na_powloce_magicznej_1_kolor: false,
//                                         naklejka_papierowa_z_nadrukiem: false,
//                                         wkladanie_ulotek_do_kubka: false,
//                                     });
//                                 }}
//                                 className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                             >
//                                 <option value="">
//                                     {lang === "1" ? "Bez Trend Color" : "No Trend Color"}
//                                 </option>
//                                 <option value="inside">
//                                     {lang === "1" ? "Wewnątrz" : "Inside"}
//                                 </option>
//                                 <option value="outside">
//                                     {lang === "1" ? "Zewnątrz" : "Outside"}
//                                 </option>
//                                 <option value="both">
//                                     {lang === "1" ? "Wenątrz i na zewnątrz" : "Inside and outside"}
//                                 </option>
//                                 {selectedCup.trend_color_lowered_edge && (
//                                     <option value="lowered_edge">
//                                         {lang === "1"
//                                             ? "Na zewnątrz z obniżonym rantem"
//                                             : "Outside with lowered edge"}
//                                     </option>
//                                 )}
//                             </select>
//                         </div>
//                     )}
//                     {selectedCup.soft_touch && (
//                         <div className="flex flex-row justify-between items-center">
//                             Soft Touch:
//                             <select
//                                 defaultValue=""
//                                 onChange={(e) =>
//                                     setCupConfig({
//                                         ...cupConfig,
//                                         soft_touch: e.target.value ? true : false,
//                                         imprintType: "",
//                                         imprintColors: 0,
//                                         nadruk_wewnatrz_na_sciance: 0,
//                                         nadruk_na_uchu: false,
//                                         nadruk_na_spodzie: false,
//                                         nadruk_na_dnie: false,
//                                         nadruk_przez_rant: false,
//                                         nadruk_apla: false,
//                                         nadruk_dookola_pod_uchem: false,
//                                         nadruk_zlotem: false,
//                                         personalizacja: false,
//                                         zdobienie_paskiem: false,
//                                         zdobienie_tapeta_na_barylce: false,
//                                         nadruk_na_powloce_magicznej_1_kolor: false,
//                                         naklejka_papierowa_z_nadrukiem: false,
//                                         wkladanie_ulotek_do_kubka: false,
//                                     })
//                                 }
//                                 className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                             >
//                                 <option value="">
//                                     {lang === "1" ? "Bez Soft Touch" : "No Soft Touch"}
//                                 </option>
//                                 <option value="soft_touch">
//                                     {lang === "1" ? "Zewnątrz" : "Outside"}
//                                 </option>
//                             </select>
//                         </div>
//                     )}
//                     {selectedCup.pro_color && (
//                         <div className="flex flex-row justify-between items-center">
//                             Pro Color:
//                             <select
//                                 defaultValue=""
//                                 onChange={(e) =>
//                                     setCupConfig({
//                                         ...cupConfig,
//                                         pro_color: e.target.value ? true : false,
//                                         imprintType: "",
//                                         imprintColors: 0,
//                                         nadruk_wewnatrz_na_sciance: 0,
//                                         nadruk_na_uchu: false,
//                                         nadruk_na_spodzie: false,
//                                         nadruk_na_dnie: false,
//                                         nadruk_przez_rant: false,
//                                         nadruk_apla: false,
//                                         nadruk_dookola_pod_uchem: false,
//                                         nadruk_zlotem: false,
//                                         personalizacja: false,
//                                         zdobienie_paskiem: false,
//                                         zdobienie_tapeta_na_barylce: false,
//                                         nadruk_na_powloce_magicznej_1_kolor: false,
//                                         naklejka_papierowa_z_nadrukiem: false,
//                                         wkladanie_ulotek_do_kubka: false,
//                                     })
//                                 }
//                                 className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                             >
//                                 <option value="">
//                                     {lang === "1" ? "Bez Pro Color" : "No Pro Color"}
//                                 </option>
//                                 <option value="pro_color">
//                                     {lang === "1" ? "Wewnątrz" : "Inside"}
//                                 </option>
//                             </select>
//                         </div>
//                     )}
//                     <div className="flex flex-row justify-between items-center">
//                         {lang === "1" ? "Wybierz nadruk: " : "Select print type: "}
//                         <select
//                             defaultValue=""
//                             onChange={(e) => {
//                                 if (e.target.value === cupConfig.imprintType) return;
//                                 setCupConfig({
//                                     ...cupConfig,
//                                     imprintType: e.target
//                                         .value as CupConfigInterface["imprintType"],
//                                     imprintColors: 0,
//                                     nadruk_wewnatrz_na_sciance: 0,
//                                     nadruk_na_uchu: false,
//                                     nadruk_na_spodzie: false,
//                                     nadruk_na_dnie: false,
//                                     nadruk_przez_rant: false,
//                                     nadruk_apla: false,
//                                     nadruk_dookola_pod_uchem: false,
//                                     nadruk_zlotem: false,
//                                     personalizacja: false,
//                                     zdobienie_paskiem: false,
//                                     zdobienie_tapeta_na_barylce: false,
//                                     nadruk_na_powloce_magicznej_1_kolor: false,
//                                     naklejka_papierowa_z_nadrukiem: false,
//                                     wkladanie_ulotek_do_kubka: false,
//                                 });
//                             }}
//                             className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                         >
//                             <option value="">{lang === "1" ? "Brak" : "None"}</option>
//                             {selectedCup.direct_print &&
//                                 checkRestriction({
//                                     cupConfig,
//                                     restrictions,
//                                     imprintType: "direct_print",
//                                 }) && (
//                                     <option value="direct_print">
//                                         {lang === "1" ? "Nadruk bezpośredni" : "Direct print"}
//                                     </option>
//                                 )}
//                             {selectedCup.transfer_plus &&
//                                 checkRestriction({
//                                     cupConfig,
//                                     restrictions,
//                                     imprintType: "transfer_plus",
//                                 }) && (
//                                     <>
//                                         <option value="transfer_plus_1">
//                                             {lang === "1"
//                                                 ? "Kalka ceramiczna 1 strona"
//                                                 : "Transfer plus 1 side"}
//                                         </option>
//                                         <option value="transfer_plus_2">
//                                             {lang === "1"
//                                                 ? "Kalka ceramiczna 2 strony"
//                                                 : "Transfer plus 2 sides"}
//                                         </option>
//                                         <option value="transfer_plus_round">
//                                             {lang === "1"
//                                                 ? "Kalka ceramiczna wokół"
//                                                 : "Transfer plus around"}
//                                         </option>
//                                     </>
//                                 )}
//                             {selectedCup.polylux &&
//                                 checkRestriction({
//                                     cupConfig,
//                                     restrictions,
//                                     imprintType: "polylux",
//                                 }) && (
//                                     <>
//                                         <option value="polylux_1">
//                                             Polylux {lang === "1" ? "1 strona" : "1 side"}
//                                         </option>
//                                         <option value="polylux_2">
//                                             Polylux {lang === "1" ? "2 strony" : "2 sides"}
//                                         </option>
//                                         <option value="polylux_round">
//                                             Polylux {lang === "1" ? "wokół" : "around"}
//                                         </option>
//                                     </>
//                                 )}
//                             {selectedCup.deep_effect &&
//                                 checkRestriction({
//                                     cupConfig,
//                                     restrictions,
//                                     imprintType: "deep_effect",
//                                 }) && (
//                                     <>
//                                         <option value="deep_effect_1">
//                                             Deep effect {lang === "1" ? "1 strona" : "1 side"}
//                                         </option>
//                                         <option value="deep_effect_2">
//                                             Deep effect {lang === "1" ? "2 strony" : "2 sides"}
//                                         </option>
//                                     </>
//                                 )}
//                             {selectedCup.deep_effect_plus &&
//                                 checkRestriction({
//                                     cupConfig,
//                                     restrictions,
//                                     imprintType: "deep_effect_plus",
//                                 }) && (
//                                     <>
//                                         <option value="deep_effect_plus_1">
//                                             Deep effect plus {lang === "1" ? "1 strona" : "1 side"}
//                                         </option>
//                                         <option value="deep_effect_plus_2">
//                                             Deep effect plus {lang === "1" ? "2 strony" : "2 sides"}
//                                         </option>
//                                     </>
//                                 )}
//                             {selectedCup.digital_print &&
//                                 checkRestriction({
//                                     cupConfig,
//                                     restrictions,
//                                     imprintType: "digital_print",
//                                 }) && (
//                                     <option value="digital_print">
//                                         {lang === "1" ? "Nadruk cyfrowy" : "Digital print"}
//                                     </option>
//                                 )}
//                         </select>
//                     </div>
//                     <div className="flex flex-row justify-between items-center">
//                         {lang === "1" ? "Liczba kolorów nadruku: " : "Number of print colors: "}
//                         <select
//                             defaultValue=""
//                             disabled={
//                                 !cupConfig.imprintType || cupConfig.imprintType === "digital_print"
//                             }
//                             onChange={(e) => {
//                                 const imprintColors = parseInt(e.target.value) || 0;
//                                 setCupConfig({
//                                     ...cupConfig,
//                                     imprintColors,
//                                 });
//                             }}
//                             className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                         >
//                             <option value="" disabled hidden>
//                                 {cupConfig.imprintType !== "digital_print"
//                                     ? lang === "1"
//                                         ? "Brak"
//                                         : "None"
//                                     : lang === "1"
//                                     ? "Pełny kolor"
//                                     : "Full color"}
//                             </option>
//                             {cupConfig.imprintType &&
//                                 [
//                                     "deep_effect_1",
//                                     "deep_effect_2",
//                                     "deep_effect_plus_1",
//                                     "deep_effect_plus_2",
//                                 ].includes(cupConfig.imprintType) &&
//                                 [...Array(2)].map(
//                                     (_, index) => (
//                                         (index += 1),
//                                         (
//                                             <option key={index} value={index}>
//                                                 {index.toString()}
//                                             </option>
//                                         )
//                                     )
//                                 )}
//                             {cupConfig.imprintType &&
//                                 cupConfig.imprintType === "direct_print" &&
//                                 [...Array(4)].map(
//                                     (_, index) => (
//                                         (index += 1),
//                                         (
//                                             <option key={index} value={index}>
//                                                 {index.toString()}
//                                             </option>
//                                         )
//                                     )
//                                 )}
//                             {cupConfig.imprintType &&
//                                 [
//                                     "transfer_plus_1",
//                                     "transfer_plus_2",
//                                     "transfer_plus_round",
//                                     "polylux_1",
//                                     "polylux_2",
//                                     "polylux_round",
//                                 ].includes(cupConfig.imprintType) &&
//                                 [...Array(16)].map(
//                                     (_, index) => (
//                                         (index += 1),
//                                         (
//                                             <option key={index} value={index}>
//                                                 {index.toString()}
//                                             </option>
//                                         )
//                                     )
//                                 )}
//                         </select>
//                     </div>
//                 </div>
//                 <div className="flex flex-col flex-wrap max-h-[230px] gap-1 accent-[#009E60] bg-slate-100 pt-4 pb-2">
//                     {selectedCup.nadruk_wewnatrz_na_sciance &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_wewnatrz_na_sciance",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         e.target.checked
//                                             ? setCupConfig({
//                                                   ...cupConfig,
//                                                   nadruk_wewnatrz_na_sciance: 1,
//                                               })
//                                             : setCupConfig({
//                                                   ...cupConfig,
//                                                   nadruk_wewnatrz_na_sciance: 0,
//                                               })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1"
//                                         ? "Nadruk wewnątrz na ściance"
//                                         : "Print on the inside"}
//                                 </p>
//                                 {cupConfig.nadruk_wewnatrz_na_sciance ? (
//                                     <select
//                                         defaultValue="1"
//                                         onChange={(e) =>
//                                             setCupConfig({
//                                                 ...cupConfig,
//                                                 nadruk_wewnatrz_na_sciance: parseInt(
//                                                     e.target.value
//                                                 ) as 1 | 2 | 3 | 4,
//                                             })
//                                         }
//                                         className="border w-16 border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                                     >
//                                         <option value="1">1</option>
//                                         <option value="2">2</option>
//                                         <option value="3">3</option>
//                                         <option value="4">4</option>
//                                     </select>
//                                 ) : (
//                                     <div className="w-16" />
//                                 )}
//                             </div>
//                         )}
//                     {selectedCup.nadruk_na_uchu &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_na_uchu",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             nadruk_na_uchu: e.target.checked,
//                                         })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1" ? "Nadruk na uchu" : "Print on the handle"}
//                                 </p>
//                             </div>
//                         )}
//                     {selectedCup.nadruk_na_spodzie &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_na_spodzie",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             nadruk_na_spodzie: e.target.checked,
//                                         })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1"
//                                         ? "Nadruk na spodzie (zewn.)"
//                                         : "Print on the bottom outside"}
//                                 </p>
//                             </div>
//                         )}
//                     {selectedCup.nadruk_na_dnie &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_na_dnie",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             nadruk_na_dnie: e.target.checked,
//                                         })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1"
//                                         ? "Nadruk na dnie (wewn.)"
//                                         : "Print on the bottom inside"}
//                                 </p>
//                             </div>
//                         )}
//                     {selectedCup.nadruk_przez_rant &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_przez_rant",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             nadruk_przez_rant: e.target.checked,
//                                         })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1" ? "Nadruk przez rant" : "Over the rim imprint"}
//                                 </p>
//                             </div>
//                         )}
//                     {selectedCup.nadruk_apla &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_apla",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             nadruk_apla: e.target.checked,
//                                         })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1" ? "Nadruk apla" : "Apla print"}
//                                 </p>
//                             </div>
//                         )}
//                     {selectedCup.nadruk_dookola_pod_uchem &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_dookola_pod_uchem",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             nadruk_dookola_pod_uchem: e.target.checked,
//                                         })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1"
//                                         ? "Nadruk dookoła (pod uchem)"
//                                         : "Print around (under the handle)"}
//                                 </p>
//                             </div>
//                         )}
//                     {((selectedCup.nadruk_zlotem_do_25cm2 &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_zlotem_25",
//                         })) ||
//                         (selectedCup.nadruk_zlotem_do_50cm2 &&
//                             checkRestriction({
//                                 cupConfig,
//                                 restrictions,
//                                 anotherValue: "nadruk_zlotem_50",
//                             }))) && (
//                         <div className="flex flex-row gap-2 items-center mx-4">
//                             <input
//                                 type="checkbox"
//                                 onChange={(e) =>
//                                     setCupConfig({ ...cupConfig, nadruk_zlotem: e.target.checked })
//                                 }
//                             />
//                             <p className="py-[2px]">
//                                 {lang === "1" ? "Nadruk złotem" : "Gold print"}
//                             </p>
//                             {cupConfig.nadruk_zlotem ? (
//                                 <select
//                                     defaultValue=""
//                                     onChange={(e) => {
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             nadruk_zlotem: e.target.value as "25" | "50",
//                                         });
//                                     }}
//                                     className="border w-32 border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                                 >
//                                     <option value="" disabled hidden>
//                                         {lang === "1" ? "Brak" : "None"}
//                                     </option>
//                                     {selectedCup.nadruk_zlotem_do_25cm2 &&
//                                         checkRestriction({
//                                             cupConfig,
//                                             restrictions,
//                                             anotherValue: "nadruk_zlotem_25",
//                                         }) && <option value="25">{"<= 25cm2"}</option>}
//                                     {selectedCup.nadruk_zlotem_do_50cm2 &&
//                                         checkRestriction({
//                                             cupConfig,
//                                             restrictions,
//                                             anotherValue: "nadruk_zlotem_50",
//                                         }) && <option value="50">{"<= 50cm2"}</option>}
//                                 </select>
//                             ) : (
//                                 <div className="w-32" />
//                             )}
//                         </div>
//                     )}
//                     {selectedCup.personalizacja &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "personalizacja",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             personalizacja: e.target.checked,
//                                         })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1" ? "Personalizacja" : "Personalization"}
//                                 </p>
//                             </div>
//                         )}
//                     {((selectedCup.zdobienie_paskiem_bez_laczenia &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "zdobienie_paskiem_bez_laczenia",
//                         })) ||
//                         (selectedCup.zdobienie_paskiem_z_laczeniem &&
//                             checkRestriction({
//                                 cupConfig,
//                                 restrictions,
//                                 anotherValue: "zdobienie_paskiem_z_laczeniem",
//                             }))) && (
//                         <div className="flex flex-row gap-2 items-center mx-4">
//                             <input
//                                 type="checkbox"
//                                 onChange={(e) =>
//                                     setCupConfig({
//                                         ...cupConfig,
//                                         zdobienie_paskiem: e.target.checked,
//                                     })
//                                 }
//                             />
//                             <p className="py-[2px]">
//                                 {lang === "1" ? "Zdobienie paskiem" : "Decoration with stripe"}
//                             </p>
//                             {cupConfig.zdobienie_paskiem ? (
//                                 <select
//                                     defaultValue=""
//                                     onChange={(e) => {
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             zdobienie_paskiem: e.target.value as
//                                                 | "bez_laczenia"
//                                                 | "z_laczeniem",
//                                         });
//                                     }}
//                                     className="border w-48 border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                                 >
//                                     <option value="" disabled hidden>
//                                         {lang === "1" ? "Brak" : "None"}
//                                     </option>
//                                     {selectedCup.zdobienie_paskiem_bez_laczenia &&
//                                         checkRestriction({
//                                             cupConfig,
//                                             restrictions,
//                                             anotherValue: "zdobienie_paskiem_bez_laczenia",
//                                         }) && (
//                                             <option value="bez_laczenia">
//                                                 {lang === "1"
//                                                     ? "Bez łączenia"
//                                                     : "Without connection"}
//                                             </option>
//                                         )}
//                                     {selectedCup.zdobienie_paskiem_z_laczeniem &&
//                                         checkRestriction({
//                                             cupConfig,
//                                             restrictions,
//                                             anotherValue: "zdobienie_paskiem_z_laczeniem",
//                                         }) && (
//                                             <option value="z_laczeniem">
//                                                 {lang === "1" ? "Z łączeniem" : "With connection"}
//                                             </option>
//                                         )}
//                                 </select>
//                             ) : (
//                                 <div className="w-48" />
//                             )}
//                         </div>
//                     )}
//                     {selectedCup.nadruk_na_powloce_magicznej_1_kolor &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "nadruk_na_powloce_magicznej_1_kolor",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         e.target.checked
//                                             ? setCupConfig({
//                                                   ...cupConfig,
//                                                   nadruk_na_powloce_magicznej_1_kolor: true,
//                                               })
//                                             : setCupConfig({
//                                                   ...cupConfig,
//                                                   nadruk_na_powloce_magicznej_1_kolor: false,
//                                               })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1"
//                                         ? "Nadruk na powłoce magicznej (1 kolor)"
//                                         : "Print on the magic coating (1 color)"}
//                                 </p>
//                             </div>
//                         )}
//                     {((selectedCup.zdobienie_tapeta_na_barylce_I_stopien_trudnosci &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "zdobienie_tapeta_na_barylce_I_stopien",
//                         })) ||
//                         (selectedCup.zdobienie_tapeta_na_barylce_II_stopien_trudnosci &&
//                             checkRestriction({
//                                 cupConfig,
//                                 restrictions,
//                                 anotherValue: "zdobienie_tapeta_na_barylce_II_stopien",
//                             }))) && (
//                         <div className="flex flex-row gap-2 items-center mx-4">
//                             <input
//                                 type="checkbox"
//                                 onChange={(e) =>
//                                     setCupConfig({
//                                         ...cupConfig,
//                                         zdobienie_tapeta_na_barylce: e.target.checked,
//                                     })
//                                 }
//                             />
//                             <p className="py-[2px]">
//                                 {lang === "1"
//                                     ? "Zdobienie tapetą na baryłce"
//                                     : "Decoration with tape on the barrel"}
//                             </p>
//                             {cupConfig.zdobienie_tapeta_na_barylce ? (
//                                 <select
//                                     defaultValue=""
//                                     onChange={(e) => {
//                                         setCupConfig({
//                                             ...cupConfig,
//                                             zdobienie_tapeta_na_barylce: e.target.value as
//                                                 | "I_stopien"
//                                                 | "II_stopien",
//                                         });
//                                     }}
//                                     className="border w-52 border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md"
//                                 >
//                                     <option value="" disabled hidden>
//                                         {lang === "1" ? "Brak" : "None"}
//                                     </option>
//                                     {selectedCup.zdobienie_tapeta_na_barylce_I_stopien_trudnosci &&
//                                         checkRestriction({
//                                             cupConfig,
//                                             restrictions,
//                                             anotherValue: "zdobienie_tapeta_na_barylce_I_stopien",
//                                         }) && (
//                                             <option value="I_stopien">
//                                                 {lang === "1"
//                                                     ? "I stopień trudności"
//                                                     : "I degree of difficulty"}
//                                             </option>
//                                         )}
//                                     {selectedCup.zdobienie_tapeta_na_barylce_II_stopien_trudnosci &&
//                                         checkRestriction({
//                                             cupConfig,
//                                             restrictions,
//                                             anotherValue: "zdobienie_tapeta_na_barylce_II_stopien",
//                                         }) && (
//                                             <option value="II_stopien">
//                                                 {lang === "1"
//                                                     ? "II stopień trudności"
//                                                     : "II degree of difficulty"}
//                                             </option>
//                                         )}
//                                 </select>
//                             ) : (
//                                 <div className="w-52" />
//                             )}
//                         </div>
//                     )}
//                     {selectedCup.naklejka_papierowa_z_nadrukiem &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "naklejka_papierowa_z_nadrukiem",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         e.target.checked
//                                             ? setCupConfig({
//                                                   ...cupConfig,
//                                                   naklejka_papierowa_z_nadrukiem: true,
//                                               })
//                                             : setCupConfig({
//                                                   ...cupConfig,
//                                                   naklejka_papierowa_z_nadrukiem: false,
//                                               })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1"
//                                         ? "Naklejka papierowa z nadrukiem"
//                                         : "Paper sticker with imprint"}
//                                 </p>
//                             </div>
//                         )}
//                     {selectedCup.wkladanie_ulotek_do_kubka &&
//                         checkRestriction({
//                             cupConfig,
//                             restrictions,
//                             anotherValue: "wkladanie_ulotek_do_kubka",
//                         }) && (
//                             <div className="flex flex-row gap-2 items-center mx-4">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) =>
//                                         e.target.checked
//                                             ? setCupConfig({
//                                                   ...cupConfig,
//                                                   wkladanie_ulotek_do_kubka: true,
//                                               })
//                                             : setCupConfig({
//                                                   ...cupConfig,
//                                                   naklejka_papierowa_z_nadrukiem: false,
//                                               })
//                                     }
//                                 />
//                                 <p className="py-[2px]">
//                                     {lang === "1"
//                                         ? "Wkładanie ulotek do kubka"
//                                         : "Inserting leaflets into the cup"}
//                                 </p>
//                             </div>
//                         )}
//                 </div>
//             </div>
//             <div className="ml-[40%] w-[60%] mt-5">
//                 <div className="flex flex-row ml-64 gap-[28px] items-center relative">
//                     <div className="inline-flex flex-col absolute -left-64 bg-slate-100 px-4 pb-4 pt-2">
//                         <p className="py-[2px]">{lang === "1" ? "Opakowanie: " : "Packaging: "}</p>
//                         <select
//                             defaultValue=""
//                             onChange={(e) =>
//                                 setCupConfig({
//                                     ...cupConfig,
//                                     cardboard: e.target.value as CupConfigInterface["cardboard"],
//                                 })
//                             }
//                             className="border w-max border-[#bbb] bg-slate-50 text-black px-2 py-[2px] rounded-md h-max"
//                         >
//                             <option value="">
//                                 {lang === "1" ? "Opakowanie zbiorcze" : "Bulk packaging"}
//                             </option>
//                             <option value="singular">
//                                 {lang === "1" ? "Kartoniki jednostkowe" : "Unit cartons"}
//                             </option>
//                             {selectedCup.category !== "filiżanka" && (
//                                 <>
//                                     <option value="6pack_wykrojnik">
//                                         {lang === "1" ? "6-pak z wykrojnika" : "6-pack from a die"}
//                                     </option>
//                                     <option value="6pack_klapowy">
//                                         {lang === "1" ? "6-pak klapowy" : "6-pack flap"}
//                                     </option>
//                                 </>
//                             )}
//                         </select>
//                     </div>

//                     <PalletQuantities
//                         lang={lang}
//                         selectedCardboard={cupConfig.cardboard}
//                         selectedCup={selectedCup}
//                         amount={amounts.amount1}
//                         keep={amounts.inputs > 0}
//                     />
//                     <PalletQuantities
//                         lang={lang}
//                         selectedCardboard={cupConfig.cardboard}
//                         selectedCup={selectedCup}
//                         amount={amounts.amount2}
//                         keep={amounts.inputs > 1}
//                     />
//                     <PalletQuantities
//                         lang={lang}
//                         selectedCardboard={cupConfig.cardboard}
//                         selectedCup={selectedCup}
//                         amount={amounts.amount3}
//                         keep={amounts.inputs > 2}
//                     />
//                     {/* ceny palet tez w panelu do wrzucenia */}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export interface CupConfigInterface {
//     trend_color: "" | "inside" | "outside" | "both" | "lowered_edge";
//     soft_touch: boolean;
//     pro_color: boolean;
//     imprintType:
//         | ""
//         | "direct_print"
//         | "transfer_plus_1"
//         | "transfer_plus_2"
//         | "transfer_plus_round"
//         | "polylux_1"
//         | "polylux_2"
//         | "polylux_round"
//         | "deep_effect_1"
//         | "deep_effect_2"
//         | "deep_effect_plus_1"
//         | "deep_effect_plus_2"
//         | "digital_print";
//     imprintColors: number;
//     nadruk_wewnatrz_na_sciance: 0 | 1 | 2 | 3 | 4;
//     nadruk_na_uchu: boolean;
//     nadruk_na_spodzie: boolean;
//     nadruk_na_dnie: boolean;
//     nadruk_przez_rant: boolean;
//     nadruk_apla: boolean;
//     nadruk_dookola_pod_uchem: boolean;
//     nadruk_zlotem: true | false | "25" | "50";
//     personalizacja: boolean;
//     zdobienie_paskiem: true | false | "bez_laczenia" | "z_laczeniem";
//     nadruk_na_powloce_magicznej_1_kolor: boolean;
//     zdobienie_tapeta_na_barylce: true | false | "I_stopien" | "II_stopien";
//     naklejka_papierowa_z_nadrukiem: boolean;
//     wkladanie_ulotek_do_kubka: boolean;
//     cardboard: "" | "singular" | "6pack_wykrojnik" | "6pack_klapowy";
// }
