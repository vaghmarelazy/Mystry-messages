import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    console.log("Username recieved: ", username)

    const decodedUsername = decodeURIComponent(username);
    console.log("Decoded Username: ", decodedUsername)
    const user = await UserModel.findOne({ username: decodedUsername });
    console.log("User found: ", user)
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not Found",
        },
        { status: 500 }
      );
    }

    const isCodevalid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodevalid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      
      return Response.json(
        {
          success: true,
          message: "Account verified successfully !",
        },
        { status: 200 }
      );
      
    } else if (!isCodeNotExpired){
        return Response.json(
            {
              success: false,
              message: "Verifiaction code expired, Please signup again !",
            },
            { status: 400 }
          );
    } else {
        return Response.json(
            {
              success: false,
              message: "Invalid verifiaction code",
            },
            { status: 400 }
          );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}