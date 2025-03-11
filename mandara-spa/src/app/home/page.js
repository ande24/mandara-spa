'use client'

import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/button";
import Link from 'next/link';

export default function Page() {
    const { user } = useAuthContext()
    const router = useRouter()

    React.useEffect(() => {
        if (user == null) router.push("/")
    }, [user])

    return (
    <div className="bg-gray-100">
        {/* Navbar */}
        <nav className="absolute top-0 left-0 z-50 w-full flex items-center px-8 py-4 text-white bg-pink-500">
            <div className="ml-110 flex flex-1 justify-start space-x-6">
                <Link href="/" className="hover:underline">HOME</Link>
                <Link href="/locations" className="hover:underline">LOCATIONS</Link>
                <Link href="/spa-packages" className="hover:underline">SPA PACKAGES</Link>
                <Link href="/spa-treatment" className="hover:underline">SPA TREATMENT</Link>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex w-10 h-10 bg-yellow-950 items-center justify-center">
                O
            </div>
            <div className="mr-130 flex justify-end space-x-6">
                <Link href="/massages" className="hover:underline">MASSAGES</Link>
                <Link href="/gift-certificates" className="hover:underline">GIFT CERTIFICATE</Link>
                <Link href="/membership" className="hover:underline">MEMBERSHIP</Link>
            </div>
        </nav>

      {/* Hero Section */}
      <section className="relative h-screen bg-[url('/spa-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-100 flex flex-col items-center justify-center text-white text-center p-8">
          <div className="absolute inset-x-0 bottom-4 bg-stone-950 h-20"></div>
          <Button className="mt-6 bg-yellow-500 hover:bg-yellow-400 px-6 py-3 text-lg rounded-full">Book Now</Button>
          <p classname="mt-50 text-s bg-yellow">MANDARA – (Man-da-ra). Noun.</p>
          <p classname="text-s">Derived from two words – mana and dara, which means mind and single line.</p>
          <div className="absolute flex flex-col items-center inset-x-0 bottom-0 h-48 bg-pink-500">
            <h1 className="mt-10 text-5xl font-bold">WELCOME TO MANDARA SPA</h1>
            <p className="mt-4 text-m max-w-300">The Mandara Spa has elevated the spa experience to a new art form. We offer our guests a personalized experience showcasing the warmth of Filipino hospitality, genuine service and a wide array of carefully curated Rituals that The Mandara Spa has been well distinguished for.</p>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 text-center">
        <h2 className="text-4xl font-semibold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold">Traditional Thai Massage</h3>
            <p className="mt-2 text-gray-600">Experience the healing touch of authentic Thai therapy.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold">Aromatherapy</h3>
            <p className="mt-2 text-gray-600">Relax with essential oils designed to soothe your senses.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold">Hot Stone Massage</h3>
            <p className="mt-2 text-gray-600">Rejuvenate your body with the warmth of heated stones.</p>
          </div>
        </div>
      </section>
      
      {/* Booking Section */}
      <section className="bg-yellow-500 py-16 text-center text-white">
        <h2 className="text-4xl font-semibold">Book Your Spa Experience</h2>
        <p className="mt-4">Enjoy a premium spa treatment tailored to your needs.</p>
        <Button className="mt-6 bg-white text-yellow-600 hover:bg-gray-100 px-6 py-3 text-lg rounded-full">Make a Reservation</Button>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8">
        <p>&copy; 2025 Oasis Spa. All rights reserved.</p>
      </footer>
    </div>
  );
}