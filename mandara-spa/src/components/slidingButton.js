"use client";

export default function SlidingButton () {
    return (
        <a
        className="group w-46 mt-120 relative inline-block overflow-hidden border-1 border-white px-8 py-3 focus:ring-3 focus:outline-hidden"
        >
            <span
                className="absolute inset-y-0 left-0 w-[1px] bg-white transition-all group-hover:w-full"
            ></span>

            <button>
                <span
                    className="relative text-xl font-serif text-white transition-colors group-hover:text-red-400"
                >
                    BOOK NOW!
                </span>
            </button>
        
        </a>
    );
};