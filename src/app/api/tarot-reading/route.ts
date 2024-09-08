import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    console.log("Received image:", image);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and provide a tarot card reading based on what you see. Be creative and insightful.",
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
      max_tokens: 300,
    });

    const reading =
      response.choices[0]?.message?.content || "Unable to generate a reading.";

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
