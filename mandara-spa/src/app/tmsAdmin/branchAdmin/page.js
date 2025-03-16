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

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

export default function () {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showEditBranch, setShowEditBranch] = useState(false);
    const [showEditService, setShowEditService] = useState(false);
    const [showEditItem, setShowEditItem] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [isBusinessAdmin, setIsBusinessAdmin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

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
        <div className="flex h-screen justify-center items-center">
            {isBusinessAdmin && (<button onClick={() => {router.push("/tmsAdmin/businessAdmin")}}className="fixed top-10 left-10 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Home</button>)}
            {user && userData && isAdmin? (
                <div className="flex flex-col justify-center items-center">
                    <h2>Welcome, {user.email}</h2>
                    <p>Branch: {userData.branch_location}</p>
                    <button className="text-red-500 my-4" onClick={() => {setShowEditBranch(true)}}>Edit branch details</button>
                    <button className="text-red-500 my-4" onClick={() => {setShowEditItem(true)}}>Manage Inventory</button>
                    <button className="text-red-500 my-4" onClick={() => {setShowEditService(true)}}>Edit service details</button>
                    <button className="text-red-500 my-4" onClick={() => {setShowBooking(true)}}>Manage Bookings</button>
                </div>
            ) : (
                <p>Loading or No User Logged In...</p>
            )}

            {showEditBranch && (<EditBranch onClose={() => setShowEditBranch(false)} />)}
            {showEditService && <ManageService onClose={() => setShowEditService(false)} />}
            {showEditItem && <ManageInv onClose={() => setShowEditItem(false)} />}
            {showBooking && <ManageBookings onClose={() => setShowBooking(false)} />}
        </div>
    );
}