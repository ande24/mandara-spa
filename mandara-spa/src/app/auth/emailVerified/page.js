"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function emailVerified () {
    const router = useRouter();


    useEffect(() => {
        setTimeout(() => {router.push("/user/login")}, 3000);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4 text-green-600">All done!</h2>
                <p>Your email has been successfully verified.</p>
            </div>
        </div>
    )
}