import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

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

  const userId = user._id;
  try {
    const user = await UserModel.findById(userId).select("messages").lean();
    // console.log("user after the code", user);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }
    if (user.messages.length > 0) {
      return Response.json(
        {
          success: true,
          messages: user.messages,
        },
        { status: 200 }
      );
    }
    return Response.json({
      success: true,
      message: "Currently you dont have any messages",
    });
  } catch (error) {
    console.error("An unexpected error occurred", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred",
      },
      { status: 404 }
    );
  }
}
