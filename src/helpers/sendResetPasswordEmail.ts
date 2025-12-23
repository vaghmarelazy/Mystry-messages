import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.USER}`,
      pass: `${process.env.PASS}`, // App password (no spaces)
    },
  });

  const mailOptions = {
    from: `${process.env.USER}`,
    to: email,
    subject: "Reset Password of your Mysty Messages Account",
    text: `Here is your OTP to reset Password: ${verifyCode} if it's not You then Please Ignore..`,
  };
  try {
    await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully", verifyCode);
    return { success: true, message: "Email sent to Reset Password.." };
  } catch (emailError) {
    console.log("Error sending email", emailError);
    return { success: false, message: "failed to send email" };
  }
}
