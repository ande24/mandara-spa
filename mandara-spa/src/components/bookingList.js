"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, onSnapshot, doc, getDocs, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import AddTransaction from "./transactionForm";
import Image from "next/image";

const ManageBookings = ({onClose}) => {
    const auth = getAuth(firebase_app)
    const db = getFirestore(firebase_app);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [showTransaction, setShowTransaction] = useState(false);

    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [services, setServices] = useState([]);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

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
    }, [user, db]);

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
    }, [userData, db]);

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
    }, [branchData, db, userData.branch_id]);

    useEffect(() => {
        if (!userData?.branch_id || !branchData || !services) return;

        const branchRef = doc(db, "branches", userData.branch_id);
        const bookingCollection = collection(branchRef, "bookings");

        const unsubscribe = onSnapshot(bookingCollection, async (snapshot) => {
            const bookingList = await Promise.all(
                snapshot.docs
                    .filter(docu => docu.id !== "placeholder")
                    .map(async (docu) => {
                        const data = docu.data();
                        
                        let customerName = "", customerEmail = "";
                        if (data.customer_id) {
                            const customerSnap = await getDoc(doc(db, "users", data.customer_id));
                            if (customerSnap.exists()) {
                                customerName = customerSnap.data().user_name; 
                                customerEmail = customerSnap.data().user_email;
                            }
                        }

                        let serviceName = "", servicePrice = "";
                        if (data.service_id) {
                            const serviceRef = doc(branchRef, "services", data.service_id);
                            const serviceSnap = await getDoc(serviceRef);
                            if (serviceSnap.exists()) {
                                serviceName = serviceSnap.data().service_name;
                                servicePrice = serviceSnap.data().service_price;
                            }
                        }

                        let total = data.no_of_customers * Number(servicePrice)

                        return {
                            id: docu.id,
                            date: data.booked_date,
                            time: data.booked_time,
                            status: data.booking_status,
                            customer: customerName,
                            total: total,
                            price: servicePrice,
                            email: customerEmail,
                            pax: data.no_of_customers,
                            services: data.services,
                        };
                    })
            );

            console.log("Updated bookings:", bookingList);
            setBookings(bookingList);
        });

        return () => unsubscribe();
    }, [userData?.branch_id, branchData, db, services]);

    const toggleStatus = async (bookingId, newStatus) => {
        setSaving(true)
        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const bookingRef = doc(branchRef, "bookings", bookingId);

            await updateDoc(bookingRef, {
                booking_status: newStatus
            });

            setBookings(prevBookings => 
                prevBookings.map(booking => 
                    booking.id === bookingId ? { ...booking, status: newStatus } : booking
                )
            );
            

            if (newStatus === "completed") {
                const bookingSnap = await getDoc(bookingRef);
                const bookingData = { id: bookingSnap.id, ...bookingSnap.data() };
                setSelectedBooking(bookingData)

                setTimeout(() => setShowTransaction(true), 0);
            }

            alert("Service status updated!");
        } catch (error) {
            console.error("Error updating service status:", error);
            alert("Error updating service status: " + error.message);
        }
        setSaving(false)
    }

    const handleRemoveBooking = async (e, bookingId) => {
        e.preventDefault();
        setSaving(true)

        const confirmDelete = window.confirm("Are you sure you want to remove this booking?");
        if (!confirmDelete) return;

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const bookingRef = doc(branchRef, "bookings", bookingId);
        
            await deleteDoc(bookingRef);

            setBookings((prevBookings) => prevBookings.filter(booking => booking.id !== bookingId));

            alert("Booking removed successfully!");
        } catch (error) {
            alert("Error removing booking: " + error.message);
        }
        setSaving(false)
    };

    return (
        <div className="flex justify-center items-center ">
            <Image className="fixed top-30 z-50" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#301414] bg-opacity-50">
                
            {showTransaction && selectedBooking ? (<AddTransaction bookingData={selectedBooking} onClose={() => setShowTransaction(false)} />) : (
                    <div className="bg-white p-6 mt-20 rounded-lg shadow-md max-w-6xl max-h-2/3 w-full overflow-y-auto">
                        <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg">
                            <h3 className="text-lg font-bold">Booking List</h3>
                            {bookings.length > 0 ? (
                                <ul className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto m-2 rounded p-2 w-full">
                                    {bookings.map((booking) => (
                                        <li 
                                            key={booking.id} 
                                            className={`flex justify-between items-center border p-3 rounded w-full ${
                                                booking.status === "pending" 
                                                    ? "bg-yellow-100 border-yellow-400" 
                                                    : booking.status === "canceled" 
                                                        ? "bg-red-100 border-red-400" 
                                                        : "bg-green-100 border-green-400"
                                            }`}
                                        >
                                            <div className="flex flex-col">
                                                <p className="font-semibold">{booking.id} : {booking.customer} : {booking.email}</p>
                                                <p>{booking.service}</p>
                                                <ul>
                                                    ${services.map(service => `<li>${service}</li>`).join('')}
                                                </ul>
                                                <p>Total: {booking.total}</p>
                                                <p className="text-sm text-gray-600">{booking.date} | {booking.time} | {booking.status}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <select
                                                    disabled={saving}
                                                    className="border p-1 mx-1 rounded-lg bg-white "
                                                    value={booking.status || "pending"} 
                                                    onChange={(e) => toggleStatus(booking.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="canceled">Canceled</option>
                                                </select>
                                                <button 
                                                    disabled={saving}
                                                    className="bg-[#502424] text-white p-2 font-seri rounded-lg hover:bg-[#301414] mx-1 transition"
                                                    onClick={(e) => toggleStatus(booking.id, "completed")}
                                                >
                                                    Log Transaction
                                                </button>
                                                <button 
                                                    disabled={saving}
                                                    className="bg-[#502424]  text-white p-2 font-seri rounded-lg hover:bg-[#301414] mx-1 transition"
                                                    onClick={(e) => handleRemoveBooking(e, booking.id)}
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
                                className="bg-[#502424] text-white p-3 m-3 mb-6 max-w-xs font-serif w-full hover:bg-[#301414] transition rounded-lg"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;
