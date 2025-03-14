"use client";

import { useState, useEffect } from "react";
import firebase_app from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const EditBranch = ({onClose}) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        branch_address: "",
        branch_desc: "",
        branch_landline: "",
        branch_location: "",
        branch_location_link: "",
        branch_mobile: "",
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
        if (user) {
            const fetchBranchData = async () => {
                try {
                    console.log(userData)
                    const branchRef = doc(db, "branches", userData.branch_id); 
                    const branchSnap = await getDoc(branchRef);
                    if (branchSnap.exists()) {
                        const data = branchSnap.data();
                        setFormData({
                            branch_address: data.branch_address || "",
                            branch_desc: data.branch_desc || "",
                            branch_landline: data.branch_landline || "",
                            branch_location: data.branch_location || "",
                            branch_location_link: data.branch_location_link || "",
                            branch_mobile: data.branch_mobile || "",
                        });
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            await updateDoc(branchRef, formData);
            alert("Branch details updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error updating branch:", error);
            alert("Failed to update branch details.");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return <p className="text-center text-red-500 mt-10">Please log in as an admin.</p>;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Branch Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold">Branch Location:</label>
                            <input
                                disabled
                                type="text"
                                name="branch_location"
                                value={formData.branch_location}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Branch Address:</label>
                            <input
                                type="text"
                                name="branch_address"
                                value={formData.branch_address}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Branch Description:</label>
                            <textarea
                                name="branch_desc"
                                value={formData.branch_desc}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Google Maps Link:</label>
                            <input
                                type="text"
                                name="branch_location_link"
                                value={formData.branch_location_link}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Branch Landline Number:</label>
                            <input
                                type="text"
                                name="branch_landline"
                                value={formData.branch_landline}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Branch Mobile Number:</label>
                            <input
                                type="text"
                                name="branch_mobile"
                                value={formData.branch_mobile}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className={`w-full p-3 rounded-lg text-white font-semibold transition ${
                                saving
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditBranch;