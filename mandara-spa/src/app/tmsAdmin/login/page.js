'use client'
import React, { useState } from "react";
import signInAdmin from "@/firebase/auth/signinAdmin";
import { useRouter } from 'next/navigation'

function SignIn() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { res, err, userDoc } = await signInAdmin(email, password);

        console.log("userdoc: ", userDoc)
        if (err) {
            return setError(err);
        }

        setError('')
        setSuccess(true)
        setTimeout(() => {
            if (userDoc.user_role == "branch_admin") {
                return router.push("/tmsAdmin/branchAdmin");
            }
            else if (userDoc.user_role == "business_admin") {
                return router.push("/tmsAdmin/businessAdmin");
            }
        }, 2000);
    }
    return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
        <div className="flex flex-col items-center justify-center rounded-3xl p-5 bg-yellow-100">
            <h1 className="text-xl font-bold">Admin Log in</h1>
            <form className="form my-3 flex flex-col" onSubmit={handleForm}>
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
        </div>
        {error && <p className="text-red-500">{error.message || error}</p>}
        {success && <p className="text-green-500">Login successful!</p>}
    </div>);
}

export default SignIn;