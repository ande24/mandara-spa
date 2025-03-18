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
                        href="/user/about/info"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "info" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        ABOUT US
                        </a>
                    </div>
                    
                    <div className="relative group flex flex-col">
                        <a
                        href="/user/contact"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "contact" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        CONTACT US
                        </a>
                    </div>
                    
                    <div className="relative group flex flex-col">
                        <a
                        href="/user/login"
                        className={`shrink-0 border-b-2 px-1 pb-4 text-xs font-medium hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "login" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        LOG IN
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    </div>
    )
}
