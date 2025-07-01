import { useState, useEffect } from "react";
import { TypingHistoryItem } from "../types";

export function useFolderContents(folderId: string) {
  const [contents, setContents] = useState<TypingHistoryItem[]>([]);

  useEffect(() => {
    if (!folderId) return;
    const key = `folderContents_${folderId}`;
    const itemsRaw = localStorage.getItem(key);
    if (itemsRaw) setContents(JSON.parse(itemsRaw) as TypingHistoryItem[]);
    else setContents([]);
  }, [folderId]);

  const addContent = (item: TypingHistoryItem) => {
    const key = `folderContents_${folderId}`;
    const updated = [...contents, item];
    setContents(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const deleteContent = (id: string) => {
    const key = `folderContents_${folderId}`;
    const updated = contents.filter((item) => item.id !== id);
    setContents(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  return { contents, addContent, deleteContent, setContents };
}
