'use client'

import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/bookingForm";

export default function Page() {
    const { user } = useAuthContext()
    const router = useRouter()
    const [showForm, setShowForm] = useState(false)

    React.useEffect(() => {
        if (user == null) router.push("/")
    }, [user])

    return (
      <div className="flex h-screen border-amber-200 justify-center items-center">
        <button className="bg-yellow-100 rounded-3xl h-auto p-5"
                onClick={() => setShowForm(true)}>
                  Book now
        </button>

        {showForm && <BookingForm onClose={() => setShowForm(false)} />}
      </div>
  );
}