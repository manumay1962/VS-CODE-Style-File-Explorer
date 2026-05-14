# File Explorer - Frontend Take-Home

A VS Code-style file explorer built from scratch using React, TypeScript, and Vite.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack
- React
- TypeScript
- Vite
- CSS (Vanilla, no styling libraries used)
- Lucide React (Icons, represented via custom SVG logic in this implementation to ensure exact visual match)

## Features
- Create files and folders at root or nested levels
- Inline renaming for files and folders
- Deleting files and folders (recursively)
- Exact macOS-style UI match with the provided mockup
- Fully custom recursive tree rendering (No 3rd-party tree libraries used)

## Build for Production
To build the app for deployment, run:
```bash
npm run build
```
