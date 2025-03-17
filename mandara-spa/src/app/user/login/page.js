'use client'
import React, { useState } from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation';
import ForgotPassword from "@/firebase/auth/forgotPassword";
import Image from "next/image";

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
        <section className="relative flex flex-wrap lg:h-screen lg:items-center">
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
                        <h1 className="text-2xl text-[#e0d8ad] font-bold sm:text-3xl">Log in to Your Account</h1>

                        <p className="mt-4 text-[#e0d8ad]">
                            Sign in to experience relaxation with us at The Mandara Spa
                        </p>
                    </div>

                    <form action="#" className="mx-auto mt-8 mb-0 min-w-100 max-w-lg space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>

                            <div className="relative">
                            <input
                                type="email"
                                className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                                placeholder="Enter email"
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
                                type="password"
                                className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                                placeholder="Enter password"
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
                            <div className="flex text-sm">
                                <p className="text-[#e0d8ad]">No account?</p>
                                <a className="ml-2 underline text-blue-400 hover:text-blue-700" href="#">Sign up</a>
                            </div>

                            <button
                            type="submit"
                            className=" rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
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
                src="/images/nowomannocry.jpg"
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

