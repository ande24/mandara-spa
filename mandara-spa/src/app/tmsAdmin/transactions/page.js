"use client";

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Image = dynamic(() => import("next/image"));

const ManageTransactions = () => {
    const router = useRouter();
    const auth = getAuth(firebase_app)
    const db = getFirestore(firebase_app);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);

    const [transactions, setTransactions] = useState([]);
    const [services, setServices] = useState([]);
    const [saving, setSaving] = useState(false)

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
                    setUserData(docSnap.data());
                } else {
                    console.log("No user data found in Firestore");
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
                }
            }, (error) => {
                console.error("Error fetching branch data:", error);
            });
            return () => unsubscribe();
        }
    }, [userData, db]);

    useEffect(() => {
        if (userData && branchData) {
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
        if (services && userData && userData?.branch_id && branchData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const transactionCollection = collection(branchRef, "transactions");

            const unsubscribe = onSnapshot(transactionCollection, (snapshot) => {
                Promise.all(
                    snapshot.docs
                        .filter(docu => docu.id !== "placeholder" && docu.data().transaction_date === selectedDate)
                        .map(async (docu) => {
                            const data = docu.data();
                            const bookingRef = doc(branchRef, "bookings", data.bookingId);

                            // Use onSnapshot for booking data
                            return new Promise((resolve) => {
                                const unsubscribeBooking = onSnapshot(bookingRef, (bookingSnap) => {
                                    let bookingData = null;
                                    let serviceName = "", servicePrice = "";

                                    if (bookingSnap.exists()) {
                                        bookingData = bookingSnap.data();
                                        if (bookingData.services) {
                                            serviceName = bookingData.services.join(", ");
                                        }
                                        // if (bookingData.service_id) {
                                        //     const service = services.find(s => s.id === bookingData.service_id);
                                        //     if (service) {
                                        //         serviceName = service.name;
                                        //         servicePrice = service.price;
                                        //     }
                                        // }
                                    }

                                    console.log("Booking: ", bookingData)
                                    console.log("transaction: ", data)

                                    resolve({
                                        id: docu.id,
                                        date: bookingData ? bookingData.booked_date : "",
                                        dateObject: bookingData ? new Date(bookingData.booked_date) : "",
                                        time: bookingData ? bookingData.booked_time : "Booking not found",
                                        booking: data.bookingId,
                                        pax: data.no_of_customers,
                                        serviceName: serviceName,
                                        servicePrice: servicePrice,
                                        sales: data.service_income,
                                        servicesList: bookingData ? bookingData.services : [],
                                        items: data.items_used
                                            ? data.items_used.map(item => ({
                                                id: item.id,
                                                name: item.name,
                                                price: item.price,
                                                quantity: item.quantity
                                            }))
                                            : []
                                    });
                                    unsubscribeBooking(); // Unsubscribe after fetching once
                                }, (error) => {
                                    console.error("Error fetching booking data:", error);
                                    resolve(null); // Resolve with null in case of error
                                });
                            });
                        })
                ).then((transactionList) => {
                    const validTransactions = transactionList.filter(transaction => transaction !== null);
                    validTransactions.sort((a, b) => b.dateObject - a.dateObject);
                    console.log("Updated transactions:", validTransactions);
                    setTransactions(validTransactions);
                });
            }, (error) => {
                console.error("Error fetching transactions:", error);
            });

            return () => unsubscribe();
        }
    }, [userData, branchData, db, services, selectedDate]);

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
        <div className="flex flex-col justify-center h-screen w-screen bg-[#301414] items-center ">
            <Image priority className="mt-30" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
            <div className="mb-20 w-full h-full flex items-center justify-center bg-[#301414] bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl w-full overflow-y-auto">
                    <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg">
                        <div className="flex-row flex justify-between items-center w-full">
                            <h3 className="text-lg font-bold ml-2">Transaction List</h3>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => changeDate(selectedDate, e.target.value)}
                                className="border p-2 rounded scale-90 hover:scale-102 transition-all"
                            />
                        </div>
                        {transactions.length > 0 ? (
                            <ul className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto m-2 rounded p-2 w-full">
                                {transactions.map((transaction) => (
                                    <li
                                        key={transaction.id}
                                        className="flex justify-between items-center border p-3 rounded w-full bg-gray-200 border-gray-400"
                                    >
                                        <div className="flex flex-col">
                                            <p className="font-semibold">Booking {transaction.booking}</p>
                                            {transaction.servicesList.map((service, index) => (
                                                <div key={index}>{service}</div>
                                            ))}
                                            <p className="font-semibold">{transaction.sales ? `Total = ₱${transaction.sales} ` : ""}</p>
                                            <br />
                                            {transaction.items.length > 0 ? (
                                                <>
                                                    <p>Items consumed:</p>
                                                    {transaction.items.map((item) => (
                                                        <p key={item.id}>{item.name} (₱{item.price}) x {item.quantity}</p>
                                                    ))}
                                                </>
                                            ) : (
                                                <p className="text-gray-500 text-sm">No items consumed</p>
                                            )}

                                            <p className="text-sm text-gray-600">{transaction.date}</p>
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
                            onClick={() => { router.push("/tmsAdmin/dashboard") }}
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
