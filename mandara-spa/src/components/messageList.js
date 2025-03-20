"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, onSnapshot, doc, getDocs, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import Image from "next/image";

const ViewMessages = ({onClose}) => {
    const auth = getAuth(firebase_app)
    const db = getFirestore(firebase_app);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);

    const [messages, setMessages] = useState([]);

    const [saving, setSaving] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
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
        if (userData && userData.branch_id) {
            const fetchBranchData = async () => {
                try {
                    const branchRef = doc(db, "branches", userData.branch_id); 
                    const branchSnap = await getDoc(branchRef);
                    if (branchSnap.exists()) {
                        setBranchData(branchSnap.data());
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

    useEffect(() => {
        if (!userData?.branch_id || !branchData) return;

        const messageCollection = collection(db, "messages");

        const unsubscribe = onSnapshot(messageCollection, async (snapshot) => {
            const messageList = await Promise.all(
                snapshot.docs
                    .filter(docu => docu.id !== "schema")
                    .map(async (docu) => {
                        const data = docu.data();

                        return {
                            id: docu.id,
                            name: data.name,
                            email: data.email,
                            number: data.number, 
                            message: data.message
                        };
                    })
            );

            setMessages(messageList);
        });

        return () => unsubscribe();
    }, [userData?.branch_id, !!branchData]);

    const handleRemoveMessage = async (e, messageId) => {
        e.preventDefault();
        setSaving(true)

        const confirmDelete = window.confirm("Are you sure you want to delete this message?");
        if (!confirmDelete) return;

        try {
            const messageRef = doc(db, "messages", messageId);
        
            await deleteDoc(messageRef);

            setMessages((prevMessages) => prevMessages.filter(message => message.id !== messageId));

            alert("Message removed successfully!");
        } catch (error) {
            alert("Error removing message: " + error.message);
        }
        setSaving(false)
    };

    return (
        <div className="flex justify-center items-center ">
            <Image className="fixed top-30 z-50" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#301414] bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl  w-full overflow-y-auto">
                        <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg">
                            <h3 className="text-lg font-bold">Message List</h3>
                            {messages.length > 0 ? (
                                <ul className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto m-2 rounded p-2 w-full">
                                    {messages.map((message) => (
                                        <li 
                                            key={message.id} 
                                            className="flex justify-between items-center border p-3 rounded w-full bg-gray-200 border-gray-400"
                                        >
                                            <div className="flex flex-col">
                                                <p className="font-semibold">From: {message.name}</p>
                                                <p>{message.message}</p>
                                                <p className="text-sm text-gray-600">{message.email} | {message.number}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <button 
                                                    disabled={saving}
                                                    className="bg-[#502424] text-white p-2 font-serif rounded-lg hover:bg-[#301414] mx-2 transition"
                                                    onClick={(e) => handleRemoveMessage(e, message.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No items available.</p>
                            )}
                        </div>
                        <div className="flex justify-center items-center">
                            <button 
                                className="bg-[#502424]  text-white p-3 m-3 mb-6 max-w-xs font-serif w-full hover:bg-[#301414] transition rounded-lg"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default ViewMessages;
