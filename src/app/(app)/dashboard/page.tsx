"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [ProfileURL, setProfileURL] = useState("");
  const [username, setUsername] = useState("");
  // const [isAcceptingMessages, setIsAcceptingMessages] = useState(false);
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
       console.log(response.data)
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

  // const fetchMessages = useCallback(
  //   async (refresh: boolean = false) => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get<ApiResponse>(`/api/get-messages`);

  //       const messages = [];
  //       response.data.messages.forEach((message) => {
  //         messages.push(message.content);
  //       });

  //       console.log(messages);

  //       // Log each message object properly
  //       // fetchedMessages.forEach((message) => {
  //       //   console.log("Message:", message);
  //       // });

  //       // Set messages correctly
  //       setMessages(messages);
  //       if (refresh) {
  //         toast({
  //           title: "Messages refreshed",
  //           description: "Messages fetched successfully",
  //         });
  //       }
  //     } catch (error) {
  //       handleError(error);
  //       console.log("Gettings error in getMessages", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [toast, handleError]
  // );

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);

        // Ensure messages are properly set as an array of objects
        const fetchedMessages: Message[] = response.data.messages || [];

        console.log("Fetched messages:", fetchedMessages.forEach((messages)=>{
          console.log(messages.content)
        }));

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
    [toast, handleError]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    setUsername(String(session?.user.username));
    // setIsAcceptingMessages(Boolean(session.user.isAcceptingMessage));
    setProfileURL(`${window.location.origin}/u/${username}`);
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages, username]);

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
      console.log(response);
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
    toast({
      title: "Link Copied",
      description: "Your unique profile link has been copied to your clipboard",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={ProfileURL}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          // {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message: Message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
