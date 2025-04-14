"use client"

import { useState } from "react";
import EditBranch from "@/components/detailsForm";
import ManageService from "@/components/serviceForm";
import ManageInv from "@/components/inventoryForm";
import ManageBookings from "@/components/bookingList";
import ManageTransactions from "@/components/transactionList";
import ViewMessages from "@/components/messageList";
import { useRouter } from "next/navigation";

export default function Sidebar({ admin }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        
            
        {isOpen && <div className="fixed inset-0 bg-black opacity-80 z-40" onClick={() => setIsOpen(false)}></div>}
        
        <div className={`fixed top-0 left-0 w-64 bg-white shadow-lg h-full z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <button className="m-6 p-2 bg-[#301414] w-52 text-white rounded-lg" onClick={() => setIsOpen(false)}>Close</button>
            <nav className="p-4">
            <ul>
                <li>{admin && <button className="p-2" onClick={() => {router.push("/tmsAdmin/admins")}}>Admins</button>}</li>
                <li>{admin && <button className="p-2 mb-8" onClick={() => {router.push("/tmsAdmin/branches")}}>Branches</button>}</li>
                
                <li><button className="p-2" onClick={() => {router.push("/tmsAdmin/details")}}>Branch Details</button></li>
                <li><button className="p-2" onClick={() => {router.push("/tmsAdmin/services")}}>Services</button></li>
                <li><button className="p-2" onClick={() => {router.push("/tmsAdmin/inventory")}}>Inventory</button></li>
                <li><button className="p-2" onClick={() => {router.push("/tmsAdmin/bookings")}}>Bookings</button></li>
                <li><button className="p-2" onClick={() => {router.push("/tmsAdmin/transactions")}}>Transactions</button></li>
                <li><button className="p-2" onClick={() => {router.push("/tmsAdmin/messages")}}>Messages</button></li>
                <li><button className="p-2 py-6" onClick={() => {router.push("/tmsAdmin")}}>Log out</button></li>
            </ul>
            </nav>
        </div>

        {!isOpen && 
        <button className="fixed top-12 left-4 p-2 bg-[#301414] text-[#e0d8ad] rounded hover:scale-105 transition-all z-50 font-bold text-4xl" onClick={() => setIsOpen(!isOpen)}>
            ☰
        </button>}
        </>
    );
}
