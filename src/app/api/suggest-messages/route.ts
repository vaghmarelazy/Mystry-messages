import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Get API key from environment variable
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be saprated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this : 'What's a hobby you're recently started?||If you could have dinner with any historical figure, who would it be ?|| what's a simple thing that makes you happy?'. Ensure the question are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await model.generateContentStream(prompt);
    let fullResponse = '';
    
    //Collect all chunks of the response
    for await (const chunk of result.stream) {
      fullResponse += chunk.text();
    }
    console.log(fullResponse)

    return NextResponse.json(
      {
        success: true,
        questions: fullResponse,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error generating content", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate questions. Please try again later.",
      },
      { status: 500 }
    );
  }
}
