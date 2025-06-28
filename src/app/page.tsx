"use client";
import { useRouter } from "next/navigation";
import { useText } from "./context/TextContext";
import { useState, useEffect } from "react";
import { useTypingHistory } from "./hooks/useTypingHistory";
import TranslateArea from "./components/TranslateArea";
import TypingInputArea from "./components/TypingInputArea";
import HistoryControls from "./components/HistoryControls";
import { trimAndReplaceNewLineAndTab, splitSentences } from "./utils/textUtils";

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
    handleClearCurrent,
    addToHistory,
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
    addToHistory(cleanedOriginal, cleanedTyping);
    router.push("/typing");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Simple Typing App</h1>

      <TranslateArea value={translateValue} setValue={setTranslateValue} />
      <TypingInputArea value={typingValue} setValue={setTypingValue} />
      {message && <p className="text-red-500 mt-4">{message}</p>}
      <HistoryControls
        onPrev={handleHistoryLeft}
        onNext={handleHistoryRight}
        onClear={handleClearCurrent}
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
    </div>
  );
}
