'use client'

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FiMenu, FiLogOut } from "react-icons/fi";

const Image = dynamic(() => import("next/image"));
const BookingForm = dynamic(() => import("@/components/bookingForm"));
const NavBar1 = dynamic(() => import("@/components/navbar1"));
const NavBar2 = dynamic(() => import("@/components/navbar2"));
const Footer = dynamic(() => import("@/components/footer"));

export default function Page() {
    const [showForm, setShowForm] = useState(false)
    const events = [
      {
        title: "Anya’s Girls Power Kiddie Sparty",
        img: "/images/events/event1.jpg",
        desc: "Birthdays are always fun when celebrated with friends! On December 10, 2018, Anya and her BFFs spent an afternoon enjoying a kiddie spa retreat at The Mandara Spa – One Serendra Branch. The girls had their nails done with a manicure and pedicure, received a relaxing kiddie massage, and absolutely loved the house-blend ginger tea!\n\nFor spa party bookings, please call +63 917 173 8767 or email inquiry@themandaraspa.com"
      },
      {
        title: "Giving More Courage to Courageous Caities’ Mom Feliz Lucas",
        img: "/images/events/event2.png",
        desc: "On May 15, 2016, the friends of Feliz Lucas, Courageous Caitie’s mom, treated her to an afternoon of affirmation and relaxation with a spa party at The Mandara Spa – Greenhills Branch. The afternoon was filled with love, kind words, and affirmations as the group enjoyed a peaceful spa retreat accompanied by healthy and indulgent canapés.\n\nFor spa party bookings, please call +63 917 173 8767 or email inquiry@themandaraspa.com"
      },
      {
        title: "SM North Towers Grand Opening",
        img: "/images/events/event3.jpg",
        desc: "In December 2018, SM North Edsa opened North Towers, SM’s new retail space, which housed over 60 tenants and lifestyle concepts, providing customers with more opportunities to explore and discover. Upon entering North Towers from its main entrance on the ground floor, visitors were welcomed by the warmth and inviting aromas of Starbucks Reserve. North Towers could also be accessed via the link from The Block beside F21 and was connected to Park Inn by Radisson. The Mandara Spa – SM North Towers Branch also opened its doors to guests in December 2018.\n\nFor investment and franchise inquiries, please call +63 917 173 8767 or email inquiry@themandaraspa.com"
      },
      {
        title: "The Mandara Spa opens at One Serendra, BGC ",
        img: "/images/events/event4.jpg",
        desc: "On November 6, 2018, the newly renovated spa facility at One Serendra was officially opened for the exclusive use of its residents. The Mandara Spa had been the spa operator of One Serendra since early 2018, providing in-room spa services while awaiting the completion and turnover of its spa facility.  One Serendra, a premier development by Ayala Land Premier, offers a low-density community amid one of the metro’s busiest and most world-class cities—Bonifacio Global City.\n\nFor spa concession or operator inquiries, please call +63 917 173 8767 or email inquiry@themandaraspa.com"
      },
      {
        title: "Kraft Eden Cheese Launch and Demo",
        img: "/images/events/event5.jpg",
        desc: "On May 17, 2018, Eden Cheese invited the media to an afternoon cooking demo with Celebrity Chef JP Anglo of Sarsa Resto + Bar. The event was hosted by Ms. Dimples Romana and kicked off with a relaxing five-minute back massage from The Mandara Spa, which the guests and media influencers enjoyed.\n\nFor corporate bookings, please call +63 917 173 8767 or email inquiry@themandaraspa.com"
      },
      {
        title: "Christmas Party 2018",
        img: "/images/events/event6.jpg",
        desc: "The Mandara Spa celebrated its 7th Anniversary and Christmas Party at the Ballroom of F1 Hotel in BGC. The team enjoyed great food and music as a hunky duo serenaded them with the hit 'Pusong Bato,' leaving the ladies gawking and shrieking. Exciting prizes were given away during the fun games, while cash prizes were awarded to those who won Best in Costume.\n\nThe night concluded with a sharing of God’s words by Pastors Paul and Vicky Mata of Word for All Nations, followed by closing remarks from The Mandara Spa’s CEO, Junlyn Miranda."
      },
      {
        title: "Christmas Party 2017",
        img: "/images/events/event7.jpg",
        desc: "Our team works hard and parties even harder! The Mandara Spa team celebrated its 6th Anniversary with a bang, enjoying a night filled with fun and games at Red Box KTV in Greenbelt, Makati. It was an evening of laughter, excitement, and sharing of blessings—an unforgettable celebration that will surely keep the team motivated for years to come!"
      },
      {
        title: "Christmas Party 2016",
        img: "/images/events/event8.jpg",
        desc: "The Mandara Spa team celebrated its 5th Anniversary and Christmas Party at Marco Polo Ortigas on December 19, 2016, marking the occasion with joy, camaraderie, and festive cheer."
      },
      {
        title: "Team Building",
        img: "/images/events/event9.jpg",
        desc: "All work and no play? Not for The Mandara Spa team! On September 12, 2018, the team enjoyed a well-deserved R&R at Aquaria Resorts in Calatagan, Batangas, where they participated in team-building activities. It was an opportunity for everyone to reconnect, realign with the company’s vision, and strengthen their commitment to providing guests and patrons with an even better experience."
      },
      {
        title: "The Mandara Spa Flagship Store Opened at Conrad Manila, MOA Complex",
        img: "/images/events/event10.jpg",
        desc: "The Mandara Spa opened at S Maison, a high-end retail complex in Conrad Manila, the newest luxury destination in Manila, offering the best views of the Manila Bay sunset. The 206 sqm spa became The Mandara Spa’s flagship store, featuring additional amenities and treatments unique to this branch. Boasting luxurious treatments and well-curated interiors, the flagship store officially opened in the 3rd quarter of 2019."
      },
      {
        title: "The Mandara Spa Flagship Store Opening Soon at Conrad Manila",
        img: "/images/events/event11.png",
        desc: "The Mandara Spa opened at S Maison, a high-end retail complex in Conrad Manila, one of the newest luxury destinations in Manila, offering stunning views of the Manila Bay sunset. The 206 sqm spa became The Mandara Spa’s flagship store, featuring additional amenities and exclusive treatments unique to this branch. Boasting luxurious treatments and well-curated interiors, the flagship store officially opened in the 3rd quarter of 2019."
      },
    ];

    const blogs = [
      {
        title: "The Mandara Spa Opens in Greenhills",
        link: "https://gretasjunkyard.com/the-mandara-spa-opens-in-greenhills/",
        date: "7/2/2015",
        img: "/images/blogs/blog1.jpg",
        desc: "I get a lot of hard knots here often, because of my bad posture and stress at work. But she [therapist] really concentrated on the area and was able to get rid of them. I felt so light and relieved after..."
      },
      {
        title: "10 Places to Go to Get a Quick Treatment on Your Lunch Break",
        link: "https://www.spot.ph/shopping/the-latest-shopping/70737/10-places-quick-treatments-lunch-break-a1805-20170714-lfrm2",
        date: "7/14/2017",
        img: "/images/blogs/blog2.jpg",
        desc: "Your lunch break can go a long way at The Mandara Spa because they offer multiple treatments that are only 30 minutes long..."
      },
      {
        title: "10 Must-try Spa Treatments in Manila",
        link: "https://www.spot.ph/shopping/the-latest-shopping/57721/10-must-try-spa-treatments-in-manila",
        date: "11/12/2014",
        img: "/images/blogs/blog3.jpg",
        desc: "Mandara Spa is unassuming and modest, but we weren’t here for posh pampering-a little bird told us that the hilot was amazing..."
      },
      {
        title: "Top 10 Places for Foot Massage in Manila",
        link: "https://www.spot.ph/shopping/the-latest-shopping/75295/top-10-foot-massage-manila-a00023-20180930-lfrm3",
        date: "9/30/2018",
        img: "/images/blogs/blog4.jpg",
        desc: "The place gives off a restful vibe, but what really makes the place stand out is the service of the staff and therapists..."
      },
    ];

  return (
    <div className="relative flex flex-col bg-gray-200 min-h-screen w-full justify-center items-center overflow-x-hidden">
    {showForm && <BookingForm onClose={() => setShowForm(false)} />}
      <div className="flex justify-center items-center w-full h-24 z-50 bg-[#502424]">
        <div className="flex justify-center items-center">
          <NavBar1 currPage={"info"} />
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
          <NavBar2 currPage={"info"}/>
        </div>
      </div>
      

      <div className="flex flex-col lg:flex-row justify-center items-center relative min-h-screen w-full">
        <div className="h-full md:w-2/3 lg:w-3/7 transition-all">
          <div className="flex flex-col lg:h-280 xl:h-270 2xl:h-260 h-full text-[#e0d8ad] p-8 xl:p-20 sm:p-13 pt-8 justify-center items-center md:rounded-b-lg lg:rounded-r-lg lg:rounded-l-none md:shadow-md shadow-black bg-[#301414]">
            <div className="flex flex-col justify-center items-center">
              <h3 className="mb-3 font-semibold xl:mt-8 text-xl sm:text-2xl ">MANA + DARA</h3>
              <p className="indent-8 text-xs sm:text-sm mb-3 text-justify ">Derived from the words mana (mind) and dara (single line), Mandara refers to a sacred mountain in Hindu mythology. This mountain, unlike fragmented rock formations, is a single, unified structure. It played a significant role as the churning rod used by the gods to stir the ocean of milk.</p> 
              <p className="indent-8 text-xs sm:text-sm mb-3 text-justify ">The Mandara Relaxation Spa Co. introduced the Boutique Spa concept to the Philippines, offering customized, high-end treatments from head to toe at competitive prices. As a leader in the mid-priced spa industry, The Mandara Spa has garnered multiple accolades and is recognized among the country’s top spas, standing alongside luxury hotel spas. It is the ideal destination for guests seeking a serene retreat with essential amenities and world-class massage techniques—all without the premium cost.</p>
              <p className="indent-8 text-xs sm:text-sm mb-3 text-justify ">Established in 2011, its first branch in BGC quickly gained a reputation as “BGC’s best-kept secret.” Today, The Mandara Spa continues to expand, making its signature experience more accessible to communities. Franchise and investment opportunities are available for qualified investors.</p>
            </div>

            <div className="flex flex-col justify-center items-center text-center">
              <h3 className=" font-semibold text-xl lg:mt-5 sm:text-2xl">MISSION</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-center mt-2 ">At the Mandara Spa, we aim to continuously excel in providing superior relaxing experience and luxurious services at the best value-for-money rates.</p>
              
            </div>
            
            <div className="flex flex-col mt-5 justify-center items-center text-center">
              <h3 className=" font-semibold text-xl lg:mt-5 sm:text-2xl">AWARDS</h3>
              <p className="text-xs sm:text-sm mt-2 ">Global Excellence Awards, Most Outstanding Spa 2015</p>
              <p className="text-xs sm:text-sm ">Manila’s Top 10 Spas – Spot.ph</p>
              <p className="text-xs sm:text-sm ">Top Luxury Spas in Philippines – getspabulous.com</p>
              
            </div>
            
            <div className="flex flex-col mt-5 justify-center items-center text-center">
              <h3 className=" font-semibold text-xl lg:mt-5 sm:text-2xl ">CAREERS</h3>
              <p className="text-xs sm:text-sm mt-2 ">At The Mandara Spa, we aim to continuously help people by providing a workplace with a good working environment and work-life balance.</p>
              <p className="text-xs sm:text-sm ">For interested applicants, please email your resume to careers@themandaraspa.com.</p>
            </div>
          </div>
        </div>
      
        <div className="flex flex-col h-full justify-center items-center lg:w-4/7">
          <h3 className="text-[#502424] mt-10 lg:mt-0  text-center font-semibold text-2xl sm:text-3xl xl:text-3xl z-20">EVENTS</h3>
          <div className="flex w-full justify-center items-center">
            <button className="custom-prev-1 rounded-full scale-50 sm:scale-80 top-2/5 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-40 transition-all">
              ❮
            </button>
            <div className="max-w-xs sm:max-w-lg xl:max-w-xl 2xl:max-w-2xl md:max-w-md">
              <Swiper
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true} 
                navigation={{
                  nextEl: ".custom-next-1",
                  prevEl: ".custom-prev-1",
                }}
                className="scale-90 hover:scale-95 hover:shadow-lg shadow-gray-300 rounded-lg transition-all"
              >
              {events.map((event, index) => (
                <SwiperSlide key={index}>
                  <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
                    <Image
                      alt=""
                      src={event.img}
                      className="h-75 w-full object-cover"
                      height={1000}
                      width={1000}
                      priority
                    />

                    <div className="bg-white h-full p-4 sm:p-6">
                      <h3 className="mt-0.5 text-sm text-gray-900">{event.title}</h3>

                      <p className="mt-2 h-full text-xs/tight text-gray-500">
                      {event.desc.split("\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                      </p>
                    </div>
                  </article>
                </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button className="custom-next-1  rounded-full scale-50 sm:scale-80 top-2/5 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 sm:hover:scale-85 text-white text-3xl flex items-center justify-center z-40 transition-all">
                ❯
            </button>
          </div>
          

          <h3 className="text-[#502424] mt-8 lg:mt-[-10] 2xl:mt-3 text-center  font-semibold text-2xl sm:text-3xl z-20">BLOGS</h3>
          <div className="flex h-full w-auto justify-center items-center lg:mb-0 mb-10">
            <button className="custom-prev-2 rounded-full scale-50 sm:scale-80 top-2/5 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 hover:scale-85 text-white text-3xl flex items-center justify-center z-49 transition-all">
              ❮
            </button>

            <div className="max-w-xs sm:max-w-lg xl:max-w-xl 2xl:max-w-2xl md:max-w-md">
              <Swiper
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true} 
                observer={true} 
                observeParents={true}
                navigation={{
                  nextEl: ".custom-next-2",
                  prevEl: ".custom-prev-2",
                }}
                className="x scale-90 hover:scale-95 transition-all  hover:shadow-lg shadow-gray-300"
              >
              {blogs.map((blog, index) => (
                <SwiperSlide key={index}>
                      <a href={blog.link} className="flex flex-col shadow-sm">
                        <Image
                          alt=""
                          src={blog.img}
                          className="h-75 w-full rounded-t-lg object-cover"
                          height={1000}
                          width={1000}
                          priority
                        />

                      <div className="bg-white p-4 h-full sm:p-6 rounded-b-lg">
                        <time className="block text-xs text-gray-500">{blog.date}</time>
                        <h3 className="mt-0.5 text-sm text-gray-900">{blog.title}</h3>
                        <p className="mt-1  text-xs/tight text-gray-500">{blog.desc}</p>
                      </div>
                    </a>
                </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button className="custom-next-2  rounded-full scale-50 sm:scale-80 top-2/5 h-13 w-13 bg-[#502424] opacity-30 hover:opacity-50 sm:hover:scale-85 text-white text-3xl flex items-center justify-center z-49 transition-all">
                ❯
            </button>
          </div>
        </div>
    </div>

    <div className="w-full z-50">
      <Footer id="footer"/>
    </div>

  </div>
  );
}