import React from "react";

interface StartTypingButtonProps {
  originalText: string;
  typingText: string;
  onSuccess?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

import { useRouter } from "next/navigation";
import { trimAndReplaceNewLineAndTab, splitSentences } from "../utils/textUtils";
import { HISTORY_FOLDER_MAX_RECORDS } from "../constants/history";
import { useText } from "../context/TextContext";

export default function StartTypingButton({
  originalText,
  typingText,
  onSuccess,
  disabled,
  children,
}: StartTypingButtonProps) {
  const router = useRouter();
  const { setOriginalText, setTypingText } = useText();

  const handleClick = () => {
    const cleanedOriginal = originalText ? trimAndReplaceNewLineAndTab(originalText) : "";
    const cleanedTyping = trimAndReplaceNewLineAndTab(typingText);
    if (!cleanedTyping) return;
    const originalSentences = splitSentences(cleanedOriginal);
    const typingSentences = splitSentences(cleanedTyping);
    if (cleanedOriginal && originalSentences.length !== typingSentences.length) {
      // Store to localStorage for alignment page
      localStorage.setItem("alignOriginal", cleanedOriginal);
      localStorage.setItem("alignTyping", cleanedTyping);
      router.push("/sentence-align");
      return;
    }
    setOriginalText(cleanedOriginal);
    setTypingText(cleanedTyping);
    // Add to history folder
    const key = `folderContents_history-folder`;
    let items = [];
    const itemsRaw = localStorage.getItem(key);
    if (itemsRaw) {
      items = JSON.parse(itemsRaw);
      items = items.filter(
        (item: any) =>
          item.originalText !== cleanedOriginal ||
          item.typingText !== cleanedTyping,
      );
    }
    items.push({
      id: Date.now().toString(),
      originalText: cleanedOriginal,
      typingText: cleanedTyping,
      createdAt: Date.now(),
    });
    if (items.length > HISTORY_FOLDER_MAX_RECORDS) {
      items = items.slice(items.length - HISTORY_FOLDER_MAX_RECORDS);
    }
    localStorage.setItem(key, JSON.stringify(items));
    if (onSuccess) onSuccess();
    router.push("/typing");
  };

  return (
    <button
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-lg"
      onClick={handleClick}
      disabled={disabled}
    >
      {children || "Start Typing"}
    </button>
  );
}
