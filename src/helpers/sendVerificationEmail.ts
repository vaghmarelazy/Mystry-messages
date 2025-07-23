// import { resend } from "@/lib/resend";
// import VerficationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  username: string,
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
    subject: "Your OTP Code for Mystry Messages",
    text: `Hi ${username}, Your OTP Code is: ${verifyCode}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", verifyCode);
    return { success: true, message: "verification email send successfully" };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "failed to send verification email" };
  }
}
