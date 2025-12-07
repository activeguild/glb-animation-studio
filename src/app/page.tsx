'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { FileUploader } from '@/components/controls/FileUploader';
import { AnimationSelector } from '@/components/controls/AnimationSelector';
import { ParameterPanel } from '@/components/controls/ParameterPanel';

// Scene3DはSSRを無効化（Three.jsはブラウザでのみ動作）
const Scene3D = dynamic(() => import('@/components/viewer/Scene3D').then(mod => ({ default: mod.Scene3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-gray-400">3Dビューワーを読み込み中...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <main className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* 左側：アニメーション選択 */}
        <div className="w-80 bg-white rounded-lg shadow-lg p-4 flex flex-col shrink-0">
          <AnimationSelector />
        </div>

        {/* 中央：3Dビューワー & アップロード */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden bg-gray-900 shadow-inner border border-gray-800">
             {/* Using a container for Scene3D to ensure it fits well */}
            <div className="absolute inset-0">
              <Scene3D />
            </div>
          </div>

          {/* ファイルアップロード */}
          <div className="shrink-0">
            <FileUploader />
          </div>
        </div>

        {/* 右側：パラメータ調整 */}
        <div className="w-80 bg-white rounded-lg shadow-lg p-4 overflow-y-auto shrink-0">
          <ParameterPanel />
        </div>
      </main>
    </div>
  );
}
