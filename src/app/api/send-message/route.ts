import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  console.log("Username", username);
  console.log("Content", content);

  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No such user exist or Invalid username",
        },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting message",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erroe adding messages", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 } 
    );
  }
}
