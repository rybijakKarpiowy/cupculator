"use client";

import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";

export const Navbar = ({ authUser }: { authUser: User | null }) => {
    const searchParams = useSearchParams()
    const lang = searchParams.get("lang") || "1";
    const cup = searchParams.get("cup") || "";

    const supabase = createClientComponentClient();

    const handleLogout = async () => {
        console.log("logout");
        const err = await supabase.auth.signOut({ scope: "global" });
        if (err) {
            console.error(err);
        }

        window.location.reload();
    };

    return (
        <nav
            className="lg:rounded-none fixed block right-0 left-0 top-0 z-50 bg-white h-[115px] transition-all min-h-[50px] mb-5"
            role="navigation"
            data-spy="affix"
            data-offset-top="100"
        >
            <div className="block md:w-[750px] lg:w-[970px] xl:w-[1170px] h-full mr-auto ml-auto px-[15px] border-none">
                <div className="lg:float-left lg:mx-0 block">
                    <button
                        type="button"
                        className="lg:hidden relative float-right mr-[15px] px-[10px] py-[9px] my-2 mx-0 bg-transparent border border-transparent rounded-none overflow-visible"
                        data-toggle="collapse"
                        data-target="#navbar"
                        aria-expanded="false"
                        aria-controls="navbar"
                    >
                        <span className="absolute w-[1px] h-[1px] -m-[1px] p-0 overflow-hidden border-0">
                            Menu
                        </span>
                        <span className="block w-[22px] h-[2px] rounded-[1px]"></span>
                        <span className="block w-[22px] h-[2px] rounded-[1px]"></span>
                        <span className="block w-[22px] h-[2px] rounded-[1px]"></span>
                    </button>
                    <a
                        className="lg:-ml-[15px] drop-shadow float-left p-[15px] text-lg leading-5 h-[50px]"
                        href="https://kubki.com.pl/"
                    >
                        <img
                            className="h-[80px] w-auto"
                            src="https://kubki.com.pl/img/logo-20lat.png"
                            alt="Kubki.com.pl"
                        />
                    </a>
                </div>

                <div
                    id="navbar"
                    className="lg:mx-0 lg:px-0 lg:pb-0 block overflow-visible h-auto max-h-[340px] relative"
                >
                    <div className="block lg:float-right lg:-mr-[15px] ml-[59px] border-none">
                        <ul className="mt-[18px] pl-0 -ml-[5px] mb-[10px] flex gap-1">
                            <li className="px-[5px]">
                                <a href={`?cup=${cup}&lang=1`}>
                                    <img
                                        className="align-middle overflow-clip"
                                        src="https://kubki.com.pl/img/pl.jpg"
                                        alt="pl"
                                    />
                                </a>
                            </li>
                            <li className="px-[5px]">
                                <a href={`?cup=${cup}&lang=2`}>
                                    <img src="https://kubki.com.pl/img/en.jpg" alt="en" />
                                </a>
                            </li>
                        </ul>

                        <form action="https://kubki.com.pl/" method="get" className="relative">
                            <input
                                type="text"
                                name="search"
                                defaultValue="szukaj"
                                onClick={(e) => ((e.target as HTMLInputElement).value = "")}
                                className="bg-[rgb(192,_4,_24)] py-[5px] pl-[40px] pr-[15px] absolute right-0 top-[3px] w-[95px] h-[33px] z-50 text-white rounded-[25px] outline-none search"
                            />
                        </form>
                    </div>
                    <ul className="lg:float-right ml-[59px] mr-0 mt-[47px] mb-0 pl-0 leading-[22.4px] text-[14px]">
                        <li className="lg:float-left relative block box-border mr-[15px]">
                            <a
                                href="https://kubki.com.pl/"
                            >
                                <img src="https://kubki.com.pl/img/home.png" alt="" />
                            </a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/blog.html" className="tab">Blog</a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/Kubki.html?lang=1" className="tab">Oferta</a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/O_firmie2.html" className="tab">O firmie</a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/ECO.html" className="tab">ECO</a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/Know_how.html" className="tab">Strefa wiedzy</a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/Kontakt.html" className="tab">Kontakt</a>
                        </li>
                    </ul>
                    {authUser && (
                        <>
                            <label
                                className="z-20 w-[33px] h-[33px] absolute cursor-pointer logout -right-20 top-[47px]"
                                onClick={() => handleLogout()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="white"
                                    className="w-6 h-6 relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                    />
                                </svg>
                            </label>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
