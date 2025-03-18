'use client'

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/bookingForm";
import Image from "next/image";
import NavBar1 from "@/components/navbar1";
import NavBar2 from "@/components/navbar2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function Page() {
  // useEffect(() => {
  //   const swiperInstance = document.querySelector(".swiper")?.swiper;
  //   if (swiperInstance) {
  //     swiperInstance.params.navigation.prevEl = ".custom-prev";
  //     swiperInstance.params.navigation.nextEl = ".custom-next";
  //     swiperInstance.navigation.init();
  //     swiperInstance.navigation.update();
  //   }
  // }, []);

    const { user } = useAuthContext()
    const router = useRouter()
    const [showForm, setShowForm] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const events = [
      {
        title: "Authentic Hilot",
        date: "",
        img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        desc: "A traditional Filipino massage designed to heal and relieve tired, tense muscles. This therapy is ideal for those suffering from back pain, spasms, frozen shoulders, misaligned or compressed bones, fatigue, restlessness, or simply seeking a deeper level of relaxation and wellness."
      },
      {
        title: "Pre/Post Natal Massage",
        date: "",
        img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        desc: "Relieve discomfort, reduce stress, improve sleep, and alleviate various discomforts associated with pregnancy. (Physician approval required prior to booking an appointment)."
      },
      {
        title: "Ventosa Cupping With Hilot",
        date: "",
        img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        desc: "A traditional Chinese massage that alleviates tissue congestion and muscle spasms, commonly known to many Filipinos as 'lamig.' This therapy uses cups placed on various pressure points on the back to promote relief and relaxation."
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
    <div className="relative flex bg-gray-200 h-screen justify-center items-center overflow-y-auto">
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}
      <div className="absolute flex justify-center items-center inset-x-0 top-0 w-full z-20 h-24 bg-[#502424] opacity-100">
        <div className="flex justify-center items-center">
          <div>
            <NavBar1 currPage={"info"}/>
          </div>
          <div>
            <a href="/user/home">
              <Image
                src="/images/mandara_gold.png"
                alt=""
                height={85}
                width={194}
                className="mb-2 object-contain scale-50 hover:scale-60 transition-all"
            />
            </a>
          </div>
          <div>
            <NavBar2 currPage={"face"}/>
          </div>
        </div>
      </div>

      <div className="flex relative top-24 h-full w-screen">
        <div className="relative h-full w-1/3 rounded-lg">
          <div className="absolute top-0 bg-white opacity-75 h-full w-full z-10 shadow-lg rounded-r-lg shadow-[#301414]"></div>

          <h3 className="absolute top-8 inset-x-0 text-center  text-[#502424] font-semibold text-xl z-20">MANDARA - (Man-da-ra). Noun.</h3>
          <p className="absolute text-xs inset-x-0 text-justify top-17 px-10 z-20">Derived from two words – mana and dara, which means mind and single line. is a sacred mountain in Hindu Mythology that served the gods by being the churning rod that mizes the ocean of milk. This mountain is not made of fragmented stones but of a single connected structure.</p>
          <p className="absolute text-xs inset-x-0 text-justify top-37 px-10 z-20">The Mandara Relaxation Spa Co.  pioneered the Boutique Spa concept in the Philippines offering personalized, luxurious treatments from head to toe at the best value-for-money rates. Leading the Mid-priced spa market in the Philippines, The Mandara Spa has received numerous recognitions and have been listed as one of Philippine’s Top Spas alongside Five Star Hotel spas. The Mandara Spa best serves guests looking for a spa haven offering a true relaxing retreat with all the basic amenities, and with Massage techniques that is second to none, without the hefty price tag.
          The first  branch in BGC which started in 2011 was dubbed “BGC’s best kept secret”. To date, The Mandara Spa is continuously expanding to bring The Mandara Spa Experience closer to the communities. Franchise and Investment Opportunities are available to qualified investors.</p> 
          
          <h3 className="absolute top-87 inset-x-0 text-center  text-[#502424] font-semibold text-xl z-20">MISSION</h3>
          <p className="absolute text-xs inset-x-0 text-justify top-95 px-10 z-20">At the Mandara Spa, we aim to continuously excel in providing superior relaxing experience and luxurious services at the best value-for-money rates.</p>
          
          <h3 className="absolute top-108 inset-x-0 text-center  text-[#502424] font-semibold text-xl z-20">AWARDS</h3>
          <p className="absolute text-xs inset-x-0 text-center top-116 px-10 z-20">Global Excellence Awards, Most Outstanding Spa 2015</p>
          <p className="absolute text-xs inset-x-0 text-center top-120 px-10 z-20">Manila’s Top 10 Spas – Spot.ph</p>
          <p className="absolute text-xs inset-x-0 text-center top-124 px-10 z-20">Top Luxury Spas in Philippines – getspabulous.com</p>
          
          <h3 className="absolute top-133 inset-x-0 text-center  text-[#502424] font-semibold text-xl z-20">CAREERS</h3>
          <p className="absolute text-xs inset-x-0 text-center top-141 px-10 z-20">At The Mandara Spa, we aim to continuously help people by providing a workplace with a good working environment and work-life balance.</p>
          <p className="absolute text-xs inset-x-0 text-center top-152 px-10 z-20">For interested applicants, please email your resume to careers@themandaraspa.com.”</p>
          <Image
            alt=""
            src="/images/about_us.jpg"
            className="h-full w-full object-cover z-0 rounded-r-lg"
            fill
          />
        </div>

        {/* <div className="flex flex-col justify-center items-center relative h-200 w-2/3 ">
          <div className="max-w-5xl h-80 mb-10 bg-red-50">
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
            {events.map((event, index) => (
              <SwiperSlide key={index}>
                <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    className="h-40 w-full object-cover"
                  />

                  <div className="bg-white h-40 p-4 sm:p-6">
                    <time datetime="2022-10-10" className="block text-xs text-gray-500"> 10th Oct 2022 </time>

                    <a href="#">
                      <h3 className="mt-0.5 text-lg text-gray-900">How to position your furniture for positivity</h3>
                    </a>

                    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
                      pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem,
                      mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque
                      dignissimos. Molestias explicabo corporis voluptatem?
                    </p>
                  </div>
                </article>
              </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="max-w-5xl h-80 bg-yellow-50">
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
            {events.map((event, index) => (
              <SwiperSlide key={index}>
                <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    className="h-40 w-full object-cover"
                  />

                  <div className="bg-white p-4 h-40 sm:p-6">
                    <time datetime="2022-10-10" className="block text-xs text-gray-500"> 10th Oct 2022 </time>

                    <a href="#">
                      <h3 className="mt-0.5 text-lg text-gray-900">How to position your furniture for positivity</h3>
                    </a>

                    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
                      pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem,
                      mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque
                      dignissimos. Molestias explicabo corporis voluptatem?
                    </p>
                  </div>
                </article>
              </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div> */}
      </div>
    </div>
  );
}