import { useState, useEffect } from "react";
import { Folder } from "../types";
import { HISTORY_FOLDER_NAME } from "../constants/history";

export type TypingHistoryItem = {
  hintText: string;
  typingText: string;
};

export function useTypingHistory() {
  const [history, setHistory] = useState<TypingHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [hintText, setHintText] = useState<string>("");
  const [typingText, setTypingText] = useState<string>("");

  // Load history and last value from localStorage on mount
  useEffect(() => {
    // Always load from history folder
    const key = `folderContents_history-folder`;
    const itemsRaw = localStorage.getItem(key);
    let arr: TypingHistoryItem[] = [];
    if (itemsRaw) {
      try {
        arr = JSON.parse(itemsRaw);
      } catch {}
    }
    setHistory(arr);
    if (arr.length > 0) {
      setHintText(arr[arr.length - 1].hintText);
      setTypingText(arr[arr.length - 1].typingText);
      setHistoryIndex(arr.length - 1);
    } else {
      setHintText("");
      setTypingText("");
      setHistoryIndex(-1);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("typingFolders");
    let foldersArr = stored ? JSON.parse(stored) : [];
    // Ensure history folder exists
    if (!foldersArr.some((f: Folder) => f.name === HISTORY_FOLDER_NAME)) {
      const historyFolder: Folder = {
        id: "history-folder",
        name: HISTORY_FOLDER_NAME,
        createdAt: 0,
      };
      foldersArr = [historyFolder, ...foldersArr];
      localStorage.setItem("typingFolders", JSON.stringify(foldersArr));
    }
  }, []);

  const hasPrev = historyIndex > 0;
  const hasNext = historyIndex !== -1 && historyIndex < history.length - 1;

  const handleHistoryLeft = () => {
    if (history.length === 0) return;
    setHistoryIndex((idx) => {
      const newIdx = Math.max(0, idx - 1);
      setHintText(history[newIdx].hintText);
      setTypingText(history[newIdx].typingText);
      return newIdx;
    });
  };

  const handleHistoryRight = () => {
    if (history.length === 0) return;
    setHistoryIndex((idx) => {
      const newIdx = Math.min(history.length - 1, idx + 1);
      setHintText(history[newIdx].hintText);
      setTypingText(history[newIdx].typingText);
      return newIdx;
    });
  };

  // Remove addToHistory or make it a no-op, since history is now managed by the folder
  const addToHistory = () => {};

  return {
    hintText,
    setHintText,
    typingText,
    setTypingText,
    history,
    historyIndex,
    hasPrev,
    hasNext,
    handleHistoryLeft,
    handleHistoryRight,
    addToHistory,
    setHistory,
    setHistoryIndex,
  };
}
