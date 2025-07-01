"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFolders } from "../../hooks/useFolders";
import { HISTORY_FOLDER_NAME } from "../../constants/history";
import { Folder } from "../../types";
import { TypingHistoryItem } from "../../types";
import { FaArrowLeft, FaDownload, FaUpload } from "react-icons/fa";

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

  const handleExportData = () => {
    // Get all folders
    const foldersData = localStorage.getItem("typingFolders");
    const folders = foldersData ? JSON.parse(foldersData) : [];

    // Get all folder contents
    const allData: {
      folders: Folder[];
      folderContents: { [key: string]: TypingHistoryItem[] };
    } = {
      folders: folders,
      folderContents: {},
    };

    folders.forEach((folder: Folder) => {
      const contentsKey = `folderContents_${folder.id}`;
      const contents = localStorage.getItem(contentsKey);
      if (contents) {
        allData.folderContents[folder.id] = JSON.parse(contents);
      }
    });

    // Create and download JSON file
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `typing-folders-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Validate data structure
        if (!data.folders || !Array.isArray(data.folders)) {
          alert("Invalid file format: missing folders array");
          return;
        }

        // Confirm import
        if (
          !confirm(
            "This will replace all existing folders and their contents. Are you sure?",
          )
        ) {
          return;
        }

        // Import folders
        localStorage.setItem("typingFolders", JSON.stringify(data.folders));

        // Import folder contents
        if (data.folderContents) {
          Object.keys(data.folderContents).forEach((folderId) => {
            const contentsKey = `folderContents_${folderId}`;
            localStorage.setItem(
              contentsKey,
              JSON.stringify(data.folderContents[folderId]),
            );
          });
        }

        alert("Data imported successfully! The page will refresh.");
        window.location.reload();
      } catch (error) {
        alert("Error importing file: Invalid JSON format");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = "";
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

      {/* Export/Import Section */}
      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          onClick={handleExportData}
        >
          <FaDownload />
          Export All Data
        </button>
        <label className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer flex items-center gap-2">
          <FaUpload />
          Import Data
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
        </label>
      </div>

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
