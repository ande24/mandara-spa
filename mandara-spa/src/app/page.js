"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/ui/loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/user/login"); 
    }, 3000);
  }, []);

  return (
    <LoadingPage />
  )
}