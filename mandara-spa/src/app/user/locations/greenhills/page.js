'use client'

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import { FaMapMarkerAlt, FaClock, FaPhone, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Link from "next/link";

const Image = dynamic(() => import("next/image"));
const BookingForm = dynamic(() => import("@/components/bookingForm"), { ssr: false });
const NavBar1 = dynamic(() => import("@/components/navbar1"), { ssr: false });
const NavBar2 = dynamic(() => import("@/components/navbar2"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });

export default function Page() {
  const db = getFirestore(firebase_app)
  const { user } = useAuthContext()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [branchData, setBranchData] = useState('')

  useEffect (() => {
    const fetchBranch = async() => {
      const branchSnap = await getDoc(doc(db, "branches", "kLi28mUaqnvozN3Z5Qnv"));
      console.log("images ", branchSnap.data().branch_images)
      setBranchData(branchSnap.data());
    }

    fetchBranch();
}, [db]);

  const handleBooking = () => {
    if (user) {
      setShowForm(true)
    }
    else {
      router.push("/user/login");
    }
  }
  return (
    <div>
    {branchData && (
      <div className="relative flex flex-col min-h-screen justify-center items-center bg-gray-200">
        {showForm && <BookingForm onClose={() => setShowForm(false)} />}
  
        <div className="absolute flex justify-center items-center inset-x-0 top-0 w-full z-20 h-24 bg-[#502424]">
          <div className="flex justify-center items-center">
            <div>
              <NavBar1 currPage={"locations"} />
            </div>
            <div>
              <Link href="/user/home">
                <Image
                  src="/images/mandara_gold.png"
                  alt=""
                  height={85}
                  width={194}
                  priority
                  className="mb-2 object-contain scale-50 hover:scale-55 transition-all"
              />
              </Link>
            </div>
            <div>
              <NavBar2 onBook={handleBooking} currPage={"locations"} />
            </div>
          </div>
        </div>
  
        <div className="flex flex-col justify-center items-center w-full mx-auto p-35">
          <h1 className="text-5xl mb-12 text-center font-serif">
            {branchData.branch_location}
          </h1>
  
          <div className="flex justify-between">
            <div className="relative rounded-lg flex justify-center w-3xl h-2xl">
              <Swiper
                modules={[Navigation]}
                spaceBetween={50}
                slidesPerView={1}
                loop={true} 
                loopAddBlankSlides={true}
                navigation={{
                  nextEl: ".custom-next",
                  prevEl: ".custom-prev",
                }}
              >
              {branchData.branch_images.map((img, index) => (
                <SwiperSlide key={index}>
                  <article className="overflow-hidden rounded-lg">
                    <Image
                      alt=""
                      src={img}
                      className="h-150 w-full object-cover"
                      height={1000}
                      width={1000}
                      priority
                    />
                  </article>
                </SwiperSlide>
                ))}
              </Swiper>
              
              <button
                className="custom-prev absolute left-[-60] top-1/2 transform -translate-y-1/2 bg-black opacity-30 hover:opacity-50 hover:scale-105 transition-all text-white p-2 rounded-full"
              >
                <FaChevronLeft />
              </button>
              <button
                className="custom-next absolute right-[-60] top-1/2 transform -translate-y-1/2 bg-black opacity-30 hover:opacity-50 hover:scale-105 transition-all text-white p-2 rounded-full"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
  
          <div className="mt-2 leading-relaxed mb-4 text-sm w-2xl text-center p-4 rounded-2xl">
            <p className="font-serif text-gray-800">{branchData.branch_desc}</p>
          </div>
  
          <div className="flex mb-4 rounded-lg hover:scale-105 hover:shadow-lg transition-all">
            <iframe
              src={branchData.branch_location_link}
              width="290"
              height="290"
              loading="lazy"
              className="rounded-lg w-2xl shadow-black"
            ></iframe>
          </div>
  
          <div className="mt-4 w-2xl bg-gray-200 text-gray-800 p-4 text-sm rounded-lg flex transition-all hover:bg-gray-50 hover:scale-105 hover:shadow-lg shadow-gray-300 md:flex-row md:items-center justify-between">
            <div className="space-y-2 font-serif w-sm">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#502424]" /> {branchData.branch_address}
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-[#502424]" /> {branchData.branch_hours}
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-[#502424]" />{" "}
                {branchData.branch_landline ? `${branchData.branch_landline}, ` : ""}{" "}
                {branchData.branch_mobile}
              </p>
            </div>
              <button onClick={handleBooking} className="bg-[#502424] text-xs text-white font-semibold p-2 w-1/3 h-full rounded-lg hover:bg-[#e0d8ad] hover:scale-105 transition-all md:ml-6">
                Book Now
              </button>
          </div>
        </div>
        
      </div>
    )
    }
    <Footer />
    </div>
  );  
}