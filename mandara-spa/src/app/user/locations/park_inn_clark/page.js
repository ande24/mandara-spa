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
import { FiMenu, FiLogOut } from "react-icons/fi";

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
      const branchSnap = await getDoc(doc(db, "branches", "ItD5S6Oufs8UcZLMDg0t"));
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
      <div className="flex flex-col min-h-screen justify-center items-center bg-gray-200 overflow-x-hidden">
        {showForm && <BookingForm onClose={() => setShowForm(false)} />}
  
        <div className="flex justify-center items-center inset-x-0 top-0 w-screen z-20 h-30 bg-[#502424]">
          <div className="flex justify-center items-center">
            <NavBar1 currPage={"locations"} />
              <div className="w-screen xl:w-auto flex justify-between">
                <button
                  className="text-gray-200 hover:scale-105 mx-5 transition-all xl:hidden" onClick={() => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <FiMenu size={24} />
                </button>
                <a href="/user/home">
                  <Image
                    src="/images/mandara_gold.png"
                    alt=""
                    height={300}
                    width={300}
                    priority
                    className="mb-4 object-contain scale-50 hover:scale-55 transition-all"
                  />
                </a>
                <button
                  onClick={() => {router.push("/user/login")}}
                  className=" text-gray-200 mx-5 hover:scale-105 transition-all xl:hidden pr-5"
                >
                  <FiLogOut size={24} />
                </button>
              </div>
            <NavBar2 onBook={handleBooking} currPage={"locations"}/>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-full ">
          <h1 className="text-2xl
                         my-5 

                         sm:text-3xl
                         sm:my-7

                         md:font-semibold
                         md:text-4xl
                         md:my-10
                         
                         text-center font-serif">
            {branchData.branch_location}
          </h1>
  
          <div className="flex justify-center items-center">
            <button
              className="scale-70
                        mr-2
                        mt-5
              
                        custom-prev transform -translate-y-1/2 bg-black opacity-30 hover:opacity-50 hover:scale-105 transition-all text-white p-2 rounded-full"
            >
              <FaChevronLeft />
            </button>

            <div className="w-3xs

                            sm:w-lg

                            md:w-2xl
                            rounded-lg flex justify-center items-center">
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
                      className="h-100 object-cover"
                      height={1000}
                      width={1000}
                      priority
                    />
                  </article>
                </SwiperSlide>
                ))}
              </Swiper>
              
              <button
                className="scale-70
                          mt-5
                          ml-2

                          custom-next transform -translate-y-1/2 bg-black opacity-30 hover:opacity-50 hover:scale-105 transition-all text-white p-2 rounded-full"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
  
          <div className="text-xs w-xs

                          sm:w-lg

                          md:w-2xl

                          lg:text-sm

          
                          mt-2 leading-relaxed mb-4 text-center p-4 rounded-2xl">
            <p className="font-serif text-gray-800">{branchData.branch_desc}</p>
          </div>
  
          <div className="sm:w-lg
                          md:w-2xl
                          flex mb-4 rounded-lg hover:scale-105 hover:shadow-lg transition-all">
            <iframe
              src={branchData.branch_location_link}
              width="290"
              height="290"
              loading="lazy"
              className="w-full rounded-lg shadow-black"
            ></iframe>
          </div>
  
          <div className="w-2xs 
                          sm:w-lg
                          md:w-2xl
                          flex flex-col mt-4 mb-10 bg-gray-200 text-gray-800 p-4 text-sm rounded-lg transition-all hover:bg-gray-50 hover:scale-105 hover:shadow-lg shadow-gray-300 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 font-serif w-full">
              <p className="text-xs xl:text-sm flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#502424] xs:w-2 xs:h-2 min-w-2 min-h-2" /> {branchData.branch_address}
              </p>
              <p className="text-xs xl:text-sm flex items-center gap-2">
                <FaClock className="text-[#502424] xs:w-2 xs:h-2 min-w-2 min-h-2"/> {branchData.branch_hours}
              </p>
              <p className="text-xs xl:text-sm flex items-center gap-2">
                <FaPhone className="text-[#502424] xs:w-2 xs:h-2 min-w-2 min-h-2" />{" "}
                {branchData.branch_landline ? `${branchData.branch_landline}, ` : ""}{" "}
                {branchData.branch_mobile}
              </p>
            </div>
            <button onClick={handleBooking} className="bg-[#502424] text-xs text-white font-serif sm:font-semibold p-2 w-max lg:w-1/3 mt-5 h-full rounded-lg hover:bg-[#e0d8ad] hover:scale-105 transition-all md:ml-6">
              Book Now
            </button>
          </div>
        </div>
        
      </div>
    )
    }
    <div id="footer">
          <Footer/>
        </div>
    </div>
  );  
}