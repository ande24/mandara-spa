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
    { title: "Swedish Aromatherapy", 
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Feel your stresses go away as your therapist use relaxing patterns to manipulate your soft tissues, increase circulation and metabolism, and release tension."
    },
    { title: "Shiatsu Dry Massage", 
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Based on the principles of oriental medicine, your therapist uses palms, fingers and thumbs to gently balance and restore your Chi. Dry massage (no oil)."
    },
    { title: "Combination Aromatherapy", 
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Relive your body from stress and aches with this combination of body reflexology techniques, including stretching. Feel lighter, invigorated and ready for the next days."
    },
    { title: "The Mandara Signature Massage", 
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "Our relaxing and healing strokes with heat pad therapy, combined with our signature blend of healing olive and all-organic aromatic oils will take you into a trance. This massage will loosen tight muscles, leave you feeling recuperated, reconnected mind, body and soul."
    },
    { title: "Hot Stone Massage", 
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "The healing power of nature’s harvested stones and combined therapeutic techniques warm you and bring you to a more tranquil state."
    },
    { title: "Four Hands Therapy", 
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "A truly inspiring and unforgettable spa experience, the medium pressure of Mandara’s Four Hands Therapy incorporates the exacting skills of two therapists working together in rhythmic tandem."
    },
    { title: "Ventosa Cupping with Hilot", 
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "A traditional form of massage that removes tissue congestion and muscles spasm also known to more Pinoys as lamig with the use of cups placed on various pressure points on the back."
    },
    { title: "Ventosa Cupping with Signature Massage", 
      img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      desc: "The ultimate healing massage therapy combo to rid-off muscle spasm or “lamig” as known to Filipinos, followed by a deeply relaxing Signature Massage. Feel your temsed muscles and stress melt away as your therapist slowly apply heat pads and perform Mandara’s carefully curated signature massage techniques while using organic olive massage and essential oils."
    },
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
        <h1 className="text-4xl mb-6 text-center font-serif">The Mandara Spa Body Rituals: Massage Therapy</h1>
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
                  <a onClick={handleBooking} className="block hover:scale-100 scale-95 p-3 rounded-xl hover:shadow-lg shadow-gray-300 transition-all mt-3 mb-15">
                    <img
                      alt=""
                      src={service.img}
                      className="h-80 w-150 object-cover rounded-lg"
                    />

                    <h3 className="mt-4 text-xl font-serif text-gray-900 ">{service.title}</h3>

                    <p className="mt-2 max-w-sm font-serif text-md leading-relaxed text-gray-700">
                      {service.desc}
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