"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";


export default function HomePage() {
  const [image, setImage] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        body: JSON.stringify({ image, question }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

      const data = await response.json() as { reading: string };
      setReading(data.reading);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setReading("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-12 text-purple-200">
          {mounted ? "The Coolest Fantasickest & Emperordope Tarot Oracle in the Multiverse" : ""}
        </h1>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <label htmlFor="image-upload" className="block text-xl font-medium mb-2 text-purple-200">
             Upload the Tarot Spread before thee Queen of Mystery
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="w-full text-sm text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="question-input" className="block text-xl font-medium mb-2 text-purple-200">
              Present thy Question to the cards
            </label>
            <input
              type="text"
              id="question-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What guidance do you seek?"
              className="w-full rounded-lg bg-white/20 p-3 text-white placeholder-purple-300"
            />
          </div>

          {image && (
            <div className="mb-8">
              <button
                onClick={analyzeImage}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? "Consulting the cards..." : "Reveal Your Reading"}
              </button>
              <Image
                src={image}
                alt="Tarot Spread"
                width={500}
                height={300}
                className="mt-4 rounded-lg shadow-md w-full h-auto"
              />
            </div>
          )}

          {reading && (
                    <div className="mt-8 bg-gray-900 rounded-lg p-6 shadow-lg">
                      <h2 className="text-2xl font-bold mb-4 text-white">Your Tarot Reading:</h2>
                      <div className="text-gray-100 space-y-4">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-4" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-2 text-white" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-2 text-white" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 text-white" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            a: ({node, ...props}) => <a className="text-purple-300 underline" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                          }}
                        >
                          {reading}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

        </div>
      </div>
      <footer className="text-center text-purple-200 py-4">
        Made by PhD in Natural Specific Stupidity
      </footer>
    </main>
  );
}