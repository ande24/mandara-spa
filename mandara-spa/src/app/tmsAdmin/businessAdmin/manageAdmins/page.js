"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, arrayUnion, updateDoc, arrayRemove, deleteDoc, } from "firebase/firestore";
import signUp from "@/firebase/auth/signup";

const AddBranchAdmin = () => {
    const db = getFirestore(firebase_app);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [message, setMessage] = useState("");

    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [branchAdmins, setBranchAdmins] = useState([]);

    useEffect(() => {
        const fetchBranches = async () => {
            const branchCollection = collection(db, "branches");
            const branchSnapshot = await getDocs(branchCollection);
            const branchList = branchSnapshot.docs
            .filter(doc => doc.id !== "schema")
            .map(doc => ({
                id: doc.id,
                name: doc.data().branch_location
            }));
            console.log(branchList);
            setBranches(branchList);
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        const fetchBranchAdmins = async () => {
            if (!selectedBranch) {
                return;
            }

            try {
                const branchDoc = await getDoc(doc(db, "branches", selectedBranch.id));
                let adminDetails = [];

                if (branchDoc.exists()) {
                    const branchData = branchDoc.data();
                    console.log("Branch Data:", branchData);
                    console.log("Branch admins: ", branchData.branch_admins)

                    adminDetails = await Promise.all(
                        (branchData.branch_admins ?? []).map(async (adminId) => {
                            const adminDoc = await getDoc(doc(db, "users", adminId));
                            if (adminDoc.exists()) {
                                return { uid: adminDoc.id, email: adminDoc.data().user_email };
                            }
                            return null;
                        })
                    );

                    console.log("Admin Details:", adminDetails);
                }

                setBranchAdmins(adminDetails.filter(admin => admin !== null)); 

            } catch (error) {
                console.error("Error fetching branch admins:", error);
            };
        };
    
        fetchBranchAdmins();
    }, [selectedBranch]);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (!selectedBranch) {
            setMessage("Please select a branch.");
            return;
        }

        try {
            const { res, err } = await signUp(adminEmail, adminPassword);
            
            if (err) {
                return setMessage("Error adding admin: " + err.message)
            }

            await setDoc(doc(db, "users", res.user.uid), {
                branch_id: selectedBranch.id,
                user_email: adminEmail,
                user_role: "branch_admin",
                branch_location: selectedBranch.name
            });

            const branchRef = doc(db, "branches", selectedBranch.id);
            await updateDoc(branchRef, {
                branch_admins: arrayUnion(res.user.uid)
            });

            setMessage("Branch admin added successfully!");
            setAdminEmail("");
            setAdminPassword("");
            setSelectedBranch(null);
        } catch (error) {
            setMessage("Error adding admin: " + error.message);
        }
    };

    const handleRemoveAdmin = async () => {
        if (!selectedBranch || !selectedAdmin) {
            setMessage("Please select a branch and an admin to remove.");
            return;
        }
    
        try {
            const branchRef = doc(db, "branches", selectedBranch.id);
            
            await updateDoc(branchRef, {
                branch_admins: arrayRemove(selectedAdmin)
            });

            console.log("removed from list")
            
            await updateDoc(doc(db, "users", selectedAdmin), {
                user_role: "customer",
                branch_location: null,
                branch_id: null
            });

            console.log("role changed")
    
            setMessage("Branch admin removed successfully!");
            setSelectedAdmin(null);
            setBranchAdmins(branchAdmins.filter(admin => admin !== selectedAdmin));
        } catch (error) {
            setMessage("Error removing admin: " + error.message);
        }
    };
    

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">Add Branch Admin</h2>
                {message  && <p className="mb-2 text-green-500">{message}</p>}
                <form onSubmit={handleAddAdmin} className="flex flex-col space-y-3">
                    <label>Select Branch:</label>
                    <select 
                        className="border p-2 rounded"
                        value={selectedBranch ? selectedBranch.id : ""}
                        onChange={(e) => {
                            const branch = branches.find(b => b.id === e.target.value);
                            setSelectedBranch(branch);
                        }}
                    >
                        <option value="">-- Choose Branch --</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>

                    <label>Email:</label>
                    <input className="border p-2 rounded" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />

                    <label>Password:</label>
                    <input className="border p-2 rounded" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Branch Admin</button>
                </form>
            </div>
            <div className="flex flex-col p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
                <label>Select Admin to Remove:</label>
                <label>Select Branch:</label>
                <select 
                    className="border p-2 rounded"
                    value={selectedBranch ? selectedBranch.id : ""}
                    onChange={(e) => {
                        const branch = branches.find(b => b.id === e.target.value);
                        setSelectedBranch(branch);
                    }}
                >
                    <option value="">-- Choose Branch --</option>
                    {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                </select>

                <label>Select Admin to Remove:</label>
                <select 
                    className="border p-2 rounded"
                    value={selectedAdmin || ""}
                    onChange={(e) => setSelectedAdmin(e.target.value)}
                >
                    <option value="">-- Choose Admin --</option>
                    {branchAdmins.map(admin => (
                        <option key={admin.uid} value={admin.uid}>{admin.email}</option>
                    ))}
                </select>

                <button 
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    onClick={handleRemoveAdmin}
                >
                    Remove Branch Admin
                </button>
            </div>
        </div>
    );
};

export default AddBranchAdmin;
