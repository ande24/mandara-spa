'use client'
import React, { useState } from "react";
import signUp from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation'

function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [number, setNumber] = useState ('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error)
        }

        const docRef = await addDoc(collection(db, "customers"), {
            number: number,
            email: email,
            password: password,
        });
        console.log("Booking successful with ID:", docRef.id);

        console.log(result)
        return router.push("/home")
    }
    return (<div className="flex justify-center">
        <div className="flex flex-col items-center justify-center border-2">
            <h1 className="mt-60 mb-30">Sign Up</h1>
            <form onSubmit={handleForm} className="form">
                <label htmlFor="number">
                    <p>Phone Number</p>
                    <input onChange={(e) => setNumber(e.target.value)} required type="tel" name="number" id="number" />
                </label>
                <label htmlFor="email">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email"/>
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password"/>
                </label>
                <button type="submit">Sign Up</button>
            </form>
        </div>

    </div>);
}

export default SignIn;