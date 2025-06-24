import { useState, useEffect } from "react";

export function useTypingHistory(initialValue: string) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [value, setValue] = useState<string>(initialValue);

  // Load history and last value from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("typingHistory");
    let arr: string[] = [];
    if (stored) {
      try {
        arr = JSON.parse(stored);
      } catch {}
    }
    setHistory(arr);
    if (arr.length > 0) {
      setValue(arr[arr.length - 1]);
      setHistoryIndex(arr.length - 1);
    } else {
      setValue(initialValue);
      setHistoryIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const hasPrev = historyIndex > 0;
  const hasNext = historyIndex !== -1 && historyIndex < history.length - 1;

  const handleHistoryLeft = () => {
    if (history.length === 0) return;
    setHistoryIndex((idx) => {
      const newIdx = Math.max(0, idx - 1);
      setValue(history[newIdx]);
      return newIdx;
    });
  };

  const handleHistoryRight = () => {
    if (history.length === 0) return;
    setHistoryIndex((idx) => {
      const newIdx = Math.min(history.length - 1, idx + 1);
      setValue(history[newIdx]);
      return newIdx;
    });
  };

  const handleClearCurrent = () => {
    if (historyIndex === -1 || history.length === 0) return;
    const newHistory = history.filter((_, idx) => idx !== historyIndex);
    localStorage.setItem("typingHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
    // Adjust index and value
    if (newHistory.length === 0) {
      setValue("");
      setHistoryIndex(-1);
    } else if (historyIndex >= newHistory.length) {
      setValue(newHistory[newHistory.length - 1]);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setValue(newHistory[historyIndex]);
      setHistoryIndex(historyIndex);
    }
  };

  const addToHistory = (newValue: string) => {
    const arr = [...history];
    if (arr.length === 0 || arr[arr.length - 1] !== newValue) {
      arr.push(newValue);
      localStorage.setItem("typingHistory", JSON.stringify(arr));
      setHistory(arr);
      setHistoryIndex(arr.length - 1);
    }
  };

  return {
    value,
    setValue,
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
