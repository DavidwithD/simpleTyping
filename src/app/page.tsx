"use client";
import { useRouter } from "next/navigation";
import { useText } from "./context/TextContext";
import { ChangeEvent, useState } from "react";
import { useTypingHistory } from "./hooks/useTypingHistory";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";

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
  const [message, setMessage] = useState<string>("");
  const {
    value,
    setValue,
    historyIndex,
    hasPrev,
    hasNext,
    handleHistoryLeft,
    handleHistoryRight,
    handleClearCurrent,
    addToHistory,
  } = useTypingHistory(text);

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
    addToHistory(cleanedValue);
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
      {/* Paste from clipboard button */}
      <div className="w-full max-w-2xl flex justify-end mb-2">
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              setValue(text);
            } catch {
              setMessage("Failed to read from clipboard.");
            }
          }}
        >
          Paste from Clipboard
        </button>
      </div>
      <div className="w-full max-w-2xl mb-2 relative group">
        {/* Subtle Floating X (Clear) Button */}
        <button
          className="absolute top-2 right-2 z-10 p-1 bg-transparent text-gray-400 rounded-full opacity-40 group-hover:opacity-90 group-hover:bg-red-600 group-hover:text-white transition-all duration-200 hover:bg-red-700 hover:text-white focus:outline-none"
          onClick={handleClearCurrent}
          disabled={historyIndex === -1}
          aria-label="Clear"
        >
          <MdClose size={20} />
        </button>
        {/* Subtle Chevron navigation middle left/right, on top of textarea */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-transparent text-gray-400 rounded-full opacity-30 group-hover:opacity-80 group-hover:bg-gray-600 group-hover:text-white transition-all duration-200 hover:bg-gray-700 hover:text-white focus:outline-none"
          onClick={handleHistoryLeft}
          disabled={!hasPrev}
          aria-label="Previous"
        >
          <MdChevronLeft size={24} />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-transparent text-gray-400 rounded-full opacity-30 group-hover:opacity-80 group-hover:bg-gray-600 group-hover:text-white transition-all duration-200 hover:bg-gray-700 hover:text-white focus:outline-none"
          onClick={handleHistoryRight}
          disabled={!hasNext}
          aria-label="Next"
        >
          <MdChevronRight size={24} />
        </button>
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
