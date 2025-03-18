"use client"

export default function NavBar2 ({currPage}) {
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

                    <div className="relative group flex flex-col">
                        <a
                        href="/user/body"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "body" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        ABOUT US
                        </a>

                        <div className="absolute group-hover:block hidden right-0">
                            <div
                                className="absolute text-xs group-hover:block hidden font-semibold rounded-md right-0 mt-7 w-56 divide-y divide-gray-100  border border-gray-100 bg-white shadow-lg"
                                role="menu"
                            >
                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    SWEDISH AROMATHERAPY
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative group flex flex-col">
                        <a
                        href="/user/hand_and_foot"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "hand" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        CONTACT US
                        </a>

                        <div
                            className="absolute group-hover:block hidden  rounded-md right-0 mt-7 w-56 text-xs font-semibold border border-gray-100 bg-white shadow-lg"
                            role="menu"
                            >
                            <div className="p-2">
                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    HAND SPA
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative group flex flex-col">
                        <a
                        href="/user/face"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "face" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        LOG IN
                        </a>

                        <div
                            className="absolute group-hover:block hidden  rounded-md right-0 mt-7 w-56 text-xs font-semibold border border-gray-100 bg-white shadow-lg"
                            role="menu"
                            >
                            <div className="p-2">
                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    DIAMOND PEEL WITH MACHINE
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
