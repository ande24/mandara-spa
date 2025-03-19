'use client'

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/bookingForm";
import Image from "next/image";
import NavBar1 from "@/components/navbar1";
import NavBar2 from "@/components/navbar2";
import { FaMapMarkerAlt, FaClock, FaPhone } from "react-icons/fa";

export default function Page() {
    const { user } = useAuthContext()
    const router = useRouter()
    const [showForm, setShowForm] = useState(false)
    const [redirect, setRedirect] = useState(false)

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
    <div className="relative flex bg-gray-200 min-h-screen justify-center items-center overflow-auto">
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}
      <div className="absolute flex justify-center items-center inset-x-0 top-0 w-full z-20 h-24 bg-[#502424] opacity-100">
        <div className="flex justify-center items-center">
          <div>
            <NavBar1 currPage={"contact"}/>
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
            <NavBar2 currPage={"contact"}/>
          </div>
        </div>
      </div>

      <div className="flex relative top-22 min-h-screen w-screen">
        <div className="flex flex-col h-fit p-2 px-26 justify-center items-center relative h-sm w-1/2 ">
          <div className="flex flex-col w-full  font-serif space-y-1 hover:shadow-lg hover:scale-105 transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-xl text-center font-semibold mb-2">SM North</h2>
            <p className="flex items-center gap-4 text-sm">
              <FaMapMarkerAlt className="text-[#502424] m-1" /> 2nd Floor, SM North Towers, SM North Edsa Quezon City
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaClock className="text-[#502424] m-1" /> Monday to Sunday, 10am to 10pm
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaPhone className="text-[#502424] m-1" /> 
              <div>
                <p>Landline: 8427 1012</p>
                <p>Mobile: +63 917 549 5777</p>
              </div>
            </p>
          </div>

          <div className="flex flex-col w-full font-serif  hover:shadow-lg hover:scale-105 transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-xl text-center font-semibold mb-2">Greenhills</h2>
            <p className="flex items-center gap-4 text-sm">
              <FaMapMarkerAlt className="text-[#502424] m-2" /> Mezzanine Floor, Atlanta Centre, 31 Annapolis St., Greenhills, San Juan City
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaClock className="text-[#502424] m-2" /> Monday to Saturday, 12nn to 11pm
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaPhone className="text-[#502424] m-2" /> 
              <div>
                <p>Mobile: +63 917 549 5777</p>
                <p>Landline: 8427 1012</p>
              </div>
            </p>
          </div>

          <div className="flex flex-col w-full font-serif  hover:shadow-lg hover:scale-105 transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-xl text-center font-semibold mb-2">Parañaque</h2>
            <p className="flex items-center gap-4 text-sm">
              <FaMapMarkerAlt className="text-[#502424] m-2" /> Ground Floor, President’s Grove, 15 President’s Avenue, BF Paranaque City
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaClock className="text-[#502424] m-2" /> Monday to Sunday, 1pm to 12am
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaPhone className="text-[#502424] m-2" /> 
              <div>
                <p>Mobile: +63 925 556 8858 | +63 917 162 1423</p>
              </div>
            </p>
          </div>

          <div className="flex flex-col w-full font-serif  hover:shadow-lg hover:scale-105 transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-xl text-center font-semibold mb-2">Bonifacio Global City</h2>
            <p className="flex items-center gap-4 text-sm">
              <FaMapMarkerAlt className="text-[#502424] m-2" /> Unit 318 McKinley Park Residences, 3rd Avenue cor. 31st St, Bonifacio Global City, Taguig 
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaClock className="text-[#502424] m-2" /> Monday to Sunday, 12nn to 11pm
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaPhone className="text-[#502424] m-2" /> 
              <div>
                <p>Mobile: +63 915 844 3003</p>
                <p>Landline: 8869 9910</p>
              </div>
            </p>
          </div>

          <div className="flex flex-col w-full font-serif  hover:shadow-lg hover:scale-105 transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-xl text-center font-semibold mb-2">Camaya Coast, Bataan</h2>
            <p className="flex items-center gap-4 text-sm">
              <FaMapMarkerAlt className="text-[#502424] m-2" /> Sands Hotel, Camaya Coast Resort, Bataan
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaClock className="text-[#502424] m-2" /> Monday to Sunday, 12nn to 11pm
            </p>
            <p className="flex items-center gap-4 text-sm">
              <FaPhone className="text-[#502424] m-2" /> 
              <div>
                <p>Mobile: +63 917 840 8159</p>
              </div>
            </p>
          </div>
        </div>

        <div className="hidden md:flex relative min-h-screen md:w-1/2 rounded-l-lg w-full">
          <div className="absolute top-0 bg-[#301414] h-full w-full z-10 shadow-lg rounded-l-lg shadow-[#301414]"></div>
          <form className="mx-auto mt-8 mb-0 min-w-100 max-w-lg z-10  space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                  placeholder="Enter full name"
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c3.866 0 7 3.134 7 7H5c0-3.866 3.134-7 7-7zm0-4a4 4 0 110-8 4 4 0 010 8z"/>
                </svg>

                </span>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email</label>

              <div className="relative">
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full font-serif bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="number" className="sr-only">Mobile Number</label>
                <div className="relative">
                  <input
                    id="number"
                    name="number"
                    type="tel"
                    className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                    placeholder="Enter mobile number"
                    onChange={(e) => setNumber(e.target.value)}
                  />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l3 5-2 2a16 16 0 006 6l2-2 5 3v2a2 2 0 01-2 2h-3c-7.18 0-13-5.82-13-13V7a2 2 0 012-2z"/>
                  </svg>

                </span>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="sr-only">Leave us a message</label>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                  placeholder="Leave us a message"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col text-sm">
                
              </div>

              <button
              type="submit"
              className="font-serif rounded-lg bg-[#e0d8ad] w-1/2 px-5 py-3 text-sm font-medium text-black"
              >
              Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}