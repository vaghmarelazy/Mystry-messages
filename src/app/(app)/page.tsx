"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Mail,
  Shield,
  Sparkles,
  Share2,
  LayoutDashboard,
  ArrowRight,
  Lock,
  HelpCircle,
} from "lucide-react";
import React, { useState } from "react";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-800 py-4 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left font-medium text-zinc-100 hover:text-white"
      >
        <span className="text-base md:text-lg">{question}</span>
        <span className={`ml-4 transform text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="min-h-screen bg-[#0B0A07] text-white relative overflow-hidden flex flex-col font-sans selection:bg-[#BBCEA8] selection:text-[#0B0A07]">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#74806708_1px,transparent_1px),linear-gradient(to_bottom,#74806708_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Decorative ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#748067]/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#BBCEA8]/8 blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* Main navigation header */}
      <Navbar />

      <main className="flex-grow z-10 relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16 text-center max-w-5xl">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#748067]/40 bg-[#748067]/10 text-xs font-semibold text-[#BBCEA8] mb-6 animate-fade-in shadow-inner">
            <Lock className="w-3.5 h-3.5" />
            <span>100% Secure & Completely Anonymous</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Hear the Honest Truth,
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#E3D87E] via-[#F0EC57] to-[#BBCEA8] bg-clip-text text-transparent">
              Without the Noise.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100">
            Mystry Message lets you collect authentic feedback, secret confessions, and constructive reviews
            from your friends, audience, or team—without revealing their identity.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-200">
            <Link href="/sign-up">
              <Button className="h-12 px-8 bg-gradient-to-r from-[#E3D87E] to-[#F0EC57] hover:from-[#F0EC57] hover:to-[#E3D87E] text-[#0B0A07] font-bold rounded-xl text-md flex items-center gap-2 shadow-lg shadow-[#F0EC57]/10 border-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="ghost" className="h-12 px-8 text-zinc-300 hover:text-white border border-[#748067]/30 hover:border-[#BBCEA8]/50 bg-[#0B0A07]/40 hover:bg-[#0B0A07]/80 backdrop-blur-sm rounded-xl text-md transition-all">
                Explore Features
              </Button>
            </a>
          </div>
        </section>

        {/* Carousel Showcase Section */}
        <section className="container mx-auto px-4 py-8 max-w-4xl relative">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-[#F0EC57] animate-ping"></span>
              <span className="text-xs font-semibold tracking-wider text-[#F0EC57] uppercase">
                Active Confessions Feed
              </span>
            </div>

            <div className="w-full bg-[#0B0A07]/40 border border-[#748067]/15 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl animate-fade-in-up animation-delay-300">
              <Carousel
                plugins={[Autoplay({ delay: 4000 })]}
                className="w-full"
              >
                <CarouselContent>
                  {messages.map((message, index) => (
                    <CarouselItem key={index} className="flex justify-center items-center">
                      <div className="bg-[#0B0A07]/90 border border-[#748067]/20 rounded-xl p-6 w-full max-w-lg shadow-xl relative overflow-hidden transition-all duration-300 hover:border-[#BBCEA8]/40">
                        {/* Decorative card glow */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#BBCEA8]/5 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#BBCEA8]/10 border border-[#BBCEA8]/20 text-[#BBCEA8]">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-zinc-200">{message.title || "Anonymous Message"}</h4>
                            <p className="text-xs text-zinc-500">{message.received}</p>
                          </div>
                        </div>
                        
                        <p className="text-zinc-300 text-sm md:text-base leading-relaxed italic">
                          "{message.content}"
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20 max-w-6xl scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Designed for Ultimate Expression
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
              A comprehensive platform crafted around user safety, smart suggestions, and simple shareability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BBCEA8]/10 border border-[#BBCEA8]/20 text-[#BBCEA8] mb-5">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Absolute Confidentiality</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  We enforce zero-tracking policies. Sender identity is never tied to messages in the database.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E3D87E]/10 border border-[#E3D87E]/20 text-[#E3D87E] mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Smart AI Suggestions</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Stuck on thoughts? Leverage Google AI algorithms directly to suggest questions for your public feed.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EC57]/10 border border-[#F0EC57]/20 text-[#F0EC57] mb-5">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">One-Click Sharing</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Copy your customized profile page link and paste it into Instagram, WhatsApp, or Twitter bios instantly.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BBCEA8]/15 border border-[#BBCEA8]/20 text-[#BBCEA8] mb-5">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Dynamic Dashboard</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  A high-fidelity layout where you can instantly accept/reject new submissions and manage received feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stepper Section (How It Works) */}
        <section className="container mx-auto px-4 py-16 max-w-5xl border-t border-[#748067]/15">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Start Collecting Feedback in 3 Steps
            </h2>
            <p className="text-zinc-400 text-sm md:text-base">Get set up and sharing in under a minute.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#748067] text-[#0B0A07] font-extrabold text-lg shadow-lg shadow-[#748067]/20 mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-zinc-150 mb-2">Create Account</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Choose a unique username and sign up securely with email verification.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#BBCEA8] text-[#0B0A07] font-extrabold text-lg shadow-lg shadow-[#BBCEA8]/20 mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-zinc-150 mb-2">Share Your URL</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Copy your customized profile page link and paste it into Instagram, WhatsApp, or Twitter bios instantly.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0EC57] text-[#0B0A07] font-extrabold text-lg shadow-lg shadow-[#F0EC57]/20 mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-zinc-150 mb-2">Read Confessions</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Open your secret vault dashboard to explore what friends really think.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16 max-w-4xl border-t border-[#748067]/15">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-1/3">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-[#BBCEA8]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[#BBCEA8]">FAQ</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Have questions about our service? Here's how we protect your safety and keep confessions clean.
              </p>
            </div>
            
            <div className="md:w-2/3 flex flex-col">
              <FAQItem
                question="Are senders really anonymous?"
                answer="Yes! Senders do not need to register. We do not store IP addresses or device IDs tied to messages. Messages are fully dissociated from any user data, ensuring 100% privacy."
              />
              <FAQItem
                question="Can I block or toggle feedback submissions?"
                answer="Absolutely. Under your dashboard settings, there is a simple switch to enable or disable submissions. When disabled, users visiting your link will see that you are currently not accepting messages."
              />
              <FAQItem
                question="Is there a moderation tool for abuse?"
                answer="Yes, you have full control over your vault. You can instantly delete any inappropriate messages directly from your dashboard."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#748067]/15 bg-black/40 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} Mystry Message. All rights reserved.
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Constructed with privacy & confidentiality as priority.
            </p>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <span>Made with ❤️ by</span>
            <a
              href="https://www.github.com/vaghmarelazy"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#BBCEA8] font-semibold underline underline-offset-4 decoration-zinc-700 hover:decoration-[#BBCEA8] transition-colors"
            >
              Lazy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
