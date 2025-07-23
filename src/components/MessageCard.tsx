"use client";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { formatDate } from "@/lib/utils";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast({
      title: response.data.message,
    });
    onMessageDelete(String(message._id));
  };

  return (
    <Card className="shadow-md border border-gray-200 relative">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="p-0 absolute right-1 top-1 cursor-pointer opacity-65" >
            <X className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently Message from your
              account
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CardHeader className="pb-2">
        <div className="flex flex-col justify-between ">
          <CardTitle className="text-lg font-medium h-[80%]">
            {message.content}
          </CardTitle>
        </div>
      </CardHeader>
      <CardFooter>
        <span className="text-xs text-gray-500 h-[20%]">
          {formatDate(message.createdAt)}
        </span>
      </CardFooter>
      {/* <CardContent>
        {/* You can add more details or actions here if needed */}
      {/* </CardContent> */}
    </Card>
  );
}

export default MessageCard;
