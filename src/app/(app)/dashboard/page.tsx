"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [ProfileURL, setProfileURL] = useState("");
  const [username, setUsername] = useState("");
  const { toast } = useToast();
  const { data: session, status } = useSession({
    required: true,
  });
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  // console.log("acceptMessages while fecthed", acceptMessages);

  const handleError = useCallback(
    (error: unknown) => {
      let errorMessage = "An unexpected error occurred";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    [toast]
  );

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
       const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
       console.log("response: dashboard.tsx", response.data)
      setMessages((prevMessages) =>
        
        prevMessages.filter((message) => message._id !== messageId)
      );
      toast({
        title: "Message Deleted",
        description: "The message has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      handleError(error);
    }
  }, [handleError, toast]);

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      // const result: boolean = response.data.isAcceptingMessages
      // console.log("Fecthing acceptMessages", response.data); 
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, handleError]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");

        // Ensure messages are properly set as an array of objects
        const fetchedMessages: Message[] = response.data.messages || [];

        // Set messages correctly
        setMessages(fetchedMessages);

        if (refresh) {
          toast({
            title: "Messages refreshed",
            description: "Messages fetched successfully",
          });
        }
      } catch (error) {
        handleError(error);
        console.log("Getting error in getMessages", error);
      } finally {
        setIsLoading(false);
      }
    },
    [toast, handleError, setMessages] 
  );

  // Merged useEffect for session, username, and profile URL
  useEffect(() => {
    if (!session || !session.user) return;

    const username = String(session.user.username);
    setUsername(username);
    setProfileURL(`${window.location.origin}/u/${username}`);

    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return <div>Please login</div>;
  }
  //handle switch change
  const handleSwitchChange = async () => {
    try {
      // const newValue = !acceptMessages;
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      // console.log("response: dashboard.tsx", response);
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Success",
        description: response.data.message,
        duration: 5000,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error fetching messages",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ProfileURL);
    setIsCopied(true);
    toast({
      title: "Link Copied",
      description: "Your unique profile link has been copied to your clipboard",
      duration: 5000,
      variant: "default",
    });
  };

  // --- New Modern Dashboard Layout ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-2 md:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Welcome, {username || 'User'}!</h1>
          <p className="text-slate-600 mt-1 text-base">Manage your anonymous messages and profile settings below.</p>
        </div>
        <Button onClick={() => signOut()} className="bg-slate-800 text-white hover:bg-slate-950 hover:text-white" variant="outline">Logout</Button>
      </div>

      {/* Profile Link Card */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow items-end p-4 flex md:flex-row md:items-end gap-3 border border-slate-200">
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-slate-800 mb-1">Your Profile Link</h2>
            <input
              type="text"
              value={ProfileURL}
              disabled
              className="w-full bg-slate-100 rounded px-3 py-2 font-mono text-slate-700 border border-slate-200 focus:outline-none focus:ring-0"
            />
          </div>
          <Button onClick={copyToClipboard} className="mt-2 md:mt-0">
            {isCopied ? "Copied" : "Copy Link"}
          </Button>
        </div>
      </div>

      {/* Accept Messages Switch Card */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 border border-slate-200">
          <Switch
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-slate-800 font-medium">
            Accept Messages: <span className={acceptMessages ? 'text-green-600' : 'text-red-500'}>{acceptMessages ? 'On' : 'Off'}</span>
          </span>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="max-w-5xl mx-auto flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span>Refresh</span>
        </Button>
      </div>

      {/* Messages Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message: Message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500 py-12 text-lg">No messages to display.</div>
        )}
      </div>
    </div>
  );
}

export default Page;
