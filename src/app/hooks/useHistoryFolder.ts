import { useState, useEffect } from "react";
import { TypingHistoryItem } from "../types";
import { HISTORY_FOLDER_MAX_RECORDS } from "../constants/history";

export function useHistoryFolder() {
  const [history, setHistory] = useState<TypingHistoryItem[]>([]);

  useEffect(() => {
    const key = `folderContents_history-folder`;
    const itemsRaw = localStorage.getItem(key);
    if (itemsRaw) setHistory(JSON.parse(itemsRaw) as TypingHistoryItem[]);
    else setHistory([]);
  }, []);

  const addHistory = (item: TypingHistoryItem) => {
    const key = `folderContents_history-folder`;
    let updated = history.filter(
      (h) =>
        h.originalText !== item.originalText ||
        h.typingText !== item.typingText,
    );
    updated.push(item);
    if (updated.length > HISTORY_FOLDER_MAX_RECORDS) {
      updated = updated.slice(updated.length - HISTORY_FOLDER_MAX_RECORDS);
    }
    setHistory(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  return { history, addHistory, setHistory };
}
