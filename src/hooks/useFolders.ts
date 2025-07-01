import { useState, useEffect } from "react";
import { Folder } from "../types";
import { HISTORY_FOLDER_NAME } from "../constants/history";

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    let foldersArr: Folder[] = [];
    const stored = localStorage.getItem("typingFolders");
    if (stored) foldersArr = JSON.parse(stored);
    // Ensure history folder exists
    if (!foldersArr.some((f) => f.name === HISTORY_FOLDER_NAME)) {
      const historyFolder: Folder = {
        id: "history-folder",
        name: HISTORY_FOLDER_NAME,
        createdAt: 0,
      };
      foldersArr = [historyFolder, ...foldersArr];
    }
    // Ensure default folder exists
    if (!foldersArr.some((f) => f.name === "Default")) {
      const defaultFolder: Folder = {
        id: "default-folder",
        name: "Default",
        createdAt: Date.now(),
      };
      foldersArr = [...foldersArr, defaultFolder];
    }
    setFolders(foldersArr);
    localStorage.setItem("typingFolders", JSON.stringify(foldersArr));
  }, []);

  const addFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    localStorage.setItem("typingFolders", JSON.stringify(updated));
  };

  const deleteFolder = (id: string) => {
    const updated = folders.filter((f) => f.id !== id);
    setFolders(updated);
    localStorage.setItem("typingFolders", JSON.stringify(updated));
    localStorage.removeItem(`folderContents_${id}`);
  };

  return { folders, addFolder, deleteFolder };
}
