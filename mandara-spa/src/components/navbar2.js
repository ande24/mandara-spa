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
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-110 transition-all  hover:text-gray-200 ${currPage === "body" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        BODY
                        </a>

                        <div className="absolute group-hover:block hidden right-0">
                            <div
                                className="absolute text-xs group-hover:block hidden font-semibold rounded-md right-0 mt-7 w-56 divide-y divide-gray-100  border border-gray-100 bg-white shadow-lg"
                                role="menu"
                            >
                                <div className="p-2 text-xs font-semibold">
                                    <p className="block p-2 uppercase text-gray-800">MASSAGE THERAPY</p>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        SWEDISH AROMATHERAPY
                                    </a>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        SHIATSU DRY MASSAGE
                                    </a>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        COMBINATION AROMATHERAPY
                                    </a>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        HOT STONE MASSAGE
                                    </a>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        FOUR HANDS THERAPY
                                    </a>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        VENTOSA CUPPING WITH HILOT
                                    </a>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        VENTOSA CUPPING WITH SIGNATURE MASSAGE
                                    </a>
                                </div>

                                <div className="p-2 text-xs font-semibold">
                                    <p className="block p-2 uppercase text-gray-800">BODY SCRUB AND WRAPS</p>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        THE SCRUB RITUAL
                                    </a>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        BODY SCRUB AND MASSAGE
                                    </a>

                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        BODY SCRUB, WRAP AND MASSAGE
                                    </a>

                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative group flex flex-col">
                        <a
                        href="/user/hand_and_foot"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-110 transition-all  hover:text-gray-200 ${currPage === "hand" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        HAND AND FOOT
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

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    FOOT SPA
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    XIAMEN FOOT MASSAGE
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    CHAIR MASSAGE
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    NAIL CARE
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative group flex flex-col">
                        <a
                        href="/user/face"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-110 transition-all  hover:text-gray-200 ${currPage === "face" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        FACE
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

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    NON-ABRASIVE DIAMOND PEEL
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    COLLAGEN GOLD MASK
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    NON-SURGICAL FACE LIFT
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    AGELOC GALVANIC FACIAL SPA
                                </a>

                                <a
                                    href="#"
                                    className="block rounded-lg px-4 py-2  text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem"
                                >
                                    RADIANCE FACIAL SPA PACKAGE
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
