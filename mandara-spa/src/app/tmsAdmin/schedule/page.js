"use client";
import React, { useState, useEffect } from "react";
import firebase_app from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot, collection, setDoc, updateDoc, getDoc, getDocs } from "firebase/firestore";
import dynamic from "next/dynamic";
import { CirclePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Image = dynamic(() => import("next/image"));

const EditSchedule = () => {
    const router = useRouter();
    const auth = getAuth(firebase_app);
    const db = getFirestore(firebase_app);

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const [beds, setBeds] = useState(null);
    const [hours, setHours] = useState("");
    const [schedule, setSchedule] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slotBeds, setSlotBeds] = useState(null);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
    }, [db, user]);

    useEffect(() => {
        if (userData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const unsubscribe = onSnapshot(branchRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setHours(data.branch_hours);
                } else {
                    console.log("No branch data found");
                }
            }, (error) => {
                console.error("Error fetching branch data:", error);
            });

            return () => unsubscribe();
        }
    }, [db, userData]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userData || !userData.branch_id) {
                return;
            }

            const branchRef = doc(db, "branches", userData.branch_id);
            const scheduleRef = collection(branchRef, "schedule");

            try {
                const branchSnap = await getDoc(branchRef);
                if (branchSnap.exists()) {
                    const branchData = branchSnap.data();
                    setBeds(branchData.branch_capacity || 1); 
                    setSlotBeds(branchData.branch_capacity || 1);
                    setHours(branchData.branch_hours || ""); 
                } else {
                    console.log("No branch data found.");
                }

                const scheduleSnap = await getDocs(scheduleRef);
                const fetchedSchedule = {};
                scheduleSnap.forEach((doc) => {
                    fetchedSchedule[doc.id] = doc.data().slots || [];
                });
                setSchedule(fetchedSchedule); 
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [userData, db]);

    const handleAddTimeSlot = () => {
        if (!startTime || !endTime) {
            alert("Please select both start and end times.");
            return;
        }

        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const duration = (end - start) / (1000 * 60); 

        if (duration <= 0) {
            alert("End time must be after start time.");
            return;
        }

        const timeSlot = { 
            start: startTime, 
            end: endTime, 
            beds: slotBeds, 
            duration 
        };

        setSchedule((prev) => ({
            ...prev,
            [selectedDay]: [...(prev[selectedDay] || []), timeSlot],
        }));

        setShowModal(false);
        setStartTime("");
        setEndTime("");
        setSlotBeds(beds); 
    };

    const handleRemoveTimeSlot = (day, index) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index),
        }));
    };

    const updateSchedule = async () => {
        if (!userData || !userData.branch_id) {
            alert("Branch information is missing.");
            return;
        }

        const confirmChanges = window.confirm(
            "Changes to the schedule will only apply to days with no current bookings. Days with existing bookings will retain their original schedule. Do you want to proceed?"
        );

        if (!confirmChanges) {
            return; 
        }

        const branchRef = doc(db, "branches", userData.branch_id);
        const scheduleRef = collection(branchRef, "schedule");

        try {
            for (const day of Object.keys(schedule)) {
                // Sort slots by start time before saving
                const sortedSlots = (schedule[day] || []).slice().sort((a, b) => a.start.localeCompare(b.start));
                const dayRef = doc(scheduleRef, day);
                await setDoc(dayRef, {
                    slots: sortedSlots,
                });
            }

            await updateDoc(branchRef, { branch_capacity: beds, branch_hours: hours });

            alert("Schedule updated successfully!");
        } catch (error) {
            console.error("Error updating schedule:", error);
            alert("Failed to update schedule: " + error.message);
        }
    };

    const handleClose = () => {
        const daysWithoutSlots = daysOfWeek.filter(day => !schedule[day] || schedule[day].length === 0);
        if (daysWithoutSlots.length > 0) {
            if (window.confirm(
                `The following days have no time slots: ${daysWithoutSlots.join(", ")}.\n\nCustomers will not be able to make any bookings for these days. Are you sure you want to exit?`
            )) {
                router.push("/tmsAdmin/dashboard");
            }
            return;
        }
        router.push("/tmsAdmin/dashboard");
    };

    return (
        <div className="flex flex-col items-center p-20">
            <Image priority className="mb-10" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
       
            <div className=" bg-white p-8 rounded-lg shadow-md flex-col flex items-center justify-center">
                <h1 className="text-2xl font-semibold">Schedule</h1>
                <div className="w-full self-start flex-row flex bg-white p-4">
                    <div className="flex-1 flex-row flex items-center justify-center gap-x-2">
                        <label className="block font-semibold mb-1">Number of Beds:</label>
                        <input
                            type="number"
                            value={beds || ""}
                            min="1"
                            required
                            onChange={(e) => {setBeds(Number(e.target.value)); setSlotBeds(Number(e.target.value));}}
                            className="w-1/4 p-2 border rounded-lg"
                        />
                    </div>
                    <div className="flex-2 flex-row flex items-center justify-center gap-x-2">
                        <label className="block font-semibold mb-1">Operating Hours:</label>
                        <input
                            value={hours || ""}
                            placeholder="e.g., Mon-Thu (11am - 10pm), Fri-Sun (10am - 11pm)"
                            onChange={(e) => setHours(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </div>

                <div className="w-full bg-white mb-4 p-4">
                    <h2 className=" font-semibold mb-4">Time Slots</h2>
                    <div className="grid grid-cols-7 gap-4">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="border p-3 rounded-lg flex flex-col items-center">
                                <h3 className="font-bold mb-2 text-center">{day}</h3>
                                <ul className="space-y-2">
                                    {(schedule[day] || [])
                                        .slice()
                                        .sort((a, b) => a.start.localeCompare(b.start))
                                        .map((timeSlot, index) => (
                                            <li key={index} className="flex justify-between items-center bg-yellow-200 p-2 rounded-lg">
                                                <span className="text-xs">
                                                    {timeSlot.start} - {timeSlot.end} ({timeSlot.beds})
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveTimeSlot(day, index)}
                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                    aria-label="Remove Time Slot"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                                <button
                                    onClick={() => {
                                        setSelectedDay(day);
                                        setShowModal(true);
                                    }}
                                    className="mt-2 text-white p-2 rounded-lg flex justify-center items-center"
                                >
                                    <CirclePlus size={30} color="#502424" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center items-center space-x-4 w-full p-4">
                    <button onClick={updateSchedule} className="w-1/5 p-3 rounded-lg h-full text-white text-md  transition mandara-btn">Save Changes</button>
                    <button onClick={handleClose} className="w-1/5 rounded-lg p-3 text-white font-serif h-full text-md mandara-btn">Close</button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Add Time Slot for {selectedDay}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold mb-1">Start:</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">End:</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Beds:</label>
                                <input
                                    type="number"
                                    value={slotBeds || ""}
                                    min="1"
                                    onChange={(e) => setSlotBeds(Number(e.target.value))}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTimeSlot}
                                className="px-4 py-2 text-white rounded-lg mandara-btn"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditSchedule;
