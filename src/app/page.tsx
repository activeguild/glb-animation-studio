'use client';

import { Header } from '@/components/layout/Header';
import { FileUploader } from '@/components/controls/FileUploader';
import { Scene3D } from '@/components/viewer/Scene3D';
import { AnimationSelector } from '@/components/controls/AnimationSelector';
import { ParameterPanel } from '@/components/controls/ParameterPanel';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <main className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* 左側：3Dビューワー */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 min-h-0">
            <Scene3D />
          </div>

          {/* ファイルアップロード */}
          <div className="shrink-0">
            <FileUploader />
          </div>
        </div>

        {/* 右側：コントロールパネル */}
        <div className="w-96 bg-white rounded-lg shadow-lg p-4 overflow-y-auto space-y-6">
          {/* アニメーション選択 */}
          <AnimationSelector />

          {/* 区切り線 */}
          <div className="border-t border-gray-200" />

          {/* パラメータ調整 */}
          <ParameterPanel />
        </div>
      </main>
    </div>
  );
}
