'use client'

import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FiMenu, FiLogOut } from "react-icons/fi";

const BookingForm = dynamic(() => import("@/components/bookingForm"), { ssr: false });
const Image = dynamic(() => import("next/image"));
const NavBar1 = dynamic(() => import("@/components/navbar1"), { ssr: false });
const NavBar2 = dynamic(() => import("@/components/navbar2"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function Page() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const services = [
    {
      title: "Diamond Peel with Machine",
      img: "/images/services/face/facial.jpg",
      desc: "Reveal a fresh, new layer of skin instantly with this microdermabrasion treatment. Achieve brighter skin, reduced pimple marks, tighter pores, and rosier cheeks."
    },
    {
      title: "Non-Abrasive Diamond Peel",
      img: "/images/services/face/facial2.jpg",
      desc: "Increase your outer peace with this multi-faceted approach to treating skin breakouts. This facial treatment helps clear your skin without harsh effects. With a special focus on exfoliation and redness reduction, it improves your skin’s appearance while correcting and preventing future blemishes."
    },
    {
      title: "Collagen Gold Mask",
      img: "/images/services/face/gold.jpg",
      desc: "Get plumper, firmer skin with a collagen and gold-infused mask. This treatment deeply moisturizes and rehydrates your skin, leaving it naturally radiant and youthful."
    },
    {
      title: "Non-Surgical Face Lift",
      img: "/images/services/face/lift.jpg",
      desc: "Look youthful and beautiful with this premier anti-aging facial treatment, designed to target wrinkles, fine lines, sagging cheeks and eyebrows, dull skin, and more. This world-renowned technology offers the safest anti-aging treatment, guaranteeing an instant glow and a wow-factor after each session. Results are cumulative."
    },
    {
      title: "Ageloc Galvanic Facial Spa",
      img: "/images/services/face/facial3.jpg",
      desc: "Tighten and lift your facial skin and muscles for a youthful, refreshed look with this safe, non-surgical facelift. This treatment also leaves your skin baby-soft."
    },
    {
      title: "Radiance Facial Spa Package",
      img: "/images/services/face/facial4.jpg",
      desc: "The complete facial spa package for a fresh and radiant look. This treatment includes cleansing, facial scrubbing, non-abrasive peeling to remove dull skin, a 24K gold collagen facial mask to deeply hydrate and infuse collagen for a youthful glow, and a relaxing facial massage."
    }          
  ];

  const handleBooking = () => {
    if (user) {
      setShowForm(true)
    }
    else {
      router.push("/user/login");
    }
  }
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}

      <div className="flex justify-center items-center inset-x-0 top-0 w-screen z-20 h-30 bg-[#502424]">
        <div className="flex justify-center items-center">
          <NavBar1 currPage={"services"} />
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
          <NavBar2 onBook={handleBooking} currPage={"services"}/>
        </div>
      </div>

      <div className="flex flex-col justify-center pt-10 mb-10 overflow-x-hidden">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:font-semibold text-center font-serif">The Mandara Spa Face Rituals</h1>
          <div className="flex justify-center items-center">
            <button className="custom-prev mr-[-80] sm:mr-0 md:scale-100 rounded-full scale-50 top-2/5 left-60 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
              ❮
            </button>

            <div className=" flex justify-center items-center w-sm md:w-lg lg:w-3xl xl:w-5xl 2xl:w-7xl scale-70 mt-[-100] mb-[-100] sm:scale-100 sm:mt-0 sm:mb-0 px-4">
              <Swiper
                modules={[Navigation]}
                spaceBetween={50}
                slidesPerView={3}
                loop={true} 
                loopAddBlankSlides={true}
                navigation={{
                  nextEl: ".custom-next",
                  prevEl: ".custom-prev",
                }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  1024: { slidesPerView: 3 },
                }}
              >
              {services.map((service, index) => (
                <SwiperSlide key={index}>
                  <a onClick={handleBooking} className="block hover:scale-100 scale-95 p-3 rounded-xl hover:shadow-lg shadow-gray-300 transition-all mt-3 mb-15">
                    <Image
                      alt=""
                      src={service.img}
                      className="h-80 w-150 object-cover rounded-lg"
                      height={1000}
                      width={1000}
                      priority
                    />

                    <h3 className="mt-4 text-xl font-serif text-gray-900 ">{service.title}</h3>

                    <p className="mt-2 max-w-sm font-serif text-md leading-relaxed text-gray-700">
                    {service.desc.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                    </p>
                  </a>
                </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <button className="custom-next rounded-full ml-[-80] md:scale-100 sm:ml-0 scale-50 top-2/5 right-60 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❯
            </button>
        </div>
      </div>
      <div id="footer">
          <Footer/>
        </div>
    </div>
  );
}