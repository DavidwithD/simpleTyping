"use client";
import { useRouter } from "next/navigation";
import { useText } from "./context/TextContext";
import { useState, useEffect } from "react";
import { useTypingHistory } from "./hooks/useTypingHistory";
import TranslateArea from "./components/TranslateArea";
import TypingInputArea from "./components/TypingInputArea";
import HistoryControls from "./components/HistoryControls";
import { trimAndReplaceNewLineAndTab, splitSentences } from "./utils/textUtils";
import {
  HISTORY_FOLDER_NAME,
  HISTORY_FOLDER_MAX_RECORDS,
} from "./constants/history";

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const { originalText, setOriginalText, typingText, setTypingText } =
    useText();
  const [translateValue, setTranslateValue] = useState<string>(originalText);
  const [typingValue, setTypingValue] = useState<string>(typingText);
  const {
    history,
    historyIndex,
    hasPrev,
    hasNext,
    handleHistoryLeft,
    handleHistoryRight,
    // handleClearCurrent,
    // addToHistory,
  } = useTypingHistory();

  // When historyIndex changes, update the textareas with the corresponding history values
  useEffect(() => {
    if (historyIndex !== -1 && history[historyIndex]) {
      setTranslateValue(history[historyIndex].originalText);
      setTypingValue(history[historyIndex].typingText);
    }
  }, [historyIndex, history]);

  const handleStartTyping = () => {
    const cleanedOriginal = translateValue
      ? trimAndReplaceNewLineAndTab(translateValue)
      : "";
    const cleanedTyping = trimAndReplaceNewLineAndTab(typingValue);
    if (!cleanedTyping) {
      setMessage("Please enter the text to type.");
      return;
    }
    // Sentence alignment check
    const originalSentences = splitSentences(cleanedOriginal);
    const typingSentences = splitSentences(cleanedTyping);
    if (
      cleanedOriginal &&
      originalSentences.length !== typingSentences.length
    ) {
      // Store to localStorage for alignment page
      localStorage.setItem("alignOriginal", cleanedOriginal);
      localStorage.setItem("alignTyping", cleanedTyping);
      router.push("/sentence-align");
      return;
    }
    setMessage("");
    setOriginalText(cleanedOriginal);
    setTypingText(cleanedTyping);
    // --- Add to history folder ---
    const key = `folderContents_history-folder`;
    let items = [];
    const itemsRaw = localStorage.getItem(key);
    if (itemsRaw) {
      items = JSON.parse(itemsRaw);
      // Remove any previous record with same content
      items = items.filter(
        (item: any) =>
          item.originalText !== cleanedOriginal ||
          item.typingText !== cleanedTyping,
      );
    }
    // Add new record to end
    items.push({
      id: Date.now().toString(),
      originalText: cleanedOriginal,
      typingText: cleanedTyping,
      createdAt: Date.now(),
    });
    // Keep only the latest N
    if (items.length > HISTORY_FOLDER_MAX_RECORDS) {
      items = items.slice(items.length - HISTORY_FOLDER_MAX_RECORDS);
    }
    localStorage.setItem(key, JSON.stringify(items));
    // --- End add to history folder ---
    router.push("/typing");
  };

  // Folder management for Add-to-folder feature
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [addStatus, setAddStatus] = useState<"idle" | "added">("idle");

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
    // Set default folder as selected if not set
    if (!selectedFolderId) {
      const defaultFolder = foldersArr.find((f: any) => f.name === "Default");
      if (defaultFolder) setSelectedFolderId(defaultFolder.id);
    }
  }, []);

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
        (item: any) =>
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
    const key = `folderContents_${selectedFolderId}`;
    const itemsRaw = localStorage.getItem(key);
    const newItem = {
      id: Date.now().toString(),
      originalText: translateValue,
      typingText: typingValue,
      createdAt: Date.now(),
    };
    let items = [];
    if (itemsRaw) {
      items = JSON.parse(itemsRaw);
      // Prevent duplicate
      if (
        items.some(
          (item: any) =>
            item.originalText === translateValue &&
            item.typingText === typingValue,
        )
      ) {
        setAddStatus("added");
        return;
      }
    }
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
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
      {message && <p className="text-red-500 mt-4">{message}</p>}
      <HistoryControls
        onPrev={handleHistoryLeft}
        onNext={handleHistoryRight}
        hasPrev={hasPrev}
        hasNext={hasNext}
        canClear={historyIndex !== -1}
      />
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleStartTyping}
      >
        Start Typing
      </button>
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
          {folders.filter(f => f.name !== HISTORY_FOLDER_NAME).map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
