"use client"

export default function NavBar1 ({currPage}) {
    return (
    <div>
        <div className="sm:hidden">
            <label htmlFor="Tab" className="sr-only">Tab</label>

            <select id="Tab" className="w-full rounded-md border-gray-200">
            <option>Home</option>
            <option>Locations</option>
            <option>Services</option>
            <option>Notifications</option>
            </select>
        </div>

        <div className="hidden sm:block">
            <div className=" border-gray-200 mt-6">
                <nav className="-mb-px flex gap-6" aria-label="Tabs">
                    <a
                        href="/user/home"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-110 transition-all  hover:text-gray-200 ${currPage === "home" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        HOME
                    </a>

                    <div className="relative group flex flex-col">
                        <a
                            href="/user/locations"
                            className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-110 transition-all  hover:text-gray-200 ${currPage === "locations" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                            >
                            LOCATIONS
                        </a>

                        <div
                            className="absolute group-hover:block hidden  rounded-md left-0 mt-7  w-56 text-xs font-semibold border border-gray-100 bg-white shadow-lg"
                            role="menu"
                            >
                            <div className="p-2">
                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                BGC 3RD AVENUE
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                BGC ONE SERENDRA
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                GREENHILLS
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                BF PARANAQUE
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                CAMAYA COAST, BATAAN
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                S MAISON AT CONRAD MANILA, MOA COMPLEX
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                SM NORTH EDSA
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                PARK INN BY RADISSON, NORTH EDSA
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                VENICE GRAND CANAL, MCKINLEY HILL, TAGUIG
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                PARK INN BY RADISSON CLARK, PAMPANGA
                                </a>

                                <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                TAGAYTAY HILLCREST
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="relative group flex flex-col">
                        <a
                            href="/user/signature"
                            className={` shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-110 transition-all  hover:text-gray-200 ${currPage === "signature" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                            >
                            SERVICES
                        </a>

                        <div
                            className="absolute group-hover:block hidden  rounded-md left-0 mt-7 w-56 text-xs font-semibold border border-gray-100 bg-white shadow-lg"
                            role="menu"
                            >
                            <div className="p-2">
                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    MASSAGE
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    SCRUB, WRAP, MASSAGE
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    SCRUB
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    BODY SCRUB & MASSAGE
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    FOOT SPA WITH PEDICURE
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    HAND SPA WITH MANICURE
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    ULTIMATE MANDARA EXPERIENCE
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </div>
    )
}
