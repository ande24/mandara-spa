"use client";

import { useEffect, useState, useCallback } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, doc, onSnapshot, updateDoc, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ManageInv = ({ onClose, onReset, bookingData }) => {
    const auth = getAuth(firebase_app);
    const db = getFirestore(firebase_app);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
    });

    const [items, setItems] = useState([]);
    const [usedItems, setUsedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        console.log(bookingData);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth, bookingData]);

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    console.log("user: ", docSnap.data());
                    setUserData(docSnap.data());
                } else {
                    console.log("No user data found in Firestore");
                    setUserData(null);
                }
            }, (error) => {
                console.error("Error fetching user data:", error);
            });

            return () => unsubscribe();
        }
    }, [user, db]);

    useEffect(() => {
        if (userData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const unsubscribe = onSnapshot(branchRef, (docSnap) => {
                if (docSnap.exists()) {
                    setBranchData(docSnap.data());
                } else {
                    console.log("No branch data found");
                    setBranchData(null);
                }
            }, (error) => {
                console.error("Error fetching branch data:", error);
            });

            return () => unsubscribe();
        }
    }, [userData, db]);

    useEffect(() => {
        if (branchData && userData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const itemCollection = collection(branchRef, "inventory");
            const unsubscribe = onSnapshot(itemCollection, (snapshot) => {
                const itemList = snapshot.docs
                    .filter(doc => doc.id !== "placeholder")
                    .map(doc => ({
                        id: doc.id,
                        name: doc.data().item_name,
                        quantity: doc.data().item_quantity,
                        price: doc.data().item_price
                    }));

                setItems(itemList);
            }, (error) => {
                console.error("Error fetching items:", error);
            });
            return () => unsubscribe();
        }
    }, [branchData, db, userData]);

    useEffect(() => {
        if (selectedItem && userData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const docRef = doc(branchRef, "inventory", selectedItem);
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const itemData = docSnap.data();
                    setFormData({
                        name: itemData.item_name || "",
                    });
                }
            }, (error) => {
                console.error("Error fetching item data:", error);
            });
            return () => unsubscribe();
        }
    }, [selectedItem, db, userData]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        setSaving(true);

        const selectedItemData = items.find(item => item.id === selectedItem);

        try {
            const existingItem = usedItems.find(item => item.id === selectedItemData.id);

            if (existingItem) {
                existingItem.quantity += parseInt(formData.quantity, 10);
            } else {

                const newItem = {
                    id: selectedItemData.id,
                    name: selectedItemData.name,
                    quantity: parseInt(formData.quantity, 10),
                    price: selectedItemData.price
                };

                setUsedItems(prevItems => [...prevItems, newItem]);
            }

            alert("Item added successfully!");
            setFormData({
                name: "",
                quantity: ""
            });
        } catch (error) {
            alert("Error adding item: " + error.message);
        }
        setSaving(false);
    };

    const handleRemoveItem = async (e, itemId) => {
        e.preventDefault();
        setSaving(true);

        try {
            setUsedItems(prevItems => prevItems.filter(item => item.id !== itemId));

            alert("Item removed successfully!");
        } catch (error) {
            alert("Error adding item: " + error.message);
        }
        setSaving(false);
    };

    const handleSubmitTransaction = async (e) => {
        e.preventDefault();
        setSaving(true);

        if (usedItems.length === 0) {
            const proceed = window.confirm("No items are used for this transaction. Do you want to proceed?");
            if (!proceed) {
                setSaving(false);
                return;
            }
        }

        try {
            const branchRef = doc(db, "branches", userData.branch_id);

            for (const usedItem of usedItems) {
                const itemRef = doc(branchRef, "inventory", usedItem.id);
                // Get current quantity using getDoc
                const itemSnap = await getDoc(itemRef);

                if (itemSnap.exists()) {
                    const currentQuantity = itemSnap.data().item_quantity;
                    console.log(itemSnap.data());
                    if (currentQuantity === 0) {
                        alert(`Item "${itemSnap.data().item_name}" is already out of stock.`);
                        setSaving(false);
                        return;
                    } else if (currentQuantity < usedItem.quantity) {
                        alert(`Item "${itemSnap.data().item_name}" has insufficient stock.`);
                        setSaving(false);
                        return;
                    }
                    const newQuantity = Math.max(0, currentQuantity - usedItem.quantity);

                    await updateDoc(itemRef, {
                        item_quantity: newQuantity
                    });
                }
            }

            const income = bookingData.total;

            const transactionsRef = collection(branchRef, "transactions");

            await addDoc(transactionsRef, {
                bookingId: bookingData.id,
                customerId: bookingData.customer_id,
                items_used: usedItems,
                service_income: income,
                transaction_date: bookingData.booked_date,
                no_of_customers: bookingData.no_of_customers,
            });

            setSaving(false);
            setFormData({
                name: "",
                quantity: "",
            });

            setUsedItems([]);

            alert("Transaction completed successfully! Check transaction list for details.");
            onClose();
        } catch (error) {
            alert("Error updating item: " + error.message);
            setSaving(false);
        }
    };

    const handleItemChange = useCallback(async (e) => {
        const selectedId = e.target.value;
        setSelectedItem(selectedId);
    }, [setSelectedItem]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="flex justify-center items-center ">
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#301414] bg-opacity-50">
                <div className="bg-white mt-20 p-6 rounded-lg shadow-md max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Log Items Used</h2>

                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg ">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Choose Item</h3>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold">Select an Item:</label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="dropdown"
                                        onChange={handleItemChange}
                                        value={selectedItem || ""}
                                    >
                                        <option value="">Select an Item</option>
                                        {items.map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold">Item:</label>
                                    <input
                                        name="name"
                                        className="w-full p-3 mb-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        value={formData.name || ""}
                                        onChange={handleChange}
                                        required
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1 font-semibold">Quantity:</label>
                                    <input
                                        name="quantity"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="number"
                                        value={formData.quantity || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="flex justify-between space-x-4">
                                    <button
                                        disabled={saving}
                                        type="submit"
                                        className="w-full p-3 rounded-lg text-white font-serif transition bg-[#502424]  hover:bg-[#301414]"
                                    >
                                        Add Item
                                    </button>
                                    <button
                                        onClick={handleSubmitTransaction}
                                        disabled={saving}
                                        className={`w-full p-3 rounded-lg text-white font-serif transition ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-[#502424]  hover:bg-[#301414]"
                                            }`}
                                    >
                                        Update Inventory
                                    </button>
                                </div>

                                <button
                                    onClick={() => onReset()}
                                    className="w-full p-3 rounded-lg text-white font-serif bg-[#502424]  hover:bg-[#301414]"
                                >
                                    Close
                                </button>
                            </form>
                        </div>

                        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Items Used</h3>
                            <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded-lg p-4">
                                {usedItems.length > 0 ? (
                                    <ul className="space-y-2">
                                        {usedItems.map(item => (
                                            <li key={item.id} className="flex justify-between items-center border border-gray-400 p-3 rounded bg-gray-200">
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p>{item.quantity} units</p>
                                                </div>
                                                <button
                                                    disabled={saving}
                                                    className="bg-[#502424]  text-white p-2 rounded-lg font font-serif hover:bg-[#301414]"
                                                    onClick={(e) => handleRemoveItem(e, item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-center">No items available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageInv;
