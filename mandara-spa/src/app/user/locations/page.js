'use client'

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/bookingForm";
import Image from "next/image";
import NavBar1 from "@/components/navbar1";
import NavBar2 from "@/components/navbar2";
import { getDoc, doc, getFirestore, collection, getDocs } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import { FaMapMarkerAlt, FaClock, FaPhone, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Page() {
  const db = getFirestore(firebase_app)
  const { user } = useAuthContext()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [branches, setBranches] = useState([]);
  const [branchData, setBranchData] = useState('')
  const [currentImage, setCurrentImage] = useState(0);
  const [branchIndex, setBranchIndex] = useState(0);

  useEffect (() => {
    if (redirect) router.push("/user/login");
  }, [redirect]);

  useEffect (() => {
    const fetchBranches = async() => {
      const branchCollection = collection(db, "branches");
      const branchesSnap = await getDocs(branchCollection);
        const branchList = branchesSnap.docs
        .filter(doc => doc.id !== "schema")
        .map(doc => ({
            id: doc.id,
            name: doc.data().branch_location
        }));
        console.log("branchlist: ", branchList)
        setBranchIndex(0);
        setBranches(branchList);
    }

    fetchBranches();
}, []);

  useEffect (() => {
    if (branches.length > 0 && branchIndex < branches.length) {
      const fetchBranch = async() => {
        const branchRef = doc(db, "branches", branches[branchIndex].id);
        const branchSnap = await getDoc(branchRef);
        console.log(branchSnap.data());
        setBranchData(branchSnap.data());
      }

      fetchBranch();
    }
  }, [branches.length, branchIndex]);

  const nextBranch = () => {
    console.log("next")
    setBranchIndex((prev) => (prev + 1) % branches.length);
  }

  const prevBranch = () => {
    setBranchIndex((prev) => (prev - 1 + branches.length) % branches.length);
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % branchData.branch_images.length);
  };

  const prevImage = () => {
      setCurrentImage((prev) => (prev - 1 + branchData.branch_images.length) % branchData.branch_images.length);
  };

  const handleBooking = () => {
    if (user) {
      setShowForm(true)
    }
    else {
      setRedirect(true);
    }
  }
  return (
    branchData && (
      <div className="relative flex h-screen justify-center items-center overflow-y-auto bg-gray-100">
        {showForm && <BookingForm onClose={() => setShowForm(false)} />}

        <button
          onClick={prevBranch}
          className="fixed scale-80 left-0 top-1/2 h-1/5 w-16 bg-black opacity-30 hover:opacity-50 hover:scale-90 text-white text-3xl flex items-center justify-center z-50 transition-all"
        >
          ❮
        </button>

        <button
          onClick={nextBranch}
          className="fixed scale-80 top-1/2 right-0 h-1/5 w-16 bg-black opacity-30 hover:opacity-50 hover:scale-90 text-white text-3xl flex items-center justify-center z-50 transition-all"
        >
          ❯
        </button>
  
        <div className="absolute flex justify-center items-center inset-x-0 top-0 w-full z-20 h-24 bg-[#502424]">
          <div className="flex justify-center items-center">
            <div>
              <NavBar1 currPage={"locations"} />
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
              <NavBar2 currPage={"locations"} />
            </div>
          </div>
        </div>
  
        <div className="flex flex-col justify-center items-center max-w-2xl mx-auto mt-165 p-4">
          <h1 className="text-5xl mb-8 text-center font-serif">
            {branchData.branch_location}
          </h1>
  
          <div className="flex justify-between">
            <div className="relative rounded-lg flex justify-center w-2xl h-2xl">
              <img
                src={branchData.branch_images[currentImage]}
                alt="Spa Gallery"
                className="w-full h-auto max-h-[500] object-cover rounded-lg"
              />
              
              <button
                onClick={prevImage}
                className="absolute left-[-40] top-1/2 transform -translate-y-1/2 bg-black opacity-30 hover:opacity-50 hover:scale-110 transition-all text-white p-2 rounded-full"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-[-40] top-1/2 transform -translate-y-1/2 bg-black opacity-30 hover:opacity-50 hover:scale-110 transition-all text-white p-2 rounded-full"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
  
          <div className="mt-2 leading-relaxed mb-4 text-xs w-2xl text-center p-4 rounded-2xl">
            <p className="font-serif text-gray-800">{branchData.branch_desc}</p>
          </div>
  
          <div className="flex rounded-lg">
            <iframe
              src={branchData.branch_location_link}
              width="290"
              height="290"
              loading="lazy"
              className="rounded-lg w-2xl"
            ></iframe>
          </div>
  
          <div className="mt-4 w-2xl bg-gray-100 text-gray-800 p-4 text-xs rounded-lg flex md:flex-row md:items-center justify-between">
            <div className="space-y-2 font-serif w-sm">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#502424]" /> {branchData.branch_address}
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-[#502424]" /> {branchData.branch_hours}
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-[#502424]" />{" "}
                {branchData.branch_landline ? `${branchData.branch_landline}, ` : ""}{" "}
                {branchData.branch_mobile}
              </p>
            </div>
            <div className="space-y-4 mr-4 flex flex-col">
              <button className="bg-[#502424] mt-2 text-xs text-white font-semibold p-2 w-full rounded-lg hover:bg-[#e0d8ad] hover:scale-105 transition-all md:ml-6">
                SERVICES
              </button>
              <button className="bg-[#502424] text-xs text-white font-semibold p-2 w-full rounded-lg hover:bg-[#e0d8ad] hover:scale-105 transition-all md:ml-6">
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );  
}