"use client";
import { useRouter } from "next/navigation";
import { useText } from "./context/TextContext";
import { ChangeEvent, useState } from "react";

function trimAndReplaceNewLineAndTab(text: string): string {
  return text
    .trim()
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ");
}

export default function Home() {
  const router = useRouter();
  const { text, setText } = useText();
  const [value, setValue] = useState<string>(text);
  const [message, setMessage] = useState<string>("");
  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };
  const handleStartTyping = () => {
    const cleanedValue = trimAndReplaceNewLineAndTab(value);
    if (cleanedValue.length === 0) {
      setMessage("Please enter some text to start typing.");
      return;
    }
    if (cleanedValue.length > 1000) {
      setMessage("Text is too long. Please limit it to 1000 characters.");
      return;
    }
    setMessage("");
    setText(cleanedValue);
    router.push("/typing");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Simple Typing App</h1>
      <p className="text-lg text-white mb-4">
        This is a simple typing app built with Next.js and Tailwind CSS.
      </p>
      <p className="text-lg text-white mb-4">
        To get started, type in the text area below and click
        <i> Start Typing.</i>
      </p>
      <h1 className="text-2xl font-bold text-white mb-6">Put your text here</h1>
      <div className="w-full max-w-2xl">
        <textarea
          className="w-full h-64 p-4 text-lg bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Put the text here..."
          autoFocus
          value={value}
          onChange={handleTextChange}
        />
      </div>
      {message && <p className="text-red-500 mt-4">{message}</p>}
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleStartTyping}
      >
        Start Typing
      </button>
    </div>
  );
}
