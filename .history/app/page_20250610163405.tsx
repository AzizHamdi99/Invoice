"use client"
import { addUser } from "@/actions/actions";
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser()
  const registerUser = async () => {
    if (user) {
      const result = await addUser(user?.fullName, user?.emailAddresses[0].emailAddress)
    }
  }
  useEffect(() => {
    registerUser()

  }, [user])
  return (
    <div className="">
      <Navbar />


    </div>
  );
}
