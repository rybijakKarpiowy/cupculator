"use client";

export const Navbar = () => {
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
                    <a className="lg:-ml-[15px] drop-shadow float-left p-[15px] text-lg leading-5 h-[50px]" href="https://kubki.com.pl/">
                        <img
                            className="h-[80px] w-auto"
                            src="https://kubki.com.pl/img/logo-20lat.png"
                            alt="Kubki.com.pl"
                        />
                    </a>
                </div>

                <div
                    id="navbar"
                    className="lg:mx-0 lg:px-0 lg:pb-0 block overflow-visible h-auto max-h-[340px]"
                >
                    <div className="block lg:float-right lg:-mr-[15px] ml-[59px]">
                        <ul className="mt-[15px] pl-0 -ml-[5px] mb-[10px] block ">
                            <li>
                                <a href="?lang=1">
                                    <img className="align-middle overflow-clip" src="https://kubki.com.pl/img/pl.jpg" alt="pl" />
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
                        <li  className="lg:float-left relative block box-border">
                            <a href="https://kubki.com.pl/" className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block">
                                <img src="https://kubki.com.pl/img/home.png" alt="" />
                            </a>
                        </li>
                        <li  className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/blog.html" className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block font-[allerregular] text-[rgb(43,_41,_41)] border-none drop-shadow-sm">Blog</a>
                        </li>
                        <li  className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/Kubki.html?lang=1" className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block font-[allerregular] text-[rgb(43,_41,_41)] border-none drop-shadow-sm">Oferta</a>
                        </li>
                        <li  className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/O_firmie2.html" className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block font-[allerregular] text-[rgb(43,_41,_41)] border-none drop-shadow-sm">O firmie</a>
                        </li>
                        <li  className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/ECO.html" className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block font-[allerregular] text-[rgb(43,_41,_41)] border-none drop-shadow-sm">ECO</a>
                        </li>
                        <li  className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/Know_how.html" className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block font-[allerregular] text-[rgb(43,_41,_41)] border-none drop-shadow-sm">Strefa wiedzy</a>
                        </li>
                        <li  className="lg:float-left relative block">
                            <a href="https://kubki.com.pl/Kontakt.html" className="ml-[5px] p-[6px_15px] rounded-[25px] duration-200 float-left relative block font-[allerregular] text-[rgb(43,_41,_41)] border-none drop-shadow-sm">Kontakt</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
