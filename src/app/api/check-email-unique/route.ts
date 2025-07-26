import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

const EmailQuerySchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      email: searchParams.get("email"),
    };
    
    // Validate with Zod
    const result = EmailQuerySchema.safeParse(queryParam);
    if (!result.success) {
      console.log("Email parsing error", request)
      const emailErrors = result.error.format().email?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            emailErrors?.length > 0
              ? emailErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check for existing verified user with this email
    const existingVerifiedUser = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      console.log("Existing verified user", existingVerifiedUser)
      return Response.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    // Check for existing unverified user with this email
    const existingUnverifiedUser = await UserModel.findOne({
      email,
      isVerified: false,
    });

    if (existingUnverifiedUser) {
      console.log("unverfied user", existingUnverifiedUser)
      return Response.json(
        {
          success: false,
          message: "Email already exists but not verified",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Email is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking email", error);
    return Response.json(
      {
        success: false,
        message: "Error checking email",
      },
      { status: 500 }
    );
  }
}
