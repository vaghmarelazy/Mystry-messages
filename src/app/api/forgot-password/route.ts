import { sendResetPasswordEmail } from "@/helpers/sendResetPasswordEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();
  // console.log("Post req triggered")

  const { email } = await req.json();
  const existingUserByEmail = await UserModel.findOne({
    email,
  });
  if (!existingUserByEmail) {
    console.log("User does not exist!!")
    return Response.json(
      {
        success: false,
        message: "This Email is not registered try Signing Up.",
      },
      { status: 400 }
    );
  }

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    //Send Verification email
    const emailResponse = await sendResetPasswordEmail(
      email,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "OTP sent to your registered Email..",
        verifyCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error sending Email", error)
    return Response.json(
      {
        success: false,
        message: "Internal Server Error, Error Sending Email",
        verifyCode,
      },
      { status: 201 }
    );
  }
  
}
