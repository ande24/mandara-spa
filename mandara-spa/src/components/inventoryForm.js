"use client"; 

import { useEffect, useState } from "react";
import firebase_app from "@/firebase/config";
import { getFirestore, collection, addDoc, doc, getDoc, deleteDoc, updateDoc, onSnapshot, query, getDocs } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const ManageInv = ({onClose}) => {
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
    const [message, setMessage] = useState(null);

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
        if (userData?.branch_id && branchData) {
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
    }, [branchData, userData?.branch_id]);

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
                    price: itemData.item_price || "", 
                    quantity: itemData.item_quantity || "", 
                });
            }
          }
        };
    
        fetchItemData();
      }, [selectedItem]);

    const handleAddItem = async (e) => {
        e.preventDefault();

        const branchRef = doc(db, "branches", userData.branch_id);
        const itemRef = collection(branchRef, "inventory");

        try {
            const existingItem = items.find(item => item.name.toLowerCase() === formData.name.toLowerCase());

            if (existingItem) {
                alert("Item with the same name already exists")
                return
            }
            
            const docRef = await addDoc(itemRef, {
                item_name: formData.name,
                item_price: formData.price,
                item_quantity: formData.quantity
            });

            setMessage("Item added successfully!");
            setFormData({
                name: "",
                price: "",
                quantity: ""
            });
        } catch (error) {
            setMessage("Error adding item: " + error.message);
        }
    };

    const handleRemoveItem = async (e, itemId) => {
        e.preventDefault();

        const confirmDelete = window.confirm("Are you sure you want to remove this item?");
        if (!confirmDelete) return;

        try {
            const branchRef = doc(db, "branches", userData.branch_id);
            const itemRef = doc(branchRef, "inventory", itemId);
        
            await deleteDoc(itemRef);

            setItems((prevItems) => prevItems.filter(item => item.id !== itemId));

            setMessage("Item removed successfully!");
        } catch (error) {
            setMessage("Error adding item: " + error.message);
        }
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
        <div className="flex justify-center items-center ">
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-bray-300 bg-opacity-50">
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
                                        type="submit" 
                                        className="w-full p-3 rounded-lg text-white font-semibold transition bg-green-400 border border-green-600 hover:bg-green-600"
                                    >
                                        Add Item
                                    </button>
                                    <button 
                                        onClick={handleEditItem} 
                                        disabled={saving} 
                                        className={`w-full p-3 rounded-lg text-white font-semibold transition ${
                                            saving ? "bg-gray-400 cursor-not-allowed" : "bg-orange-300 border border-orange-500 hover:bg-orange-500"
                                        }`}
                                    >
                                        Edit Item
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
                                                    className=" text-white p-2 rounded-lg font font-semibold bg-red-400 border border-red-600 hover:bg-red-600"
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



                {/* <div className="bg-white flex justify-center items-center shadow-lg rounded-lg">
                    <div className="flex flex-col justify-center rounded-lg items-center px-10 py-5 bg-white w-125">
                        <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg h-25">
                            <h2 className="text-xl font-bold mb-4">Choose Item</h2>
                            <form className="flex flex-col space-y-3 w-100">
                                <select className="border p-2 rounded mb-3" name="name" onChange={handleItemChange} value={formData.name || ""}>
                                    <option value="">Select an Item</option>
                                    {items.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                    ))}
                                </select>
                            </form>
                        </div>
                        <div className="flex flex-col justify-center items-center mb-5 w-100">
                            <form onSubmit={handleAddItem} className="flex flex-col space-y-3 w-100">
                                <label>Item Name:</label>
                                <input name="name" className="border p-2 rounded" type="text" value={formData.name} onChange={handleChange}  required/>

                                <label>Price (₱):</label>
                                <input name="price" className="border p-2 rounded" type="number" min="1" value={formData.price} onChange={handleChange}  required/>

                                <label>Quantity:</label>
                                <input name="quantity" className="border p-2 rounded" type="number" value={formData.quantity} onChange={handleChange} required/>

                                <div className="flex justify-around items-center my-4">
                                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-40">Add Item</button>
                                    <button onClick={handleEditItem} disabled={saving} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-40">Edit Item</button>
                                </div>
                                <div className="flex justify-center items-center my-4">
                                    <button onClick={() => {onClose()}} className="bg-red-500 text-white p-2 rounded hover:bg-blue-red w-40">Close</button>
                                </div>
                            </form>
                        </div>
                        
                    </div>

                    

                    <div className="flex flex-col justify-baseline items-center my-6 p-4 bg-white rounded-lg m-2 mr-7 max-w-150 max-h-180">
                        <h3 className="text-lg font-bold">Item List</h3>
                        {items.length > 0 ? (
                            <ul className="flex flex-col space-y-2 max-h-160 overflow-y-auto m-2 rounded p-2 max-w-150">
                                {items.map(item => (
                                    <li key={item.id} className={"flex justify-between items-center border-b p-2 rounded min-w-125"}>
                                        <div className="flex flex-col">
                                            <p>{item.name}</p>
                                            <p>{item.quantity} units</p>
                                            <p>₱{item.price} / unit</p>
                                        </div>
                                        <div className="flex">
                                            <button 
                                                className="bg-red-500 mx-2 text-white p-1 rounded hover:bg-red-600"
                                                onClick={(e) => handleRemoveItem(e, item.id)}
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
                </div> */}
            </div>
        </div>
    );
};

export default ManageInv;
