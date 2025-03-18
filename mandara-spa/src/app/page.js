"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
      router.push("/user/home"); 
  }, []);

  // return (
  //   <LoadingPage />
  // )
}