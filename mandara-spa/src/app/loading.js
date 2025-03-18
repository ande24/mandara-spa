"use client"
import { motion } from "framer-motion";

export default function Loading() {
    return (
        
        <div className=" flex justify-center items-center h-screen w-screen bg-[#502424]">
            
            {/* <div className="flex flex-col items-center mb-6">
                <svg className="w-20 h-20 text-[#D4AF37]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 45L26 30L43 42L62 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-3xl font-bold text-[#D4AF37] mt-2">THE MANDARA SPA</h1>
                <p className="text-lg text-[#CBAA6F] tracking-widest">RELAXATION</p>
            </div> */}

            <motion.div 
                className="flex space-x-2"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <span className="w-4 h-4 bg-[#e0d8ad] rounded-full"></span>
                <span className="w-4 h-4 bg-[#e0d8ad] rounded-full"></span>
                <span className="w-4 h-4 bg-[#e0d8ad] rounded-full"></span>
            </motion.div>
        </div>
    );
}
