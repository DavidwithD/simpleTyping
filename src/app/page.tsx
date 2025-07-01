"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTypingHistory } from "../hooks/useTypingHistory";
import TranslateArea from "../components/TranslateArea";
import TypingInputArea from "../components/TypingInputArea";
import HistoryControls from "../components/HistoryControls";
import StartTypingButton from "../components/StartTypingButton";

export default function HomePage() {
  const router = useRouter();
  const [hintValue, setHintValue] = useState<string>("");
  const [typingValue, setTypingValue] = useState<string>("");
  const {
    history,
    historyIndex,
    hasPrev,
    hasNext,
    handleHistoryLeft,
    handleHistoryRight,
  } = useTypingHistory();

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

      <TranslateArea value={hintValue} setValue={setHintValue} />
      <TypingInputArea value={typingValue} setValue={setTypingValue} />
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
