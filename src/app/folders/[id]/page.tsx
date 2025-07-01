"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useText } from "../../context/TextContext";
import { HISTORY_FOLDER_NAME } from "../../constants/history";
import { Folder, TypingHistoryItem } from "../../types";
import { useFolderContents } from "../../hooks/useFolderContents";
import { FaArrowLeft } from "react-icons/fa";

export default function FolderContentsPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = params?.id as string;
  const [folder, setFolder] = useState<Folder | null>(null);
  const { contents, deleteContent } = useFolderContents(folderId);
  const { setOriginalText, setTypingText } = useText();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    // Load folder info
    const foldersRaw = localStorage.getItem("typingFolders");
    if (foldersRaw) {
      const folders: Folder[] = JSON.parse(foldersRaw);
      const found = folders.find((f: Folder) => f.id === folderId);
      if (found) setFolder(found);
    }
    // No need to manually load contents, useFolderContents handles it
  }, [folderId]);

  // Delete content by id
  const handleDelete = (id: string) => {
    deleteContent(id);
  };

  // Start typing with this content
  const handleStartTyping = (item: TypingHistoryItem) => {
    setOriginalText(item.originalText);
    setTypingText(item.typingText);
    // Optionally, update typingHistory as well
    localStorage.setItem(
      "typingHistory",
      JSON.stringify([
        { originalText: item.originalText, typingText: item.typingText },
      ]),
    );
    router.push("/typing");
  };

  const handleDeleteFolder = () => {
    if (
      !folder ||
      folder.name === HISTORY_FOLDER_NAME ||
      folder.name === "Default"
    ) {
      setDeleteError("This folder cannot be deleted.");
      setShowDeleteDialog(true);
      return;
    }
    setDeleteError("");
    setShowDeleteDialog(true);
  };

  const confirmDeleteFolder = () => {
    if (!folder) return;
    // Remove folder from folders list
    const foldersRaw = localStorage.getItem("typingFolders");
    let foldersArr = foldersRaw ? JSON.parse(foldersRaw) : [];
    foldersArr = foldersArr.filter((f: Folder) => f.id !== folder.id);
    localStorage.setItem("typingFolders", JSON.stringify(foldersArr));
    // Remove folder contents
    localStorage.removeItem(`folderContents_${folder.id}`);
    setShowDeleteDialog(false);
    router.push("/folders");
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center">
      <button
        className="self-start mb-4 text-blue-400 hover:underline flex items-center gap-2"
        onClick={() => router.push("/folders")}
      >
        <FaArrowLeft />
        Back to Folders
      </button>
      <h1 className="text-2xl text-white font-bold mb-2">
        {folder?.name || "Folder"}
      </h1>
      {folder &&
      folder.name !== HISTORY_FOLDER_NAME &&
      folder.name !== "Default" ? (
        <button
          className="mb-4 px-3 py-1 bg-slate-700 text-gray-400 rounded hover:bg-slate-600 hover:text-red-500 text-xs border border-slate-600 transition"
          onClick={handleDeleteFolder}
        >
          Delete Folder
        </button>
      ) : (
        <div className="mb-4 text-xs text-gray-500">
          {folder?.name === HISTORY_FOLDER_NAME || folder?.name === "Default"
            ? "This folder cannot be deleted."
            : null}
        </div>
      )}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center">
            {deleteError ? (
              <div className="text-red-600 mb-4">{deleteError}</div>
            ) : (
              <>
                <div className="text-lg mb-4 text-gray-800">
                  Are you sure you want to delete this folder?
                </div>
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={confirmDeleteFolder}
                  >
                    Confirm Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="text-gray-400 mb-6">
        Created: {folder ? new Date(folder.createdAt).toLocaleString() : ""}
      </div>
      <div className="w-full max-w-2xl">
        {contents.length === 0 ? (
          <div className="text-gray-400">No contents in this folder.</div>
        ) : (
          <ul className="space-y-4">
            {contents.map((item) => (
              <li
                key={item.id}
                className="bg-slate-800 p-4 rounded group flex flex-col gap-2 relative cursor-pointer hover:bg-slate-700 transition"
                onClick={() => handleStartTyping(item)}
              >
                <button
                  className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  &#10005;
                </button>
                <div className="mb-2">
                  <span className="text-sm text-gray-400 font-normal">
                    Original:
                  </span>
                  <div className="text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis text-base bg-slate-700 rounded p-2 mt-1 max-w-full">
                    {item.originalText}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400 font-normal">
                    Typing:
                  </span>
                  <div className="text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis text-base bg-slate-700 rounded p-2 mt-1 max-w-full">
                    {item.typingText}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
