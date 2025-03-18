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
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "home" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        HOME
                    </a>

                    <div className="relative group flex flex-col">
                        <a
                            href="/user/locations"
                            className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "locations" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                            >
                            LOCATIONS
                        </a>

                        <div
                            className="absolute group-hover:opacity-100 group-hover:scale-100 transition-all opacity-0 scale-0 z-10   rounded-md left-0 mt-7  w-56 text-xs font-semibold border border-gray-100 bg-white shadow-lg"
                            role="menu"
                            >
                            <div className="p-2">
                                <a
                                href="/user/locations"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                BGC 3RD AVENUE
                                </a>

                                <a
                                href="/user/locations?idx=9"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                BGC ONE SERENDRA
                                </a>

                                <a
                                href="/user/locations?idx=7"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                GREENHILLS
                                </a>

                                <a
                                href="/user/locations?idx=5"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                BF PARANAQUE
                                </a>

                                <a
                                href="/user/locations?idx=6"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                CAMAYA COAST, BATAAN
                                </a>

                                <a
                                href="/user/locations?idx=8"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                S MAISON AT CONRAD MANILA, MOA COMPLEX
                                </a>

                                <a
                                href="/user/locations?idx=10"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                SM NORTH EDSA
                                </a>

                                <a
                                href="/user/locations?idx=3"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                PARK INN BY RADISSON, NORTH EDSA
                                </a>

                                <a
                                href="/user/locations?idx=1"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                VENICE GRAND CANAL, MCKINLEY HILL, TAGUIG
                                </a>

                                <a
                                href="/user/locations?idx=2"
                                className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                role="menuitem"
                                >
                                PARK INN BY RADISSON CLARK, PAMPANGA
                                </a>

                                <a
                                href="/user/locations?idx=4"
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
                            className={` shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "services" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                            >
                            SERVICES
                        </a>

                        <div
                            className="absolute group-hover:opacity-100 group-hover:scale-100 transition-all opacity-0 scale-0 z-10 rounded-md left-0 mt-7 w-56 text-xs font-semibold border border-gray-100 bg-white shadow-lg"
                            role="menu"
                            >
                            <div className="p-2">
                                <a
                                    href="/user/services/signature"
                                    className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    SIGNATURE RITUALS
                                </a>

                                <div className="relative flex group/body ">
                                    <a
                                        className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        BODY RITUALS
                                    </a>
                                    
                                    <div
                                        className=" absolute text-xs transition-all group-hover/body:scale-100 group-hover/body:opacity-100 opacity-0 scale-0 font-semibold top-[-30] left-full rounded-md mt-7 w-56 divide-y divide-gray-100  border border-gray-100 bg-white shadow-lg"
                                        role="menu"
                                    >
                                        <a
                                            href="/user/services/body/massage_therapy"
                                            className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                            role="menuitem"
                                        >
                                            MASSAGE THERAPY
                                        </a>

                                        <a
                                            href="/user/services/body/scrub_and_wraps"
                                            className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                            role="menuitem"
                                        >
                                            SCRUB AND WRAPS
                                        </a>

                                        <a
                                            href="/user/services/body/healing_massage"
                                            className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                            role="menuitem"
                                        >
                                            TRADITIONAL HEALING MASSAGE
                                        </a>
                                    </div>
                                </div>
                               
                                <a
                                    href="/user/services/hand_and_foot"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    HAND AND FOOT RITUALS
                                </a>

                                <a
                                    href="/user/services/face"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    FACE RITUALS
                                </a>

                                <a
                                    href="/user/services/other"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                   OTHER TREATS
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
