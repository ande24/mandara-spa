'use client'
import React, { useState } from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation';
import ForgotPassword from "@/firebase/auth/forgotPassword";
import Image from "next/image";
import ErrorMessage from "@/components/error";

function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showChange, setShowChange] = useState(false);
    const [showError, setShowError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter()

    const createAccount = () => {
        return router.push("/user/signup")
    }

    const handleForgot = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorMsg("Please enter your email address.");
            setShowError(true)
            return;
        }

        await ForgotPassword(email)

        setShowChange(true)
    }

    const handleForm = async (event) => {
        event.preventDefault();

        const { res, err } = await signIn(email, password);

        if (err) {
            let message = "An unknown error occurred. Please try again.";

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
            }

            setErrorMsg(message);
            setShowError(true);
            return;
        }

        setErrorMsg('')
        setSuccess(true)
        console.log(res);
        setTimeout(() => {return router.push("/user/home")}, 2000);
    }
    return (
        <section className="relative flex flex-wrap lg:h-screen lg:items-center">
            {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
            {showChange && ( 
                <div role="alert" className="absolute top-4 left-4 z-50 rounded-xl border border-gray-100 bg-white p-4 animate-">
                    <div className="flex items-start gap-4">
                    <span className="text-green-600">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        </svg>
                    </span>
                
                    <div className="flex-1">
                        <strong className="block font-medium text-gray-900"> Check your Email </strong>
                
                        <p className="mt-1 text-sm text-gray-700">We sent you a verification link.</p>
                    </div>
                
                    <button onClick={() => {setShowChange(false)}} className="text-gray-500 transition hover:text-gray-600">
                        <span className="sr-only">Dismiss popup</span>
                
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col justify-center w-full h-screen px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 bg-[#502424]">
                <div className="flex flex-col justify-center items-center">
                    <Image 
                    className="mb-10"
                    alt="The Mandara Spa Logo"
                    src="/images/mandara_gold.png"
                    height={200}
                    width={200}
                    />

                    <div className="mx-auto max-w-lg text-center">
                        <h1 className="text-xl text-dark-brown font-serif text-[#e0d8ad] sm:text-3xl">Sign in to Your Account</h1>

                        <p className="mt-4 font-serif text-[#e0d8ad]">
                            To experience relaxation at The Mandara Spa
                        </p>
                    </div>

                    <form onSubmit={handleForm} className="mx-auto mt-8 mb-0 min-w-100 max-w-lg space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>

                            <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full font-serif bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
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
                                id="password"
                                name="password"
                                type="password"
                                className="w-full font-serif bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
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

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col text-sm">
                                <p onClick={createAccount} className="ml-1 font-serif text-white hover:text-[#e0d8ad]" >Sign Up</p>
                                <p onClick={handleForgot} className="mt-1 font-serif ml-1 text-white hover:text-[#e0d8ad]" >Forgot Password?</p>
                            </div>

                            <button
                            type="submit"
                            className="font-serif rounded-lg bg-[#e0d8ad] w-1/2 px-5 py-3 text-sm font-medium text-black"
                            >
                            Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
                <img
                alt=""
                src="/images/sign_in.jpg"
                className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </section>
    )
    // <div className="flex flex-col h-screen w-screen justify-center items-center">
    //     <div className="flex flex-col items-center justify-center rounded-3xl p-5 bg-yellow-100">
    //         <h1 className="text-xl font-bold">Customer Log in</h1>
    //         <form className="form mt-3 mb-2 flex flex-col" onSubmit={handleForm}>
    //             <label htmlFor="email">
    //                 <p>Email</p>
    //                 <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email"/>
    //             </label>
    //             <label htmlFor="password">
    //                 <p>Password</p>
    //                 <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password"  />
    //             </label>
    //             <button type="submit" className="hover:underline">Log in</button>
    //         </form>
    //         <button className="mb-1 hover:underline" onClick={createAccount}>Create an Account</button>
    //         <button className="m-1 hover:underline text-xs text-blue-500" onClick={handleForgot}>Forgot password?</button>
    //     </div>
    //     {error && <p className="text-red-500">{error.message || error}</p>}
    //     {success && <p className="text-green-500">Login successful!</p>}
    //     {showChange && (
    //         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
    //             <div className="bg-white p-6 rounded-lg shadow-md text-center">
    //                 <h2 className="text-2xl font-bold mb-4">We sent you a link</h2>
    //                 <p>Please check your email and click the link to change your password, then log into your account.</p>
    //             </div>
    //         </div>
    //     )}
    // </div>);
}

export default SignIn;



{/*
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
*/}

