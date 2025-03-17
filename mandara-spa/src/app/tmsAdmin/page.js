"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    router.push("/tmsAdmin/login"); 
  }, [router]);
}