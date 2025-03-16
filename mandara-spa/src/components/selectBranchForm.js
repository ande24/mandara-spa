"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const BranchSelect = ({ onClose }) => {
    const router = useRouter();
    const auth = getAuth(firebase_app);
    const db = getFirestore(firebase_app);
    const [branches, setBranches] = useState([]);
    const [user, setUser] = useState("");
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

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

    const directBranch = async (e) => {
        e.preventDefault();
        if (!selectedBranch) {
            setMessage("Please select a branch.");
            return;
        }

        console.log(user)

        try {
            const userRef = doc(db, "users", user.uid);

            await updateDoc(userRef, {
                branch_id: selectedBranch.id,
                branch_location: selectedBranch.name
            });

            setSelectedBranch(null);
            router.push("/tmsAdmin/branchAdmin");
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-300 bg-opacity-50">
                <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
                    <h2 className="text-xl font-bold mb-4">View a branch</h2>
                    {message  && <p className="mb-2 text-green-500">{message}</p>}
                    <form onSubmit={directBranch} className="flex flex-col space-y-3">
                        <select 
                            className="border p-2 rounded-lg"
                            value={selectedBranch ? selectedBranch.id : ""}
                            onChange={(e) => {
                                const branch = branches.find(b => b.id === e.target.value);
                                setSelectedBranch(branch);
                            }}
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>

                        <button type="submit" className="bg-blue-400 text-white p-2 font-semibold rounded-lg border border-blue-600 hover:bg-blue-600">Continue</button>

                        <button 
                                    className="bg-red-400 text-white p-2 rounded-lg font-semibold  border border-red-600 hover:bg-red-600"
                                    onClick={() => {onClose()}}
                                >
                                    Close
                                </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BranchSelect;
