"use client"
import { motion } from "framer-motion";

export default function Loading() {
    return (
        
        <div className=" flex justify-center items-center h-screen w-screen bg-[#502424]">
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
