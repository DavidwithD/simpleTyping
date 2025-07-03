"use client";
import React, { use, useState } from "react";
import { splitSentences } from "../utils/textUtils";
import StartTypingButton from "../../components/StartTypingButton";
import AddToFolder from "../../components/AddToFolder";

type EditPageProps = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default function EditPage({ searchParams }: EditPageProps) {
  const { hint, typing } = use(searchParams);
  const [hintText, setHintTextState] = useState(hint || "");
  const [typingText, setTypingTextState] = useState(typing || "");

  const hintSentences = splitSentences(hintText);
  const typingSentences = splitSentences(typingText);
  const countMatch = hintSentences.length === typingSentences.length;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Edit Text</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <div className="flex-1">
          <h2 className="text-lg text-gray-300 mb-2">Hint Text</h2>
          <textarea
            className="w-full h-40 p-2 bg-slate-700 text-white rounded mb-2"
            value={hintText}
            onChange={(e) => setHintTextState(e.target.value)}
          />
          <ul className="text-gray-400 text-sm space-y-1">
            {hintSentences.map((s, i) => (
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
        <StartTypingButton
          hintText={hintText}
          typingText={typingText}
          disabled={!countMatch}
        />
        <AddToFolder hintValue={hintText} typingValue={typingText} />
      </div>
    </div>
  );
}
