"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const ManageService = () => {
    const auth = getAuth(firebase_app)
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
    const [selectedService, setSelectedService] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

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
        if (branchData) {
            const fetchServices = async () => {
                try {
                    const branchRef = doc(db, "branches", userData.branch_id);
                    const serviceCollection = collection(branchRef, "services");
                    const serviceSnapshot = await getDocs(serviceCollection);
                    const serviceList = serviceSnapshot.docs
                        .filter(doc => doc.id !== "placeholder")
                        .map(doc => ({
                            id: doc.id,
                            name: doc.data().service_name,
                            price: doc.data().service_price,
                            desc: doc.data().service_desc,
                            duration: doc.data().service_duration,
                            category: doc.data().service_category
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

    const handleAddService = async (e) => {
        e.preventDefault();

        const branchRef = doc(db, "branches", userData.branch_id);
        const servicesRef = collection(branchRef, "services");

        try {
            const docRef = await addDoc(servicesRef, {
                service_name: formData.name,
                service_duration: formData.duration,
                service_price: formData.price,
                service_status: "available",
                service_desc: formData.desc,
                service_category: selectedCategory
            });
    
            const newService = {
                id: docRef.id, 
                name: formData.name,
                duration: formData.duration,
                price: formData.price,
                desc: formData.desc,
                category: selectedCategory
            };

            setServices(prevServices => [...prevServices, newService]);

            setMessage("Service added successfully!");
            setFormData({
                name: "",
                duration: "",
                price: "",
                desc: "",
            });
            //setSelectedCategory(null);
        } catch (error) {
            setMessage("Error adding service: " + error.message);
        }
    };

    const handleRemoveService = async (e, serviceId) => {
        e.preventDefault();

        const confirmDelete = window.confirm("Are you sure you want to remove this service?");
        if (!confirmDelete) return;

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const serviceRef = doc(branchRef, "services", serviceId);
        
            await deleteDoc(serviceRef);

            setServices((prevServices) => prevServices.filter(service => service.id !== serviceId));

            setMessage("Service removed successfully!");
        } catch (error) {
            setMessage("Error adding admin: " + error.message);
        }
    };

    const updateEditForm = async(e, serviceId) => {
        e.preventDefault();

        setSelectedService(serviceId);

        const branchRef = doc(db, "branches", userData.branch_id); 
        const serviceRef = doc(branchRef, "services", serviceId);
        const docSnap = await getDoc(serviceRef);
        const data = docSnap.data();

        setFormData({
            name: data.service_name,
            duration: data.service_duration,
            price: data.service_price,
            desc: data.service_desc,
            category: data.service_category
        });
    }

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
                service_category: selectedCategory
            }
        
            await updateDoc(serviceRef, data);
            alert("Service details updated successfully!");

            setServices(prevServices => 
                prevServices.map(service => 
                    service.id === selectedService ? 
                        { ...service, name: formData.name, duration: formData.duration, price: formData.price } : service
                )
            );
    
            setSaving(false);
            setFormData({
                name: "",
                duration: "",
                price: "",
                desc: "",
            });

            setSelectedCategory(null);
        } catch (error) {
            setMessage("Error updating service: " + error.message);
            alert("Failed to update service.");
            setSaving(false);
        }

        
    };

    const toggleDisable = async (serviceId, newStatus) => {
        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const serviceRef = doc(branchRef, "services", serviceId);

            await updateDoc(serviceRef, {
                service_status: newStatus
            });

            setServices(prevServices => 
                prevServices.map(service => 
                    service.id === serviceId ? { ...service, status: newStatus } : service
                )
            );

            setMessage("Service status updated!");
        } catch (error) {
            console.error("Error updating service status:", error);
            setMessage("Error updating service status: " + error.message);
        }
    }

    return (
        <div className="flex justify-around items-center h-screen w-screen bg-gray-500">
            
            <div className="flex flex-col justify-center items-center p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">Add Service</h2>
                {message  && <p className="mb-2 text-green-500">{message}</p>}
                <form onSubmit={handleAddService} className="flex flex-col space-y-3">
                    <label>Service Name:</label>
                    <input name="name" className="border p-2 rounded" type="text" value={formData.name} onChange={(e) => setFormData((prevData) => ({ ...prevData, name: e.target.value }))} required />

                    <label>Duration (Minutes):</label>
                    <input name="duration" className="border p-2 rounded" type="number" min="1" value={formData.duration} onChange={(e) => setFormData((prevData) => ({ ...prevData, duration: e.target.value }))} />

                    <label>Price (Php):</label>
                    <input name="price" className="border p-2 rounded" type="number" min="1" value={formData.price} onChange={(e) => setFormData((prevData) => ({ ...prevData, price: e.target.value }))}  />

                    <label>Description:</label>
                    <input name="desc" className="border p-2 rounded" type="text" value={formData.desc} onChange={(e) => setFormData((prevData) => ({ ...prevData, desc: e.target.value }))} />

                    <label>Category:</label>
                    <select
                        name="category"
                        className="border p-1 rounded"
                        value={selectedCategory || ""} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value=""></option>
                        <option value="signature">The Mandara Spa Signature Rituals</option>
                        <option value="massage_therapy">The Mandara Spa Body Rituals (Massage Therapy)</option>
                        <option value="body_scrub">The Mandara Spa Body Rituals (Body Scrub and Wraps)</option>
                        <option value="hand_and_foot">The Mandara Spa Hand and Foot Rituals</option>
                        <option value="facial">The Mandara Spa Facial Rituals</option>
                        <option value="other">Other Mandara Treats</option>
                        <option value="special">Special Offers</option>
                    </select>

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Service</button>
                </form>
            </div>

            <div className="flex flex-col justify-center items-center p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">Edit Service</h2>
                {message  && <p className="mb-2 text-green-500">{message}</p>}
                <form onSubmit={handleEditService} className="flex flex-col space-y-3">
                    <label>Service Name:</label>
                    <input name="name" className="border p-2 rounded" type="text" value={formData.name} onChange={(e) => setFormData((prevData) => ({ ...prevData, name: e.target.value }))} required />

                    <label>Duration (Minutes):</label>
                    <input name="duration" className="border p-2 rounded" type="number" min="1" value={formData.duration} onChange={(e) => setFormData((prevData) => ({ ...prevData, duration: e.target.value }))} required />

                    <label>Price (Php):</label>
                    <input name="price" className="border p-2 rounded" type="number" min="1" value={formData.price} onChange={(e) => setFormData((prevData) => ({ ...prevData, price: e.target.value }))} required />

                    <label>Description:</label>
                    <input name="desc" className="border p-2 rounded" type="text" value={formData.desc} onChange={(e) => setFormData((prevData) => ({ ...prevData, desc: e.target.value }))} required />

                    <label>Category:</label>
                    <select
                        name="category"
                        className="border p-1 rounded"
                        value={ selectedCategory || ""} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value=""></option>
                        <option value="signature">The Mandara Spa Signature Rituals</option>
                        <option value="massage_therapy">The Mandara Spa Body Rituals (Massage Therapy)</option>
                        <option value="body_scrub">The Mandara Spa Body Rituals (Body Scrub and Wraps)</option>
                        <option value="hand_and_foot">The Mandara Spa Hand and Foot Rituals</option>
                        <option value="facial">The Mandara Spa Facial Rituals</option>
                        <option value="other">Other Mandara Treats</option>
                        <option value="special">Special Offers</option>
                    </select>

                    <button type="submit" disabled={saving} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Edit Service</button>
                </form>
            </div>

            <div className="flex flex-col justify-center items-center mt-6 p-4 bg-white shadow-lg rounded-lg">
                <h3 className="text-lg font-bold mb-3">Service List</h3>
                {services.length > 0 ? (
                    <ul className="flex flex-col justify-between space-y-2 w-100">
                        {services.map(service => (
                            <li key={service.id} className="flex justify-between items-center border-b p-2">
                                <span>{service.name} - Php {service.price} </span>
                                <div>
                                    <select
                                        className="border p-1 rounded"
                                        value={service.status || "available"} // Default to available
                                        onChange={(e) => toggleDisable(service.id, e.target.value)}
                                    >
                                        <option value="available">Available</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                    <button 
                                        className="bg-red-500 mx-2 text-white p-1 rounded hover:bg-red-600"
                                        onClick={(e) => handleRemoveService(e, service.id)}
                                    >
                                        Remove
                                    </button>
                                    <button 
                                        className="bg-blue-500 px-3 text-white p-1 rounded hover:bg-white hover:text-black"
                                        onClick={(e) => updateEditForm(e, service.id)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No services available.</p>
                )}
            </div>
        </div>
    );
};

export default ManageService;
