'use client'

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/bookingForm";

export default function Page() {
    const { user } = useAuthContext()
    const router = useRouter()
    const [showForm, setShowForm] = useState(false)
    const [redirect, setRedirect] = useState(false)

    useEffect (() => {
      if (redirect) router.push("/user/login");
    }, [redirect]);

    const handleBooking = () => {
      if (user) {
        setShowForm(true)
      }
      else {
        setRedirect(true);
      }
    }

  return (
    <div className="flex h-screen border-amber-200 justify-center items-center">
      <button className="bg-[#e0d8ad] p-2 w-50 rounded-lg font font-semibold"
              onClick={handleBooking}>
                Book now
      </button>
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}
    </div>
  );
}