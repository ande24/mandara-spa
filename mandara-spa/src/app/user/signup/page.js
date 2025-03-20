'use client'
import React, { useState } from "react";
import SignUp from "@/firebase/auth/signup";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/error";
import Image from "next/image";
import SuccessMessage from "@/components/success";

function SignUpUser() {
    const db = getFirestore(firebase_app)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [number, setNumber] = useState ('')
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMsg, setSuccessMsg] = useState('');
    const router = useRouter();

    const handleForm = async (event) => {
        event.preventDefault()

        if (String(number).length !== 11) {
            return setError('Please provide an 11-digit mobile number.');
        }

        const { res, err } = await SignUp(email, password);

        if (err) {
            let message = "Signup Failed. Please check your credentials.";

            if (err.code === "auth/invalid-email") {
            message = "Invalid email format. Please check your input.";
            } else if (err.code === "auth/user-not-found") {
            message = "No account found with this email. Please sign up first.";
            } else if (err.code === "auth/wrong-password") {
            message = "Incorrect password. Try again.";
            } else if (err.code === "auth/email-already-in-use") {
            message = "This email is already in use. Try signing in instead.";
            } else if (err.code === "auth/weak-password") {
            message = "Your password is too weak. Use at least 6 characters.";
            } else if (err.code === "auth/too-many-requests") {
            message = "Too many failed login attempts. Try again later.";
            } else if (err.code === "auth/network-request-failed") {
            message = "Network error. Check your internet connection.";
            } else if (err.code === "auth/user-disabled") {
            message = "This account has been disabled. Contact support.";
            } else if (err.code === "auth/requires-recent-login") {
            message = "Please log in again to perform this action.";
            } else if (email === "") {
            message = "Please enter your email address.";
            } else if (password === "") {
            message = "Please enter your password.";
            }

            setErrorMsg(message);
            console.log("message", message);
            setShowError(true);
            return;
        }
        
        try {
            await setDoc(doc(db, "users", res.user.uid), {
                user_role: "customer",
                user_name: name, 
                user_number: number,
                user_email: email,
            });
    
            console.log(res)

            setSuccessMsg('Almost there! Please check your email for a verification link.')
            setShowSuccess(true)
        } catch (dbError) {
            setErrorMsg("Database error.")
        }
    }
    return (
    <section className="relative flex flex-wrap lg:h-screen lg:items-center">
        {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
        {showSuccess && <SuccessMessage message={successMsg} onClose={() => setShowSuccess(false)}/>}
            
        <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
            <img
            alt=""
            src="/images/sign_up.jpg"
            className="absolute inset-0 h-full w-full object-cover"
            />
        </div>

        <div className="flex flex-col justify-center w-full h-screen px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 bg-[#502424]">
            <div className="flex flex-col justify-center mb-10 items-center">
                <Image 
                className="mb-10"
                alt="The Mandara Spa Logo"
                src="/images/mandara_gold.png"
                height={200}
                width={200}
                />

                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-xl text-dark-brown font-semibold text-[#e0d8ad] sm:text-3xl">Create Your Account</h1>

                    <p className="mt-4 text-[#e0d8ad]">
                        To experience relaxation at The Mandara Spa
                    </p>
                </div>

                <form onSubmit={handleForm} className="mx-auto mt-8 mb-0 min-w-100 max-w-lg space-y-4">
                    <div>
                        <label htmlFor="name" className="sr-only">Full Name</label>
                        <div className="relative">
                            <input
                                required
                                id="name"
                                name="name"
                                type="text"
                                className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                                placeholder="Enter full name"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c3.866 0 7 3.134 7 7H5c0-3.866 3.134-7 7-7zm0-4a4 4 0 110-8 4 4 0 010 8z"/>
                            </svg>

                            </span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="number" className="sr-only">Mobile Number</label>
                        <div className="relative">
                            <input
                                required
                                id="number"
                                name="number"
                                type="tel"
                                className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                                placeholder="Enter mobile number"
                                onChange={(e) => setNumber(e.target.value)}
                            />
                            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l3 5-2 2a16 16 0 006 6l2-2 5 3v2a2 2 0 01-2 2h-3c-7.18 0-13-5.82-13-13V7a2 2 0 012-2z"/>
                            </svg>

                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>

                        <div className="relative">
                        <input
                            required
                            id="email"
                            name="email"
                            type="email"
                            className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                            </svg>
                        </span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>

                        <div className="relative">
                        <input
                            required
                            id="password"
                            name="password"
                            type="password"
                            className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                            </svg>
                        </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                        type="submit"
                        className=" rounded-lg bg-[#e0d8ad] w-full px-5 py-3 text-sm font-medium text-black"
                        >
                        Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
    );
}

export default SignUpUser;
