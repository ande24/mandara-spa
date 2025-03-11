"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Redirect homepage to /dashboard
  }, []);

  return <h1>Welcome to The Mandara Spa, Redirecting you...</h1>;
}