"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, setDoc, doc, onSnapshot, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";
import { useRouter } from "next/navigation";
import SignUp from "@/firebase/auth/signup";

const Image = dynamic(() => import("next/image"), { ssr: false });

const EditAdmins = () => {
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
        const unsubscribe = onSnapshot(collection(db, "branches"), (snapshot) => {
            const branchList = snapshot.docs
                .filter(doc => doc.id !== "schema")
                .map(doc => ({
                    id: doc.id,
                    name: doc.data().branch_location
                }));
            console.log("Branches updated:", branchList);
            setBranches(branchList);
        });

        return () => unsubscribe();
    }, [db]);

    useEffect(() => {
        if (!selectedBranch) {
            setBranchAdmins([]);
            return;
        }

        const branchRef = doc(db, "branches", selectedBranch.id);
        const unsubscribe = onSnapshot(branchRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const branchData = docSnapshot.data();
                const adminIds = branchData.branch_admins || [];

                // Fetch admin details in parallel
                Promise.all(
                    adminIds.map(async (adminId) => {
                        const adminRef = doc(db, "users", adminId);
                        return new Promise((resolve) => {
                            onSnapshot(adminRef, (adminDoc) => {
                                if (adminDoc.exists()) {
                                    resolve({ uid: adminDoc.id, email: adminDoc.data().user_email });
                                } else {
                                    resolve(null);
                                }
                            });
                        });
                    })
                ).then((adminDetails) => {
                    const validAdmins = adminDetails.filter(admin => admin !== null);
                    console.log("Branch admins updated:", validAdmins);
                    setBranchAdmins(validAdmins);
                });
            } else {
                console.log("Branch not found");
                setBranchAdmins([]);
            }
        });

        return () => unsubscribe();
    }, [selectedBranch, db]);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setSaving(true);
        if (!selectedBranch) {
            alert("Please select a branch.");
            setSaving(false);
            return;
        }

        // Show alert and confirmation before creating the account
        const proceed = window.confirm("After creating this account, the user will be logged out. Continue?");
        if (!proceed) {
            setSaving(false);
            return;
        }

        try {
            // Check if user with this email already exists
            const usersRef = collection(db, "users");
            let existingUser = null;
            let existingUserId = null;
            const unsubscribe = onSnapshot(usersRef, (snapshot) => {
                unsubscribe(); // Only need one fetch
                snapshot.forEach((docu) => {
                    const data = docu.data();
                    if (data.user_email === adminEmail) {
                        existingUser = data;
                        existingUserId = docu.id;
                    }
                });
            });
            // Wait for snapshot to finish
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (existingUser) {
                if (existingUser.user_role === "customer") {
                    // Update their branch_id and branch_location, and promote to branch_admin
                    await updateDoc(doc(db, "users", existingUserId), {
                        branch_id: selectedBranch.id,
                        branch_location: selectedBranch.name,
                        user_role: "branch_admin"
                    });
                    // Add to branch_admins array
                    const branchRef = doc(db, "branches", selectedBranch.id);
                    await updateDoc(branchRef, {
                        branch_admins: arrayUnion(existingUserId)
                    });
                    alert(`Account ${existingUser.user_email} promoted to branch admin for branch: ${selectedBranch.name}`);
                    setAdminEmail("");
                    setAdminPassword("");
                    setSaving(false);
                    return;
                } else if (existingUser.user_role === "branch_admin") {
                    // Check if already admin of this branch
                    if (existingUser.branch_id === selectedBranch.id) {
                        alert("This user is already an admin of this branch.");
                        setSaving(false);
                        return;
                    }
                    // Confirm transfer
                    const proceed = window.confirm(`This user is already a branch admin of another branch: ${existingUser.branch_location}. If you proceed, they will no longer be an admin of that branch. Continue?`);
                    if (!proceed) {
                        setSaving(false);
                        return;
                    }
                    // Remove from old branch's branch_admins
                    const oldBranchRef = doc(db, "branches", existingUser.branch_id);
                    await updateDoc(oldBranchRef, {
                        branch_admins: arrayRemove(existingUserId)
                    });
                    // Update user to new branch
                    await updateDoc(doc(db, "users", existingUserId), {
                        branch_id: selectedBranch.id,
                        branch_location: selectedBranch.name
                    });
                    // Add to new branch's branch_admins
                    const branchRef = doc(db, "branches", selectedBranch.id);
                    await updateDoc(branchRef, {
                        branch_admins: arrayUnion(existingUserId)
                    });
                    alert(`Admin ${existingUser.user_email} transferred to this branch!`);
                    setAdminEmail("");
                    setAdminPassword("");
                    setSaving(false);
                    return;
                }
            }

            if (!adminPassword) {
                alert("Please provide a password for the new admin.");
                setSaving(false);
                return;
            }

            // If new admin, sign up and add to branch
            const { res, err } = await SignUp(adminEmail, adminPassword);

            if (err) {
                setSaving(false);
                return alert("Error adding admin: " + err.message);
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

            alert("Branch admin added successfully! You will now be logged out.");
            setAdminEmail("");
            setAdminPassword("");
            setSaving(false);
            // Log out and redirect
            if (typeof window !== "undefined") {
                const auth = (await import("firebase/auth")).getAuth(firebase_app);
                await auth.signOut();
                window.location.href = "/tmsAdmin";
            }
            return;
        } catch (error) {
            setSaving(false);
            alert("Error adding admin: " + error.message);
        }
    };

    const handleRemoveAdmin = async () => {
        if (!selectedBranch || !selectedAdmin) {
            alert("Please select a branch and an admin to remove.");
            return;
        }

        setSaving(true);

        const confirmDelete = window.confirm("Are you sure you want to remove this admin?");
        if (!confirmDelete) return;

        try {
            const branchRef = doc(db, "branches", selectedBranch.id);

            await updateDoc(branchRef, {
                branch_admins: arrayRemove(selectedAdmin)
            });

            await updateDoc(doc(db, "users", selectedAdmin), {
                user_role: "customer",
                branch_location: null,
                branch_id: null
            });

            alert("Branch admin removed successfully!");
            setBranchAdmins(prevAdmins => prevAdmins.filter(admin => admin.uid !== selectedAdmin));
            setSelectedAdmin(null);
        } catch (error) {
            alert("Error removing admin: " + error.message);
        }
        setSaving(false);
    };

    const handleBranchChange = useCallback((e) => {
        const branch = branches.find(b => b.id === e.target.value);
        setSelectedBranch(branch);
    }, [branches]);

    const handleAdminSelect = useCallback((e) => {
        setSelectedAdmin(e.target.value);
    }, []);

    return (
        <div className="fixed h-screen w-screen z-0 inset-0 flex items-center justify-center bg-[#301414] bg-opacity-50 p-4">
            <Image priority className="fixed top-30" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />

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
                                    onChange={handleBranchChange}
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

                                <label className="text-sm font-medium text-gray-600">Password (if new account):</label>
                                <input
                                    className="border p-2 rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-red-400"
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
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
                                    onChange={handleBranchChange}
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
                                    onChange={handleAdminSelect}
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
                    onClick={() => { router.push("/tmsAdmin/dashboard") }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default EditAdmins;
