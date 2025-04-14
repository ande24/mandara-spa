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
    { title: "The Mandara Signature Massage", 
      img: "/images/services/signature/massage.jpg",
      desc: "Our relaxing and healing strokes, combined with head pad therapy and our signature blend of healing olive oil and all-organic aromatic oils, will take you into a trance. This massage will loosen tight muscles, leaving you feeling rejuvenated and reconnected—mind, body, and soul."
    },
    { title: "The Mandara Signature Scrub, Wrap, Massage", 
      img: "/images/services/signature/scrub2.jpg",
      desc: "Deeply hydrate your skin and awaken your senses with our signature aromatic scrub, followed by our unique blend of healing olive oil and aromatic oils. A 15-minute wrap allows the masque to deeply nourish and replenish your skin while calming your mind and body. Finally, drift into a trance with a 75-minute signature massage, enhanced by heat pad therapy to loosen tight muscles and take you to a deeper level of relaxation."
    },
    { title: "The Mandara Signature Scrub", 
      img: "/images/services/signature/scrub.jpg",
      desc: "Achieve silky-smooth skin with our signature body polish, featuring a premium organic scrub and a blend of healing olive oil and aromatic oils. First, your skin is gently brushed with our Body Brush to exfoliate dead skin and stimulate lymph flow. Next, an aromatic body scrub is applied to further exfoliate and soften your skin while calming your mind and body. Finally, a soothing butter is massaged in to deeply hydrate, leaving your skin soft, smooth, and revitalized."
    },
    { title: "The Mandara Signature Body Scrub & Massage", 
      img: "/images/services/signature/combo.jpg",
      desc: "Feel pampered and rejuvenated with a body scrub made from organic olive ingredients, known for their healing benefits, followed by our most-raved-about 75-minute signature massage, featuring heat pads to help loosen tight muscles."
    },
    { title: "The Mandara Signature Foot Spa with Pedicure", 
      img: "/images/services/signature/foot.jpg",
      desc: "This special signature foot spa refreshes and enlivens tired feet. Relax as we immerse your feet in a warm, aromatic foot soak before softening the skin with herbal exfoliation. Feel the healing and refreshing effects of an olive and peppermint-infused foot masque as it revitalizes your feet. Then, enjoy nail nurturing, cuticle care, and a perfect polish to complete the experience."
    },
    { title: "The Mandara Signature Hand Spa with Manicure", 
      img: "/images/services/signature/hand.jpg",
      desc: "Restore the glory and suppleness of your hands with this special signature hand spa. Our herbal exfoliation will rid your hands of dead skin before they are wrapped in nourishing Dead Sea mud. Feel your stress melt away with a hot towel wrap, followed by a soothing hand massage using olive and vitamin E butter. Finish off with the application of your favorite imported polish."
    },
    { title: "Ultimate Mandara Experience Scrub + Wrap + Massage + Footspa + Facial or Ear Candling", 
      img: "/images/services/signature/ultimate.jpg",
      desc: "Indulge in the best and most luxurious pampering retreat. Experience the royal treatment as we pamper you from head to toe with Mandara’s most-loved rituals, using only the finest organic ingredients. This will surely leave you feeling enlivened—body, mind, and soul. It’s everything your body could ask for."
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
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-gray-100">
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
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:font-semibold text-center font-serif">The Mandara Spa Signature Rituals</h1>
          <div className="flex justify-center items-center">
            <button className="custom-prev mr-[-80] sm:mr-0 md:scale-100 rounded-full scale-50 top-2/5 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
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
                  <a onClick={handleBooking} className="block hover:scale-100 scale-95 rounded-xl p-3 hover:shadow-lg shadow-gray-300 transition-all mt-3 mb-15">
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

            <button className="custom-next rounded-full ml-[-80] md:scale-100 sm:ml-0 scale-50 top-2/5 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-50 transition-all">
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