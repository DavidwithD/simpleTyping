import { useMemo, useState } from "react";
import { splitAndTrimSentences } from "../utils/textUtils";

export function useSentenceNavigation(typingText: string, hintText: string) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const sentences = useMemo(
    () => splitAndTrimSentences(typingText),
    [typingText],
  );
  const hintSentences = useMemo(
    () => splitAndTrimSentences(hintText),
    [hintText],
  );
  const currentSentence = sentences[sentenceIndex] || "";
  const currentOriginal = hintSentences[sentenceIndex] || "";
  const isLast = sentenceIndex === sentences.length - 1;

  const goNext = () => {
    if (sentenceIndex < sentences.length - 1) {
      setSentenceIndex((idx) => idx + 1);
      return true;
    }
    return false;
  };

  const reset = () => setSentenceIndex(0);

  return {
    sentences,
    hintSentences,
    currentSentence,
    currentOriginal,
    sentenceIndex,
    isLast,
    goNext,
    reset,
    setSentenceIndex,
  };
}
