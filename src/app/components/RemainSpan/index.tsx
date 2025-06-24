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
  highlightFirstSpace = false,
}: {
  remaining: string;
  showRemaining: boolean;
  highlightFirstSpace?: boolean;
}) {
  const { shown, hidden } = getNextSentence(remaining);
  return (
    <>
      {/* First char: highlight if space and prop is set */}
      {shown[0] === " " && highlightFirstSpace ? (
        <span
          className="text-yellow-400 bg-gray-700 rounded"
          ref={(el) => {
            if (el) {
              el.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
          }}
          style={{ opacity: showRemaining ? 1 : 0 }}
        >
          &nbsp;
        </span>
      ) : (
        <span
          className="text-yellow-400"
          ref={(el) => {
            if (el) {
              el.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
          }}
          style={{ opacity: showRemaining ? 1 : 0 }}
        >
          {shown[0]}
        </span>
      )}
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
