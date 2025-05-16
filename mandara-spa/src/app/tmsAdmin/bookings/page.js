"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

const Image = dynamic(() => import("next/image"), { ssr: false });
const AddTransaction = dynamic(() => import("@/components/transactionForm"), { ssr: false });

const ManageBookings = () => {
    const router = useRouter();
    const auth = getAuth(firebase_app);
    const db = getFirestore(firebase_app);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [showTransaction, setShowTransaction] = useState(false);

    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [services, setServices] = useState([]);

    const [saving, setSaving] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"));

    useEffect(() => {
        const getDateAndMonth = () => {
            const now = new Date();

            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, "0");
            const dd = String(now.getDate()).padStart(2, "0");

            setSelectedDate(`${yyyy}-${mm}-${dd}`);
        };

        getDateAndMonth();
    }, []);

    const changeDate = (prevDate, date) => {
        const [year, month, day] = date.split("-").map(Number);
        const [pyear, pmonth, pday] = prevDate.split("-").map(Number);

        if (!date) {
            if (pday === 1) {
                if (pmonth === 2) {
                    const isLeapYear = (pyear % 4 === 0 && pyear % 100 !== 0) || (pyear % 400 === 0);
                    const nday = isLeapYear ? 29 : 28;
                    date = `${pyear}-${String(pmonth)}-${nday}`;
                } else if ([4, 6, 9, 11].includes(pmonth)) {
                    const nday = 30;
                    date = `${pyear}-${String(pmonth)}-${nday}`;
                } else {
                    const nday = 31;
                    date = `${pyear}-${String(pmonth)}-${nday}`;
                }
            }
            else {
                const nday = 1;
                date = `${pyear}-${String(pmonth)}-${nday}`;
            }
        }

        const newDate = new Date(date);

        if (!newDate) {
            window.alert("You tried to input an invalid date!", "Try adjusting the day value before changing the month or year.")
            return;
        }

        newDate.setHours(8, 0, 0, 0);

        const formattedDate = newDate.toISOString().split("T")[0];
        setSelectedDate(formattedDate);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    console.log("user: ", docSnap.data());
                    setUserData(docSnap.data());
                } else {
                    console.log("No user data found in Firestore");
                    setUserData(null);
                }
            }, (error) => {
                console.error("Error fetching user data:", error);
            });

            return () => unsubscribe();
        }
    }, [user, db]);

    useEffect(() => {
        if (userData && userData.branch_id) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const unsubscribe = onSnapshot(branchRef, (docSnap) => {
                if (docSnap.exists()) {
                    setBranchData(docSnap.data());
                } else {
                    console.log("No branch data found");
                    setBranchData(null);
                }
            }, (error) => {
                console.error("Error fetching branch data:", error);
            });

            return () => unsubscribe();
        }
    }, [userData, db]);

    useEffect(() => {
        if (userData?.branch_id && userData && branchData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const serviceCollection = collection(branchRef, "services");
            const unsubscribe = onSnapshot(serviceCollection, (snapshot) => {
                const serviceList = snapshot.docs
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
            }, (error) => {
                console.error("Error fetching services:", error);
            });
            return () => unsubscribe();
        }
    }, [branchData, db, userData]);

    useEffect(() => {
        if (!userData?.branch_id || !branchData || !services || !userData) return;

        const branchRef = doc(db, "branches", userData.branch_id);
        const bookingCollection = collection(branchRef, "bookings");

        const unsubscribe = onSnapshot(bookingCollection, (snapshot) => {
            const bookingList = snapshot.docs
                .filter(docu => docu.id !== "placeholder" && docu.data().booked_date === selectedDate)
                .map(docu => {
                    const data = docu.data();
                    return {
                        id: docu.id,
                        additional_notes: data.additional_notes || "",
                        booked_date: data.booked_date || "",
                        booking_status: data.booking_status || "",
                        customer_email: data.customer_email || "",
                        customer_id: data.customer_id || "",
                        customer_name: data.customer_name || "",
                        customer_number: data.customer_number || "",
                        no_of_customers: data.no_of_customers || "",
                        total: data.total || 0,
                        services: Array.isArray(data.services) ? data.services.map(guestObj => ({
                            guest: guestObj.guest,
                            services: Array.isArray(guestObj.services) ? guestObj.services.map(svc => ({
                                duration: svc.duration,
                                id: svc.id,
                                name: svc.name,
                                price: svc.price,
                                timeSlot: svc.timeSlot,
                                slots: svc.slots
                            })) : []
                        })) : [],
                        // For sorting and legacy display:
                        dateObject: new Date(data.booked_date),
                        time: data.booked_time || "",
                        price: data.service_price || "",
                        pax: data.no_of_customers || "",
                        notes: data.additional_notes || ""
                    };
                });

            bookingList.sort((a, b) => b.dateObject - a.dateObject);

            console.log("Updated bookings:", bookingList);
            setBookings(bookingList);
        }, (error) => {
            console.error("Error fetching bookings:", error);
        });

        return () => unsubscribe();
    }, [userData, branchData, services, db, selectedDate]);

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

            if (newStatus === "Completed") {
                const unsubscribe = onSnapshot(bookingRef, (bookingSnap) => {
                    if (bookingSnap.exists()) {
                        const bookingData = { id: bookingSnap.id, ...bookingSnap.data() };
                        setSelectedBooking(bookingData);
                        setTimeout(() => setShowTransaction(true), 0);
                    } else {
                        console.log("Booking not found");
                    }
                    
                    unsubscribe(); 
                }, (error) => {
                    console.error("Error fetching booking data:", error);
                });
            }
        } catch (error) {
            console.error("Error updating booking status:", error);
            alert("Error updating booking status: " + error.message);
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

    const handleTransactionClose = () => {
        setShowTransaction(false);
        setSelectedBooking(null);
    };

    return (
        <div className="flex flex-col justify-center bg-[#301414] h-screen items-center ">
            <Image priority className="mt-20 z-50" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
            <div className="mt-[-150] w-full h-full flex items-center justify-center bg-[#301414] bg-opacity-50">

                {showTransaction && selectedBooking ? (<AddTransaction bookingData={selectedBooking} onReset={() => { toggleStatus(selectedBooking.id, "Pending"); setShowTransaction(false); alert(`Transaction submission for Booking ${selectedBooking.id} canceled.`) }} onClose={handleTransactionClose} />) : (
                    <div className="bg-white p-6 mt-20 rounded-lg shadow-md max-w-6xl max-h-2/3 w-full overflow-y-auto">
                        <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg">
                            <div className="flex-row flex justify-between items-center w-full">
                                <h3 className="text-lg font-bold ml-2">Booking List</h3>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => changeDate(selectedDate, e.target.value)}
                                    className="border p-2 rounded scale-90 hover:scale-102 transition-all"
                                />
                            </div>
                            {bookings.length > 0 ? (
                                <ul className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto m-2 rounded p-2 w-full">
                                    {bookings.map((booking) => (
                                        <li
                                            key={booking.id}
                                            className={`flex justify-between items-center border p-3 rounded w-full ${booking.booking_status === "Pending"
                                                ? "bg-yellow-100 border-yellow-400"
                                                : booking.status === "Canceled"
                                                    ? "bg-red-100 border-red-400"
                                                    : "bg-green-100 border-green-400"
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <p className="font-semibold">{booking.id} : {booking.customer_name} : {booking.customer_email}</p>
                                                {Array.isArray(booking.services) && booking.services.map((guestObj, guestIdx) => (
                                                    <div key={guestIdx} className="mb-2">
                                                      <div className="font-bold">Guest {guestObj.guest}</div>
                                                      {Array.isArray(guestObj.services) && guestObj.services.map((service, svcIdx) => (
                                                        <div key={svcIdx} className="ml-4">
                                                          <span className="">{service.name}</span>
                                                          <span className="ml-2 text-xs text-gray-600">(₱{service.price}, {service.duration} min, {service.timeSlot})</span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  ))}
                                                <p className="font-semibold">Total: ₱{booking.total}</p>
                                                <br />
                                                <p>Additional Notes: {booking.additional_notes}</p>
                                                <p className="text-sm text-gray-600">{booking.booked_date} | {booking.booking_status}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <select
                                                    disabled={saving}
                                                    className="border p-1 mx-1 rounded-lg bg-white "
                                                    value={booking.booking_status}
                                                    onChange={(e) => toggleStatus(booking.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Canceled">Canceled</option>
                                                </select>
                                                <button
                                                    disabled={saving}
                                                    className="bg-[#502424] text-white p-2 font-serif rounded-lg hover:bg-[#301414] mx-1 transition"
                                                    onClick={(e) => toggleStatus(booking.id, "Completed")}
                                                >
                                                    Log Transaction
                                                </button>
                                                <button
                                                    disabled={saving}
                                                    className="bg-[#502424]  text-white p-2 font-serif rounded-lg hover:bg-[#301414] mx-1 transition"
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
                                onClick={() => { router.push("/tmsAdmin/dashboard") }}
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
