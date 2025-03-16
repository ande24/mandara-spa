"use client";

import React, { useState, useEffect } from "react";
import { getFirestore, query, orderBy } from "firebase/firestore";
import { addDoc, collection, doc, getDocs, getDoc } from "firebase/firestore"; 
import firebase_app from "../firebase/config";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

    const [formData, setFormData] = useState({
        date: "",
        time: "",
        pax: "", 
        service: "",
        branch: "",
        category: "", 
    });

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

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

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

        console.log(formData)
        
        try {
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
            
            setShowSuccess(true);
            
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({ pax: "", date: "", time: "", service: "", branch: "", category: ""});
                setSelectedCategory(null) 
                setSelectedBranch(null)
                setSelectedService(null)
                onClose();
            }, 2000);
            
            return docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);

            setShowError(true);
            
            setTimeout(() => {
                setShowError(false);
                setSelectedCategory(null) 
                setSelectedBranch(null)
                setSelectedService(null)
                setFormData({ pax: "", date: "", time: "", service: "", branch: "", category: ""}); 
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-300 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                    <h2 className="text-2xl font-bold mb-4 text-center">Book an Appointment</h2>

                    <form onSubmit={handleSubmit}>
                        <label>Branch:</label>
                        <select 
                            className="border p-2 rounded w-full mb-2"
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
                            className="border p-2 rounded w-full mb-2"
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
                            className="border p-2 rounded w-full mb-2"
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
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <label>Date</label>
                        <input 
                            type="date" name="date" min={minDate}
                            value={formData.date} onChange={handleChange} required
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <label>Time</label>
                        <input 
                            type="time" name="time" step="1800"
                            value={formData.time} onChange={handleChange} required
                            className="w-full p-2 mb-5 border rounded"
                        />

                        <div className="flex justify-around">
                            <button 
                                type="submit"
                                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
                            >
                                Submit Booking
                            </button>
                            <button 
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-bold mb-4 text-green-600">Booking Successful!</h2>
                        <p>We'll send you a confirmation email.</p>
                    </div>
                </div>
            )}

            {showError && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h2>
                        <p>Please try again.</p>
                    </div>
                </div>
            )}          

        </div>
    );
};

export default BookingForm;