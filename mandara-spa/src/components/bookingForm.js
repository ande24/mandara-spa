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

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
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
        pax: "", 
        service: "",
        branch: "",
        category: "", 
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
    }, [userData]);

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
    }, []);

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
    }, [selectedBranch]);

    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() + 1); 
        setMinDate(today.toISOString().split("T")[0]); 
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true)

        console.log(formData)
        
        try {
            console.log("select", selectedBranch)
            const branchRef = doc(db, "branches", selectedBranch)
            const docRef = await addDoc(collection(branchRef, "bookings"), {
                customer_id: auth.currentUser.uid,
                booked_time: formData.time,
                booked_date: formData.date,
                no_of_customers: formData.pax,
                service_id: formData.service,
                booking_status: "pending"
            });
            console.log("Booking successful with ID:", docRef.id);

            console.log(formData)

            const serviceRef = doc(branchRef, "services", formData.service);
            const serviceSnap = await getDoc(serviceRef);

            const branchSnap = await getDoc(branchRef);

            const newData = {
                mobile: branchSnap.data().branch_mobile || "",
                landline: branchSnap.data().branch_landline || "",
                date: formData.date,
                time: formData.time,
                pax: formData.pax,
                service: serviceSnap.data().service_name,
                location: branchSnap.data().branch_location,
                name: userData.user_name,
                id: selectedBranch,
            }

            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
              });
            
            setSuccessMsg("We sent you a booking request confirmation email.")
            setShowSuccess(true);
            
            
            setTimeout(() => {
                setFormData({ pax: "", date: "", time: "", service: "", branch: "", category: ""});
                setSelectedCategory(null) 
                setSelectedBranch(null)
                setSelectedService(null)
                onClose();
            }, 2000);

            setSaving(false)
            
            return docRef.id;
        } catch (error) {
            setErrorMsg(error.message);

            setShowError(true);
            
            setTimeout(() => {
                setSelectedCategory(null) 
                setSelectedBranch(null)
                setSelectedService(null)
                setFormData({ pax: "", date: "", time: "", service: "", branch: "", category: ""}); 
            }, 2000);
        }
        setSaving(false)
    };

    return (
        <div className="flex flex-col items-center justify-center z-50 transition-all">
            {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
            {showSuccess && <SuccessMessage message={successMsg} onClose={() => setShowSuccess(false)}/>}

            <div className={`fixed top-0 left-0 w-full h-full transition-all bg-white opacity-80 ${show ? "scale-100" : "scale-0"}`}></div>
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                <div className={`flex flex-col p-6 text-[#e0d8ad] rounded-lg transition-all shadow-md max-w-lg w-full bg-[#502424] ${show ? "scale-100" : "scale-0"}`}>
                    <h2 className="text-2xl mb-2 font-bold text-center">Book an Appointment</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                        <label>Branch:</label>
                        <select 
                            className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                            value={selectedBranch ? selectedBranch.id : ""}
                            onChange={handleBranchChange}
                        >
                            <option value="">Select Branch</option>
                            {branches
                            .filter(branch => branch.name !== "Camaya Coast, Bataan" && branch.name !== "BGC One Serendra")
                            .map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name} - {branch.hours}</option>
                            ))}
                        </select>

                        <label>Service Category:</label>
                        <select
                            name="category"
                            className="w-full bg-gray-200 text-black rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                            value={selectedCategory || ""} 
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select Category</option>
                            <option value="signature">The Mandara Spa Signature Rituals</option>
                            <option value="massage_therapy">The Mandara Spa Body Rituals (Massage Therapy)</option>
                            <option value="body_scrub">The Mandara Spa Body Rituals (Body Scrub and Wraps)</option>
                            <option value="healing">The Mandara Spa Body Rituals (Traditional Healing Massage)</option>
                            <option value="hand_and_foot">The Mandara Spa Hand and Foot Rituals</option>
                            <option value="facial">The Mandara Spa Facial Rituals</option>
                            <option value="other">Other Mandara Treats</option>
                            <option value="special">Special Offers</option>
                        </select>
                        
                        <label>Service:</label>
                        <select 
                            className="w-full bg-gray-200 rounded-lg text-black border-gray-200 p-4 pe-12 text-sm shadow-xs"
                            value={selectedService ? selectedService.id : ""}
                            onChange={handleServiceChange}
                        >
                            <option value="">Select Service</option>
                            {services
                            .filter(service => service.status !== "unavailable" && service.category === selectedCategory)
                            .map(service => (
                                <option key={service.id} value={service.id}>{service.name} {service.price ? `- ₱${service.price}` : ""}</option>
                            ))}
                            
                        </select>

                        <label>Number of Customers</label>
                        <input 
                            type="number" name="pax" min="1"
                            value={formData.pax} onChange={handleChange} required
                            className="w-full bg-gray-200 rounded-lg text-black border-gray-200 p-4 pe-12 text-sm shadow-xs"
                        />
                        <label>Date</label>
                        <input 
                            type="date" name="date" min={minDate}
                            value={formData.date} onChange={handleChange} required
                            className="w-full bg-gray-200 rounded-lg text-black border-gray-200 p-4 pe-12 text-sm shadow-xs"
                        />
                        <label>Time</label>
                        <input 
                            type="time" name="time" step="1800"
                            value={formData.time} onChange={handleChange} required
                            className="w-full bg-gray-200 rounded-lg text-black border-gray-200 p-4 pe-12 text-sm shadow-xs"
                        />

                        <div className="flex justify-around mt-3">
                            <button 
                                disabled={saving}
                                type="submit"
                                    className={`${saving ? "bg-gray-400" : "bg-[#e0d8ad] hover:scale-105 hover:bg-white"} text-black w-2/5 px-6 py-3 rounded-md transition`}
                            >
                                Submit Booking
                            </button>
                            <button 
                                type="button"
                                onClick={onClose}
                                className="bg-[#e0d8ad] text-black w-2/5 px-6 py-3 rounded-md hover:scale-105 hover:bg-white transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;