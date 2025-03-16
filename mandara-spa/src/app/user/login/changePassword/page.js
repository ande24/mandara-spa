'use client'
import React, {useState, useEffect} from "react";
import { useRouter, useSearchParams  } from 'next/navigation';
import { getAuth, confirmPasswordReset } from "firebase/auth";
import firebase_app from "@/firebase/config";

function resetPassword() {
    const auth = getAuth(firebase_app);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [password1, setPassword1] = React.useState('')
    const [password2, setPassword2] = React.useState('')
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const oobCode = searchParams.get("oobCode");

    useEffect(() => {
        if (!oobCode) {
            setError("Invalid or missing reset code.");
        }
    }, [oobCode]);

    const handleReset = async (event) => {
        event.preventDefault();

        if (!oobCode) {
            setError("Invalid reset request.");
            return;
        }

        if (password1 !== password2) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, password1);

            setError(false);
            setSuccess(true);
            setTimeout(() => router.push("/user/login"), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
        <div className="flex flex-col items-center justify-center rounded-3xl p-5 bg-yellow-100">
            <h1 className="text-xl font-bold">Change Password</h1>
            <form className="form my-3 flex flex-col" onSubmit={handleReset}>
                <label htmlFor="password1">
                    <p>New Password</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setPassword1(e.target.value)} required type="password" name="password1" id="password1"  />
                </label>
                <label htmlFor="password2">
                    <p>Confirm New Password</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setPassword2(e.target.value)} required type="password" name="password2" id="password2"  />
                </label>
                <button className="m-1 hover:underline" type="submit">Confirm changes</button>
            </form>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Password successfully changed! Redirecting...</p>}
    </div>);
}

export default resetPassword;