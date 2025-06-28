import { useMemo, useState } from "react";
import { splitAndTrimSentences } from "../utils/textUtils";

export function useSentenceNavigation(
  typingText: string,
  originalText: string,
) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const sentences = useMemo(
    () => splitAndTrimSentences(typingText),
    [typingText],
  );
  const originalSentences = useMemo(
    () => splitAndTrimSentences(originalText),
    [originalText],
  );
  const currentSentence = sentences[sentenceIndex] || "";
  const currentOriginal = originalSentences[sentenceIndex] || "";
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
    originalSentences,
    currentSentence,
    currentOriginal,
    sentenceIndex,
    isLast,
    goNext,
    reset,
    setSentenceIndex,
  };
}
