"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Mail } from "lucide-react";
import React from "react";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Main content starts here */}
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4 md:px-0">
        <h1 className="text-5xl font-extrabold text-white mb-4 animate-fade-in">
          Dive into the World of{" "}
          <span className="font-mono font-bold text-white">Anonymous</span>{" "}
          <span className="text-white">Feedback</span>
        </h1>
        <p className="mt-4 text-md text-gray-300 opacity-90 max-w-2xl animate-fade-in delay-100">
          True Feedback - Where your identity remains a secret.
        </p>
        <Link href="/sign-up">
          <button className="mt-5 px-8 py-3 bg-white text-black rounded-full shadow-lg hover:scale-105 transition-transform font-semibold text-lg animate-fade-in delay-200">
            Get Started
          </button>
        </Link>
      </section>

      {/* Carousel Section */}
      <section className="flex flex-col items-center justify-center flex-grow w-full md:px-0">
        <div className="flex items-center max-w-xl left-0 mb-4 animate-fade-in-up">
          <span className="text-sm font-thin text-white">
            Some Recent Messages
          </span>
          <span className="inline-block w-3 h-3 rounded-full bg-white ml-3 shadow-lg"></span>
        </div>
        <div className="w-full max-w-xl bg-black rounded-2xl shadow-2xl p-6 md:p-10 mb-12 animate-fade-in-up">
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-xl mx-auto"
          >
            <CarouselContent className="flex justify-center">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2 flex justify-center">
                  <Card className="bg-white/80 rounded-xl shadow-md border-0 w-full max-w-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <p className="text-gray-700 text-base">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-black text-gray-400 w-full mt-auto animate-fade-in-up delay-300">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          <span>
            © {new Date().getFullYear()} True Feedback. All rights reserved.
          </span>
          <span className="hidden md:inline">|</span>
          <span>
            Made with <span className="text-red-400">❤️</span> by{" "}
            <a
              href="https://www.github.com/vaghmarelazy"
              className="underline hover:text-blue-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lazy
            </a>
          </span>
        </div>
      </footer>
      {/* Background image - set your image URL below */}
      <div
        className="absolute inset-0 w-full h-full -z-10 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/bg.png')" }}
        aria-hidden="true"
      />
    </div>
  );
};
export default page;
