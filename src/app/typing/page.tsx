"use client";
import React, { useEffect, useRef, useState } from "react";
import { useText } from "../../context/TextContext";
import CursorLockedInput from "../../components/CursorLockInput/index";
import { useRouter } from "next/navigation";
import RemainingSpan from "../../components/RemainSpan";
import { useSentenceNavigation } from "../../hooks/useSentenceNavigation";
import { compareStr } from "../utils/textUtils";
import { MdVisibility, MdVisibilityOff, MdAdd, MdRemove } from "react-icons/md";
import SentenceNavigation from "../../components/SentenceNavigation";

export default function TypingPage() {
  const { typingText, hintText } = useText();
  const [value, setValue] = useState<string>("");
  const [showing, setShowing] = useState<boolean>(true);
  const [peeking, setPeeking] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(24); // Base font size in pixels
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    sentences,
    currentSentence,
    currentHint,
    sentenceIndex,
    isLast,
    goNext,
    goPrevious,
  } = useSentenceNavigation(typingText, hintText);

  const { identical, incorrect, remaining } = compareStr(
    currentSentence,
    value,
  );

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 48)); // Max 48px
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12)); // Min 12px
  };

  const handlePreviousSentence = () => {
    goPrevious();
    setValue("");
  };

  const handleNextSentence = () => {
    goNext();
    setValue("");
  };

  useEffect(() => {
    if (
      identical.length === currentSentence.length &&
      currentSentence.length > 0
    ) {
      if (!isLast) {
        setTimeout(() => {
          goNext();
          setValue("");
        }, 300); // short delay for feedback
      } else {
        router.push("/typing/finished");
      }
    }
  }, [identical.length, currentSentence.length, isLast, goNext, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) setPeeking(true);

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        setValue("");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrevious();
        setValue("");
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) setPeeking(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [goNext, goPrevious]);

  if (!currentSentence) {
    return <div className="text-white text-center mt-10">No text to type.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top half: hint sentence */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-800 min-h-0">
        {currentHint && (
          <div
            className="max-w-2xl p-4 rounded-lg text-gray-200 break-all overflow-auto max-h-full"
            style={{ fontSize: `${fontSize}px` }}
          >
            {currentHint}
          </div>
        )}
      </div>
      {/* Divider */}
      <div className="w-full h-0.5 bg-gradient-to-r from-slate-700 via-slate-400 to-slate-700" />
      {/* Bottom half: typing area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 relative min-h-0">
        {/* Control buttons */}
        <div className="absolute top-4 right-8 z-20 flex gap-4 items-center">
          <SentenceNavigation
            onPrevious={handlePreviousSentence}
            onNext={handleNextSentence}
            canGoPrevious={sentenceIndex > 0}
            canGoNext={sentenceIndex < sentences.length - 1}
            currentIndex={sentenceIndex}
            totalSentences={sentences.length}
          />
          <FontSizeControls
            onIncrease={increaseFontSize}
            onDecrease={decreaseFontSize}
            fontSize={fontSize}
          />
          <VisibilityToggleButton
            showing={showing}
            peeking={peeking}
            onToggle={() => setShowing((prev) => !prev)}
            onPeekStart={() => setPeeking(true)}
            onPeekEnd={() => setPeeking(false)}
          />
        </div>
        {/* Typing display and invisible input overlay */}
        <div className="relative">
          <TypingSentenceDisplay
            identical={identical}
            incorrect={incorrect}
            remaining={remaining}
            showRemaining={showing || peeking}
            fontSize={fontSize}
          />
          {/* Invisible input positioned exactly over the typing display for IME positioning */}
          <CursorLockedInput
            ref={inputRef}
            className="absolute inset-0 opacity-0 pointer-events-none cursor-none max-w-2xl p-4 text-white break-all"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${fontSize * 2.1}px`, // Match the display component
            }}
            autoFocus
            autoComplete="off"
            spellCheck="false"
            tabIndex={-1}
            value={value}
            onBlur={() => inputRef.current?.focus()}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <SentenceProgress current={sentenceIndex} total={sentences.length} />
      </div>
    </div>
  );
}

function FontSizeControls({
  onIncrease,
  onDecrease,
  fontSize,
}: {
  onIncrease: () => void;
  onDecrease: () => void;
  fontSize: number;
}) {
  return (
    <div className="flex gap-4 items-center">
      <button
        className="p-2 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition-colors"
        onClick={onDecrease}
        disabled={fontSize <= 12}
        aria-label="Decrease font size"
        title="Decrease font size"
      >
        <MdRemove
          size={20}
          className={fontSize <= 12 ? "text-gray-500" : "text-gray-200"}
        />
      </button>
      <button
        className="p-2 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition-colors"
        onClick={onIncrease}
        disabled={fontSize >= 48}
        aria-label="Increase font size"
        title="Increase font size"
      >
        <MdAdd
          size={20}
          className={fontSize >= 48 ? "text-gray-500" : "text-gray-200"}
        />
      </button>
    </div>
  );
}

function VisibilityToggleButton({
  showing,
  peeking,
  onToggle,
  onPeekStart,
  onPeekEnd,
}: {
  showing: boolean;
  peeking: boolean;
  onToggle: () => void;
  onPeekStart: () => void;
  onPeekEnd: () => void;
}) {
  return (
    <button
      className="z-20 p-2 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition-colors"
      onClick={onToggle}
      onMouseEnter={onPeekStart}
      onMouseLeave={onPeekEnd}
      aria-label={showing || peeking ? "Hide remaining" : "Show remaining"}
      title={`${showing || peeking ? "Hide" : "Show"} remaining text - Hold Ctrl/Cmd to peek`}
    >
      {showing || peeking ? (
        <MdVisibility size={24} className="text-gray-200" />
      ) : (
        <MdVisibilityOff size={24} className="text-gray-400" />
      )}
    </button>
  );
}

function TypingSentenceDisplay({
  identical,
  incorrect,
  remaining,
  showRemaining,
  fontSize,
}: {
  identical: string;
  incorrect: string;
  remaining: string;
  showRemaining: boolean;
  fontSize: number;
}) {
  return (
    <div
      className="max-w-2xl p-4 rounded-lg text-white break-all"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: `${fontSize * 2.1}px`, // Maintain proportional line height
      }}
    >
      <span className="text-white mb-4">{identical}</span>
      <span className="text-green-500">{incorrect}</span>
      <RemainingSpan remaining={remaining} showRemaining={showRemaining} />
    </div>
  );
}

function SentenceProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div className="w-full max-w-2xl mt-4">
      <div className="flex justify-between text-gray-400 text-sm mb-1">
        <span>
          Sentence {current + 1} / {total}
        </span>
        <span>{percent.toFixed(0)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded">
        <div
          className="h-2 bg-blue-500 rounded transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
