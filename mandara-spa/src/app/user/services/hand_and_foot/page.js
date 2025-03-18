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
      title: "Hand Spa",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Reveal softer, younger-looking hands with this special hand spa. Our premium scrub will remove dead skin from your hands before they are wrapped in a nourishing masque. Feel your stress melt away as the warmth of a hot towel wrap penetrates your arms, followed by an enriching hand massage with oils and butter."
    },
    {
      title: "Foot Spa",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Pamper your feet with this well-deserved special foot spa, designed to refresh and rejuvenate tired feet. Relax as we immerse your feet in a warm, aromatic foot soak before softening the skin with herbal exfoliation. Feel the invigorating effect of a peppermint-infused foot masque as it revitalizes your feet."
    },
    {
      title: "Selection of Hand and Foot Spa",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Choose from our premium hand and foot spa treatments for a customized relaxing experience:\nLavender Aromatherapy (Whitening + Relaxing)\nPeppermint Break (Ultra Refreshing + Enlivening)\nGreen Tea (Callous Softening + Invigorating)\nMandara Signature (Healing + Nourishing + All Organic)"
    },
    {
      title: "Xiamen Foot Massage",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Take away the stress from your feet with a relaxing, tension-relieving foot massage that targets all key pressure points."
    },
    {
      title: "Chair Massage",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Sit back and relax in our massage chair as we effectively relieve your stress and ease back and shoulder tension."
    },
    {
      title: "Nail Care",
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Our nail care services offer the perfect pampering for your hands and feet:\nGreen Tea Manicure\nGreen Tea Pedicure\nHand Paraffin\nGel Manicure (Lasts up to 4 Weeks)\nGel Pedicure (Lasts up to 4 Weeks)\nFoot Paraffin"
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
    <div className="relative flex flex-col h-screen overflow-y-auto bg-gray-100">
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
        <NavBar2 currPage={"services"} />
      </div>

      <div className="flex flex-col justify-center pt-8 mb-10">
        <h1 className="text-4xl mb-6 text-center font-serif">The Mandara Spa Hand and Foot Rituals</h1>
          <div className="flex justify-center relative">
            <button className="custom-prev absolute rounded-full scale-80 top-2/5 left-15 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
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
                  <a href="#" className="block hover:scale-100 scale-95 transition-all mt-3 mb-15">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                      className="h-80 w-150 object-cover rounded-lg"
                    />

                    <h3 className="mt-4 text-lg font-serif text-gray-900 ">{service.title}</h3>

                    <p className="mt-2 max-w-sm font-serif text-xs leading-relaxed text-gray-700">
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

            <button className="custom-next absolute rounded-full scale-80 top-2/5 right-15 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❯
            </button>
        </div>
      </div>
    </div>
  );
}