import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image, question } = await req.json() as { image: string; question: string };

    console.log("Received image:", image);

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a tarot card reader. You are given an image and a question. You need to analyze the image and provide a tarot card reading based on what you see. Be creative and insightful. Reply with just your reading, in markdown.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please answer my question: ${question}`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const reading = response.choices[0]?.message?.content ?? "Unable to generate a reading.";

    console.log("Generated reading:", reading);

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Error in tarot reading API:", error);
    return NextResponse.json(
      { error: "Failed to get tarot reading" },
      { status: 500 },
    );
  }
}