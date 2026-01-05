"use client";

import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { resetPasswordResponse } from "@/types/resetPasswordResponse";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [OTP, setOTP] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [token, setToken] = useState("")
  const [isverified, setIsverified] = useState(false);
  const router = useRouter();

  async function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("HandleSubmit triggered");
    const email = e.currentTarget.email.value;
    if (!isValidEmail(email)) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Invalid Email id",
        duration: 5000,
        variant: "destructive",
      });
    }
    try {
      const result = await axios.post<resetPasswordResponse>(
        "/api/forgot-password",
        {
          email,
        }
      );
      console.log(result.data.verifyCode)
      if (result) {
        toast({
          title: "Success",
          description: result.data.message,
          duration: 5000,
        });
        setOTP(result.data.verifyCode);
        setToken(result.data.resetToken)
        setOtpSent(true);
      }
      console.log(result.data.message);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Internal server Error", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Internal Server Error!",
        duration: 5000,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  //complete this function
  async function verifyOTP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("VerifyOTP triggered");
    const otp = e.currentTarget.otp.value;
    console.log(otp);
    try {
      if (otp.toString() === OTP) {
        setIsverified(true);
        console.log("Redirected", token);
        router.push(`/set-new-password?token=${token}`);
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please enter valid otp",
          duration: 5000,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 transition-all duration-500 ease-in-out">
      <div
        className={`w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md absolute transition-all duration-500 ease-in-out ${otpSent ? "hidden" : "block"}`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Forgot Password
          </h1>
          <p className="mb-4">Enter your email to reset your password.</p>
        </div>
        {/* Your forgot password form goes here */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
    ${
      isSubmitting
        ? "bg-gray-950 cursor-not-allowed"
        : "bg-gray-950 hover:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    }`}
            >
              {isSubmitting ? "Sending OTP..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
      <div
        className={`w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md absolute transition-all duration-500 ease-in-out${isverified ? "hidden" : ""} ${otpSent ? "block" : "hidden"}`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Enter OTP
          </h1>
          <p className="mb-4">A 6-digit OTP has been sent to your email.</p>
        </div>
        <form className="space-y-6" onSubmit={verifyOTP}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP
            </label>
            <div className="mt-1">
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={4}
                pattern="\d{4}"
                autoComplete="off"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
    ${
      isSubmitting
        ? "bg-gray-700 cursor-not-allowed"
        : "bg-gray-950 hover:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-black"
    }`}
            >
              {isSubmitting ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
