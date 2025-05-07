"use client";

import React, { useState, useEffect } from "react";
import { getFirestore, query, orderBy } from "firebase/firestore";
import { addDoc, collection, doc, getDocs, getDoc } from "firebase/firestore"; 
import firebase_app from "../firebase/config";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SuccessMessage from "./success";
import ErrorMessage from "./error";

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
    const [selectedServices, setSelectedService] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [show, setShow] = useState(false)
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [saving, setSaving] = useState(false)

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
            const fetchUserData = async () => {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        console.log("user: ", docSnap.data());
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
        if (userData && !formData.isInitialized) {
            setFormData((prev) => ({
                ...prev,
                name: userData.user_name || "",
                number: userData.user_number || "",
                email: userData.user_email || "",
                isInitialized: true, 
            }));
        }
    }, [userData]);

    useEffect(() => {
        if (userData && selectedBranch) {
            const fetchBranchData = async () => {
                try {
                    const branchRef = doc(db, "branches", selectedBranch); 
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
    }, [userData, db, selectedBranch]);

    useEffect(() => {
        const fetchBranches = async () => {
            const branchCollection = collection(db, "branches");
            const branchSnapshot = await getDocs(branchCollection);
            const branchList = branchSnapshot.docs
            .filter(doc => doc.id !== "schema")
            .map(doc => ({
                id: doc.id,
                name: doc.data().branch_location,
                hours: doc.data().branch_hours
            }));
            console.log(branchList);
            setBranches(branchList);
        };
        fetchBranches();
    }, [db]);

    useEffect(() => {
        if (selectedBranch) {
            const fetchServices = async () => {
                try {
                    const branchRef = doc(db, "branches", selectedBranch);
                    console.log(branchRef)
                    const serviceCollection = query(collection(branchRef, "services"), orderBy("service_name"));
                    console.log(serviceCollection)
                    const serviceSnapshot = await getDocs(serviceCollection);
                    const serviceList = serviceSnapshot.docs
                        .filter(doc => doc.id !== "placeholder")
                        .map(doc => ({
                            id: doc.id,
                            name: doc.data().service_name,
                            price: doc.data().service_price,
                            desc: doc.data().service_desc,
                            duration: doc.data().service_duration,
                            category: doc.data().service_category,
                            status: doc.data().service_status
                        }));
    
                    console.log("services: ", serviceList);
                    setServices(serviceList);
                } catch (error) {
                    console.error("Error fetching services:", error);
                }
            };
            fetchServices();
        }
    }, [selectedBranch, db]);

    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() + 1); 
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

    const handleCategoryChange = async (e) => {
        const selectedCat = e.target.value;
        setSelectedCategory(selectedCat);

        setFormData((prev) => ({ ...prev, category: selectedCat }))
    };

    const handleServiceChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedService(selectedId);
        setFormData((prev) => ({ ...prev, service: selectedId }))
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

        console.log("DATA: ", formData)

        setStep(2);
    }

    const submitServices = async (e) =>  {
        e.preventDefault();
        // if (selectedBranch === "" || !formData.date || !formData.time || selectedPax === "" ) {
        //     setErrorMsg("Please fill in all required fields.");
        //     setShowError(true);
        //     return;
        // }
        console.log("formdata: ", formData)

        setStep(3);
    }

    const calculateTotal = () => {
        let subtotal = 0;
        Array.from({ length: selectedPax }, (_, guestIndex) => {
            formData.services?.[guestIndex]?.forEach(serviceId => {
                const service = services.find(s => s.id === serviceId);
                if (service) subtotal += Number(service.price);
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

            const formattedServices = formData.services.map((guestServices, guestIndex) => {
                const serviceNames = guestServices
                    .map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId);
                        return service ? `${service.name} - ₱${service.price}` : null;
                    })
                    .filter((name) => name !== null); 
                return `Guest ${guestIndex + 1}: ${serviceNames.join(", ")}`;
            });

            const docRef = await addDoc(collection(branchRef, "bookings"), {
                customer_id: auth.currentUser.uid,
                booked_time: formData.time,
                booked_date: formData.date,
                no_of_customers: formData.pax,
                services: formattedServices,
                customer_name: formData.name,
                customer_number: formData.number,
                customer_email: formData.email,
                additional_notes: formData.notes,
                booking_status: "pending",
                total: calculateTotal(formData.services)
            });
            console.log("Booking successful with ID:", docRef.id);

            const branchSnap = await getDoc(branchRef);

            const newData = {
                mobile: branchSnap.data().branch_mobile || "",
                landline: branchSnap.data().branch_landline || "",
                date: formData.date,
                time: formData.time,
                pax: selectedPax,
                services: formattedServices,
                total: calculateTotal(formData.services),
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
                setSelectedService(null);
                setSaving(false);
                onClose();
            }, 3000);

            
        } catch (error) {
            setErrorMsg(error.message);
            setShowError(true);
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col relative items-center justify-center z-50 transition-all">
            

            <div className={`fixed top-0 left-0 w-full h-full transition-all bg-white opacity-80 ${show ? "scale-100" : "scale-0"}`}></div>
            
            <div className="fixed top-0 inset-x-0 flex items-center justify-center">
            {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
            {showSuccess && <SuccessMessage message={successMsg} onClose={() => setShowSuccess(false)}/>}
                <div className={` top-30 inset-x-0 relative flex flex-col p-6 text-[#e0d8ad] rounded-lg transition-all shadow-md max-w-lg w-full bg-[#502424] ${show ? "scale-100" : "scale-0"}`}>
                    
                    
                    <button 
                        type="button"
                        onClick={onClose}
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
                            value={formData.date} onChange={handleChange} required
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
                        <form onSubmit={submitServices} id="form2" className="flex flex-col space-y-4 pl-10 pr-6 overflow-y-auto overflow-x-hidden max-h-[50vh]">
                            {Array.from({ length: selectedPax }, (_, guestIndex) => (
                                <div key={guestIndex} className="flex flex-col space-y-4 border-b pb-4 mb-4">
                                    <h4 className="font-semibold text-[#e0d8ad]">Guest {guestIndex + 1}</h4>

                                    {Array.from({ length: formData.services?.[guestIndex]?.length || 1 }, (_, serviceIndex) => (
                                        <div key={serviceIndex} className="flex items-center space-x-2">
                                            <select
                                                id={`service-${guestIndex}-${serviceIndex}`}
                                                name={`service-${guestIndex}-${serviceIndex}`}
                                                className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 text-sm shadow-xs"
                                                value={formData.services?.[guestIndex]?.[serviceIndex] || ""}
                                                onChange={(e) => {
                                                    const updatedServices = [...(formData.services || [])];
                                                    updatedServices[guestIndex] = updatedServices[guestIndex] || [];
                                                    updatedServices[guestIndex][serviceIndex] = e.target.value;
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        services: updatedServices,
                                                    }));
                                                }}
                                                required
                                            >
                                                <option value=""></option>
                                                {services
                                                    .filter((service) => service.status !== "unavailable")
                                                    .map((service) => (
                                                        <option key={service.id} value={service.id}>
                                                            {service.name} {`${service.price ? `- ₱${service.price}` : ""}`}
                                                        </option>
                                                    ))}
                                            </select>

                                            {/* Delete Button */}
                                            {formData.services?.[guestIndex]?.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedServices = [...(formData.services || [])];
                                                        updatedServices[guestIndex].splice(serviceIndex, 1); // Remove the selected service
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            services: updatedServices,
                                                        }));
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedServices = [...(formData.services || [])];
                                            updatedServices[guestIndex] = updatedServices[guestIndex] || [];
                                            updatedServices[guestIndex].push(""); // Add a new empty service
                                            setFormData((prev) => ({
                                                ...prev,
                                                services: updatedServices,
                                            }));
                                        }} 
                                        className={`mt-2 bg-[#e0d8ad] hover:scale-105 hover:bg-white text-black px-4 py-2 rounded-md transition`}
                                    >
                                        Add Service
                                    </button>
                                </div>
                            ))}

                            
                        </form>
                            <div className="flex justify-around mt-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="bg-gray-400 hover:scale-105 hover:bg-gray-500 text-white w-2/5 px-6 py-3 rounded-md transition"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                form="form2"
                                disabled={saving}
                                className={`${
                                    saving ? "bg-gray-400" : "bg-[#e0d8ad] hover:scale-105 hover:bg-white"
                                } text-black w-2/5 px-6 py-3 rounded-md transition`}
                            >
                                Next
                            </button>
                        </div>
                        </>
                    )}

                    {step === 3 && (
                    <>
                        <div className="flex flex-col space-y-6 pl-10 pr-6 overflow-y-auto overflow-x-hidden max-h-[50vh]">
                            {/* Booking Summary */}
                            <h3 className="text-xl font-bold text-[#e0d8ad] text-center">Booking Summary</h3>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md text-xs text-zinc-800">
                                <p><strong>Date:</strong> {formData.date}</p>
                                <p><strong>Time:</strong> {formData.time}</p>
                                <p><strong>Location:</strong> {branches.find(branch => branch.id === selectedBranch)?.name}</p>
                                <p><strong>No. of Guests:</strong> {selectedPax}</p>
                                {Array.from({ length: selectedPax }, (_, guestIndex) => (
                                    <div key={guestIndex} className="mt-4">
                                        <p className="font-semibold">Guest {guestIndex + 1}</p>
                                        <ul className="list-none">
                                            {formData.services?.[guestIndex]?.map((serviceId, index) => {
                                                const service = services.find(s => s.id === serviceId);
                                                return (
                                                    <li key={index}>
                                                        <div className="flex justify-between items-center">
                                                            <p>{service?.name}</p>
                                                            <p>₱{service?.price}</p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                                <hr className="my-4" />
                                <div className="flex justify-between font-bold">
                                    <p><strong>Total:</strong></p>
                                    <p>₱{calculateTotal()}</p>
                                </div>
                            </div>

                            {/* Contact Information Form */}
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
                                <div className="flex flex-col sm:flex-row sm:space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium">Contact No.</label>
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