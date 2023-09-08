import { Database } from "@/database/types";

export const ProductsCardTab = ({cupsData} : {cupsData: Database["public"]["Tables"]["cups"]["Row"][]}) => {
    return (
        <div>
            <h2>Aktywacja klientów</h2>
            <hr />
            <br />
            <ul className="overflow-x-auto px-4 w-auto">
                <li>
                    <ul className="flex flex-row min-w-max">
                        <li className="px-2 border border-black w-48 text-center">
                            Imię i nazwisko
                        </li>
                        <li className="px-2 border border-black w-64 text-center">Nazwa firmy</li>
                        <li className="px-2 border border-black w-64 text-center">Adres</li>
                        <li className="px-2 border border-black w-24 text-center">Kod pocztowy</li>
                        <li className="px-2 border border-black w-32 text-center">Miasto</li>
                        <li className="px-2 border border-black w-32 text-center">
                            Województwo / Region
                        </li>
                        <li className="px-2 border border-black w-48 text-center">Telefon</li>
                        <li className="px-2 border border-black w-48 text-center">NIP</li>
                        <li className="px-2 border border-black w-16 text-center">Waluta</li>
                        <li className="px-2 border border-black w-32 text-center">Kraj</li>
                        <li className="px-2 border border-black w-64 text-center">Email</li>
                        <li className="px-2 border border-black w-32 text-center">Cennik kubków</li>
                        <li className="px-2 border border-black w-32 text-center">
                            Cennik nadruków
                        </li>
                        <li className="px-2 border border-black w-60 text-center">
                            Przypisany Handlowiec
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};
