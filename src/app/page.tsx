"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTypingHistory } from "../hooks/useTypingHistory";
import TextInputArea from "../components/TextInputArea";
import HistoryControls from "../components/HistoryControls";
import StartTypingButton from "../components/StartTypingButton";
import TranslateControls from "../components/TranslateControls";

export default function HomePage() {
  const router = useRouter();
  const [hintValue, setHintValue] = useState<string>("");
  const [typingValue, setTypingValue] = useState<string>("");
  const [targetLang, setTargetLang] = useState("auto");
  const {
    history,
    historyIndex,
    hasPrev,
    hasNext,
    handleHistoryLeft,
    handleHistoryRight,
  } = useTypingHistory();

  const handleTranslate = async () => {
    if (!hintValue) return;
    try {
      await navigator.clipboard.writeText(hintValue);
    } catch {}
    const url = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodeURIComponent(hintValue)}&op=translate`;
    window.open(url, "_blank");
  };

  // When historyIndex changes, update the textareas with the corresponding history values
  useEffect(() => {
    if (historyIndex !== -1 && history[historyIndex]) {
      setHintValue(history[historyIndex].hintText);
      setTypingValue(history[historyIndex].typingText);
    }
  }, [historyIndex, history]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Simple Typing App</h1>
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-blue-700"
        onClick={() => router.push("/folders")}
      >
        Manage Folders
      </button>

      <TextInputArea
        value={hintValue}
        setValue={setHintValue}
        placeholder="Enter text to translate..."
        className="flex-1"
      />
      <TranslateControls
        targetLang={targetLang}
        onTargetLangChange={setTargetLang}
        onTranslate={handleTranslate}
        disabled={!hintValue}
      />
      <TextInputArea
        value={typingValue}
        setValue={setTypingValue}
        placeholder="Put the text here..."
        autoFocus={true}
        className="flex-1"
      />
      <HistoryControls
        onPrev={handleHistoryLeft}
        onNext={handleHistoryRight}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
      <StartTypingButton hintText={hintValue} typingText={typingValue} />
    </div>
  );
}
