"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, onSnapshot, doc, getDocs, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import Image from "next/image";

const ManageTransactions = ({onClose}) => {
    const auth = getAuth(firebase_app)
    const db = getFirestore(firebase_app);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);

    const [transactions, setTransactions] = useState([]);
    const [services, setServices] = useState([]);
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log("No user data found in Firestore");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
    
            fetchUserData();
        }
    }, [user]);

    useEffect(() => {
        if (userData && userData.branch_id) {
            const fetchBranchData = async () => {
                try {
                    const branchRef = doc(db, "branches", userData.branch_id); 
                    const branchSnap = await getDoc(branchRef);
                    if (branchSnap.exists()) {
                        setBranchData(branchSnap.data());
                    } else {
                        console.log("No branch data found");
                    }
                } catch (error) {
                    console.error("Error fetching branch data:", error);
                } 
            };

            fetchBranchData();
        }
    }, [userData]);

    useEffect(() => {
        if (userData?.branch_id && branchData) {
            const fetchServices = async () => {
                try {
                    const branchRef = doc(db, "branches", userData.branch_id);
                    const serviceCollection = collection(branchRef, "services");
                    const serviceSnapshot = await getDocs(serviceCollection);
                    const serviceList = serviceSnapshot.docs
                        .filter(docu => docu.id !== "placeholder")
                        .map(docu => ({
                            id: docu.id,
                            name: docu.data().service_name,
                            price: docu.data().service_price,
                            desc: docu.data().service_desc,
                            duration: docu.data().service_duration,
                            category: docu.data().service_category,
                            status: docu.data().service_status
                        }));
    
                    console.log("services: ", serviceList);
                    setServices(serviceList);
                } catch (error) {
                    console.error("Error fetching services:", error);
                }
            };
            fetchServices();
        }
    }, [branchData]);

    useEffect(() => {
        if (!userData?.branch_id || !branchData || !services) return;

        const branchRef = doc(db, "branches", userData.branch_id);
        const transactionCollection = collection(branchRef, "transactions");
        let bookingData = null;

        const unsubscribe = onSnapshot(transactionCollection, async (snapshot) => {
            const transactionList = await Promise.all(
                snapshot.docs
                    .filter(docu => docu.id !== "placeholder")
                    .map(async (docu) => {
                        const data = docu.data();

                        const bookingRef = doc(branchRef, "bookings", data.bookingId);
                        const bookingSnap = await getDoc(bookingRef);
                        
                        let serviceName = "", servicePrice = "";
                        if (bookingSnap.exists()) {  
                            bookingData = bookingSnap.data();
                            if (bookingData.service_id) {  
                                const serviceRef = doc(branchRef, "services", bookingData.service_id);
                                const serviceSnap = await getDoc(serviceRef);
                                if (serviceSnap.exists()) {
                                    serviceName = serviceSnap.data().service_name;
                                    servicePrice = serviceSnap.data().service_price;
                                }
                            }
                        }

                        console.log("Booking: ", bookingData)

                        return {
                            id: docu.id,
                            date: bookingData ? bookingData.booked_date : "",
                            time: bookingData ? bookingData.booked_time : "Booking not found",
                            booking: data.bookingId,
                            pax: data.no_of_customers,
                            serviceName: serviceName,
                            servicePrice: servicePrice,
                            sales: data.service_income,
                            items: data.items_used
                                ? data.items_used.map(item => ({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,  
                                    quantity: item.quantity 
                                }))
                                : []  
                        };
                    })
            );

            console.log("Updated transactions:", transactionList);
            setTransactions(transactionList);
        });

        return () => unsubscribe();
    }, [userData?.branch_id, !!branchData, !!services]);

    const handleRemoveTransaction = async (e, transactionId) => {
        e.preventDefault();
        setSaving(true)

        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirmDelete) return;

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const transactionRef = doc(branchRef, "transactions", transactionId);
        
            await deleteDoc(transactionRef);

            setTransactions((prevTransactions) => prevTransactions.filter(transaction => transaction.id !== transactionId));

            alert("Transaction removed successfully!");
        } catch (error) {
            alert("Error removing transaction: " + error.message);
        }
        setSaving(false)
    };

    return (
        <div className="flex justify-center items-center ">
            <Image className="fixed top-30 z-50" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#301414] bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl  w-full overflow-y-auto">
                        <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg">
                            <h3 className="text-lg font-bold">Transaction List</h3>
                            {transactions.length > 0 ? (
                                <ul className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto m-2 rounded p-2 w-full">
                                    {transactions.map((transaction) => (
                                        <li 
                                            key={transaction.id} 
                                            className="flex justify-between items-center border p-3 rounded w-full bg-gray-200 border-gray-400"
                                        >
                                            <div className="flex flex-col">
                                                <p className="font-semibold">Booking {transaction.booking}</p>
                                                <p>{transaction.serviceName} {transaction.servicePrice ? `(₱${transaction.servicePrice}) x ${transaction.pax}` : ""}</p>
                                                {transaction.items.map((item) => (
                                                    <p key={item.id}>- {item.name} (₱{item.price}) x {item.quantity}</p>
                                                ))}
                                                <p>{transaction.servicePrice ?`= ₱${transaction.revenue} Total Sales` : "" }</p>
                                                <p className="text-sm text-gray-600">{transaction.date} | {transaction.time}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <button 
                                                    disabled={saving}
                                                    className="bg-[#502424] text-white p-2 font-serif rounded-lg hover:bg-[#301414] mx-2 transition"
                                                    onClick={(e) => handleRemoveTransaction(e, transaction.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No items available.</p>
                            )}
                        </div>
                        <div className="flex justify-center items-center">
                            <button 
                                className="bg-[#502424]  text-white p-3 m-3 mb-6 max-w-xs font-serif w-full hover:bg-[#301414] transition rounded-lg"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default ManageTransactions;
