'use client'
import React, { useState } from "react";
import SignUp from "@/firebase/auth/signup";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/error";
import Image from "next/image";

function SignUpUser() {
    const db = getFirestore(firebase_app)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [number, setNumber] = useState ('')
    const [showVerify, setShowVerify] = useState(false)
    const [showError, setShowError] = useState(false)
    const [error, setError] = useState('');
    const router = useRouter();

    const handleForm = async (event) => {
        event.preventDefault()

        if (String(number).length !== 11) {
            return setError('Please provide an 11-digit mobile number.');
        }

        const { res, err } = await SignUp(email, password);

        if (err) {
            return setError(err)
        }
        
        try {
            await setDoc(doc(db, "users", res.user.uid), {
                user_role: "customer",
                user_name: name, 
                user_number: number,
                user_email: email,
            });
    
            console.log(res)

            setShowVerify(true)

            setTimeout(() => {
                setShowVerify(false);
            }, 3000);
            
            router.push("/user/home");

        } catch (dbError) {
            setError(dbError.message);
        }
    }
    return (
    <section className="relative flex flex-wrap lg:h-screen lg:items-center">
        {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
            
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

{/* <div className="flex flex-col h-screen w-screen justify-center items-center">
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
                    <h2 className="text-2xl font-bold mb-4">Account created!</h2>
                    <p>Check your email soon for a verification link.</p>
                    <p>Signing you in for now.</p>
                </div>
            </div>
        )}
    </div> */}