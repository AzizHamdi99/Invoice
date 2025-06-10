import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const { user } = useUser()
  return (
    <div className="">
      <Navbar />
      hello
    </div>
  );
}
