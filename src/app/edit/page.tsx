"use client";
import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { splitSentences } from "../utils/textUtils";
import StartTypingButton from "../../components/StartTypingButton";
import AddToFolder from "../../components/AddToFolder";

type EditPageProps = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default function EditPage({ searchParams }: EditPageProps) {
  const { hint, typing } = use(searchParams);
  const router = useRouter();
  const [hintSentences, setHintSentences] = useState<string[]>([]);
  const [typingSentences, setTypingSentences] = useState<string[]>([]);

  // Initialize sentences from URL params
  useEffect(() => {
    const hintSentencesFromUrl = hint ? splitSentences(hint) : [];
    const typingSentencesFromUrl = typing ? splitSentences(typing) : [];

    // Ensure we have at least one row
    const maxLength = Math.max(
      hintSentencesFromUrl.length,
      typingSentencesFromUrl.length,
      1,
    );

    setHintSentences([
      ...hintSentencesFromUrl,
      ...Array(maxLength - hintSentencesFromUrl.length).fill(""),
    ]);
    setTypingSentences([
      ...typingSentencesFromUrl,
      ...Array(maxLength - typingSentencesFromUrl.length).fill(""),
    ]);
  }, [hint, typing]);

  // Get the maximum number of sentences to determine table rows
  const maxSentences = Math.max(
    hintSentences.length,
    typingSentences.length,
    1,
  );
  const countMatch =
    hintSentences.filter((s) => s.trim()).length ===
    typingSentences.filter((s) => s.trim()).length;

  // Update individual hint sentence
  const updateHintSentence = (index: number, value: string) => {
    const newSentences = [...hintSentences];
    newSentences[index] = value;
    setHintSentences(newSentences);
  };

  // Update individual typing sentence
  const updateTypingSentence = (index: number, value: string) => {
    const newSentences = [...typingSentences];
    newSentences[index] = value;
    setTypingSentences(newSentences);
  };

  // Add new row
  const addRow = () => {
    setHintSentences([...hintSentences, ""]);
    setTypingSentences([...typingSentences, ""]);
  };

  // Remove row
  const removeRow = (index: number) => {
    const newHintSentences = hintSentences.filter((_, i) => i !== index);
    const newTypingSentences = typingSentences.filter((_, i) => i !== index);
    setHintSentences(newHintSentences);
    setTypingSentences(newTypingSentences);
  };

  // Cancel edit and go back
  const handleCancel = () => {
    router.back();
  };

  // Refresh table by re-splitting current combined text
  const handleRefresh = () => {
    const currentHintText = hintSentences.filter((s) => s.trim()).join(" ");
    const currentTypingText = typingSentences.filter((s) => s.trim()).join(" ");

    const newHintSentences = currentHintText
      ? splitSentences(currentHintText)
      : [];
    const newTypingSentences = currentTypingText
      ? splitSentences(currentTypingText)
      : [];

    // Ensure we have at least one row
    const maxLength = Math.max(
      newHintSentences.length,
      newTypingSentences.length,
      1,
    );

    setHintSentences([
      ...newHintSentences,
      ...Array(maxLength - newHintSentences.length).fill(""),
    ]);
    setTypingSentences([
      ...newTypingSentences,
      ...Array(maxLength - newTypingSentences.length).fill(""),
    ]);
  };

  // Get combined text for StartTypingButton and AddToFolder
  const hintText = hintSentences.filter((s) => s.trim()).join(" ");
  const typingText = typingSentences.filter((s) => s.trim()).join(" ");

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <button
          className="mb-4 text-blue-400 hover:underline flex items-center gap-2"
          onClick={handleCancel}
        >
          <FaArrowLeft />
          Back
        </button>
        <h1 className="text-2xl text-white font-bold mb-4 text-center">
          Edit Text
        </h1>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-gray-300">
            <span className="text-sm">Sentences: {maxSentences}</span>
          </div>
          <button
            onClick={addRow}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Row
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700">
                <th className="text-left p-4 text-gray-300 w-12">#</th>
                <th className="text-left p-4 text-gray-300 w-1/2">Hint Text</th>
                <th className="text-left p-4 text-gray-300 w-1/2">
                  Typing Text
                </th>
                <th className="text-left p-4 text-gray-300 w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxSentences }, (_, index) => (
                <tr key={index} className="border-t border-slate-700">
                  <td className="p-4 text-gray-400 text-sm">{index + 1}</td>
                  <td className="p-4">
                    <textarea
                      className="w-full min-h-[60px] p-2 bg-slate-700 text-white rounded resize-none border border-slate-600 focus:border-blue-500 focus:outline-none"
                      value={hintSentences[index] || ""}
                      onChange={(e) =>
                        updateHintSentence(index, e.target.value)
                      }
                      placeholder="Enter hint sentence..."
                    />
                  </td>
                  <td className="p-4">
                    <textarea
                      className="w-full min-h-[60px] p-2 bg-slate-700 text-white rounded resize-none border border-slate-600 focus:border-blue-500 focus:outline-none"
                      value={typingSentences[index] || ""}
                      onChange={(e) =>
                        updateTypingSentence(index, e.target.value)
                      }
                      placeholder="Enter typing sentence..."
                    />
                  </td>
                  <td className="p-4">
                    {maxSentences > 1 && (
                      <button
                        onClick={() => removeRow(index)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded transition-colors"
                        title="Remove row"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        {!countMatch && (
          <div className="text-red-400 mb-2">
            Sentence count does not match! Please edit the texts so both have
            the same number of sentences.
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            title="Refresh by re-splitting current text into sentences"
          >
            🔄 Refresh
          </button>
          
          <AddToFolder hintValue={hintText} typingValue={typingText} />
          
          <StartTypingButton
            hintText={hintText}
            typingText={typingText}
            disabled={!countMatch}
          />
        </div>
      </div>
    </div>
  );
}
