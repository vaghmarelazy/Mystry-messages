"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { MessageSquare, LogOut, LayoutDashboard } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0A07]/85 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex flex-row justify-between items-center px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#BBCEA8] to-[#748067] shadow-lg shadow-[#748067]/25">
            <MessageSquare className="h-5 w-5 text-[#0B0A07]" />
          </div>
          <span className="bg-gradient-to-r from-neutral-50 via-neutral-200 to-[#BBCEA8] bg-clip-text text-transparent font-extrabold">
            Mystry Message
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="hidden md:inline-block text-sm font-medium text-zinc-400">
                Welcome, <span className="text-zinc-100 font-semibold">{user?.username || user?.email}</span>
              </span>
              <Link href="/dashboard">
                <Button className="bg-white/5 hover:bg-white/10 text-white border border-[#748067]/30 hover:border-[#BBCEA8]/60 flex items-center gap-1.5 transition-all text-xs md:text-sm rounded-xl">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => signOut()}
                variant="destructive"
                className="flex items-center gap-1.5 text-xs md:text-sm transition-all rounded-xl"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/5 text-xs md:text-sm rounded-xl">
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-[#E3D87E] to-[#F0EC57] hover:from-[#F0EC57] hover:to-[#E3D87E] text-[#0B0A07] font-semibold shadow-lg shadow-[#F0EC57]/10 text-xs md:text-sm border-0 rounded-xl transition-all duration-300 hover:scale-[1.02]">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;