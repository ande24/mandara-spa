"use client";

export default function SlidingButton () {
    return (
        <button
        className="group w-70 relative hover:scale-105 transition-all inline-block overflow-hidden border-1 border-white px-8 py-3  focus:outline-hidden"
        >
            <span
                className="absolute inset-y-0 left-0 w-[1px] bg-white transition-all group-hover:w-full"
            ></span>

            <div>
                <span
                    className="relative text-2xl font-serif text-white transition-colors group-hover:text-red-400"
                >
                    BOOK NOW!
                </span>
            </div>
        
        </button>
    );
};