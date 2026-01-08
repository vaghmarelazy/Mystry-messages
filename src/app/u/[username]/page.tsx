"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageScheama";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function Page() {
  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const [messages, setMessages] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const specialChar = "||";
  const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
  };
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const params = useParams<{ username: string }>();
  const username = params.username;

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post(`/api/suggest-messages`);
      if (!response) console.log("Response error");
      // const questions = parseStringMessages(response.data.questions)
      const questions = response.data.questions;
      setMessages(questions);
      // complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(error as AxiosError);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  async function onSubmit(data: z.infer<typeof messageSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${window.location.origin}/api/send-message`,
        {
          ...data,
          username,
        }
      );
      // console.log(response)
      toast({
        title: response.data.message,
        description: "Your anonymous message has been sent to the recipient.",
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function checkUserStatus() {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/accept-messages`
      );
      if (response.data.isAcceptingMessage === false) {
        toast({
          title: "Error",
          description: "The user is currently not accepting Messages",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cool 😎",
          description: "The user is currently Accepting Messages",
          variant: "default",
        });
      }
    } catch (error) {
      console.error(error as AxiosError<ApiResponse>);
      toast({
        title: "Error",
        description: "Failed to check user status",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    checkUserStatus();
  }, []);
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-thin text-base">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none p-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? "Loading..." : "Suggest Messages"}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(messages).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 w-auto hover:shadow-sm hover:shadow-gray-800 hover:scale-105 transition-all duration-75"
                  onClick={() => handleMessageClick(message)}
                >
                  <p>{message}</p>
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
