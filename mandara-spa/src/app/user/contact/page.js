'use client'

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FaMapMarkerAlt, FaClock, FaPhone } from "react-icons/fa";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import { FiMenu, FiLogOut } from "react-icons/fi";

const Image = dynamic(() => import("next/image"));
const BookingForm = dynamic(() => import("@/components/bookingForm"));
const NavBar1 = dynamic(() => import("@/components/navbar1"));
const NavBar2 = dynamic(() => import("@/components/navbar2"));
const Footer = dynamic(() => import("@/components/footer"));
const SuccessMessage = dynamic(() => import("@/components/success"));
const ErrorMessage = dynamic(() => import("@/components/error"));

export default function Page() {
    const db = getFirestore(firebase_app);
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [message, setMessage] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleForm = async (e) => {
      e.preventDefault();
      setSaving(true)
      console.log(name, email, number, message);
      

      try {
        await addDoc(collection(db, "messages"),  {
          name: name,
          email: email, 
          number: number, 
          message: message,
          date: new Date()
        });

        setSuccessMsg("Message sent successfully!")
        setShowSuccess(true)

        setName("");
        setEmail("");
        setMessage("");
        setNumber("");
      } catch (error) {
        setErrorMsg(error.message)
        setShowError(true)
        console.log(error)
      }
      setSaving(false)
    }

  return (
    <div className="flex flex-col overflow-x-hidden justify-center items-center h-full w-full bg-white">
      {showForm && <BookingForm onClose={() => setShowForm(false)} />}
      {showError && <ErrorMessage message={errorMsg} onClose={() => setShowError(false)}/>}
      {showSuccess && <SuccessMessage message={successMsg} onClose={() => setShowSuccess(false)}/>}

      <div className="flex justify-center items-center w-full h-24 z-50 bg-[#502424]">
        <div className="flex justify-center items-center">
          <NavBar1 currPage={"contact"} />
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
          <NavBar2 currPage={"contact"}/>
        </div>
      </div>
        
      <div className="flex-col lg:flex-row lg:flex-grow flex justify-center items-center h-full w-full bg-white xl:bg-white lg:bg-[#401414]">
        <div className="flex flex-col w-full lg:min-h-250 lg:w-1/2 lg:max-w-full xl:w-1/3 md:max-w-xl justify-center items-center p-6 pb-10 shadow-lg xl:shadow-md rounded-bl-lg shadow-black h-full text-[#e0d8ad] bg-[#401414] z-10">
          <div className="flex flex-col w-full font-serif space-y-1 hover:shadow-lg hover:bg-[#502424] hover:scale-105 transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-base sm:text-xl text-center font-semibold mb-2">SM North</h2>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaMapMarkerAlt className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> 2nd Floor, SM North Towers, SM North Edsa Quezon City
            </p>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaClock className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Monday to Sunday, 10am to 10pm
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <FaPhone className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> 
              <div>
                <p>Landline: 8427 1012</p>
                <p>Mobile: +63 917 549 5777</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full font-serif space-y-1 hover:shadow-lg hover:bg-[#502424] hover:scale-105 transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-base sm:text-xl text-center font-semibold mb-2">Greenhills</h2>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaMapMarkerAlt className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Mezzanine Floor, Atlanta Centre, 31 Annapolis St., Greenhills, San Juan City
            </p>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaClock className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Monday to Saturday, 12nn to 11pm
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <FaPhone className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> 
              <div>
                <p>Mobile: +63 917 549 5777</p>
                <p>Landline: 8427 1012</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full font-serif space-y-1 hover:shadow-lg hover:scale-105 hover:bg-[#502424] transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-base sm:text-xl text-center font-semibold mb-2">Parañaque</h2>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaMapMarkerAlt className=" m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Ground Floor, President’s Grove, 15 President’s Avenue, BF Paranaque City
            </p>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaClock className=" m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Monday to Sunday, 1pm to 12am
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <FaPhone className=" m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> 
              <div>
                <p>Mobile: +63 925 556 8858 | +63 917 162 1423</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full font-serif  hover:shadow-lg hover:scale-105 hover:bg-[#502424] transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-base sm:text-xl text-center font-semibold mb-2">Bonifacio Global City</h2>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaMapMarkerAlt className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Unit 318 McKinley Park Residences, 3rd Avenue cor. 31st St, Bonifacio Global City, Taguig 
            </p>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaClock className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Monday to Sunday, 12nn to 11pm
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <FaPhone className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> 
              <div>
                <p>Mobile: +63 915 844 3003</p>
                <p>Landline: 8869 9910</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col w-full font-serif  hover:shadow-lg hover:scale-105 hover:bg-[#502424] transition-all p-4 shadow-[#502424] rounded-2xl">
            <h2 className="text-base sm:text-xl text-center font-semibold mb-2">Camaya Coast, Bataan</h2>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaMapMarkerAlt className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Sands Hotel, Camaya Coast Resort, Bataan
            </p>
            <p className="flex items-center gap-4 text-xs sm:text-sm">
              <FaClock className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> Monday to Sunday, 12nn to 11pm
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <FaPhone className="m-1 h-3 w-3 sm:h-min sm:w-min min-w-3 min-h-3" /> 
              <div>
                <p>Mobile: +63 917 840 8159</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          
        </div>
        <div className="flex p-3 pt-5 w-full lg:w-1/2 md:max-w-xl lg:max-w-full xl:w-1/3 h-full lg:min-h-250 flex-col justify-center items-center lg:rounded-md xl:rounded-br-lg xl:rounded-l-none xl:shadow-md shadow-lg shadow-black z-20 bg-[#301414]">
          <h3 className="text-2xl sm:text-3xl text-center text-[#e0d8ad] font-semibold mb-8">Send us a Message</h3>
            <form onSubmit={handleForm} className="flex h-full flex-col justify-center items-center w-full px-10 z-10 space-y-6">
                      
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <div className="relative w-full">
                    <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name ? name : ""}
                    className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                    placeholder="Enter full name"
                    onChange={(e) => setName(e.target.value)}
                    />
                          <span className="absolute inset-y-0 end-0 hidden sm:grid place-content-center px-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c3.866 0 7 3.134 7 7H5c0-3.866 3.134-7 7-7zm0-4a4 4 0 110-8 4 4 0 010 8z"/>
                                  </svg>
                          </span>
                  </div>

                  <label htmlFor="email" className="sr-only">Email</label>
                  <div  className="relative w-full">
                          <input
                          id="email"
                          name="email"
                          type="email"
                          value={email ? email : ""}
                          className="w-full font-serif bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                          placeholder="Enter email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          />

                          <span className="absolute inset-y-0 end-0 hidden sm:grid place-content-center px-4">
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

                  <label htmlFor="number" className="sr-only">Mobile Number</label>
                          <div className="relative w-full">
                                  <input
                                  id="number"
                                  name="number"
                                  type="tel"
                                  className="w-full bg-gray-200 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                                  placeholder="Enter mobile number"
                                  value={number ? number : ""}
                                  onChange={(e) => setNumber(e.target.value)}
                                  required
                                  />
                                  <span className="absolute inset-y-0 end-0 hidden sm:grid place-content-center px-4">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l3 5-2 2a16 16 0 006 6l2-2 5 3v2a2 2 0 01-2 2h-3c-7.18 0-13-5.82-13-13V7a2 2 0 012-2z"/>
                                          </svg>
                                  </span>
                          </div>

                  <label htmlFor="message" className="sr-only">Leave us a message</label>
                  <div className="w-full relative">
                          <textarea
                          id="message"
                          name="message"
                          type="text"
                          value={message ? message : ""}
                          className="w-full bg-gray-200 rounded-lg text-black border-gray-200 p-4 h-48 pe-12 text-sm shadow-xs"
                          placeholder="Leave us a message"
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          />
                  </div>

                  <div className="flex items-center justify-between w-full hover:scale-105 transition-all">
                          <button
                          disabled={saving}
                          type="submit"
                          className="font-serif rounded-lg bg-[#e0d8ad] w-1/2 px-5 mb-5 mx-auto py-3 text-sm font-medium text-black"
                          >
                            Submit
                          </button>
                  </div>
            </form> 
        </div>
      </div>
      <div id="footer" className="w-screen z-100">
        <Footer/>
      </div>
    </div>
  );
}