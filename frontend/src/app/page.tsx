"use client";

import { supabase } from "@/libs/supabase/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter()
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hello`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .then(() => checkSession());

    const checkSession = async () => {
      const { data: { session }, } = await supabase.auth.getSession();
      if (session != null) {
        router.push('/chat')
      } else {
        router.push('/signin')
      }
    }
    document.documentElement.classList.toggle("dark", false);
  }, []);



  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-background">
      <h1 className="text-3xl font-bold text-foreground">
        {message || "Loading..."}
      </h1>
    </main>
  );
}