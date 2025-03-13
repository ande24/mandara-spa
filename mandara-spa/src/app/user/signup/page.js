'use client'
import React, { useState } from "react";
import signUp from "@/firebase/auth/signup";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";

function SignIn() {
    const db = getFirestore(firebase_app)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [number, setNumber] = useState ('')
    const [showVerify, setShowVerify] = useState(false)
    const [error, setError] = useState('');

    const handleForm = async (event) => {
        event.preventDefault()

        if (String(number).length !== 11) {
            return setError('Please provide an 11-digit mobile number.');
        }

        const { res, err } = await signUp(email, password);

        if (err) {
            return setError(err)
        }
        
        try {
            await setDoc(doc(db, "users", res.user.uid), {
                role: "customer",
                name: name, 
                number: number,
                email: email,
            });
    
            console.log(res)

            setShowVerify(true)

        } catch (dbError) {
            setError(dbError.message);
        }
    }
    return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
        <div className="flex flex-col items-center justify-center rounded-3xl p-5 bg-yellow-100">
            <h1 className="text-xl font-bold">Sign Up</h1>
            <form className="form my-3 flex-col flex" onSubmit={handleForm}>
                <label htmlFor="name">
                    <p>Full Name</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setName(e.target.value)} required type="text" name="name" id="name"/>
                </label>
                <label htmlFor="email">
                    <p>Email</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email"/>
                </label>
                <label htmlFor="number">
                    <p>Phone Number</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setNumber(e.target.value)} required type="tel" name="number" id="number"/>
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password"  />
                </label>
                <button className="m-1 hover:underline" type="submit">Sign Up</button>
            </form>
        </div>
        {error && <p className="text-red-500">{error.message || error}</p>}
        {showVerify && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Almost there!</h2>
                    <p>Please check your email and click the link to verify your email, then log into your account.</p>
                </div>
            </div>
        )}
    </div>
    );
}

export default SignIn;