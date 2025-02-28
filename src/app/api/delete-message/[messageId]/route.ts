import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ messageid: string }> }
) {
  const resolvedParams = await context.params;
  const messageid = resolvedParams.messageid;
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
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );
    if (updateResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message note Found or deleted successfully",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 200 }
    );
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