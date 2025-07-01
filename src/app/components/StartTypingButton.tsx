import React from "react";
import { useRouter } from "next/navigation";

import {
  trimAndReplaceNewLineAndTab,
  splitSentences,
} from "../utils/textUtils";
import { HISTORY_FOLDER_MAX_RECORDS } from "../constants/history";
import { useText } from "../context/TextContext";
import { TypingHistoryItem } from "../types";

interface StartTypingButtonProps {
  hintText: string;
  typingText: string;
  onSuccess?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function StartTypingButton({
  hintText,
  typingText,
  onSuccess,
  disabled,
  children,
}: StartTypingButtonProps) {
  const router = useRouter();
  const { setHintText, setTypingText } = useText();

  const handleClick = () => {
    const cleanedHint = hintText ? trimAndReplaceNewLineAndTab(hintText) : "";
    const cleanedTyping = trimAndReplaceNewLineAndTab(typingText);
    if (!cleanedTyping) return;
    const hintSentences = splitSentences(cleanedHint);
    const typingSentences = splitSentences(cleanedTyping);
    if (cleanedHint && hintSentences.length !== typingSentences.length) {
      // Store to localStorage for alignment page
      localStorage.setItem("alignHint", cleanedHint);
      localStorage.setItem("alignTyping", cleanedTyping);
      const params = new URLSearchParams({
        hint: cleanedHint,
        typing: cleanedTyping,
      }).toString();
      router.push(`/sentence-align?${params}`);
      return;
    }
    setHintText(cleanedHint);
    setTypingText(cleanedTyping);
    // Add to history folder
    const key = `folderContents_history-folder`;
    let items: TypingHistoryItem[] = [];
    const itemsRaw = localStorage.getItem(key);
    if (itemsRaw) {
      items = JSON.parse(itemsRaw) as TypingHistoryItem[];
      items = items.filter(
        (item: TypingHistoryItem) =>
          item.hintText !== cleanedHint || item.typingText !== cleanedTyping,
      );
    }
    items.push({
      id: Date.now().toString(),
      hintText: cleanedHint,
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
