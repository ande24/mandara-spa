'use client'

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/bookingForm";
import Image from "next/image";
import SlidingButton from "@/components/slidingButton";
import NavBar1 from "@/components/navbar1";
import NavBar2 from "@/components/navbar2";

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
    <div className="relative flex h-screen justify-center items-center overflow-y-auto">
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}
      <div className="absolute flex justify-center items-center inset-x-0 top-0 w-full z-20 h-24 bg-[#502424] opacity-80">
        <div className="flex justify-center items-center">
          <div>
            <NavBar1 currPage={"hand"}/>
          </div>
          <div>
            <a href="/user/home">
              <Image
                src="/images/mandara_gold.png"
                alt=""
                height={85}
                width={194}
                className="mb-2 object-contain scale-50 hover:scale-60 transition-all"
            />
            </a>
          </div>
          <div>
            <NavBar2 currPage={"hand"}/>
          </div>
        </div>
      </div>

      <div className="w-screen h-full relative flex pb-28 justify-center flex-col items-center z-10">
        <SlidingButton onClick={handleBooking}/>
      </div>

      <Image
      alt=""
      src="/images/sign_in.jpg"
      className="inset-0 h-full w-full object-cover z-0"
      fill
      />

      <div className="absolute inset-x-0 bottom-0 w-full h-28 bg-[#502424] opacity-80">
        <div className="flex justify-center items-center flex-col w-full h-full">
          <h1 className="text-3xl mb-2 font-bold text-[#e0d8ad] text-center ">WELCOME TO THE MANDARA SPA</h1>
          <p className="text-gray-100 text-xs">Elevating the spa experience to a new art form.</p>
        </div>
      </div>
    </div>
  );
}