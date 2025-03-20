"use client";

import EditBranch from "@/components/detailsForm";
import firebase_app from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ManageService from "@/components/serviceForm";
import ManageInv from "@/components/inventoryForm";
import ManageBookings from "@/components/bookingList";
import ManageTransactions from "@/components/transactionList";
import Image from "next/image";
import ViewMessages from "@/components/messageList";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

export default function BranchAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showEditBranch, setShowEditBranch] = useState(false);
    const [showEditService, setShowEditService] = useState(false);
    const [showEditItem, setShowEditItem] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [isBusinessAdmin, setIsBusinessAdmin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hideButton, setHideButton] = useState(false);

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
        if (userData) {
            if (userData.user_role === "business_admin") {
                setIsBusinessAdmin(true);
            }
            else {
                setIsBusinessAdmin(false);
            }
        }
    }, [userData])

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
          if (userData.user_role === "customer") {
            return router.push("/tmsAdmin");
          }
          else {
            setIsAdmin(true)
          }
        }
      }, [userData]);

    return (
        <div className="fixed flex-col h-screen w-screen z-0 inset-0 flex items-center justify-center bg-[#301414] bg-opacity-50 p-4">
        <Image className="" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
            {isBusinessAdmin && !hideButton && (<button onClick={() => {router.push("/tmsAdmin/businessAdmin")}}className="fixed top-15 left-15 scale-190 hover:scale-230 transition-all  bg-[#301414] rounded-full text-[#e0d8ad] z-100 p-2">❮</button>)}
            {user && userData && isAdmin && (
                <div className="mt-10 flex min-h-40 flex-col justify-around items-center">
                    <h1 className="text-[#e0d8ad] mb-3 font-semibold text-5xl">Welcome,</h1>
                    <h2 className="text-[#e0d8ad]  text-2xl">{user.email}</h2>
                    <h2 className="text-[#e0d8ad]  text-2xl">{userData.branch_location}</h2>
                    <div className="grid grid-cols-3 gap-4 mt-10 min-w-lg justify-around">
                        <button className="bg-[#e0d8ad] p-2 mx-5 w-70 rounded-lg text-xl" onClick={() => {setShowEditBranch(true); setHideButton(true)}}>Branch</button>
                        <button className="bg-[#e0d8ad] p-2 mx-5 w-70 rounded-lg text-xl" onClick={() => {setShowEditItem(true); setHideButton(true)}}>Inventory</button>
                        <button className="bg-[#e0d8ad] p-2 mx-5 w-70 rounded-lg text-xl" onClick={() => {setShowEditService(true); setHideButton(true)}}>Services</button>
                        <button className="bg-[#e0d8ad] p-2 mx-5 w-70 rounded-lg text-xl" onClick={() => {setShowBooking(true); setHideButton(true)}}>Bookings</button>
                        <button className="bg-[#e0d8ad] p-2 mx-5 w-70 rounded-lg text-xl" onClick={() => {setShowTransactions(true); setHideButton(true)}}>Transactions</button>
                        <button className="bg-[#e0d8ad] p-2 mx-5 w-70 rounded-lg text-xl" onClick={() => {setShowMessages(true); setHideButton(true)}}>Messages</button>
                    </div>
                </div>
            )}

            {showEditBranch && (<EditBranch onClose={() => {setShowEditBranch(false); setHideButton(false)}} />)}
            {showEditService && <ManageService onClose={() => {setShowEditService(false); setHideButton(false)}} />}
            {showEditItem && <ManageInv onClose={() => {setShowEditItem(false); setHideButton(false)}} />}
            {showBooking && <ManageBookings onClose={() => {setShowBooking(false); setHideButton(false)}} />}
            {showTransactions && <ManageTransactions onClose={() => {setShowTransactions(false); setHideButton(false)}} />}
            {showMessages && <ViewMessages onClose={() => {setShowMessages(false); setHideButton(false)}} />}
        </div>
    );
}