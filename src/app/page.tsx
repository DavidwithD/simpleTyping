"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTypingHistory } from "./hooks/useTypingHistory";
import { useFolders } from "./hooks/useFolders";
import { useFolderContents } from "./hooks/useFolderContents";
import TranslateArea from "./components/TranslateArea";
import TypingInputArea from "./components/TypingInputArea";
import HistoryControls from "./components/HistoryControls";
import StartTypingButton from "./components/StartTypingButton";
import { HISTORY_FOLDER_NAME } from "./constants/history";
import { Folder, TypingHistoryItem } from "./types";

export default function Home() {
  const router = useRouter();
  const [translateValue, setTranslateValue] = useState<string>("");
  const [typingValue, setTypingValue] = useState<string>("");
  const {
    history,
    historyIndex,
    hasPrev,
    hasNext,
    handleHistoryLeft,
    handleHistoryRight,
  } = useTypingHistory();
  const { folders } = useFolders();
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const { addContent } = useFolderContents(selectedFolderId);

  // When historyIndex changes, update the textareas with the corresponding history values
  useEffect(() => {
    if (historyIndex !== -1 && history[historyIndex]) {
      setTranslateValue(history[historyIndex].originalText);
      setTypingValue(history[historyIndex].typingText);
    }
  }, [historyIndex, history]);

  // Folder management for Add-to-folder feature
  const [addStatus, setAddStatus] = useState<"idle" | "added">("idle");

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

  // Check if current content is already in selected folder
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
          item.originalText === translateValue &&
          item.typingText === typingValue,
      );
      setAddStatus(exists ? "added" : "idle");
    } else {
      setAddStatus("idle");
    }
  }, [selectedFolderId, translateValue, typingValue]);

  const handleAddToFolder = () => {
    if (!selectedFolderId) return;
    const newItem = {
      id: Date.now().toString(),
      originalText: translateValue,
      typingText: typingValue,
      createdAt: Date.now(),
    };
    addContent(newItem);
    setAddStatus("added");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Simple Typing App</h1>
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-blue-700"
        onClick={() => router.push("/folders")}
      >
        Manage Folders
      </button>

      <TranslateArea value={translateValue} setValue={setTranslateValue} />
      <TypingInputArea value={typingValue} setValue={setTypingValue} />
      <HistoryControls
        onPrev={handleHistoryLeft}
        onNext={handleHistoryRight}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
      <StartTypingButton
        originalText={translateValue}
        typingText={typingValue}
      />
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
    </div>
  );
}
