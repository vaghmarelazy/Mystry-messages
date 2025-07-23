import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const { acceptMessages } = await request.json();
  try {
    const foundUser = await UserModel.find({username: user.username}).select("_id").lean();
    const userId = foundUser[0]._id.toString();
    // console.log("userId : AM : Post", userId)
    // console.log("foundUser : AM : Post", foundUser[0]._id.toString())
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // const userId = foundUser[0]._id.toString();
    try {
      const updateUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAcceptingMessage: acceptMessages },
        { new: true }
      );
  
      if (!updateUser) {
        return Response.json(
          {
            success: false,
            message: "Failed to update user status to accept messages",
          },
          { status: 401 }
        );
      }
      return Response.json(
        {
          success: true,
          message: "Message acceptance was successfully updated",
          updateUser,
        },
        { status: 200 }
      );
    } catch (error) {
      console.log("Failed to update user status to accept messages", error);
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log("Error in accept messages : AM : Post", error);
    return Response.json(
      {
        success: false,
        message: "Error in accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const foundUser = await UserModel.find({username: user.username}).select("isAcceptingMessage").lean();
    const userId = foundUser[0]._id.toString();
    console.log("userId : AM : Get", userId)

    if (!foundUser) {
      // console.log("User not found");
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser[0].isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Error updating user status",
      },
      { status: 500 }
    );
  }
}
