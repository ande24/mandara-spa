'use client'
import React, { useState } from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation';
import ForgotPassword from "@/firebase/auth/forgotPassword";

function SignIn() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showChange, setShowChange] = React.useState('')
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter()

    const createAccount = () => {
        return router.push("/user/signup")
    }

    const handleForgot = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        await ForgotPassword(email)

        setShowChange(true)
    }

    const handleForm = async (event) => {
        event.preventDefault();

        const { res, err } = await signIn(email, password);

        if (err) {
            return setError(err);
        }

        setError('')
        setSuccess(true)
        console.log(res);
        setTimeout(() => {return router.push("/user/home")}, 2000);
    }
    return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
        <div className="flex flex-col items-center justify-center rounded-3xl p-5 bg-yellow-100">
            <h1 className="text-xl font-bold">Customer Log in</h1>
            <form className="form mt-3 mb-2 flex flex-col" onSubmit={handleForm}>
                <label htmlFor="email">
                    <p>Email</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email"/>
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password"  />
                </label>
                <button type="submit" className="hover:underline">Log in</button>
            </form>
            <button className="mb-1 hover:underline" onClick={createAccount}>Create an Account</button>
            <button className="m-1 hover:underline text-xs text-blue-500" onClick={handleForgot}>Forgot password?</button>
        </div>
        {error && <p className="text-red-500">{error.message || error}</p>}
        {success && <p className="text-green-500">Login successful!</p>}
        {showChange && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">We sent you a link</h2>
                    <p>Please check your email and click the link to change your password, then log into your account.</p>
                </div>
            </div>
        )}
    </div>);
}

export default SignIn;