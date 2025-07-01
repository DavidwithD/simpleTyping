"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFolders } from "../hooks/useFolders";
import { HISTORY_FOLDER_NAME } from "../constants/history";
import { Folder } from "../types";
import { FaArrowLeft } from "react-icons/fa";

export default function FolderManagerPage() {
  const [newFolderName, setNewFolderName] = useState("");
  const router = useRouter();
  const { folders, addFolder } = useFolders();

  useEffect(() => {
    const stored = localStorage.getItem("typingFolders");
    let foldersArr: Folder[] = stored ? JSON.parse(stored) : [];
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
    // Ensure default folder exists
    if (!foldersArr.some((f: Folder) => f.name === "Default")) {
      const defaultFolder: Folder = {
        id: "default-folder",
        name: "Default",
        createdAt: Date.now(),
      };
      foldersArr = [...foldersArr, defaultFolder];
      localStorage.setItem("typingFolders", JSON.stringify(foldersArr));
    }
  }, []);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim());
    setNewFolderName("");
  };

  const handleOpenFolder = (id: string) => {
    router.push(`/folders/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center">
      <button
        className="self-start mb-4 text-blue-400 hover:underline flex items-center gap-2"
        onClick={() => router.push("/")}
      >
        <FaArrowLeft />
        Back to Home
      </button>
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
            {folders.map((folder: Folder) => (
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
