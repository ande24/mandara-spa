"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, arrayUnion, updateDoc, arrayRemove, } from "firebase/firestore";
import signUp from "@/firebase/auth/signup";
import Image from "next/image";
import { useRouter } from "next/navigation";

const EditAdmins = ({}) => {
    const router = useRouter();
    const db = getFirestore(firebase_app);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [saving, setSaving] = useState(false);

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
                alert("Error fetching branch admins:", error);
            };
        };
    
        fetchBranchAdmins();
    }, [selectedBranch]);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setSaving(true)
        if (!selectedBranch) {
            alert("Please select a branch.");
            setSaving(false)
            return;
        }

        try {
            const { res, err } = await signUp(adminEmail, adminPassword);
            
            if (err) {
                setSaving(false)
                return alert("Error adding admin: " + err.message)
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

            alert("Branch admin added successfully!");
            setAdminEmail("");
            setAdminPassword("");
            setSelectedBranch(null);
            setSaving(false)
        } catch (error) {
            setSaving(false)
            alert("Error adding admin: " + error.message);
        }
    };

    const handleRemoveAdmin = async () => {
        if (!selectedBranch || !selectedAdmin) {
            alert("Please select a branch and an admin to remove.");
            return;
        }

        setSaving(true)

        const confirmDelete = window.confirm("Are you sure you want to remove this admin?");
        if (!confirmDelete) return;
    
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
    
            alert("Branch admin removed successfully!");
            
            setBranchAdmins(branchAdmins.filter(admin => admin !== selectedAdmin));
            setSelectedAdmin(null);
        } catch (error) {
            alert("Error removing admin: " + error.message);
        }
        setSaving(false)
    };
    
    return (
        <div className="fixed h-screen w-screen z-0 inset-0 flex items-center justify-center bg-[#301414] bg-opacity-50 p-4">
           
                <Image className="fixed top-30" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
          

            <div className="fixed flex flex-col justify-center items-center bottom-35 bg-white w-full z-50 max-w-3xl p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-black text-">Manage Branch Admins</h2>

                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-white rounded-lg">
                            <h3 className="text-lg text-black font-semibold mb-3">Add Branch Admin</h3>
                            <form onSubmit={handleAddAdmin} className="flex flex-col space-y-3">
                                <label className="text-sm  font-medium text-gray-600">Select Branch:</label>
                                <select 
                                    className="border  border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-red-400"
                                    value={selectedBranch ? selectedBranch.id : ""}
                                    onChange={(e) => {
                                        const branch = branches.find(b => b.id === e.target.value);
                                        setSelectedBranch(branch);
                                    }}
                                >
                                    <option value="">Choose Branch</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>

                                <label className="text-sm font-medium text-gray-600">Email:</label>
                                <input 
                                    className="border p-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-400" 
                                    type="email" 
                                    value={adminEmail} 
                                    onChange={(e) => setAdminEmail(e.target.value)} 
                                    required 
                                />

                                <label className="text-sm font-medium text-gray-600">Password:</label>
                                <input 
                                    className="border p-2 rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-red-400" 
                                    type="password" 
                                    value={adminPassword} 
                                    onChange={(e) => setAdminPassword(e.target.value)} 
                                    required 
                                />

                                <button 
                                    disabled={saving}
                                    type="submit" 
                                    className={`bg-[#502424] hover:bg-[#301414] w-full text-white p-3 rounded-lg`}
                                >
                                    Add Admin
                                </button>
                            </form>
                        </div>

                        <div className="p-4 bg-white  rounded-lg flex flex-col justify-between">
                            <h3 className="text-lg text-black font-semibold mb-3">Remove Branch Admin</h3>
                            <div className="flex flex-col">
                                <label className="text-sm mb-3 font-medium text-gray-600">Select Branch:</label>
                                <select 
                                    className="border p-2 border-gray-300 rounded-lg bg-whitew-full focus:ring-2 focus:ring-red-400"
                                    value={selectedBranch ? selectedBranch.id : ""}
                                    onChange={(e) => {
                                        const branch = branches.find(b => b.id === e.target.value);
                                        setSelectedBranch(branch);
                                    }}
                                >
                                    <option value="">Choose Branch</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm mb-3 font-medium text-gray-600">Select Admin to Remove:</label>
                                <select 
                                    className="border p-2 rounded-lg border-gray-300 bg-white w-full focus:ring-2 focus:ring-red-400"
                                    value={selectedAdmin || ""}
                                    onChange={(e) => setSelectedAdmin(e.target.value)}
                                >
                                    <option value="">Choose Admin</option>
                                    {branchAdmins.map(admin => (
                                        <option key={admin.uid} value={admin.uid}>{admin.email}</option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                className="w-full p-3 mandara-btn mt-3"
                                onClick={handleRemoveAdmin}
                            >
                                Remove Admin
                            </button>
                        </div>
                    </div>
                </div>
                

                <button 
                    className="w-172 p-3 mt-3 mb-3 mandara-btn"
                    onClick={() => {router.push("/tmsAdmin/dashboard")}}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default EditAdmins;
