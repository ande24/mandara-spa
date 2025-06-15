"use client";

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, orderBy, query, onSnapshot, getDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Image = dynamic(() => import("next/image"));

const ManageService = () => {
    const router = useRouter();
    const auth = getAuth(firebase_app);
    const db = getFirestore(firebase_app);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        price: "",
        desc: "",
        category: ""
    });

    const [services, setServices] = useState([]);
    const [serviceData, setServiceData] = useState(null);
    const [selectedService, setSelectedService] = useState("");

    const [saving, setSaving] = useState(false);

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
                        status: doc.data().service_status
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
        if (selectedService && userData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const docRef = doc(branchRef, "services", selectedService);
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                }
            }, (error) => {
                console.error("Error fetching service data:", error);
            });
            return () => unsubscribe();
        }
    }, [selectedService, db, userData]);

    const handleAddService = async (e) => {
        e.preventDefault();
        setSaving(true)

        const branchRef = doc(db, "branches", userData.branch_id);
        const servicesRef = collection(branchRef, "services");

        try {
            const docRef = await addDoc(servicesRef, {
                service_name: formData.name || "",
                service_duration: formData.duration || "",
                service_price: formData.price || "",
                service_status: `${formData.price && formData.duration ? "available" : "unavailable"}`,
                service_desc: formData.desc || "",
                service_category: formData.category || ""
            });

            alert("Service added successfully!");
            setFormData({
                name: "",
                duration: "",
                price: "",
                desc: "",
                category: "",
            });
        } catch (error) {
            alert("Error adding service: " + error.message);
        }
        setSaving(false)
    };

    const handleRemoveService = async (e, serviceId) => {
        e.preventDefault();
        setSaving(true)

        const confirmDelete = window.confirm("Are you sure you want to remove this service?");
        if (!confirmDelete) return;

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const serviceRef = doc(branchRef, "services", serviceId);

            await deleteDoc(serviceRef);

            setServices((prevServices) => prevServices.filter(service => service.id !== serviceId));

            alert("Service removed successfully!");
        } catch (error) {
            alert("Error adding admin: " + error.message);
        }
        setSaving(false)
    };

    const handleEditService = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const serviceRef = doc(branchRef, "services", selectedService);

            const data = {
                service_name: formData.name,
                service_price: formData.price,
                service_desc: formData.desc,
                service_duration: formData.duration,
                service_category: formData.category
            }

            await updateDoc(serviceRef, data);
            alert("Service details updated successfully!");

            setServices(prevServices =>
                prevServices.map(service =>
                    service.id === selectedService ?
                        { ...service, name: formData.name, duration: formData.duration, price: formData.price, category: formData.category } : service
                )
            );

            setSaving(false);
            setFormData({
                name: "",
                duration: "",
                price: "",
                desc: "",
                category: ""
            });
        } catch (error) {
            alert("Error updating service: " + error.message);
            setSaving(false);
        }
    };

    const toggleDisable = async (serviceId, newStatus) => {
        setSaving(true)
        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const serviceRef = doc(branchRef, "services", serviceId);

            const serviceDoc = await getDoc(serviceRef);
            console.log("Service Document: ", serviceDoc.data());

            if (newStatus === "available" && (!serviceDoc.data().service_price || !serviceDoc.data().service_duration)) {
                window.alert("Service is missing price or duration. Please fill them in before marking as available."); 
                setSaving(false);
                return;
            }
            await updateDoc(serviceRef, {
                service_status: newStatus
            });

            setServices(prevServices =>
                prevServices.map(service =>
                    service.id === serviceId ? { ...service, status: newStatus } : service
                )
            );

        } catch (error) {
            console.error("Error updating service status:", error);
            alert("Error updating service status: " + error.message);
        }
        setSaving(false)
    }

    const handleServiceChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedService(selectedId);
        const foundService = services.find(service => service.id === selectedId);
        setServiceData(foundService);
        if (foundService) {
            setFormData({
                name: foundService.name || "",
                duration: foundService.duration || "",
                price: foundService.price || "",
                desc: foundService.desc || "",
                category: foundService.category || ""
            });
        } else {
            setFormData({
                name: "",
                duration: "",
                price: "",
                desc: "",
                category: ""
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="flex justify-center items-center ">
            {user && userData && branchData && services && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#301414] bg-opacity-50">
                    <Image priority className="fixed top-10 z-10" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />

                    <div className="flex flex-col md:flex-row mt-20 justify-center gap-6">
                        <div className="md:w-1/3 bg-white p-3 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-black mb-4 text-center">Choose Service</h3>
                            <form onSubmit={handleAddService} className="space-y-4">
                                <div>
                                    <label className="block text-black font-semibold">Select a Service:</label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="name"
                                        onChange={handleServiceChange}
                                        value={formData.name || ""}
                                    >
                                        <option value="">Select a Service</option>
                                        {services.map(service => (
                                            <option key={service.id} value={service.id}>{service.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-black font-semibold">Service Name:</label>
                                    <input
                                        name="name"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        value={formData.name || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-black font-semibold">Duration (Minutes):</label>
                                    <input
                                        name="duration"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="number"
                                        min="1"
                                        value={formData.duration ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-black0 font-semibold">Price (₱):</label>
                                    <input
                                        name="price"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="number"
                                        min="1"
                                        value={formData.price ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-black font-semibold">Description:</label>
                                    <input
                                        name="desc"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        value={formData.desc || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-black font-semibold">Category:</label>
                                    <select
                                        name="category"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.category || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value=""></option>
                                        <option value="signature">The Mandara Spa Signature Rituals</option>
                                        <option value="massage_therapy">The Mandara Spa Body Rituals (Massage Therapy)</option>
                                        <option value="body_scrub">The Mandara Spa Body Rituals (Body Scrub and Wraps)</option>
                                        <option value="healing">The Mandara Spa Body Rituals (Traditional Healing Massage)</option>
                                        <option value="hand_and_foot">The Mandara Spa Hand and Foot Rituals</option>
                                        <option value="facial">The Mandara Spa Facial Rituals</option>
                                        <option value="other">Other Mandara Treats</option>
                                        <option value="special">Special Offers</option>
                                    </select>
                                </div>

                                <div className="flex justify-between space-x-4">
                                    <button
                                        disabled={saving}
                                        type="submit"
                                        className="w-full p-3 rounded-lg text-white font-serif bg-[#502424] hover:bg-[#301414] transition "
                                    >
                                        Add Service
                                    </button>
                                    <button
                                        onClick={handleEditService}
                                        disabled={saving}
                                        className={`w-full p-3 rounded-lg text-white transition font-serif bg-[#502424] hover:bg-[#301414]"
                                            }`}
                                    >
                                        Edit Service
                                    </button>
                                </div>

                                <button
                                    onClick={() => { router.push("/tmsAdmin/dashboard") }}
                                    className="w-full p-3 rounded-lg text-white font-serif bg-[#502424] hover:bg-[#301414]"
                                >
                                    Close
                                </button>
                            </form>
                        </div>

                        <div className="w-full md:w-1/2 bg-white p-3 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Manage Services</h3>
                            <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded-lg p-4">
                                {services.length > 0 ? (
                                    <ul className="space-y-2">
                                        {services.map(service => (
                                            <li key={service.id} className={`flex justify-between border items-center p-3 rounded 
                                                    ${service.status === "available" ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"}`}>
                                                <div>
                                                    <p className="font-semibold">{service.name}</p>
                                                    <div className="flex flex-row gap-x-1">
                                                        <p className={`${service.price ? "" : "text-red-600"}`}>{service.price ? `₱${service.price} ` : "NO PRICE "}</p>
                                                        <p>|</p>
                                                        <p className={`${service.duration ? "" : "text-red-600"}`}>{service.duration ? `${service.duration} mins` : "NO DURATION "}</p>
                                                    </div>
                                                    <p className={`text-xs ${service.desc ? "" : "text-red-600"}`}>{service.desc ? `${service.desc}` : "NO DESCRIPTION "}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        disabled={saving}
                                                        className="border p-1 rounded-lg bg-white "
                                                        value={service.status || "available"}
                                                        onChange={(e) => toggleDisable(service.id, e.target.value)}
                                                    >
                                                        <option value="available">Available</option>
                                                        <option value="unavailable">Unavailable</option>
                                                    </select>
                                                    <button
                                                        disabled={saving}
                                                        className=" text-white p-2 rounded-lg font-serif bg-[#502424] hover:bg-[#301414]"
                                                        onClick={(e) => handleRemoveService(e, service.id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-center">No services available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageService;
