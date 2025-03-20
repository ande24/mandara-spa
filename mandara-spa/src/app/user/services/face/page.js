'use client'

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/bookingForm";
import Image from "next/image";
import NavBar1 from "@/components/navbar1";
import NavBar2 from "@/components/navbar2";
import { getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Footer from "@/components/footer";

export default function Page() {
  useEffect(() => {
    const swiperInstance = document.querySelector(".swiper")?.swiper;
    if (swiperInstance) {
      swiperInstance.params.navigation.prevEl = ".custom-prev";
      swiperInstance.params.navigation.nextEl = ".custom-next";
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, []);

  const db = getFirestore(firebase_app)
  const { user } = useAuthContext()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const services = [
    {
      title: "Diamond Peel with Machine",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Reveal a fresh, new layer of skin instantly with this microdermabrasion treatment. Achieve brighter skin, reduced pimple marks, tighter pores, and rosier cheeks."
    },
    {
      title: "Non-Abrasive Diamond Peel",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Increase your outer peace with this multi-faceted approach to treating skin breakouts. This facial treatment helps clear your skin without harsh effects. With a special focus on exfoliation and redness reduction, it improves your skin’s appearance while correcting and preventing future blemishes."
    },
    {
      title: "Collagen Gold Mask",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Get plumper, firmer skin with a collagen and gold-infused mask. This treatment deeply moisturizes and rehydrates your skin, leaving it naturally radiant and youthful."
    },
    {
      title: "Non-Surgical Face Lift",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Look youthful and beautiful with this premier anti-aging facial treatment, designed to target wrinkles, fine lines, sagging cheeks and eyebrows, dull skin, and more. This world-renowned technology offers the safest anti-aging treatment, guaranteeing an instant glow and a wow-factor after each session. Results are cumulative."
    },
    {
      title: "Ageloc Galvanic Facial Spa",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Tighten and lift your facial skin and muscles for a youthful, refreshed look with this safe, non-surgical facelift. This treatment also leaves your skin baby-soft."
    },
    {
      title: "Radiance Facial Spa Package",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "The complete facial spa package for a fresh and radiant look. This treatment includes cleansing, facial scrubbing, non-abrasive peeling to remove dull skin, a 24K gold collagen facial mask to deeply hydrate and infuse collagen for a youthful glow, and a relaxing facial massage."
    }          
  ];

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
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}

      <div className="flex justify-center items-center w-full h-24 bg-[#502424]">
        <NavBar1 currPage={"services"} />
        <a href="/user/home">
          <Image
            src="/images/mandara_gold.png"
            alt=""
            height={85}
            width={194}
            className="mb-2 object-contain scale-50 hover:scale-55 transition-all"
          />
        </a>
        <NavBar2 onBook={handleBooking} sscurrPage={"services"} />
      </div>

      <div className="flex flex-col justify-center pt-18 mb-10">
        <h1 className="text-4xl mb-6 text-center font-serif">The Mandara Spa Face Rituals</h1>
          <div className="flex justify-center relative">
            <button className="custom-prev absolute rounded-full scale-80 top-2/5 left-60 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
              ❮
            </button>

            <div className=" flex justify-center items-center xl:max-w-7xl md:max-w-md w-full mx-auto px-4">
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
                  640: { slidesPerView: 1, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 30 },
                  1024: { slidesPerView: 3, spaceBetween: 40 },
                }}
              >
              {services.map((service, index) => (
                <SwiperSlide key={index}>
                  <a onClick={handleBooking} className="block hover:scale-100 scale-95 p-3 rounded-xl hover:shadow-lg shadow-gray-300 transition-all mt-3 mb-15">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                      className="h-80 w-full object-cover rounded-lg"
                    />

                    <h3 className="mt-4 text-xl font-serif text-gray-900 ">{service.title}</h3>

                    <p className="mt-2 w-full font-serif text-md leading-relaxed text-gray-700">
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

            <button className="custom-next absolute rounded-full scale-80 top-2/5 right-60 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❯
            </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}