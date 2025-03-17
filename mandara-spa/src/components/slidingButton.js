"use client";

export default function SlidingButton () {
    return (
        <a
        className="group w-45 mt-120 relative inline-block overflow-hidden border-1 border-white px-8 py-3 focus:ring-3 focus:outline-hidden"
        >
        <span
            className="absolute inset-y-0 left-0 w-[1px] bg-white transition-all group-hover:w-full"
        ></span>

        <span
            className="relative text-xl font-normal text-white transition-colors group-hover:text-red-400"
        >
            BOOK NOW!
        </span>
        </a>
    );
};