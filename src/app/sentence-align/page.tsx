"use client";
import React, { use, useState } from "react";
import { splitSentences } from "../utils/textUtils";
import StartTypingButton from "../components/StartTypingButton";
import { useFolders } from "../hooks/useFolders";
import AddToFolder from "../components/AddToFolder";

type SentenceAlignPageProps = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default function SentenceAlignPage({
  searchParams,
}: SentenceAlignPageProps) {
  const { original, typing } = use(searchParams);
  const [originalText, setOriginalTextState] = useState(original || "");
  const [typingText, setTypingTextState] = useState(typing || "");

  const originalSentences = splitSentences(originalText);
  const typingSentences = splitSentences(typingText);
  const countMatch = originalSentences.length === typingSentences.length;

  const { folders } = useFolders();
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    folders.find((f) => f.name === "Default")?.id || "",
  );
  const [addStatus, setAddStatus] = useState<"idle" | "added">("idle");

  // Dummy handler for demonstration; you may want to pass real data
  const handleAddToFolder = () => {
    setAddStatus("added");
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
        <StartTypingButton
          originalText={originalText}
          typingText={typingText}
          disabled={!countMatch}
        />
        <AddToFolder
          folders={folders}
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
          addStatus={addStatus}
          handleAddToFolder={handleAddToFolder}
        />
      </div>
    </div>
  );
}
