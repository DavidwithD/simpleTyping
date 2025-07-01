import React from "react";
import { Folder } from "../types";
import { HISTORY_FOLDER_NAME } from "../constants/history";

interface AddToFolderProps {
  folders: Folder[];
  selectedFolderId: string;
  setSelectedFolderId: (id: string) => void;
  addStatus: string;
  handleAddToFolder: () => void;
}

const AddToFolder: React.FC<AddToFolderProps> = ({
  folders,
  selectedFolderId,
  setSelectedFolderId,
  addStatus,
  handleAddToFolder,
}) => (
  <div className="flex items-center gap-2 mt-6">
    <button
      className={`px-4 py-2 rounded ${addStatus === "added" ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
      disabled={!selectedFolderId || addStatus === "added"}
      onClick={handleAddToFolder}
    >
      {addStatus === "added" ? "added" : "Add"}
    </button>
    <span className="text-white">to</span>
    <select
      className="p-2 rounded bg-slate-700 text-white"
      value={selectedFolderId}
      onChange={(e) => setSelectedFolderId(e.target.value)}
      tabIndex={-1}
    >
      {/* Show Default as default option, hide history folder */}
      {folders
        .filter((f) => f.name !== HISTORY_FOLDER_NAME)
        .map((folder: Folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
    </select>
  </div>
);

export default AddToFolder;
