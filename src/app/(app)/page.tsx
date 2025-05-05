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

const page = () => {
  return (
    <div className="min-h-full">
      {/* Main content */}
      <Navbar />
      <main className=" h-[70vh] md:h-[80vh] flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12 ">
          <h1 className="text-4xl md:text-5xl font-thin">
            Dive into the World of <span className="font-mono font-medium">Anonymous</span> Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg opacity-80">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white fixed bottom-0 w-full">
        © 2025 True Feedback. All rights reserved. Made with ❤️ by <a href="https://www.github.com/vaghmarelazy">Lazy</a>
      </footer>
    </div>
  );
};
export default page;
