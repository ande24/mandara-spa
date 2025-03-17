"use client";

import firebase_app from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import EditAdmins from "@/components/adminForm";
import BranchSelect from "@/components/selectBranchForm";
import { useRouter } from "next/navigation";
import Image from "next/image";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

export default function BusinessAdminPage() {
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
        <div className="fixed h-screen w-screen z-0 inset-0 flex items-center justify-center bg-[#301414] bg-opacity-50 p-4">
            <div className="fixed flex justify-center w-screen h-50 z-0 inset-0 top-0 bg-[#502424]">
                <Image className="fixed top-[-60]" src={"/images/mandara_mtn.png"} width={400} height={400} alt={"The Mandara Spa Logo"} />
            </div>
            {user && userData && isBusinessAdmin ? (
                <div className="mt-10 flex min-h-40 flex-col justify-around items-center">
                    <h1 className="text-[#e0d8ad] mb-3 font-semibold text-5xl">Welcome,</h1>
                    <h2 className="text-[#e0d8ad] font-semibold text-2xl">{user.email}</h2>
                    <div className="flex mt-20 min-w-lg justify-around">
                        <button className="bg-[#e0d8ad] p-2 mx-5 w-70 rounded-lg text-xl font-semibold" onClick={() => {setShowManageAdmin(true)}}>Manage Branch Admins</button>
                        <button className="bg-[#e0d8ad] p-2 mx-5 w-70 rounded-lg text-xl font-semibold" onClick={() => {setShowViewBranch(true)}}>Manage Branches</button>
                    </div>
                </div>
            ) : (
                <p></p>
            )}

            {showManageAdmin && (<EditAdmins onClose={() => setShowManageAdmin(false)} />)}
            {showViewBranch && <BranchSelect onClose={() => setShowViewBranch(false)} />}
        </div>
    );
}