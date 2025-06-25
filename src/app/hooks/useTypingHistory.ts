import { useState, useEffect } from "react";

export type TypingHistoryItem = {
  originalText: string;
  typingText: string;
};

export function useTypingHistory() {
  const [history, setHistory] = useState<TypingHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [originalText, setOriginalText] = useState<string>("");
  const [typingText, setTypingText] = useState<string>("");

  // Load history and last value from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("typingHistory");
    let arr: TypingHistoryItem[] = [];
    if (stored) {
      try {
        arr = JSON.parse(stored);
      } catch {}
    }
    setHistory(arr);
    if (arr.length > 0) {
      setOriginalText(arr[arr.length - 1].originalText);
      setTypingText(arr[arr.length - 1].typingText);
      setHistoryIndex(arr.length - 1);
    } else {
      setOriginalText("");
      setTypingText("");
      setHistoryIndex(-1);
    }
  }, []);

  const hasPrev = historyIndex > 0;
  const hasNext = historyIndex !== -1 && historyIndex < history.length - 1;

  const handleHistoryLeft = () => {
    if (history.length === 0) return;
    setHistoryIndex((idx) => {
      const newIdx = Math.max(0, idx - 1);
      setOriginalText(history[newIdx].originalText);
      setTypingText(history[newIdx].typingText);
      return newIdx;
    });
  };

  const handleHistoryRight = () => {
    if (history.length === 0) return;
    setHistoryIndex((idx) => {
      const newIdx = Math.min(history.length - 1, idx + 1);
      setOriginalText(history[newIdx].originalText);
      setTypingText(history[newIdx].typingText);
      return newIdx;
    });
  };

  const handleClearCurrent = () => {
    if (historyIndex === -1 || history.length === 0) return;
    const newHistory = history.filter((_, idx) => idx !== historyIndex);
    localStorage.setItem("typingHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
    if (newHistory.length === 0) {
      setOriginalText("");
      setTypingText("");
      setHistoryIndex(-1);
    } else if (historyIndex >= newHistory.length) {
      setOriginalText(newHistory[newHistory.length - 1].originalText);
      setTypingText(newHistory[newHistory.length - 1].typingText);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setOriginalText(newHistory[historyIndex].originalText);
      setTypingText(newHistory[historyIndex].typingText);
      setHistoryIndex(historyIndex);
    }
  };

  const addToHistory = (original: string, typing: string) => {
    const arr = [...history];
    if (
      arr.length === 0 ||
      arr[arr.length - 1].originalText !== original ||
      arr[arr.length - 1].typingText !== typing
    ) {
      arr.push({ originalText: original, typingText: typing });
      localStorage.setItem("typingHistory", JSON.stringify(arr));
      setHistory(arr);
      setHistoryIndex(arr.length - 1);
    }
  };

  return {
    originalText,
    setOriginalText,
    typingText,
    setTypingText,
    history,
    historyIndex,
    hasPrev,
    hasNext,
    handleHistoryLeft,
    handleHistoryRight,
    handleClearCurrent,
    addToHistory,
    setHistory,
    setHistoryIndex,
  };
}
