'use client'

import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const Image = dynamic(() => import("next/image"));
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
    <div className="flex flex-col">
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}
      <div className="flex justify-center items-center relative w-full h-screen">
        <div className="absolute flex justify-center items-center inset-x-0 top-0 w-full z-20 h-30 bg-[#502424] opacity-80">
          <div className="flex justify-center items-center">
            <NavBar1 currPage={"home"}/>
            <a href="/user/home">
              <Image
                src="/images/mandara_gold.png"
                alt=""
                height={150}
                width={300}
                priority
                className=" mb-4 object-contain scale-50 hover:scale-55 transition-all"
              />
            </a>
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
            <h1 className="text-4xl font-serif mb-4 font-bold text-[#e0d8ad] text-center ">WELCOME TO THE MANDARA SPA</h1>
            <p className="text-gray-100 font-serif text-lg">Elevating the spa experience to a new art form.</p>
          </div>
        </div>
      </div>
      
        <div className="bg-gray-200 flex flex-col justify-center items-center pt-10">
          <h1 className="text-4xl mb-6 text-center font-serif">The Mandara Spa Special Offers</h1>
            <div className="justify-center relative">
              <button className="custom-prev absolute rounded-full scale-80 top-2/5 left-[-50] h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❮
              </button>
  
              <div className="flex  justify-center items-center max-w-7xl w-full mx-auto px-4">
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
                    <button onClick={handleBooking}>
                      <a className="block hover:scale-100 rounded-lg scale-95 hover:bg-gray-50 hover:shadow-lg shadow-gray-300 transition-all p-5 mt-3 mb-5">
                        <Image
                          alt=""
                          src={service.img}
                          className="h-80 w-150 object-cover rounded-lg"
                          height={300}
                          width={300}
                          priority
                        />
    
                        <h3 className="mt-4 text-xl text-left font-serif text-gray-900 ">{service.title}</h3>
    
                        <p className="mt-2 max-w-sm font-serif text-sm text-left leading-relaxed text-gray-700">
                          {service.desc}
                        </p>
                      </a>
                    </button>
                  </SwiperSlide>
                  ))}
                </Swiper>
              </div>
  
              <button className="custom-next absolute rounded-full scale-80 top-2/5 right-[-50] h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                  ❯
              </button>
          </div>
        </div>

        
        <div className="bg-gray-200 h-2xl flex flex-col justify-center items-center pb-10">
          <h1 className="text-4xl mb-6 text-center font-serif">Testimonials</h1>
            <div className="justify-center relative">
              <button className="custom-prev-2 absolute rounded-full scale-80 top-2/5 left-[-50] h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❮
              </button>
  
              <div className="flex justify-center items-center max-w-7xl w-full mx-auto px-4">
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
                    640: { slidesPerView: 1 },
                    1024: { slidesPerView: 3 },
                  }}
                >
                {reviews.map((review, index) => (
                  <SwiperSlide key={index}>
                    <blockquote className="hover:scale-100 rounded-lg scale-95 hover:shadow-lg shadow-gray-300 transition-all hover:bg-gray-50  bg-gray-200 p-10  sm:p-8">
                      <div className="flex items-center gap-4">
                        <Image
                          alt=""
                          src={review.img}
                          className="size-14 rounded-full object-cover"
                          height={100}
                          width={100}
                          layout="intrinsic"
                          priority
                        />

                        <p className="mt-0.5 text-xl font-medium text-gray-900">{review.title}</p>
                      </div>

                      <p className="mt-4 text-sm/relaxes text-gray-700">
                        {review.desc}
                      </p>
                    </blockquote>
                  </SwiperSlide>
                  ))}
                </Swiper>
              </div>
  
              <button className="custom-next-2 absolute rounded-full scale-80 top-2/5 right-[-50] h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
                ❯
              </button>
            </div>
        </div>
        <Footer />
    </div>
  );
}