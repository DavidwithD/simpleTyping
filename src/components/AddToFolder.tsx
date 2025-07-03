import React, { useEffect, useState } from "react";
import { Folder, TypingHistoryItem } from "../types";
import { HISTORY_FOLDER_NAME } from "../constants/history";
import { useFolders } from "../hooks/useFolders";
import { useFolderContents } from "../hooks/useFolderContents";

interface AddToFolderProps {
  hintValue: string;
  typingValue: string;
}

const AddToFolder: React.FC<AddToFolderProps> = ({
  hintValue,
  typingValue,
}) => {
  const { folders } = useFolders();
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    folders.find((f) => f.name === "Default")?.id || "",
  );
  const [addStatus, setAddStatus] = useState<"idle" | "added">("idle");
  const { contents, addContent } = useFolderContents(selectedFolderId);

  const handleAddToFolder = () => {
    if (!selectedFolderId) return;

    // Check if item already exists
    const exists = contents.some(
      (item) => item.hintText === hintValue && item.typingText === typingValue,
    );

    if (exists) {
      setAddStatus("added");
      return;
    }

    // Add new item
    const newItem: TypingHistoryItem = {
      id: Date.now().toString(),
      hintText: hintValue,
      typingText: typingValue,
      createdAt: Date.now(),
    };
    addContent(newItem);
    setAddStatus("added");
  };

  useEffect(() => {
    // Ensure history folder exists
    if (!folders.some((f: Folder) => f.name === HISTORY_FOLDER_NAME)) {
      const historyFolder: Folder = {
        id: "history-folder",
        name: HISTORY_FOLDER_NAME,
        createdAt: 0,
      };
      localStorage.setItem(
        "typingFolders",
        JSON.stringify([historyFolder, ...folders]),
      );
    }
    // Ensure default folder exists
    if (!folders.some((f: Folder) => f.name === "Default")) {
      const defaultFolder: Folder = {
        id: "default-folder",
        name: "Default",
        createdAt: Date.now(),
      };
      localStorage.setItem(
        "typingFolders",
        JSON.stringify([...folders, defaultFolder]),
      );
    }
    // Set default folder as selected if not set
    if (!selectedFolderId) {
      const defaultFolder = folders.find((f: Folder) => f.name === "Default");
      if (defaultFolder) setSelectedFolderId(defaultFolder.id);
    }
  }, [selectedFolderId, setSelectedFolderId, folders]);

  useEffect(() => {
    if (!selectedFolderId) {
      setAddStatus("idle");
      return;
    }
    const key = `folderContents_${selectedFolderId}`;
    const itemsRaw = localStorage.getItem(key);
    if (itemsRaw) {
      const items = JSON.parse(itemsRaw);
      const exists = items.some(
        (item: TypingHistoryItem) =>
          item.hintText === hintValue && item.typingText === typingValue,
      );
      setAddStatus(exists ? "added" : "idle");
    } else {
      setAddStatus("idle");
    }
  }, [selectedFolderId, hintValue, typingValue]);

  return (
    <div className="flex items-center gap-2 mt-6">
      <button
        className={`px-4 py-2 rounded ${addStatus === "added" ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        disabled={!selectedFolderId || addStatus === "added"}
        onClick={handleAddToFolder}
      >
        {addStatus === "added" ? "added" : "Add"}
      </button>
      <span className="text-white">to</span>
      <select
        className="p-2 rounded bg-slate-700 text-white"
        value={selectedFolderId}
        onChange={(e) => setSelectedFolderId(e.target.value)}
        tabIndex={-1}
      >
        {/* Show Default as default option, hide history folder */}
        {folders
          .filter((f) => f.name !== HISTORY_FOLDER_NAME)
          .map((folder: Folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default AddToFolder;
