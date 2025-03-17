'use client'

import { Img } from "@react-email/components";
import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/bookingForm";
import Image from "next/image";

export default function Page() {
    const { user } = useAuthContext()
    const router = useRouter()
    const [showForm, setShowForm] = useState(false)

    React.useEffect(() => {
        if (user == null) router.push("/")
    }, [user])

  return (
    <div className="flex h-screen border-amber-200 justify-center items-center">
      <button className="bg-[#e0d8ad] p-2 w-50 rounded-lg font font-semibold"
              onClick={() => setShowForm(true)}>
                Book now
      </button>
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}
    </div>
  );
}