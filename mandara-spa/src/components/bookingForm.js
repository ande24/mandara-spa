"use client";

import React, { useState, useEffect } from "react";
import { getFirestore, query, orderBy, collection, doc, onSnapshot, addDoc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import firebase_app from "../firebase/config";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SuccessMessage from "./success";
import ErrorMessage from "./error";
import { FaTrash } from "react-icons/fa";

const BookingForm = ({ onClose }) => {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const [minDate, setMinDate] = useState("");
    const [step, setStep] = useState(1);

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branches, setBranches] = useState([]);
    const [branchData, setBranchData] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const [services, setServices] = useState([]);       
    const [selectedPax, setSelectedPax] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState({});
    
    const [show, setShow] = useState(false)
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [saving, setSaving] = useState(false)

    const [isNewSchedule, setIsNewSchedule] = useState(false);
    const [newScheduleRef, setNewScheduleRef] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [reservations, setReservations] = useState([]);

    const [formData, setFormData] = useState({
        date: "",
        time: "",
        name: "", 
        number: "",
        branch: "",
        services: [],
        notes: "",
        email: "",
        isInitialized: false
    }); 

    

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 200);
    }, [])

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
        if (userData && !formData.isInitialized) {
            setFormData((prev) => ({
                ...prev,
                name: userData.user_name || "",
                number: userData.user_number || "",
                email: userData.user_email || "",
                isInitialized: true, 
            }));
        }
    }, [userData, formData]);

    useEffect(() => {
        if (selectedBranch) {
            const branchRef = doc(db, "branches", selectedBranch);
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
    }, [db, selectedBranch]);

    useEffect(() => {
        const branchCollection = collection(db, "branches");
        const unsubscribe = onSnapshot(branchCollection, (snapshot) => {
            const branchList = snapshot.docs
                .filter(doc => doc.id !== "schema")
                .map(doc => ({
                    id: doc.id,
                    name: doc.data().branch_location,
                    hours: doc.data().branch_hours
                }));
            console.log(branchList);
            setBranches(branchList);
        }, (error) => {
            console.error("Error fetching branches:", error);
        });

        return () => unsubscribe();
    }, [db]);

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        if (hours === 1) {
            return minutes > 0 ? `${hours} hr, ${minutes} mins` : `${hours} hr`;
        } else if (hours > 1) {
            return minutes > 0 ? `${hours} hrs, ${minutes} mins` : `${hours} hrs`;
        } else {
            return `${minutes} mins`;
        }
    };

    useEffect(() => {
        if (selectedBranch) {
            const branchRef = doc(db, "branches", selectedBranch);
            const serviceCollection = query(collection(branchRef, "services"), orderBy("service_name"));
            const unsubscribe = onSnapshot(serviceCollection, (snapshot) => {
                const serviceList = snapshot.docs
                    .filter(doc => doc.id !== "placeholder")
                    .map(doc => ({
                        id: doc.id,
                        name: doc.data().service_name,
                        price: doc.data().service_price,
                        desc: doc.data().service_desc,
                        duration: doc.data().service_duration,
                        category: doc.data().service_category,
                        status: doc.data().service_status,
                        fduration: formatDuration(doc.data().service_duration)
                    }))
                    .sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        

                        return a.duration - b.duration;
                    });

                console.log("services: ", serviceList);
                setServices(serviceList);
            }, (error) => {
                console.error("Error fetching services:", error);
            });

            return () => unsubscribe();
        }
    }, [db, selectedBranch]);

    useEffect(() => {
        const today = new Date();
        setMinDate(today.toISOString().split("T")[0]);
    }, []);

    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaxChange = async (e) => {
        const selectedPax = e.target.value;
        setSelectedPax(selectedPax);

        setFormData((prev) => ({ ...prev, pax: selectedPax, services: Array.from({ length: selectedPax }, () => []), }))
    };

    const handleBranchChange = async (e) => {
        const selectedB = e.target.value;
        setSelectedBranch(selectedB);

        setFormData((prev) => ({ ...prev, branch: selectedB }))
    };

    const submitDetails = async (e) =>  {
        e.preventDefault();
        if (selectedBranch === "" || !formData.date || selectedPax === "" ) {
            setErrorMsg("Please fill in all required fields.");
            setShowError(true);
            return;
        }

        const date = new Date(formData.date);
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
        const branchRef = doc(db, "branches", selectedBranch);
        const scheduleRef = doc(branchRef, "schedule", formattedDate);

        try {
            const scheduleSnap = await getDoc(scheduleRef);

            if (scheduleSnap.exists()) {
                console.log("Schedule exists:", scheduleSnap.data());
                setNewScheduleRef(null);

                if (scheduleSnap.data().slots) {
                    setTimeSlots(scheduleSnap.data().slots);
                }
                setStep(2);
            } else {
                const dayOfWeek = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long' });
                const templateRef = doc(branchRef, "schedule", dayOfWeek);
                const templateSnap = await getDoc(templateRef);

                if (templateSnap.exists()) {
                    await setDoc(scheduleRef, templateSnap.data());
                    console.log("New schedule created from template:", dayOfWeek);
                    setNewScheduleRef(scheduleRef);
                    setIsNewSchedule(true);

                    if (templateSnap.data().slots) {
                        setTimeSlots(templateSnap.data().slots);
                    }
                    setStep(2);
                } else {
                    setErrorMsg("Scheduling for that day is not available. Please contact us for assistance.");
                    setShowError(true);
                    return;
                }
            }
        } catch (error) {
            console.error("Error fetching or creating schedule:", error);
            setErrorMsg(error.message);
            setShowError(true);
        }

        setStep(2);
    }

    const submitServices = async (e) =>  {
        e.preventDefault();

        const newReservations = Array.from({ length: selectedPax }, (_, guestIndex) => {
            const guestServices = formData.services?.[guestIndex] || [];
            return {
                guest: guestIndex + 1,
                services: guestServices.map(serviceObj => {
                    const service = services.find(s => s.id === serviceObj.serviceId);
                    let slots = [];
                    if (serviceObj.timeSlot) {
                        const [spanStart, spanEnd] = serviceObj.timeSlot.split("-");
                        slots = timeSlots.filter(slot =>
                            slot.start >= spanStart && slot.end <= spanEnd
                        ).map(slot => `${slot.start}-${slot.end}`);
                    }
                    return {
                        id: service?.id,
                        name: service?.name,
                        price: service?.price,
                        duration: service?.duration,
                        timeSlot: serviceObj.timeSlot,
                        slots,
                    };
                })
            };
        });

        console.log("New reservations:", newReservations);

        setReservations(newReservations);
        setStep(3);
    };

    const calculateTotal = () => {
        let subtotal = 0;
        reservations.forEach(guest => {
            guest.services.forEach(service => {
                if (service.price) {
                    subtotal += Number(service.price);
                }
            });
        });
        return subtotal;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true)

        console.log(formData)
        
        try {
            console.log("select", selectedBranch)
            const branchRef = doc(db, "branches", selectedBranch)

            const docRef = await addDoc(collection(branchRef, "bookings"), {
                customer_id: auth.currentUser.uid,
                booked_date: formData.date,
                no_of_customers: formData.pax,
                services: reservations,
                customer_name: formData.name,
                customer_number: formData.number,
                customer_email: formData.email,
                additional_notes: formData.notes,
                booking_status: "Pending",
                total: calculateTotal()
            });
            console.log("Booking successful with ID:", docRef.id);

            const date = new Date(formData.date);
            const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
            const scheduleRef = doc(branchRef, "schedule", formattedDate);
            const scheduleSnap = await getDoc(scheduleRef);

            if (scheduleSnap.exists()) {
                const scheduleData = scheduleSnap.data();
                const updatedSlots = scheduleData.slots.map(slot => {
                    const slotKey = `${slot.start}-${slot.end}`;
                    let bedsToDeduct = 0;
                    let newBookings = slot.bookings ? [...slot.bookings] : [];
                    reservations.forEach(guest => {
                        guest.services.forEach(service => {
                            if (service.slots && service.slots.includes(slotKey)) {
                                bedsToDeduct += 1;
                                newBookings.push({
                                    booking: docRef.id,
                                    guest: guest.guest,
                                    service: service.name
                                });
                            }
                        });
                    });
                    return {
                        ...slot,
                        beds: slot.beds - bedsToDeduct,
                        bookings: newBookings
                    };
                });

                await setDoc(scheduleRef, { ...scheduleData, slots: updatedSlots }, { merge: true });
            }


            const branchSnap = await getDoc(branchRef);

            const newData = {
                mobile: branchSnap.data().branch_mobile || "",
                landline: branchSnap.data().branch_landline || "",
                date: formData.date,
                pax: selectedPax,
                services: reservations,
                total: calculateTotal(),
                location: branchSnap.data().branch_location,
                name: formData.name,
                notes: formData.notes,
                id: selectedBranch,
            };

            setSuccessMsg("We sent you a booking request confirmation email.");
            setShowSuccess(true);

            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            setTimeout(() => {
                setFormData({ date: "", time: "", services: [] });
                setSelectedPax(null);
                setSelectedBranch(null);
                setSaving(false);
                setReservations([]);
                onClose();
            }, 3000);

            
        } catch (error) {
            setErrorMsg(error.message);
            setShowError(true);
            setSaving(false);
        }
    };

    const handleServiceChange = (guestIndex, serviceIndex, serviceId) => {
        const updatedServices = [...(formData.services || [])];
        updatedServices[guestIndex] = updatedServices[guestIndex] || [];
        updatedServices[guestIndex][serviceIndex] = {
            ...updatedServices[guestIndex][serviceIndex],
            serviceId, // Update the serviceId
        };
        setFormData((prev) => ({
            ...prev,
            services: updatedServices,
        }));
    };

    const handleAddService = (guestIndex) => {
        const updatedServices = [...(formData.services || [])];
        updatedServices[guestIndex] = updatedServices[guestIndex] || [];
        updatedServices[guestIndex].push({ serviceId: "" }); // Initialize with default values
        setFormData((prev) => ({
            ...prev,
            services: updatedServices,
        }));
    };

    const handleDeleteService = (guestIndex, serviceIndex) => {
        const updatedServices = [...(formData.services || [])];
        // Remove the service at serviceIndex for the guest
        if (updatedServices[guestIndex]) {
            updatedServices[guestIndex].splice(serviceIndex, 1);
        }

        setFormData((prev) => ({
            ...prev,
            services: updatedServices,
        }));

        // Remove the slot selection for this service as well
        setSelectedSlots((prev) => {
            const updatedSlots = { ...prev };
            if (updatedSlots[guestIndex]) {
                updatedSlots[guestIndex] = [...updatedSlots[guestIndex]];
                updatedSlots[guestIndex].splice(serviceIndex, 1);
                // If no more services for this guest, remove the guest entry
                if (updatedSlots[guestIndex].length === 0) {
                    delete updatedSlots[guestIndex];
                }
            }
            return updatedSlots;
        });
    };

    const deleteNewSchedule = async () => {
        console.log("Deleting new schedule...");
        if (isNewSchedule && newScheduleRef) {
            try {
                await deleteDoc(newScheduleRef);
                setIsNewSchedule(false);
                setNewScheduleRef(null);
                console.log("New schedule deleted.");
            } catch (error) {
                console.error("Error deleting new schedule:", error);
            }
        }
    };

    const handleCancelBooking = async () => {
        await deleteNewSchedule();
        setFormData({ date: "", time: "", services: [] });
        setSelectedPax(null);
        setSelectedBranch(null);
        setIsNewSchedule(false);
        onClose();
    };

    const handleTimeSlotChange = (guestIndex, serviceIndex, timeSlot) => {
        const updatedServices = [...(formData.services || [])];
        updatedServices[guestIndex] = updatedServices[guestIndex] || [];
        updatedServices[guestIndex][serviceIndex] = {
            ...updatedServices[guestIndex][serviceIndex],
            timeSlot,
        };
    
        setFormData((prev) => ({
            ...prev,
            services: updatedServices,
        }));
    
        setSelectedSlots((prev) => {
            const updatedSlots = { ...prev };
            updatedSlots[guestIndex] = updatedSlots[guestIndex] || [];
            updatedSlots[guestIndex][serviceIndex] = {
                service: services.find((s) => s.id === updatedServices[guestIndex][serviceIndex].serviceId)?.name || "N/A",
                slot: timeSlot,
            };
            return updatedSlots;
        });
    };

    const getAllConsecutiveSlotCombos = (slots, neededDuration) => {
        const combos = [];
        for (let i = 0; i < slots.length; i++) {
            let total = 0;
            const combo = [];
            for (let j = i; j < slots.length; j++) {
                // Ensure slots are contiguous: the start of the next slot must match the end of the previous slot
                if (combo.length > 0 && slots[j].start !== combo[combo.length - 1].end) {
                    break;
                }
                combo.push(slots[j]);
                total += Number(slots[j].duration);

                if (
                    combo.length > 1 &&
                    combo.some(s => Number(s.duration) >= Number(neededDuration))
                ) {
                    break;
                }

                if (total >= Number(neededDuration)) {
                    combos.push([...combo]);
                    break; // Only take the smallest combo that fits
                }
            }
        }
        return combos;
    };

    const slotBeds = {};

    const slotSelectionCounts = {};
    Object.values(selectedSlots).forEach(guestServices => {
        guestServices?.forEach(service => {
            if (service?.slot) {
                const [spanStart, spanEnd] = service.slot.split("-");
                let inSpan = false;
                timeSlots.forEach(slot => {
                    // Check if slot is within the span
                    // slot.start >= spanStart && slot.end <= spanEnd
                    if (
                        (slot.start >= spanStart && slot.end <= spanEnd)
                    ) {
                        const slotKey = `${slot.start}-${slot.end}`;
                        slotSelectionCounts[slotKey] = (slotSelectionCounts[slotKey] || 0) + 1;
                    }
                });
            }
        });
    });

    if (Array.isArray(timeSlots)) {
        timeSlots.forEach(slot => {
            const slotKey = `${slot.start}-${slot.end}`;
            slotBeds[slotKey] = slot.beds;
        });
    }

    const anyOverbooked = timeSlots.some(slot => {
        const slotKey = `${slot.start}-${slot.end}`;
        const selectedCount = slotSelectionCounts[slotKey] || 0;
        return slot.beds - selectedCount < 0;
    });

    const getSlotKey = (slot) => `${slot.start}-${slot.end}`;

    const getSlotIndexByKey = (slots, key) => slots.findIndex(slot => getSlotKey(slot) === key);

    const getConsecutiveSlots = (slots, startIndex, neededDuration) => {
        let total = 0;
        const result = [];
        for (let i = startIndex; i < slots.length; i++) {
            result.push(slots[i]);
            total += slots[i].duration;
            if (total >= neededDuration) break;
        }
        return total >= neededDuration ? result : [];
    };



    return (
        <div className="flex flex-col relative items-center justify-center z-100 transition-all">
            <div className={`fixed top-0 left-0 w-full h-full transition-all bg-white opacity-80 ${show ? "scale-100" : "scale-0"}`}></div>
            
                <div className="fixed inset-0 flex xl:flex-row p-4 flex-col items-center justify-center">
                {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
                {showSuccess && <SuccessMessage message={successMsg} onClose={() => setShowSuccess(false)}/>}
                    <div className={` top-0 inset-0 lg:max-h-[90vh] max-h-[80vh] relative overflow-y-auto flex flex-col p-6 text-[#e0d8ad] rounded-lg transition-all shadow-md max-w-2xl w-full bg-[#502424] ${show ? "scale-100" : "scale-0"}`}>
                        
                        
                        <button 
                            type="button"
                            onClick={handleCancelBooking}
                            disabled={saving}
                            className="absolute top-5 right-5 p-2 rounded-md hover:scale-120 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#e0d8ad]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <h2 className="text-2xl mb-2 font-bold text-center">Online Booking</h2>

                        <div className="my-6 mx-10">
                            <h2 className="sr-only">Steps</h2>

                            <div>
                                <div className={`overflow-hidden rounded-full ${step === 3 ? "bg-[#e0d8ad]" : "bg-gray-200"}`}>
                                    <div className={`h-2 w-1/2 rounded-full ${step === 1 ? "" : "bg-[#e0d8ad]"}`}></div>
                                    </div>

                                    <ol className="mt-4 grid grid-cols-3 text-sm font-medium text-gray-400">
                                    <li className="flex items-center justify-start text-[#e0d8ad] sm:gap-1.5">
                                        <span className="hidden sm:inline"> Details</span>

                                        <svg
                                        className="size-6 sm:size-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        </svg>
                                    </li>

                                    <li className={`flex items-center justify-center ${step === 1 ? "" : "text-[#e0d8ad]"} sm:gap-1.5`}>
                                        <span className="hidden sm:inline"> Services </span>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                        <path strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                        </svg>

                                    </li>

                                    <li className={`flex items-center justify-end  sm:gap-1.5 ${step === 3 ? "text-[#e0d8ad]" : ""}`}>
                                        <span className="hidden sm:inline"> Confirm </span>

                                        <svg
                                        className="size-6 sm:size-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                        </svg>
                                    </li>
                                    </ol>
                                </div>
                            </div>

                        {step === 1 && (

                        <form onSubmit={submitDetails} className="flex flex-col space-y-2 px-10">
                            <label>Location</label>
                            <select 
                                className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 text-sm shadow-xs"
                                value={formData.branch || ""}
                                onChange={handleBranchChange}
                            >
                                <option value=""></option>
                                {branches
                                .filter(branch => branch.name !== "Camaya Coast, Bataan" && branch.name !== "BGC One Serendra")
                                .map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name} - {branch.hours}</option>
                                ))}
                            </select>

                            <label>Date</label>
                            <input 
                                type="date" name="date" min={minDate}
                                value={formData.date} 
                                onChange={handleChange} 
                                required
                                className="w-full bg-gray-200 rounded-lg text-black border-gray-200 p-4 text-sm shadow-xs"
                            />

                            <label>Guests</label>
                            <select
                            name="pax"
                            className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                            value={selectedPax || ""} 
                            onChange={handlePaxChange}
                            >
                                <option value=""></option>
                                <option value="1">1 Guest</option>
                                <option value="2">2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4 Guests</option>
                                <option value="5">5 Guests</option>
                                <option value="6">6 Guests</option>
                                <option value="7">7 Guests</option>
                                <option value="8">8 Guests</option>
                                <option value="9">9 Guests</option>
                                <option value="10">10 Guests</option>
                            </select>

                            <div className="flex justify-around mt-3">
                                <button 
                                    disabled={saving}
                                    type="submit"
                                        className={`bg-[#e0d8ad] hover:scale-105 hover:bg-white text-black w-2/5 px-6 py-3 rounded-md transition`}
                                >
                                    Next
                                </button>
                            </div>

                        </form>
                        )}

                        {step === 2 && (
                            <>
                            <div className="bg-white p-4 rounded-lg mb-4 shadow-lg text-xs text-zinc-800 w-full border border-gray-300">
                                <div className="overflow-x-auto overflow-y-auto max-h-[15vh]">
                                    <table className="min-w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="px-2 py-1 border-b text-center font-semibold">Time Slot</th>
                                                <th className="px-2 py-1 border-b hidden md:table-cell text-center font-semibold">Beds</th>
                                                <th className="px-2 py-1 border-b hidden md:table-cell text-center font-semibold">Selected</th>
                                                <th className="px-2 py-1 border-b text-center font-semibold">Available</th>
                                                <th className="px-2 py-1 border-b text-center font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {timeSlots.map((slot, idx) => {
                                                const slotKey = `${slot.start}-${slot.end}`;
                                                const selectedCount = slotSelectionCounts[slotKey] || 0;
                                                const bedsAvailable = slot.beds - selectedCount;
                                                const isOverbooked = bedsAvailable < 0;
                                                return (
                                                    <tr key={idx} className={isOverbooked ? "bg-red-100" : idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                        <td className="px-2 py-1 border-b text-center">
                                                            {new Date(`1970-01-01T${slot.start}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(`1970-01-01T${slot.end}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </td>
                                                        <td className="px-2 py-1 hidden md:table-cell border-b text-center">{slot.beds}</td>
                                                        <td className="px-2 py-1 hidden md:table-cell border-b text-center">{selectedCount}</td>
                                                        <td className={`px-2 py-1 border-b text-center font-bold ${isOverbooked ? "text-red-600" : "text-green-700"}`}>
                                                            {bedsAvailable}
                                                        </td>
                                                        <td className="px-2 py-1 border-b text-center">
                                                            {isOverbooked ? (
                                                                <span className="inline-block px-2 py-1 bg-red-200 text-red-800 rounded font-semibold text-xs">
                                                                    Overbooked
                                                                </span>
                                                            ) : bedsAvailable === 0 ? (
                                                                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold text-xs">
                                                                    Full
                                                                </span>
                                                            ) : (
                                                                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-xs">
                                                                    Available
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 text-center">
                                    <span className="font-semibold text-red-600">Overbooked</span> slots must be resolved before proceeding.
                                    <p>Longer services might require <span className="font-semibold text-red-600">more than one</span> slot. </p>
                                </div>
                            </div>
                            <form onSubmit={submitServices} id="form2" className="flex flex-col space-y-4 overflow-y-auto overflow-x-hidden max-h-[50vh]">
                                {Array.from({ length: selectedPax }, (_, guestIndex) => (
                                    <div key={guestIndex} className="flex flex-col space-y-4 border-b pb-4 mb-4">
                                        <h4 className="font-semibold text-[#e0d8ad]">Guest {guestIndex + 1}</h4>

                                        {Array.from({ length: formData.services?.[guestIndex]?.length || 1 }, (_, serviceIndex) => (
                                            <div key={serviceIndex} className="flex items-center flex-col md:flex-row space-y-2 w-full space-x-4">
                                                <select
                                                    id={`service-${guestIndex}-${serviceIndex}`}
                                                    name={`service-${guestIndex}-${serviceIndex}`}
                                                    className="w-4/5 md:w-full md:flex-4 bg-gray-200 text-black rounded-lg border-gray-200 p-4 text-xs shadow-xs"
                                                    value={formData.services?.[guestIndex]?.[serviceIndex]?.serviceId || ""}
                                                    onChange={(e) => handleServiceChange(guestIndex, serviceIndex, e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Service</option>
                                                    {services
                                                        .filter((service) => service.status !== "unavailable")
                                                        .map((service) => (
                                                            <option key={service.id} value={service.id}>
                                                                {service.name} ({service.fduration}) {`${service.price ? `- ₱${service.price}` : ""}`}
                                                            </option>
                                                        ))}
                                                </select>
                                                <select
                                                    id={`timeSlot-${guestIndex}-${serviceIndex}`}
                                                    name={`timeSlot-${guestIndex}-${serviceIndex}`}
                                                    className="md:flex-2 w-4/5 md:w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 text-xs shadow-xs"
                                                    value={formData.services?.[guestIndex]?.[serviceIndex]?.timeSlot || ""}
                                                    onChange={(e) => handleTimeSlotChange(guestIndex, serviceIndex, e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Time Slot</option>
                                                    {(() => {
                                                        const serviceId = formData.services?.[guestIndex]?.[serviceIndex]?.serviceId;
                                                        const service = services.find(s => s.id === serviceId);
                                                        if (!service || !service.duration || !Array.isArray(timeSlots) || timeSlots.length === 0) return null;

                                                        const combos = getAllConsecutiveSlotCombos(timeSlots, service.duration);
                                                        if (!combos.length) return <option disabled>No available slots</option>;

                                                        const seen = new Set();

                                                        return combos.map((combo, idx) => {
                                                            const slotKey = `${combo[0].start}-${combo[combo.length - 1].end}`;
                                                            if (seen.has(slotKey)) return null;
                                                            seen.add(slotKey);

                                                            let selectedCount = 0;
                                                            Object.values(selectedSlots).forEach(guestServices => {
                                                                guestServices?.forEach(sel => {
                                                                    if (sel?.slot === slotKey) selectedCount++;
                                                                });
                                                            });

                                                            const minBeds = Math.min(...combo.map(s => s.beds));
                                                            const bedsAvailable = minBeds - selectedCount;

                                                            return (
                                                                <option
                                                                    key={slotKey}
                                                                    value={slotKey}
                                                                >
                                                                    {new Date(`1970-01-01T${combo[0].start}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(`1970-01-01T${combo[combo.length - 1].end}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                                </option>
                                                            );
                                                        });
                                                    })()}
                                                </select>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteService(guestIndex, serviceIndex)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                    aria-label="Remove Service"
                                                >
                                                    {serviceIndex > 0 ? (
                                                        <FaTrash size={16} />
                                                    ) : (
                                                        <FaTrash size={16} opacity={0} />
                                                    )}
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => handleAddService(guestIndex)} 
                                            className={`mt-2 w-1/2 self-center bg-[#e0d8ad] hover:scale-105 hover:bg-white text-black px-4 py-2 rounded-md transition`}
                                        >
                                            Add Service
                                        </button>
                                    </div>
                                ))}

                                
                            </form>
                                <div className="flex justify-around mt-3">
                                <button
                                    type="button"
                                    onClick={async () => {await deleteNewSchedule(); setStep(1)}}
                                    className="bg-gray-400 hover:scale-105 hover:bg-gray-500 text-white w-2/5 px-6 py-3 rounded-md transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    form="form2"
                                    disabled={saving || anyOverbooked}
                                    className={`${
                                        saving || anyOverbooked ? "bg-gray-400 text-white" : "bg-[#e0d8ad] hover:scale-105 hover:bg-white"
                                    } text-black w-2/5 px-6 py-3 rounded-md transition`}
                                >
                                    Next
                                </button>
                            </div>
                            </>
                        )}

                        {step === 3 && (
                        <>
                            <div className="flex flex-col space-y-6 pl-6 pr-6 overflow-y-auto overflow-x-hidden max-h-[50vh]">
                                
                                <h3 className="text-xl font-bold text-[#e0d8ad] text-center">Booking Summary</h3>
                                <div className="bg-gray-100 p-4 rounded-lg shadow-md text-xs text-zinc-800">
                                    <p><strong>Date:</strong> {formData.date}</p>
                                    <p><strong>Location:</strong> {branches.find(branch => branch.id === selectedBranch)?.name}</p>
                                    {reservations.map((guest, guestIdx) => (
                                        <div key={guestIdx} className="mt-4">
                                            <p className="font-semibold mb-3">Guest {guest.guest}</p>
                                            <ul className="list-none space-y-2">
                                                {guest.services.map((service, svcIdx) => (
                                                    <li key={svcIdx} className=" pb-1 mb-1">
                                                        <div className="flex justify-between items-center">
                                                            <span>
                                                                {service.name}
                                                                {service.duration && (
                                                                    <span className="ml-2 text-gray-500">
                                                                        (
                                                                            {service.timeSlot && (() => {
                                                                                const [start, end] = service.timeSlot.split("-");
                                                                                const format12hr = (t) => {
                                                                                    const d = new Date(`1970-01-01T${t}:00`);
                                                                                    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                                                                                };
                                                                                return `${format12hr(start)} - ${format12hr(end)}`;
                                                                            })()}
                                                                        )
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span>₱{service.price}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <hr className="my-4" />
                                    <div className="flex justify-between font-bold">
                                        <p><strong>Total:</strong></p>
                                        <p>₱{calculateTotal()}</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-[#e0d8ad] text-center">Contact Information</h3>
                                <form onSubmit={handleSubmit} id="form3" className="flex flex-col [#e0d8ad] space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium">Full Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.name || ""}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 text-sm shadow-xs"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col  sm:flex-row sm:space-x-4">
                                        <div className="flex-1 mb-4 sm:mb-0">
                                            <label className="block text-sm  font-medium">Contact No.</label>
                                            <input
                                                type="tel"
                                                name="contactNo"
                                                value={formData.number || ""}
                                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                                className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 text-sm shadow-xs"
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ""}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 text-sm shadow-xs"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Additional Notes</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes || ""}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 text-sm shadow-xs"
                                            rows="4"
                                        ></textarea>
                                    </div>
                                </form>

                                
                            </div>
                            <div className="flex justify-around mt-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="bg-gray-400 hover:scale-105 hover:bg-gray-500 text-white w-2/5 px-6 py-3 rounded-md transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    form="form3"
                                    disabled={saving}
                                    className={`${
                                        saving ? "bg-gray-400" : "bg-[#e0d8ad] hover:scale-105 hover:bg-white"
                                    } text-black w-2/5 px-6 py-3 rounded-md transition`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </>
                        )}
                </div>    
            </div>
        </div>
    );
};

export default BookingForm;