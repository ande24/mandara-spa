"use client"

import SuccessMessage from "@/components/success"
import Loading from "@/app/loading"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function EmailVerified () {
    const router = useRouter();
    const [show, setShow] = useState(false)
    useEffect(() => {
        setShow(true);

        router.push("/user/login");
    }, [router])
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#301414]">
            {show && <SuccessMessage message={"Email verified successfully!"} onClose={() => setShow(false)}/>}
            <Loading />
        </div>
    )
}