"use client"

export default function NavBar2 ({currPage, onBook}) {
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
                <nav className="-mb-px  flex gap-15" aria-label="Tabs">

                    <div className="relative group flex flex-col">
                        <a
                        href="/user/about"
                        className={`shrink-0 border-b-2 px-1 pb-4 mb-3 text-sm font-semibold hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "info" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        ABOUT US
                        </a>
                    </div>
                    
                    <div className="relative group flex flex-col">
                        <a
                        href="/user/contact"
                        className={`shrink-0 border-b-2 px-1 pb-4 mb-3 text-sm font-semibold hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "contact" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        CONTACT US
                        </a>
                    </div>
                    
                    <div className="relative group flex flex-col">
                        <button
                        onClick={onBook}
                        className={`shrink-0 border-b-2 px-1 pb-4 mb-3 text-sm font-semibold hover:scale-105 transition-all  hover:text-gray-200 ${currPage === "login" ? "border-gray-200 text-gray-200" : "border-transparent text-[#e0d8ad] hover:text-gray-200"}`}
                        >
                        BOOK NOW
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    </div>
    )
}
