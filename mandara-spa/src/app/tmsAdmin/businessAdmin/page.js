"use client";

import firebase_app from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import EditAdmins from "@/components/adminForm";
import BranchSelect from "@/components/selectBranchForm";
import { useRouter } from "next/navigation";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

export default function () {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showManageAdmin, setShowManageAdmin] = useState(false);
    const [showViewBranch, setShowViewBranch] = useState(false);
    const [isBusinessAdmin, setIsBusinessAdmin] = useState(false);

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
      if (userData) {
        if (userData.user_role !== "business_admin") {
          return router.push("/tmsAdmin");
        }
        else {
          setIsBusinessAdmin(true)
        }
      }
    }, [userData]);

    return (
        <div className="flex h-screen justify-center items-center">
            {user && userData && isBusinessAdmin ? (
                <div className="flex flex-col justify-center items-center">
                    <h2>Welcome, {user.email}</h2>
                    <button className="text-red-500 my-4" onClick={() => {setShowManageAdmin(true)}}>Add/Remove Branch Admins</button>
                    <button className="text-red-500 my-4" onClick={() => {setShowViewBranch(true)}}>Manage Branches</button>
                </div>
            ) : (
                <p>Loading or No User Logged In...</p>
            )}

            {showManageAdmin && (<EditAdmins onClose={() => setShowManageAdmin(false)} />)}
            {showViewBranch && <BranchSelect onClose={() => setShowViewBranch(false)} />}
        </div>
    );
}