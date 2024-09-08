"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function HomePage() {
  const [image, setImage] = useState<string | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/tarot-reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setReading(data.reading);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setReading("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Read your <span className="text-[hsl(280,100%,70%)]">Tarot</span>
        </h1>

        <div className="w-full max-w-md">
          <label
            htmlFor="image-upload"
            className="mb-2 block text-lg font-medium"
          >
            Upload or Take a Photo
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="w-full text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>

        {reading && (
          <div className="mt-4 rounded-lg bg-white p-4 text-gray-800">
            <h2 className="mb-2 text-xl font-bold">Tarot reading:</h2>
            <ReactMarkdown>{reading}</ReactMarkdown>
          </div>
        )}

        {image && (
          <button
            className="mt-4  group"
            onClick={analyzeImage}
            disabled={isLoading}
          >
            <div className="mt-4 w-full rounded-t-lg bg-violet-500 px-4 py-2 font-bold text-white group-hover:bg-violet-600 group-hover:font-extrabold">
              {isLoading ? "Analyzing..." : "Analyze Image"}
            </div>
            <img
              src={image}
              alt="Uploaded"
              className="h-auto max-w-full rounded-b-lg"
            />
          </button>
        )}
      </div>
    </main>
  );
}
