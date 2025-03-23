'use client'
import React, {useState, useEffect} from "react";
import { useRouter, useSearchParams  } from 'next/navigation';
import { getAuth, confirmPasswordReset } from "firebase/auth";
import firebase_app from "@/firebase/config";
import Image from "next/image";
import ErrorMessage from "@/components/error";
import SuccessMessage from "@/components/success";

const ResetPassword = () => {
    const auth = getAuth(firebase_app);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [saving, setSaving] = useState(false)

    const oobCode = searchParams.get("oobCode");

    useEffect(() => {
        if (!oobCode) {
            setErrorMsg("Invalid or missing reset code.");
            setShowError(true)
        }
    }, [oobCode]);

    const handleForm = async (event) => {
        event.preventDefault();
        setSaving(true)

        if (!oobCode) {
            setErrorMsg("Invalid reset request.");
            setShowError(true)
            return;
        }

        if (password1 !== password2) {
            setErrorMsg("Passwords do not match.");
            setShowError(true)
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, password1);

            setSuccessMsg("Password reset successfully!");
            setShowSuccess(true);
            
            router.push("/user/login");
        } catch (err) {
            setErrorMsg(err.message);
            setShowError(true)
        }
        setSaving(false)
    };

    return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
        {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
        {showSuccess && <SuccessMessage message={successMsg} onClose={() => setShowSuccess(false)}/>}

        <div className="flex flex-col justify-center w-full h-screen px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 bg-[#502424]">
            <div className="flex flex-col mb-10 justify-center items-center">
                <Image 
                className="mb-10"
                alt="The Mandara Spa Logo"
                src="/images/mandara_gold.png"
                height={200}
                width={200}
                />

                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-xl text-dark-brown font-serif text-[#e0d8ad] sm:text-3xl">The Mandara Spa</h1>

                    <p className="mt-4 font-serif text-[#e0d8ad]">
                        Reset your password
                    </p>
                </div>

                <form onSubmit={handleForm} className="mx-auto mt-8 mb-0 min-w-100 max-w-lg space-y-4">
                    <div>
                        <label htmlFor="password" className="sr-only">New Password</label>

                        <div className="relative">
                        <input
                            required
                            id="password"
                            name="password"
                            type="password"
                            className="w-full font-serif bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                            placeholder="Enter new password"
                            onChange={(e) => setPassword1(e.target.value)}
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

                    <div>
                        <label htmlFor="password" className="sr-only">Confirm New Password</label>

                        <div className="relative">
                        <input
                            required
                            id="password"
                            name="password"
                            type="password"
                            className="w-full font-serif bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                            placeholder="Confirm new password"
                            onChange={(e) => setPassword2(e.target.value)}
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
                        disabled={saving}
                        type="submit"
                        className="font-serif rounded-lg bg-[#e0d8ad] w-1/2 px-5 py-3 text-sm font-medium text-black"
                        >
                        Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>);
}

export default ResetPassword;