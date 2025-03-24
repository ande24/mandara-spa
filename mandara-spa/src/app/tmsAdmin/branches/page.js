"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const BranchSelect = ({ onClose }) => {
    const router = useRouter();
    const auth = getAuth(firebase_app);
    const db = getFirestore(firebase_app);
    const [branches, setBranches] = useState([]);
    const [user, setUser] = useState("");
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [saving, setSaving] = useState(false);
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
        setSaving(true)
        if (!selectedBranch) {
            alert("Please select a branch.");
            setSaving(false)
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
            return router.push("/tmsAdmin/dashboard");
        } catch (error) {
            alert("Error: " + error.message);
        }
        setSaving(false)
    };

    return (
        <div className="fixed h-screen w-screen z-0 inset-0 flex items-center justify-center bg-[#301414] bg-opacity-50 p-4">
                <Image className="fixed top-30" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
        

            <div className="flex flex-col justify-around p-4 z-10 bottom-35 min-w-lg min-h-80 mx-auto bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-bold text-center">View a branch</h2>
                {/* {message  && <p className="mb-2 text-green-500">{message}</p>} */}
                <form onSubmit={directBranch} className="flex flex-col space-y-5">
                    <select 
                        className="border  input-field rounded-lg"
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

                    <button type="submit" className="mandara-btn p-2 py-5">Continue</button>

                    <button 
                                className="mandara-btn p-2 py-5"
                                onClick={() => {router.push("/tmsAdmin/dashboard")}}
                            >
                                Close
                            </button>
                </form>
            </div>
        </div>
    );
};

export default BranchSelect;
