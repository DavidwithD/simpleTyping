"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { splitSentences } from "../utils/textUtils";
import { useText } from "../context/TextContext";
import { useTypingHistory } from "../hooks/useTypingHistory";

export default function SentenceAlignPage() {
  const router = useRouter();
  const { setOriginalText, setTypingText } = useText();
  const { addToHistory } = useTypingHistory();
  // Try to get texts from localStorage (or context if you prefer)
  const [originalText, setOriginalTextState] = useState(
    () => localStorage.getItem("alignOriginal") || "",
  );
  const [typingText, setTypingTextState] = useState(
    () => localStorage.getItem("alignTyping") || "",
  );

  const originalSentences = splitSentences(originalText);
  const typingSentences = splitSentences(typingText);
  const countMatch = originalSentences.length === typingSentences.length;

  const handleRecheck = () => {
    // Save edits to localStorage
    localStorage.setItem("alignOriginal", originalText);
    localStorage.setItem("alignTyping", typingText);
    if (countMatch) {
      // Update context and history, then go to typing page
      setOriginalText(originalText);
      setTypingText(typingText);
      addToHistory(originalText, typingText);
      localStorage.setItem(
        "typingHistory",
        JSON.stringify([{ originalText, typingText }]),
      );
      router.push("/typing");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-white font-bold mb-4">
        Sentence Alignment Check
      </h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <div className="flex-1">
          <h2 className="text-lg text-gray-300 mb-2">Original Text</h2>
          <textarea
            className="w-full h-40 p-2 bg-slate-700 text-white rounded mb-2"
            value={originalText}
            onChange={(e) => setOriginalTextState(e.target.value)}
          />
          <ul className="text-gray-400 text-sm space-y-1">
            {originalSentences.map((s, i) => (
              <li key={i}>
                {i + 1}. {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <h2 className="text-lg text-gray-300 mb-2">Typing Text</h2>
          <textarea
            className="w-full h-40 p-2 bg-slate-700 text-white rounded mb-2"
            value={typingText}
            onChange={(e) => setTypingTextState(e.target.value)}
          />
          <ul className="text-gray-400 text-sm space-y-1">
            {typingSentences.map((s, i) => (
              <li key={i}>
                {i + 1}. {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-4">
        {!countMatch && (
          <div className="text-red-400 mb-2">
            Sentence count does not match! Please edit the texts so both have
            the same number of sentences.
          </div>
        )}
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!countMatch}
          onClick={handleRecheck}
        >
          Start Typing
        </button>
      </div>
    </div>
  );
}
