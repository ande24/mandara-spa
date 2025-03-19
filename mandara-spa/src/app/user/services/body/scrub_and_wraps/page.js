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
        title: "The Scrub Ritual",
        img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        desc: "This all-over body polish is sure to be invigorating. First, your skin is lightly brushed and stimulated by our body brush, helping to eliminate dead skin on the surface and promote lymph flow. Then, an aromatic body scrub is applied to exfoliate and soften the skin while relaxing your mind and body. Finally, a soothing butter is applied to hydrate your skin, leaving it soft, smooth, and rejuvenated."
      },
      {
        title: "Body Scrub and Massage",
        img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=870&q=80",
        desc: "Feel pampered and rejuvenated with a body scrub, followed by a 60-minute massage of your choice."
      },
      {
        title: "Body Scrub, Wrap, and Massage",
        img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=870&q=80",
        desc: "Transcend to a world of beauty and relaxation with a body scrub and wrap, followed by a 60-minute massage of your choice."
      },
      {
        title: "Selection of Premium Scrubs and Wraps",
        img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=870&q=80",
        desc: "Choose from our premium scrubs and wraps for a customized rejuvenating experience:\nLavender Glow (Whitening + Relaxing)\nCoffee (Anti-oxidant + Enlivening)\nGreen Tea (Hydrating + Detoxifying)\nLemon Grass FOR HIM (Soothing + Energizing)\nMandara Signature (Healing + Nourishing + All Organic)"
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
        <NavBar2 onBook={handleBooking} currPage={"services"} />
      </div>

      <div className="flex flex-col justify-center pt-18 mb-10">
        <h1 className="text-4xl mb-6 text-center font-serif">The Mandara Spa Body Rituals: Body Scrub and Wraps</h1>
          <div className="flex justify-center relative">
            <button className="custom-prev absolute rounded-full scale-80 top-2/5 left-60 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
              ❮
            </button>

            <div className="relative flex justify-center items-center max-w-7xl w-full mx-auto px-4">
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
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 3 },
                }}
              >
              {services.map((service, index) => (
                <SwiperSlide key={index}>
                  <a onClick={handleBooking} className="block hover:scale-100 scale-95 transition-all mt-3 mb-15">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                      className="h-80 w-150 object-cover rounded-lg"
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

            <button className="custom-next absolute rounded-full scale-80 top-2/5 right-60 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❯
            </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}