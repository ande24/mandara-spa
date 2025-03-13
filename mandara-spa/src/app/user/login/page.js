'use client'
import React from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import forgotPassword from "@/firebase/auth/forgotPassword";

function SignIn() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const createAccount = () => {
        return router.push("/user/signup")
    }

    const handleForgot = async (e) => {
        e.preventDefault();
        
        await forgotPassword(email);
    }

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signIn(email, password);

        if (error) {
            return console.log(error)
        }

        console.log(result)
        return router.push("/user/home")
    }
    return (
    <div className="flex h-screen w-screen justify-center items-center">
        <div className="flex flex-col items-center justify-center rounded-3xl p-5 bg-yellow-100">
            <h1 className="text-xl font-bold">Customer Log in</h1>
            <form className="form my-3">
                <label htmlFor="email">
                    <p>Email</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email"/>
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input className="bg-white p-2 my-2 rounded-sm border-1" onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password"  />
                </label>
            </form>
            <button className="m-1 hover:underline" onClick={handleForm}>Log in</button>
            <button className="m-1 hover:underline" onClick={createAccount}>Create an Account</button>
            <Link className="m-1 hover:underline text-xs text-blue-500" href="/user/forgotPassword" onClick={handleForgot}>Forgot password?</Link>
        </div>
    </div>);
}

export default SignIn;