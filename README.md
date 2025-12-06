# GLB Animation Studio

A specialized internal tool for inspecting, fixing, and exporting GLB/GLTF 3D models, with a strong focus on animation integrity and compatibility.

## Overview

This project provides a web interface to load 3D models, preview their animations, and export them back to GLB format. It specifically addresses common issues found when exporting complex animations from various DCC tools to standard GLTF, such as converting split Euler rotation tracks to Quaternions and ensuring correct node hierarchy handling.

## Features

- **3D Model Viewer**: Interactive preview using Three.js / R3F.
- **Animation Inspector**: Detect and play animations embedded in the model.
- **Smart Export**:
  - Automatically merges split animation tracks (e.g., `rotation.x`, `rotation.y`, `rotation.z`) into single tracks.
  - Converts Euler rotation tracks to Quaternion tracks for full GLTF compatibility.
  - Handles nested node animations correctly.
  - Preserves hierarchy and material data.
- **Tech Stack**:
  - [Next.js](https://nextjs.org/) (App Router)
  - [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
  - [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

The main logic for animation processing and export is located in:

- `src/components/viewer/ExportGLTF.tsx`: Handles the extraction, conversion (Euler to Quaternion), and export of animation clips.
- `src/components/viewer/ModelViewer.tsx`: Manages the 3D scene and model loading.

## License

Private repository.
