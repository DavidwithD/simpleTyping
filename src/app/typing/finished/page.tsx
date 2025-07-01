"use client";
import React, { useState } from "react";
import { useFolders } from "../../../hooks/useFolders";
import AddToFolder from "../../../components/AddToFolder";

export default function FinishedPage() {
  const { folders } = useFolders();
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    folders.find((f) => f.name === "Default")?.id || "",
  );

  // Dummy values for demonstration; replace with real values as needed
  const hintValue = "";
  const typingValue = "";

  // Dummy handler for demonstration; you may want to pass real data
  const handleAddToFolder = () => {
    // Implement add logic here
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-20">Congratulations!</h1>
      <p className="text-xl text-center mt-4">
        You have completed the typing challenge.
      </p>
      <p className="text-lg text-center mt-2"> Thank you for participating!</p>
      <div className="flex justify-center mt-10">
        <a
          href="/ "
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </a>
      </div>
      <div className="flex justify-center mt-10">
        <AddToFolder
          folders={folders}
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
          hintValue={hintValue}
          typingValue={typingValue}
          handleAddToFolder={handleAddToFolder}
        />
      </div>
    </div>
  );
}
