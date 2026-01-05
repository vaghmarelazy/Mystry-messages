"use client";

import { Suspense, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { verificationResponse } from "@/types/verificationResponse";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewpassword, setShowNewpassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const newPassword = e.currentTarget["new-password"].value;
    const confirmPassword = e.currentTarget["confirm-password"].value;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description:
          "Failed to sign in automatically. Please sign in manually.",
        duration: 5000,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Here you would typically send the new password to your API
    console.log("New password submitted:", newPassword);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    alert("Password updated successfully!");
  }

  //Getting error in this
  async function isAuthenticated() {
    try {
      const token = searchParams.get("token");

      if (!token) {
        router.push("/sign-up");
        return;
      }

      const response = await axios.post<verificationResponse>(
        "/api/verify-reset-token",
        { token }
      );
      console.log(response);

      if (!response.data.success) {
        router.push("/sign-up");
      }
    } catch (error) {
      console.error("Authentication Error", error);
      router.push("/sign-in");
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    setPageLoading(true);
    isAuthenticated();
  }, [searchParams]);
  if (pageLoading) {
    return (
      <Suspense>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </Suspense>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 transition-all duration-500 ease-in-out">
      <div
        className={`w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md absolute transition-all duration-500 ease-in-out`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Set New Password
          </h1>
          <p className="mb-4">Enter your new password.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="mt-1">
              <input
                id="new-password"
                name="new-password"
                type={showNewpassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewpassword(!showNewpassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showNewpassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
          <div>
            <button
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
