'use client';

import { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const setUploadedFile = useAppStore((state) => state.setUploadedFile);

  const handleFile = useCallback((file: File) => {
    if (!file.name.match(/\.(glb|gltf)$/i)) {
      alert('GLBまたはGLTF形式のファイルを選択してください');
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedFile(file, url);
  }, [setUploadedFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }
      `}
    >
      <input
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700">
            ドラッグ＆ドロップまたはクリック
          </p>
          <p className="text-sm text-gray-500">
            GLB / GLTF ファイル対応
          </p>
        </div>
      </label>
    </div>
  );
}
