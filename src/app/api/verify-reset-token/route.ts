import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  dbConnect();
  const { token } = await req.json();
  // console.log(token);
  if (!token) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const user = await UserModel.findOne({
    resetPasswordToken: token,
  });
  if (!user) {
    return Response.json(
      {
        success: false,
        message: "User Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  return Response.json(
    {
      success: true,
      message: "User Authenticated",
    },
    {
      status: 200,
    }
  );
}
