export function trimAndReplaceNewLineAndTab(text: string): string {
  return text
    .trim()
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ");
}

export function splitSentences(text: string): string[] {
  // Split by sentence-ending punctuation, keep the punctuation
  return text.match(/[^.!?。！？…]+[.!?。！？…]?/g) || [];
}

export function splitAndTrimSentences(text: string): string[] {
  return splitSentences(text)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

export function compareStr(answer: string, current: string) {
  const minLength = Math.min(answer.length, current.length);
  const temp = [];
  for (let i = 0; i < minLength; i++) {
    if (answer[i] === current[i]) {
      temp.push(answer[i]);
    } else break;
  }

  const identical = temp.join("");
  const incorrect = current.slice(identical.length).replaceAll(/\s/g, "_");
  const remaining = answer.slice(identical.length + incorrect.length);

  return {
    identical,
    incorrect,
    remaining,
  };
}
