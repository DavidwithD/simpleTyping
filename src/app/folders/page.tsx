"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HISTORY_FOLDER_NAME } from "../constants/history";

// Folder type
type Folder = {
  id: string;
  name: string;
  createdAt: number;
};

export default function FolderManagerPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("typingFolders");
    let foldersArr = stored ? JSON.parse(stored) : [];
    // Ensure history folder exists
    if (!foldersArr.some((f: any) => f.name === HISTORY_FOLDER_NAME)) {
      const historyFolder = {
        id: "history-folder",
        name: HISTORY_FOLDER_NAME,
        createdAt: 0,
      };
      foldersArr = [historyFolder, ...foldersArr];
      localStorage.setItem("typingFolders", JSON.stringify(foldersArr));
    }
    // Ensure default folder exists
    if (!foldersArr.some((f: any) => f.name === "Default")) {
      const defaultFolder = {
        id: "default-folder",
        name: "Default",
        createdAt: Date.now(),
      };
      foldersArr = [...foldersArr, defaultFolder];
      localStorage.setItem("typingFolders", JSON.stringify(foldersArr));
    }
    setFolders(foldersArr);
  }, []);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      createdAt: Date.now(),
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    localStorage.setItem("typingFolders", JSON.stringify(updated));
    setNewFolderName("");
  };

  const handleOpenFolder = (id: string) => {
    router.push(`/folders/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center">
      <h1 className="text-2xl text-white font-bold mb-6">Manage Folders</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="p-2 rounded bg-slate-700 text-white"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleCreateFolder}
        >
          Create Folder
        </button>
      </div>
      <div className="w-full max-w-xl">
        {folders.length === 0 ? (
          <div className="text-gray-400">No folders yet.</div>
        ) : (
          <ul className="space-y-2">
            {folders.map((folder) => (
              <li
                key={folder.id}
                className="flex items-center justify-between bg-slate-800 p-4 rounded cursor-pointer hover:bg-slate-700"
                onClick={() => handleOpenFolder(folder.id)}
              >
                <span className="text-white font-medium">{folder.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(folder.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
