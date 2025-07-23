"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setISCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const debounceUsername = useDebounce(username, 300);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    document.title = "Sign Up";
    const checkUsernameUnique = async () => {
      if (debounceUsername) {
        setISCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debounceUsername}`
          );

          console.log("response: sign-up.tsx", response.data.message);

          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "Error Checking username"
          );
        } finally {
          setISCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [debounceUsername]);

  // Focus the first OTP input when OTP form is shown
  useEffect(() => {
    if (showOtp && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [showOtp]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow single digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index - 1] = "";
        return newOtp;
      });
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      pasted.split("").forEach((digit, idx) => {
        if (otpRefs.current[idx]) {
          otpRefs.current[idx]!.value = digit;
        }
      });
      otpRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    setIsSubmitting(true);
    try {
      const result = await axios.post<ApiResponse>("/api/verify-code", {
        username: username,
        code: otpValue,
      });

      if (result.data.success) {
        // After successful verification, attempt to sign in
        const signInResult = await signIn("credentials", {
          identifier: username,  // Using username as identifier
          password: form.getValues("password"),  // Get password from the form
          redirect: false,  // Don't redirect automatically
        });

        if (signInResult?.error) {
          toast({
            title: "Error",
            description: "Failed to sign in automatically. Please sign in manually.",
            duration: 5000,
            variant: "destructive",
          });
          router.push("/sign-in");
        } else {
          toast({
            title: "Success",
            description: result.data.message,
            duration: 5000,
          });
          router.push("/dashboard");
        }
      }
      setIsSubmitting(false);
      setShowOtp(false);
    } catch (error) {
      console.error("Error in verify OTP", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Error in verify OTP",
        duration: 5000,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
        duration: 5000,
      });
      setIsSubmitting(false);
      setShowOtp(true);
    } catch (error) {
      console.error("Error in sign-up User", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Error in sign-up user",
        duration: 5000,
        variant: "destructive", 
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md h-[600px]">
        {/* Sign Up Form */}
        <div
          className={`absolute w-full h-full top-0 left-0 transition-all duration-500 bg-white rounded-lg shadow-md p-8 space-y-8 z-10
            ${showOtp ? "-translate-x-full hidden pointer-events-none" : "translate-x-0 block"}
          `}
        >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystry Messsage
            </h1>
            <p className="mb-4">Sign-up to start your <span className="font-mono">anonymous</span> adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Username</FormLabel>
                      {isCheckingUsername && <Loader2 className="animate-spin" />}
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                    <p
                      className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}
                    >
                      {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" aria-disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <div className="text-center mt-4">
              <p>
                Already a member ?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {" "}
                  Sign In
                </Link>
              </p>
            </div>
          </Form>
        </div>
        {/* OTP Form */}
        <div
          className={`absolute w-full h-full top-0 left-0 transition-all duration-500 bg-white rounded-lg shadow-md p-8 space-y-8 z-20
            ${showOtp ? "translate-x-0 block" : "translate-x-full hidden pointer-events-none"}
          `}
        >
          {showOtp && (
            <div className="h-full flex flex-col justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
                <p className="mb-4">Please enter the OTP sent to your email.</p>
              </div>
              <form className="space-y-6 text-center" onSubmit={handleOtpSubmit}>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <Input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-12 text-center text-xl border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      ref={(el) => {
                        if (el) {
                          otpRefs.current[idx] = el;
                        }
                      }}
                      autoFocus={idx === 0}
                      aria-label={`OTP digit ${idx + 1}`}
                    />
                  ))}
                </div>
                <Button type="submit" className="">Verify OTP</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
