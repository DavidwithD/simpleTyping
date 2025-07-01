type SettingsToggleProps = {
  showRemaining: boolean;
  setShowRemaining: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SettingsToggle({
  showRemaining,
  setShowRemaining,
}: SettingsToggleProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-700 rounded-lg shadow-lg p-4 flex items-center gap-2 opacity-50 hover:opacity-100">
      <label htmlFor="toggle-remaining" className="text-white text-sm mr-2">
        Show Remaining
      </label>
      <button
        id="toggle-remaining"
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          showRemaining ? "bg-green-500" : "bg-gray-400"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setShowRemaining((v) => !v);
        }}
      >
        <span
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            showRemaining ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}
