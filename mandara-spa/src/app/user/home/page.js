'use client'

import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FiMenu, FiLogOut } from "react-icons/fi";
import Image from "next/image";

const NavBar1 = dynamic(() => import("@/components/navbar1"), { ssr: false });
const NavBar2 = dynamic(() => import("@/components/navbar2"), { ssr: false });
const SlidingButton = dynamic(() => import("@/components/slidingButton"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });
const BookingForm = dynamic(() => import("@/components/bookingForm"), { ssr: false });

export default function Page() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const services = [
    { title: "On-The-Go Recharge", 
      img: "/images/services/special/onthego.jpg",
      desc: "A fully-clothed massage for guests on the go, focusing on the arms, shoulders, back, and feet in our relaxing lounge."
    },
    { title: "Stress Buster", 
      img: "/images/services/special/stress.png",
      desc: "1 hour and 15 minutes Signature Massage plus 15 minutes Xiamen Foot Massage."
    },
    { title: "Foot Break", 
      img: "/images/services/special/foot.jpg",
      desc: "Signature Foot Spa with Green Tea Pedicure plus Xiamen Foot Massage."
    },
    { title: "Wellness Ritual", 
      img: "/images/services/special/wellness.png",
      desc: "1 hour and 15 minutes Signature Massage plus Cleansing Spa Facial."
    },
    { title: "Personal Retreat", 
      img: "/images/services/special/personal.png",
      desc: "Signature Scrub, Wrap, and Massage, Xiamen Foot Massage plus Scalp and Hair Revitalizing Ritual."
    },
    { title: "Couple’s Retreat", 
      img: "/images/services/special/couple.png",
      desc: "Signature Scrub, Wrap, and Massage, Xiamen Foot Massage plus Scalp and Hair Revitalizing Ritual for two persons."
    },
    { title: "Ultimate Mandara Experience", 
      img: "/images/services/special/ultimate.png",
      desc: "Signature Scrub, Wrap, and Massage, Xiamen Foot Massage, Foot Spa plus Ear Candling OR Scalp and Hair Revitalizing Ritual."
    },
  ];

  const reviews = [
    { title: "Timmyrose", 
      img: "/images/testimonials/girl2.jpg",
      desc: "\"We are spa lovers and tried a lot of spa within Pasay and Makati. I bumped into The Mandara Spa and tried their Signature Body Scrub and Massage as my gift for my husband’s birthday and thank God I decided to try it! It is the best body scrub and massage I ever had here in Luzon. My husband, being a guy who is particular in the scent being used on him, he liked the one they use in Mandara. The scrub and oil they used is very relaxing. The staff are very accommodating and the massage is 2 thumbs up!\""
    },
    { title: "Christina Advincula", 
      img: "/images/testimonials/girl1.jpg",
      desc: "\"Everything in The Mandara Spa exudes a breath of fresh air. Overall, the experiences of rituals-massage, scrub and facial were beyond the usual spa experiences I’ve had. After going to The Mandara Spa, I realized I am not paying for service. I am paying for both experience and art form. The Mandara Spa is indeed a master in the art of relaxation!\""
    },
    { title: "A. Aquino", 
      img: "/images/testimonials/boy1.jpg",
      desc: "\"Friendly staff, awesome place, top notch services and value for money!\""
    },
    { title: "Laarni D", 
      img: "/images/testimonials/girl3.jpg",
      desc: "\"The Mandara Spa is by far the best spa I have ever been. The place is very relaxing and the staff are very accommodating. The therapist was really good. She met all my expectations when it comes to massage, she was very gentle yet firm just the way I like it. I fell asleep within 10 minutes of the whole 2hrs session coz I availed The Mandara Signature package and it was all worth every single peso for it.\""
    },
  ];

  const handleBooking = () => {
    if (user) {
      console.log("showing form");
      setShowForm(true);
    }
    else {
      router.push("/user/login");
    }
  }
return ( 
    <div className="flex flex-col overflow-x-hidden">
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}
      <div className="flex justify-center items-center relative w-screen h-screen">
        <div className="absolute flex justify-center items-center inset-x-0 top-0 w-screen z-20 h-30 bg-[#502424] opacity-80">
          <div className="flex justify-center items-center">
            <NavBar1 currPage={"home"} />
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
            <NavBar2 onBook={handleBooking} currPage={"home"}/>
          </div>
        </div>

        <div className="absolute h-min flex bottom-45 justify-center items-center z-20">
          <SlidingButton onBook={handleBooking}/>
        </div>

        <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/video_poster.png"
        className="absolute w-full h-full object-cover"
        >
          <source src="/images/home_video.mp4" type="video/mp4"/>
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-x-0 bottom-0 w-full h-36 bg-[#502424] opacity-80">
          <div className="flex justify-center items-center flex-col w-full h-full">
            <h1 className="text-lg font-serif mb-4 sm:text-3xl md:text-4xl font-bold text-[#e0d8ad] text-center ">WELCOME TO THE MANDARA SPA</h1>
            <p className="text-gray-100 font-serif text-xs sm:text-md md:text-lg">Elevating the spa experience to a new art form.</p>
          </div>
        </div>
      </div>
      
        <div className="bg-gray-200 flex-col flex justify-center items-center pt-10">
          <h1 className="text-3xl xl:text-4xl mb-[-30] text-center font-serif">The Mandara Spa Special Offers</h1>
            <div className="flex items-center justify-around">
              <button className="custom-prev scale-80 xl rounded-full w-13 h-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❮
              </button>
  
              <div className="flex justify-center h-min items-center max-w-3xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-5xl 2xl:max-w-7xl">
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
                    1280: { slidesPerView: 3 },
                  }}
                >
                {services.map((service, index) => (
                  <SwiperSlide key={index}>
                    <button onClick={handleBooking}>
                      <a className="p-3 block hover:scale-85 rounded-lg scale-80 hover:bg-gray-50 hover:shadow-lg shadow-gray-300 transition-all">
                        <Image
                          alt=""
                          src={service.img}
                          className="h-80 w-150 object-cover rounded-lg"
                          height={300}
                          width={300}
                          priority
                        />
    
                        <h3 className="mt-4 text-xl text-left font-serif text-gray-900 ">{service.title}</h3>
    
                        <p className="mt-2 h-min max-w-sm font-serif text-sm text-left leading-relaxed text-gray-700">
                          {service.desc}
                        </p>
                      </a>
                    </button>
                  </SwiperSlide>
                  ))}
                </Swiper>
              </div>
  
              <button className="custom-next scale-80 rounded-full h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                  ❯
              </button>
          </div>
        </div>

        
        <div className="bg-gray-200  flex flex-col justify-center items-center pb-10">
          <h1 className="text-3xl text-center mb-[-30] font-serif">Testimonials</h1>
            <div className="flex justify-around items-center">
              <button className="custom-prev-2 rounded-full scale-80 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❮
              </button>
  
              <div className="flex justify-center items-center max-w-3xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-5xl 2xl:max-w-7xl">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={50}
                  slidesPerView={3}
                  loop={true} 
                  loopAddBlankSlides={true}
                  navigation={{
                    nextEl: ".custom-next-2",
                    prevEl: ".custom-prev-2",
                  }}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    1280: { slidesPerView: 3 },
                  }}
                >
                {reviews.map((review, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex flex-col p-3 justify-start min-h-100 hover:scale-85 rounded-lg scale-80 hover:shadow-lg shadow-gray-300 transition-all hover:bg-gray-50  bg-gray-200">
                      <div className="flex items-center gap-4">
                        <Image
                          alt=""
                          src={review.img}
                          className="size-10 rounded-full object-cover"
                          height={100}
                          width={100}
                          priority
                        />

                        <p className=" text-xl font-medium text-gray-900">{review.title}</p>
                      </div>

                      <p className="mt-4 text-sm/relaxes text-gray-700">
                        {review.desc}
                      </p>
                    </div>
                  </SwiperSlide>
                  ))}
                </Swiper>
              </div>
  
              <button className="custom-next-2 rounded-full scale-80 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
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