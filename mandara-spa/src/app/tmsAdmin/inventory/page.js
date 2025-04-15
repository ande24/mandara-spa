"use client"; 

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, addDoc, doc, getDoc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

const Image = dynamic(() => import("next/image"));

const ManageInv = () => {
    const router = useRouter();
    const auth = getAuth(firebase_app)
    const db = getFirestore(firebase_app);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        quantity: "",
    });

    const [items, setItems] = useState([]);
    const [itemData, setItemData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

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
    }, [user, db]);

    useEffect(() => {
        if (userData) {
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
    }, [userData, db]);

    useEffect(() => {
        if (userData && branchData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const itemCollection = collection(branchRef, "inventory");
    
            const unsubscribe = onSnapshot(itemCollection, (snapshot) => {
                const itemList = snapshot.docs
                    .filter(doc => doc.id !== "placeholder")
                    .map(doc => ({
                        id: doc.id,
                        name: doc.data().item_name,
                        price: doc.data().item_price,
                        quantity: doc.data().item_quantity
                    }));
    
                console.log("Updated items: ", itemList);
                setItems(itemList);
            }, (error) => {
                console.error("Error fetching items:", error);
            });
    
            return () => unsubscribe();
        }
    }, [branchData, userData, db]);

    useEffect(() => {
        const fetchItemData = async () => {
          if (selectedItem && userData) {
            const branchRef = doc(db, "branches", userData.branch_id);
            const docRef = doc(branchRef, "inventory", selectedItem);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const itemData = docSnap.data();
                setFormData({
                    name: itemData.item_name || "",  
                    price: itemData.item_price || "", 
                    quantity: itemData.item_quantity || "", 
                });
            }
          }
        };
    
        fetchItemData();
      }, [selectedItem, db, userData]);

    const handleAddItem = async (e) => {
        setSaving(true)
        e.preventDefault();

        const branchRef = doc(db, "branches", userData.branch_id);
        const itemRef = collection(branchRef, "inventory");

        try {
            const existingItem = items.find(item => item.name.toLowerCase() === formData.name.toLowerCase());

            if (existingItem) {
                alert("Item with the same name already exists")
                setSaving(false)
                return
            }
            
            const docRef = await addDoc(itemRef, {
                item_name: formData.name,
                item_price: formData.price,
                item_quantity: formData.quantity
            });

            setFormData({
                name: "",
                price: "",
                quantity: ""
            });

            alert("Item added successfully!");
        } catch (error) {
            alert("Error adding item: " + error.message);
        }
        setSaving(false)
    };

    const handleRemoveItem = async (e, itemId) => {
        e.preventDefault();

        const confirmDelete = window.confirm("Are you sure you want to remove this item?");
        if (!confirmDelete) return;
        setSaving(true)

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const itemRef = doc(branchRef, "inventory", itemId);
        
            await deleteDoc(itemRef);

            setItems((prevItems) => prevItems.filter(item => item.id !== itemId));

            alert("Item removed successfully!");
        } catch (error) {
            alert("Error adding item: " + error.message);
        }
        setSaving(false)
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const itemRef = doc(branchRef, "inventory", selectedItem);

            const data = {
                item_name: formData.name,
                item_price: formData.price,
                item_quantity: formData.quantity
            }
        
            await updateDoc(itemRef, data);
            alert("Item details updated successfully!");

            setItems(prevItems => 
                prevItems.map(item => 
                    item.id === selectedItem ? 
                        { ...item, name: formData.name, price: formData.price, quantity: formData.quantity} : item
                )
            );
    
            setSaving(false);
            setFormData({
                name: "",
                price: "",
                quantity: "",
            });
        } catch (error) {
            setMessage("Error updating item: " + error.message);
            alert("Failed to update item.");
            setSaving(false);
        }
        setSaving(false)
    };

    const handleItemChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedItem(selectedId);
        setItemData(items.find(item => item.id === selectedId));
    
        if (itemData) {
            setFormData({
                name: itemData.name || "",
                price: itemData.price || "",
                quantity: itemData.quantity || "",
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
        <div className="flex flex-col h-screen justify-center bg-[#301414] items-center">

            <Image priority className="mt-20 z-10" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} /> 
            <div className=" left-0 w-full h-full flex items-center justify-center bg-[#301414] bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Manage Items</h2>

                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg ">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Choose Item</h3>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold">Select an Item:</label>
                                    <select 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        name="name" 
                                        onChange={handleItemChange} 
                                        value={formData.name || ""}
                                    >
                                        <option value="">Select an Item</option>
                                        {items.map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold">Item Name:</label>
                                    <input 
                                        name="name" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        type="text" 
                                        value={formData.name} 
                                        onChange={handleChange}  
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold">Price (₱):</label>
                                    <input 
                                        name="price" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        type="number" 
                                        min="1" 
                                        value={formData.price} 
                                        onChange={handleChange}  
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold">Quantity:</label>
                                    <input 
                                        name="quantity" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        type="number" 
                                        value={formData.quantity} 
                                        onChange={handleChange} 
                                        required
                                    />
                                </div>

                                <div className="flex justify-between space-x-4">
                                    <button 
                                        disabled={saving}
                                        type="submit" 
                                        className="w-full p-3 rounded-lg text-white font-serif transition bg-[#502424] hover:bg-[#301414]"
                                    >
                                        Add Item
                                    </button>
                                    <button 
                                        onClick={handleEditItem} 
                                        disabled={saving} 
                                        className={`w-full p-3 rounded-lg text-white font-serif transition bg-[#502424] hover:bg-[#301414]"
                                        }`}
                                    >
                                        Edit Item
                                    </button>
                                </div>

                                <button 
                                    onClick={() => {router.push("/tmsAdmin/dashboard")}} 
                                    className="w-full p-3 rounded-lg  text-white font-serif bg-[#502424] hover:bg-[#301414]"
                                >
                                    Close
                                </button>
                            </form>
                        </div>

                        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Current Inventory</h3>
                            <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded-lg p-4">
                                {items.length > 0 ? (
                                    <ul className="space-y-2">
                                        {items.map(item => (
                                            <li key={item.id} className="flex justify-between items-center border border-gray-400 p-3 rounded bg-gray-200">
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p>{item.quantity} units</p>
                                                    <p>₱{item.price} / unit</p>
                                                </div>
                                                <button 
                                                    disabled={saving}
                                                    className=" text-white p-2 rounded-lg font font-serif bg-[#502424] hover:bg-[#301414]"
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
