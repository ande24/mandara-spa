"use client"

import Image from "next/image";

export default function NavBar () {
    return (
    <div>
        <div className="sm:hidden">
            <label htmlFor="Tab" className="sr-only">Tab</label>

            <select id="Tab" className="w-full rounded-md border-gray-200">
            <option select>Home</option>
            <option>Locations</option>
            <option>Services</option>
            <option>Notifications</option>
            </select>
        </div>

        <div className="hidden sm:block">
            <div className=" border-gray-200 mt-6 ml-22">
                <nav className="-mb-px flex gap-6" aria-label="Tabs">
                    <a
                    href="#"
                    className="shrink-0 border-b-2 mt-7 border-gray-200 px-1 pb-4 text-xs font-medium text-gray-200"
                    >
                    HOME
                    </a>

                    <a
                    href="#"
                    className="shrink-0 border-transparent mt-7 px-1 pb-4 text-xs font-medium text-[#e0d8ad]  hover:text-gray-200"
                    >
                    LOCATIONS
                    </a>

                    <a
                    href="#"
                    className="shrink-0  border-transparent  mt-7 px-1 pb-4 text-xs font-medium text-[#e0d8ad] hover:text-gray-200"
                    >
                    SIGNATURE RITUALS
                    </a>

                    <Image
                    src="/images/mandara_gold.png"
                    alt=""
                    height={150}
                    width={130}
                    className="mb-7"
                    />

                    <a
                    href="#"
                    className="shrink-0 border-transparent mt-7  pb-4 text-xs font-medium text-[#e0d8ad] hover:text-gray-200"
                    >
                    BODY RITUALS
                    </a>

                    <a
                    href="#"
                    className="shrink-0 border-transparent mt-7  pb-4 text-xs font-medium text-[#e0d8ad]  hover:text-gray-200"
                    >
                    HAND AND FOOT RITUALS
                    </a>

                    <a
                    href="#"
                    className="shrink-0  border-transparent mt-7  pb-4 text-xs font-medium text-[#e0d8ad] hover:text-gray-200"
                    >
                    FACE RITUALS
                    </a>
                </nav>
            </div>
        </div>
    </div>
    )
}
