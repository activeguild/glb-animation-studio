'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { exportAnimatedGLB, generateFilename } from '@/lib/three/exporter';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modelData = useAppStore((state) => state.modelData);
  const currentClip = useAppStore((state) => state.currentClip);
  const selectedPreset = useAppStore((state) => state.selectedPreset);

  const handleExport = async () => {
    if (!modelData || !currentClip || !selectedPreset) {
      setError('モデルとアニメーションを選択してください');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const filename = generateFilename(selectedPreset.name);
      await exportAnimatedGLB(modelData.scene, [currentClip], filename);

      // 成功メッセージ（3秒後に消える）
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (err) {
      console.error('Export error:', err);
      setError('エクスポートに失敗しました');
      setIsExporting(false);
    }
  };

  const canExport = modelData && currentClip && selectedPreset;

  return (
    <div className="space-y-3">
      <button
        onClick={handleExport}
        disabled={!canExport || isExporting}
        className={`
          w-full py-3 rounded-lg font-semibold text-white transition-all
          ${
            canExport && !isExporting
              ? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
              : 'bg-gray-300 cursor-not-allowed'
          }
        `}
      >
        {isExporting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            エクスポート中...
          </span>
        ) : (
          '⬇ GLBダウンロード'
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!canExport && !error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            モデルをアップロードし、アニメーションを適用してからエクスポートしてください
          </p>
        </div>
      )}
    </div>
  );
}
