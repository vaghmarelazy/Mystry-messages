import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const { newPassword, token } = await req.json();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    user.password = hashedPassword;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Updated Password Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Occured", error);
    return Response.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  }
}
