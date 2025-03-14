"use client";

import EditBranch from "@/components/editBranchForm";
import firebase_app from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

export default function () {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [showEdit, setShowEdit] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
                setUserData(null);
            }
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
                    setBranchData(branchSnap.data());
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

    return (
        <div className="flex h-screen justify-center items-center">
            {user ? (
                <div className="flex flex-col justify-center items-center">
                    <h2>Welcome, {user.displayName || "User"}</h2>
                    <p>Email: {user.email}</p>
                    <p>User ID: {user.uid}</p>
                    {userData && (
                        <div>
                            <h3>Branch Details from Firestore:</h3>
                            <pre>{JSON.stringify(branchData, null, 2)}</pre>
                        </div>
                    )}
                    <button className="text-red-500 my-4" onClick={() => {setShowEdit(true)}}>Edit branch details</button>
                    <button className="text-red-500 my-4" onClick={() => {router.push("/tmsAdmin/branchAdmin/manageService")}}>Add/Remove branch services</button>
                </div>
            ) : (
                <p>Loading or No User Logged In...</p>
            )}

            {showEdit && <EditBranch onClose={() => setShowEdit(false)} />}
        </div>
    );
}