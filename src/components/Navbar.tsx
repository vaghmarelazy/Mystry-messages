"use client";
// import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
// import { User } from "next-auth";
import { Button } from "./ui/button";

function Navbar() {

  // const user:User = session?.user as User

  return (
    <nav className="p-4 md:p-6 shadow-md  text-white">
      <div className="container mx-auto flex md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">Mystry Message</a>
        <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={"outline"}>Log In</Button>
          </Link>
      </div>
    </nav>
  );
}

export default Navbar;