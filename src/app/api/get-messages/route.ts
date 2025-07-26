import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  // console.log("user : get-messages.ts", user);
  // console.log("session", session);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  // const userId = user._id;
  try {
    const fetchUser = await UserModel.find({username: user.username}).select("messages").lean();
    if (!fetchUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }
    if (fetchUser[0].messages.length > 0) {
      return Response.json(
        {
          success: true,
          messages: fetchUser[0].messages,
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
