"use client";

import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const Navbar = ({ authUser }: { authUser: User | null }) => {
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
            className="lg:rounded-none fixed block right-0 left-0 top-0 border-b z-50 bg-white h-[115px] transition-all min-h-[50px] mb-5"
            role="navigation"
            data-spy="affix"
            data-offset-top="100"
        >
            <div className="block md:w-[750px] lg:w-[970px] xl:w-[1170px] h-full mr-auto ml-auto px-[15px]">
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
                    <div className="block lg:float-right lg:-mr-[15px] ml-[59px]">
                        <ul className="mt-[15px] pl-0 -ml-[5px] mb-[10px] block ">
                            <li>
                                <a href="?lang=1">
                                    <img
                                        className="align-middle overflow-clip"
                                        src="https://kubki.com.pl/img/pl.jpg"
                                        alt="pl"
                                    />
                                </a>
                            </li>
                            <li>
                                <a href="?lang=2">
                                    <img src="https://kubki.com.pl/img/en.jpg" alt="en" />
                                </a>
                            </li>
                        </ul>

                        <form action="https://kubki.com.pl/" method="get">
                            <input
                                type="text"
                                name="search"
                                defaultValue="szukaj"
                                onClick={(e) => ((e.target as HTMLInputElement).value = "")}
                            />
                        </form>
                    </div>
                    <ul className="lg:float-right ml-[59px] mr-0 mt-12 mb-0 pl-0 leading-5 text-[14px]">
                        <li className="lg:float-left relative block box-border">
                            <a
                                href="https://kubki.com.pl/"
                                className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block"
                            >
                                <img src="https://kubki.com.pl/img/home.png" alt="" />
                            </a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a
                                href="https://kubki.com.pl/blog.html"
                                className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block border-none drop-shadow-sm"
                            >
                                Blog
                            </a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a
                                href="https://kubki.com.pl/Kubki.html?lang=1"
                                className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block border-none drop-shadow-sm"
                            >
                                Oferta
                            </a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a
                                href="https://kubki.com.pl/O_firmie2.html"
                                className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block border-none drop-shadow-sm"
                            >
                                O firmie
                            </a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a
                                href="https://kubki.com.pl/ECO.html"
                                className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block border-none drop-shadow-sm"
                            >
                                ECO
                            </a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a
                                href="https://kubki.com.pl/Know_how.html"
                                className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block border-none drop-shadow-sm"
                            >
                                Strefa wiedzy
                            </a>
                        </li>
                        <li className="lg:float-left relative block">
                            <a
                                href="https://kubki.com.pl/Kontakt.html"
                                className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block border-none drop-shadow-sm"
                            >
                                Kontakt
                            </a>
                        </li>
                    </ul>
                    {authUser && (
                        <>
                            <label
                                className="z-20 w-6 h-6 absolute cursor-pointer"
                                onClick={() => handleLogout()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
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
