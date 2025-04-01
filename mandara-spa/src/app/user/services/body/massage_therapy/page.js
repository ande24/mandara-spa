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
    { title: "Swedish Aromatherapy", 
      img: "/images/services/body/massage_therapy/aroma.jpg",
      desc: "Feel your stresses go away as your therapist use relaxing patterns to manipulate your soft tissues, increase circulation and metabolism, and release tension."
    },
    { title: "Shiatsu Dry Massage", 
      img: "/images/services/body/massage_therapy/shiatsu.jpg",
      desc: "Based on the principles of oriental medicine, your therapist uses palms, fingers and thumbs to gently balance and restore your Chi. Dry massage (no oil)."
    },
    { title: "Combination Aromatherapy", 
      img: "/images/services/body/massage_therapy/aroma2.jpg",
      desc: "Relive your body from stress and aches with this combination of body reflexology techniques, including stretching. Feel lighter, invigorated and ready for the next days."
    },
    { title: "The Mandara Signature Massage", 
      img: "/images/services/body/massage_therapy/massage.jpg",
      desc: "Our relaxing and healing strokes with heat pad therapy, combined with our signature blend of healing olive and all-organic aromatic oils will take you into a trance. This massage will loosen tight muscles, leave you feeling recuperated, reconnected mind, body and soul."
    },
    { title: "Hot Stone Massage", 
      img: "/images/services/body/massage_therapy/stone.jpg",
      desc: "The healing power of nature’s harvested stones and combined therapeutic techniques warm you and bring you to a more tranquil state."
    },
    { title: "Four Hands Therapy", 
      img: "/images/services/body/massage_therapy/four.jpg",
      desc: "A truly inspiring and unforgettable spa experience, the medium pressure of Mandara’s Four Hands Therapy incorporates the exacting skills of two therapists working together in rhythmic tandem."
    },
    { title: "Ventosa Cupping with Hilot", 
      img: "/images/services/body/massage_therapy/cupping.jpg",
      desc: "A traditional form of massage that removes tissue congestion and muscles spasm also known to more Pinoys as lamig with the use of cups placed on various pressure points on the back."
    },
    { title: "Ventosa Cupping with Signature Massage", 
      img: "/images/services/body/massage_therapy/cupping2.jpg",
      desc: "The ultimate healing massage therapy combo to rid-off muscle spasm or “lamig” as known to Filipinos, followed by a deeply relaxing Signature Massage. Feel your temsed muscles and stress melt away as your therapist slowly apply heat pads and perform Mandara’s carefully curated signature massage techniques while using organic olive massage and essential oils."
    },
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
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:font-semibold text-center font-serif">The Mandara Spa Body Rituals: Massage Therapy</h1>
          <div className="flex justify-center items-center">
            <button className="custom-prev mr-[-80] sm:mr-0 md:scale-100 rounded-full scale-50 top-2/5 left-60 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
              ❮
            </button>

            <div className="relative flex justify-center items-center w-sm md:w-lg lg:w-3xl xl:w-5xl 2xl:w-7xl scale-70 mt-[-100] mb-[-100] sm:scale-100 sm:mt-0 sm:mb-0 px-4">
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
                      {service.desc}
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
      <Footer />
    </div>
  );
}