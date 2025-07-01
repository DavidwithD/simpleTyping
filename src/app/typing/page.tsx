"use client";
import React, { useEffect, useRef, useState } from "react";
import { useText } from "../../context/TextContext";
import CursorLockedInput from "../../components/CursorLockInput/index";
import { useRouter } from "next/navigation";
import RemainingSpan from "../../components/RemainSpan";
import { useSentenceNavigation } from "../../hooks/useSentenceNavigation";
import { compareStr } from "../utils/textUtils";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function TypingPage() {
  const { typingText, hintText } = useText();
  const [value, setValue] = useState<string>("");
  const [showing, setShowing] = useState<boolean>(true);
  const [peeking, setPeeking] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    sentences,
    currentSentence,
    currentHint,
    sentenceIndex,
    isLast,
    goNext,
  } = useSentenceNavigation(typingText, hintText);

  const { identical, incorrect, remaining } = compareStr(
    currentSentence,
    value,
  );

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
  }, []);

  if (!currentSentence) {
    return <div className="text-white text-center mt-10">No text to type.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top half: hint sentence */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-800">
        {currentHint && (
          <div className="max-w-2xl p-4 rounded-lg text-xl text-gray-200 break-all">
            {currentHint}
          </div>
        )}
      </div>
      {/* Divider */}
      <div className="w-full h-0.5 bg-gradient-to-r from-slate-700 via-slate-400 to-slate-700" />
      {/* Bottom half: typing area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 relative">
        {/* Eye icon toggle */}
        <button
          className="absolute top-4 right-8 z-20 p-2 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition-colors"
          onClick={() => setShowing((prev) => !prev)}
          onMouseEnter={() => setPeeking(true)}
          onMouseLeave={() => setPeeking(false)}
          aria-label={showing || peeking ? "Hide remaining" : "Show remaining"}
        >
          {showing || peeking ? (
            <MdVisibility size={24} className="text-gray-200" />
          ) : (
            <MdVisibilityOff size={24} className="text-gray-400" />
          )}
        </button>
        {/* input is invisible but always on focus */}
        <CursorLockedInput
          ref={inputRef}
          className="fixed top-0 left-0 w-full h-full opacity-0 pointer-events-none cursor-none"
          autoFocus
          autoComplete="off"
          spellCheck="false"
          tabIndex={-1}
          value={value}
          onBlur={() => inputRef.current?.focus()}
          onChange={(e) => setValue(e.target.value)}
        />
        <TypingSentenceDisplay
          identical={identical}
          incorrect={incorrect}
          remaining={remaining}
          showRemaining={showing || peeking}
        />
        <SentenceProgress current={sentenceIndex} total={sentences.length} />
      </div>
    </div>
  );
}

function TypingSentenceDisplay({
  identical,
  incorrect,
  remaining,
  showRemaining,
}: {
  identical: string;
  incorrect: string;
  remaining: string;
  showRemaining: boolean;
}) {
  return (
    <div
      className="max-w-2xl p-4 rounded-lg text-2xl text-white break-all"
      style={{ lineHeight: "5rem" }}
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
