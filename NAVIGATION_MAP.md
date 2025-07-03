# Simple Typing App Navigation Map (2025-06-29)

```mermaid
graph TD
  Home["Home Page (/)"]
  Typing["Typing Page (/typing)"]
  Align["Edit Page (/edit)"]
  Folders["Folders Page (/folders)"]
  FolderDetail["Folder Detail (/folders/[id])"]

  Home -- "Start Typing" --> Typing
  Home -- "If sentence count mismatch" --> Align
  Home -- "Manage Folders" --> Folders
  Home -- "Add to Folder" --> FolderDetail
  Folders -- "Click Folder" --> FolderDetail
  FolderDetail -- "Click Content" --> Typing
  Align -- "Start Typing (after align)" --> Typing
```

- Home: main entry, translation, typing, add to folder, manage folders
- Typing: sentence-by-sentence typing
- Sentence Alignment: edit/align sentences if counts mismatch
- Folders: manage folders, create/open
- Folder Detail: view, delete, or start typing with content

> This file is for documentation only and will not affect your app implementation.
