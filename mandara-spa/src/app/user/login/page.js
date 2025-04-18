'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import signIn from "@/firebase/auth/signin";
import ForgotPassword from "@/firebase/auth/forgotPassword";
import dynamic from "next/dynamic";

const ErrorMessage = dynamic(() => import("@/components/error"));
const SuccessMessage = dynamic(() => import("@/components/success"));
const Image = dynamic(() => import("next/image"));

function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter()
    const [saving, setSaving] = useState(false);

    const createAccount = () => {
        return router.push("/user/signup")
    }

    const handleForgot = async (e) => {
        e.preventDefault();
        setSaving(true)

        if (!email) {
            setSaving(false)
            setErrorMsg("Please enter your email address.");
            setShowError(true)
            return;
        }

        await ForgotPassword(email)

        setSuccessMsg('Please check your email for the reset link.')
        setShowSuccess(true)
        setSaving(false)
    }

    const handleForm = async (event) => {
        event.preventDefault();
        setSaving(true);

        if (email === "" || password === "") {
        setErrorMsg("Please enter your email address and password.");
        console.log("No email/password")
        setShowError(true);
        setSaving(false);
        return;
        } 

        const { res, err } = await signIn(email, password);

        if (err) {
            let message = "Login Failed. Please check your credentials.";

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
            console.log(message)
            setShowError(true);
            return;
        }
        setSaving(false);
        setErrorMsg('')
        setSuccessMsg('Logged in successfully!')
        setShowSuccess(true)
        console.log(res);
        setTimeout(() => {return router.push("/user/home")}, 2000);
    }

    return (
        <section className="relative flex flex-wrap lg:h-screen lg:items-center">
            {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
            {showSuccess && <SuccessMessage message={successMsg} onClose={() => setShowSuccess(false)}/>}

            <div className="flex flex-col justify-center items-center w-screen h-screen px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 bg-[#502424]">
                <div className="flex flex-col mb-10 justify-center items-center">
                    <Image 
                    className="mb-10"
                    alt="The Mandara Spa Logo"
                    src="/images/mandara_gold.png"
                    height={200}
                    width={200}
                    priority
                    />

                    <div className="mx-auto max-w-lg text-center">
                        <h1 className="text-xl text-dark-brown font-semibold text-[#e0d8ad] sm:text-3xl">Sign in to Your Account</h1>

                        <p className="text-xs sm:text-lg mt-4 font-serif text-[#e0d8ad]">
                            To experience relaxation at The Mandara Spa
                        </p>
                    </div>

                    <form onSubmit={handleForm} className="flex flex-col items-center justify-center mx-auto mt-8 mb-0 min-w-screen max-x-lg space-y-4">
                        <div className="relative flex justify-center items-center w-2/3 lg:w-1/3">
                            <input
                                required
                                id="email"
                                name="email"
                                type="email"
                                className="sm:w-full w-4/5 font-serif bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <span className="absolute right-0 top-1/3 place-content-center px-4 hidden sm:grid">
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

                        <div className="relative flex justify-center items-center w-2/3 lg:w-1/3">
                            <input
                                required
                                id="password"
                                name="password"
                                type="password"
                                className="w-4/5  sm:w-full font-serif bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <span className="absolute top-1/3 right-0 sm:grid place-content-center px-4 hidden">
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

                        <div className="flex w-2/3 lg:w-1/3 items-center justify-between">
                            <div className="flex flex-col text-sm">
                                <p onClick={createAccount} className="ml-1 text-xs font-serif hover:cursor-pointer text-white hover:text-[#e0d8ad]" >Sign Up</p>
                                <p onClick={handleForgot} className="mt-2 text-xs font-serif ml-1 hover:cursor-pointer text-white hover:text-[#e0d8ad]" >Forgot Password?</p>
                            </div>

                            <button
                            disabled={saving}
                            type="submit"
                            className="font-serif rounded-lg bg-[#e0d8ad] w-2/5 sm:w-1/2 sm:text-md px-5 py-3 text-xs font-medium text-black"
                            >
                            Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2 lg:block hidden">
                <Image
                alt=""
                src="/images/sign_in.jpg"
                className="absolute inset-0 h-full w-full object-cover"
                fill
                priority
                />
            </div>
        </section>
    )
}
export default SignIn
