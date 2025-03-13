"use client";

import React, { useState } from "react";
import { getFirestore } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore"; 
import firebase_app from "../firebase/config";
import { getAuth } from 'firebase/auth';

const BookingForm = ({ onClose }) => {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);

    const [formData, setFormData] = useState({
        date: "",
        time: "",
        pax: "", 
        service: "",
        branch: "",
    });

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        
        try {
            const docRef = await addDoc(collection(db, "bookings"), {
                customer_id: auth.currentUser.uid,
                time: formData.time,
                date: formData.date,
                pax: formData.pax,
                service: formData.service,
                branch: formData.branch,
            });
            console.log("Booking successful with ID:", docRef.id);
            
            setShowSuccess(true);
            
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({ pax: "", date: "", time: "", service: "", branch: ""}); 
                onClose();
            }, 2000);
            
            return docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);

            setShowError(true);
            
            setTimeout(() => {
                setShowError(false);
                setFormData({ pax: "", date: "", time: "", service: "", branch: ""}); 
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                    <h2 className="text-2xl font-bold mb-4 text-center">Book an Appointment</h2>

                    <form onSubmit={handleSubmit}>
                        
                        <label>Service</label>
                        <select 
                            name="service" value={formData.service} onChange={handleChange} required
                            className="w-full p-2 mb-4 border rounded"
                        >
                            <option value=""></option>
                            <option value="The Mandara Signature Massage">The Mandara Signature Massage</option>
                            <option value="The Mandara Signature Scrub, Wrap & Massage">The Mandara Signature Scrub, Wrap & Massage</option>
                            <option value="The Mandara Signature Scrub">The Mandara Signature Scrub</option>
                            <option value="The Mandara Signature Scrub and Massage">The Mandara Signature Scrub and Massage</option>
                            <option value="The Mandara Signature Foot Spa and Pedicure">The Mandara Signature Foot Spa and Pedicure</option>
                            <option value="The Mandara Signature Hand Spa and Manicure">The Mandara Signature Hand Spa and Manicure</option>
                            <option value="Ultimate Mandara Experience Scrub + Wrap + Massage + Foot Spa + Facial or Ear Candling">Ultimate Mandara Experience Scrub + Wrap + Massage + Foot Spa + Facial or Ear Candling</option>
                            <option value="Swedish Aromatherapy">Swedish Aromatherapy</option>
                            <option value="Shiatsu Dry Massage">Shiatsu Dry Massage</option>
                            <option value="Combination Aromatherapy">Combination Aromatherapy</option>
                            <option value="Hot Stone Massage">Hot Stone Massage</option>
                            <option value="Four Hands Therapy">Four Hands Therapy</option>
                            <option value="Ventosa Cupping with Hilot">Ventosa Cupping with Hilot</option>
                            <option value="Ventosa with Signature Massage">Ventosa with Signature Massage</option>
                            <option value="The Scrub Ritual">The Scrub Ritual</option>
                            <option value="Body Scrub and Massage">Body Scrub and Massage</option>
                            <option value="Body Scrub, Wrap and Massage">Body Scrub, Wrap and Massage</option>
                            <option value="Hand Spa">Hand Spa</option>
                            <option value="Foot Spa">Foot Spa</option>
                            <option value="Xiamen Foot Massage">Xiamen Foot Massage</option>
                            <option value="Chair Massage">Chair Massage</option>
                            <option value="Nail Care: Green Tea Manicure">Nail Care: Green Tea Manicure</option>
                            <option value="Nail Care: Green Tea Pedicure">Nail Care: Green Tea Pedicure</option>
                            <option value="Nail Care: Gel Manicure">Nail Care: Gel Manicure</option>
                            <option value="Nail Care: Gel Pedicure">Nail Care: Gel Pedicure</option>
                            <option value="Nail Care: Hand Paraffin">Nail Care: Hand Paraffin</option>
                            <option value="Nail Care: Foot Paraffin">Nail Care: Foot Paraffin</option>
                            <option value="Diamond Peel with Machine">Diamond Peel with Machine</option>
                            <option value="Non-Abrasive Diamond Peel">Non-Abrasive Diamond Peel</option>
                            <option value="Collagen Gold Mask">Collagen Gold Mask</option>
                            <option value="Non-Surgical Face Lift">Non-Surgical Face Lift</option>
                            <option value="Ageloc Galvanic Facial Spa">Ageloc Galvanic Facial Spa</option>
                            <option value="Radiance Facial Spa Package">Radiance Facial Spa Package</option>
                            <option value="Organic Honey Wax Services: Upper Lip">Organic Honey Wax Services: Upper Lip</option>
                            <option value="Organic Honey Wax Services: Underarms">Organic Honey Wax Services: Underarms</option>
                            <option value="Organic Honey Wax Services: Half-leg">Organic Honey Wax Services: Half-leg</option>
                            <option value="Organic Honey Wax Services: Full Leg">Organic Honey Wax Services: Full Leg</option>
                            <option value="Organic Honey Wax Services: Bikini">Organic Honey Wax Services: Bikini</option>
                            <option value="Organic Honey Wax Services: Brazilian">Organic Honey Wax Services: Brazilian</option>
                            <option value="Semi-Permanent Eyelash Extension">Semi-Permanent Eyelash Extension</option>
                            <option value="Ear Candling">Ear Candling</option>
                            <option value="Threading Services: Eyebrow">Threading Services: Eyebrow</option>
                            <option value="Threading Services: Upper Lip">Threading Services: Upper Lip</option>
                            <option value="Threading Services: Forehead">Threading Services: Forehead</option>
                            <option value="Threading Services: Cheeks">Threading Services: Cheeks</option>
                            <option value="Threading Services: Underarms">Threading Services: Underarms</option>
                            <option value="Special Offers: On-The-Go Recharge">Special Offers: On-The-Go Recharge</option>
                            <option value="Special Offers: Stress Buster">Special Offers: Stress Buster</option>
                            <option value="Special Offers: Foot Break">Special Offers: Foot Break</option>
                            <option value="Special Offers: Wellness Ritual">Special Offers: Wellness Ritual</option>
                            <option value="Special Offers: Personal Retreat">Special Offers: Personal Retreat</option>
                            <option value="Special Offers: Couple's Retreat">Special Offers: Couple's Retreat</option>
                            <option value="Special Offers: Ultimate Mandara Experience">Special Offers: Ultimate Mandara Experience</option>
                        </select>
                        <label>Number of Customers</label>
                        <input 
                            type="number" name="pax" min="1"
                            value={formData.pax} onChange={handleChange} required
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <label>Date</label>
                        <input 
                            type="date" name="date"
                            value={formData.date} onChange={handleChange} required
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <label>Time</label>
                        <input 
                            type="time" name="time"
                            value={formData.time} onChange={handleChange} required
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <label>Branch</label>
                        <select 
                            name="branch" value={formData.branch} onChange={handleChange} required
                            className="w-full p-2 mb-4 border rounded"
                        >
                            <option value=""></option>
                            <option value="BGC 3rd Avenue">BGC 3rd Avenue</option>
                            <option value="BGC One Serendra">BGC One Serendra</option>
                            <option value="Greenhills">Greenhills</option>
                            <option value="BF Paranaque">BF Paranaque</option>
                            <option value="S Maison">S Maison at Conrad Manila, MOA Complex</option>
                            <option value="Park Inn North Edsa">Park Inn by Radisson, North Edsa</option>
                            <option value="Venice Grand Canal">Venice Grand Canal, Mckinley Hill, Taguig</option>
                            <option value="Park Inn Clark">Park Inn by Radisson, Clark, Pampanga</option>
                            <option value="Tagaytay Hillcrest">Tagaytay Hillcrest</option>
                        </select>

                        <div className="flex justify-between">
                            <button 
                                type="submit"
                                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
                            >
                                Submit Booking
                            </button>
                            <button 
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-bold mb-4 text-green-600">Booking Successful!</h2>
                        <p>We'll send you a confirmation email.</p>
                    </div>
                </div>
            )}

            {showError && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h2>
                        <p>Please try again.</p>
                    </div>
                </div>
            )}          

        </div>
    );
};

export default BookingForm;