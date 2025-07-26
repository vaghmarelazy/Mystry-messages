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
    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user found with this email",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        email: user.email,
        isVerified: user.isVerified,
        username: user.username,
        // Add more info if needed
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching email info", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching email info",
      },
      { status: 500 }
    );
  }
} 