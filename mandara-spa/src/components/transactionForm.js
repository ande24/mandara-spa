"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, doc, getDocs, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const ManageInv = ({onClose, bookingData}) => {
    const auth = getAuth(firebase_app)
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
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        console.log("DATA", bookingData)

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
        if (userData?.branch_id && branchData) {
            const fetchItems = async () => {
                try {
                    const branchRef = doc(db, "branches", userData.branch_id);
                    const itemCollection = collection(branchRef, "inventory");
                    const itemSnapshot = await getDocs(itemCollection);
                    const itemList = itemSnapshot.docs
                        .filter(doc => doc.id !== "placeholder")
                        .map(doc => ({
                            id: doc.id,
                            name: doc.data().item_name,
                            quantity: doc.data().item_quantity,
                            price: doc.data().item_price
                        }));
    
                    console.log("items: ", itemList);
                    setItems(itemList);
                } catch (error) {
                    console.error("Error fetching images:", error);
                }
            };
            fetchItems();
        }
    }, [branchData]);

    useEffect(() => {
        const fetchItemData = async () => {
          if (selectedItem) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const docRef = doc(branchRef, "inventory", selectedItem);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const itemData = docSnap.data();
                setFormData({
                    name: itemData.item_name || "",  
                });
            }
          }
        };
    
        fetchItemData();
      }, [selectedItem]);

    const handleAddItem = async (e) => {
        e.preventDefault();

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

                console.log("new item", newItem)

                usedItems.push(newItem);
            }

            setMessage("Item added successfully!");
            setFormData({
                name: "",
                quantity: ""
            });
        } catch (error) {
            setMessage("Error adding item: " + error.message);
        }
    };

    const handleRemoveItem = async (e, itemId) => {
        e.preventDefault();

        try {
            setUsedItems(prevItems => prevItems.filter(item => item.id !== itemId));

            setMessage("Item removed successfully!");
        } catch (error) {
            setMessage("Error adding item: " + error.message);
        }
    };

    const handleSubmitTransaction = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            
            for (const usedItem of usedItems) {
                const itemRef = doc(branchRef, "inventory", usedItem.id);
                const itemSnap = await getDoc(itemRef);

                if (itemSnap.exists()) {
                    const currentQuantity = itemSnap.data().item_quantity;
                    const newQuantity = Math.max(0, currentQuantity - usedItem.quantity);

                    await updateDoc(itemRef, {
                        item_quantity: newQuantity
                    });
                }

                setItems(prevItems => 
                    prevItems.map(item => 
                        item.id === selectedItem ? 
                            { ...item, name: formData.name, price: formData.price, quantity: formData.quantity} : item
                    )
                );
            }

            const userSnap = await getDoc(doc(db, "users", bookingData.customer_id))
            const serviceSnap = await getDoc(doc(branchRef, "services", bookingData.service_id))

            const income = Number(bookingData.no_of_customers) * Number(serviceSnap.data().service_price)
            const cost = usedItems 
            ? usedItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0) 
            : 0;
            const rev = income - cost

            const transactionsRef = collection(branchRef, "transactions");

            await addDoc(transactionsRef, {
                bookingId: bookingData.id,
                customerId: bookingData.customer_id,
                customerName: userSnap.data()?.user_name,
                items_used: usedItems,
                net_revenue: rev,
                service_income: income,
                service_cost: cost,
                no_of_customers: bookingData.no_of_customers,
            });

            setSaving(false);
            setFormData({
                name: "",
                quantity: "",
            });

            setUsedItems([])

            onClose();
        } catch (error) {
            setMessage("Error updating item: " + error.message);
            alert(error.message);
            setSaving(false);
        }
    };

    const handleItemChange = async (e) => {
        const selectedId = e.target.value;
        const selectedItemData = items.find(item => item.id === selectedId);
    
        if (selectedItemData) {
            setSelectedItem(selectedId);
            setItemData(selectedItemData);
            setFormData({
                name: selectedItemData.name || "",
                quantity: "",
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

    return (
        <div className="flex justify-center items-center ">
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-300 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl w-full max-h-[90vh] overflow-y-auto">
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
                                        value={""}
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
                                        type="submit" 
                                        className="w-full p-3 rounded-lg text-white font-semibold transition bg-blue-400 border border-blue-600 hover:bg-blue-600"
                                    >
                                        Add Item
                                    </button>
                                    <button 
                                        onClick={handleSubmitTransaction} 
                                        disabled={saving} 
                                        className={`w-full p-3 rounded-lg text-white font-semibold transition ${
                                            saving ? "bg-gray-400 cursor-not-allowed" : "bg-green-400 border border-green-600 hover:bg-green-600"
                                        }`}
                                    >
                                        Submit List
                                    </button>
                                </div>

                                <button 
                                    onClick={() => onClose()} 
                                    className="w-full p-3 rounded-lg text-white font-semibold bg-red-400 border border-red-600 hover:bg-red-600"
                                >
                                    Close
                                </button>
                            </form>
                        </div>

                        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Item List</h3>
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
                                                    className="bg-red-400 border border-red-600 text-white p-2 rounded-lg font font-semibold hover:bg-red-600"
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
