import clsx from "clsx";

function getNextSentence(remaining: string) {
  // Find the first sentence-ending punctuation (., !, ?, …, 。, ！, ？, etc)
  const match = remaining.match(/^[^.!?。！？…]*[.!?。！？…]?/);
  if (!match) return { shown: "", hidden: remaining };
  const shown = match[0];
  const hidden = remaining.slice(shown.length);
  return { shown, hidden };
}

export default function RemainingSpan({
  remaining,
  showRemaining,
}: {
  remaining: string;
  showRemaining: boolean;
}) {
  const { shown, hidden } = getNextSentence(remaining);
  const startIsSpace = shown[0] === " ";
  return (
    <>
      <span
        className={clsx(
          "text-yellow-400",
          startIsSpace && "bg-gray-700 rounded",
        )}
        ref={(el) => {
          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });
          }
        }}
        style={{ opacity: startIsSpace || showRemaining ? 1 : 0 }}
      >
        {shown[0]}
      </span>
      <span
        className="text-gray-500"
        style={{ opacity: showRemaining ? 1 : 0 }}
      >
        {shown.slice(1)}
      </span>
      <span className="text-gray-500 opacity-40 select-none">{hidden}</span>
    </>
  );
}
