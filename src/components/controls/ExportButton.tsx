'use client';

import { useAppStore } from '@/store/useAppStore';

export function ExportButton() {
  const currentClip = useAppStore((state) => state.currentClip);
  const selectedPreset = useAppStore((state) => state.selectedPreset);
  const exportTrigger = useAppStore((state) => state.exportTrigger);
  const setExportTrigger = useAppStore((state) => state.setExportTrigger);

  const handleExport = () => {
    if (!currentClip || !selectedPreset) {
      return;
    }

    // エクスポートをトリガー
    setExportTrigger(true);
  };

  const canExport = currentClip && selectedPreset;

  return (
    <div className="space-y-3">
      <button
        onClick={handleExport}
        disabled={!canExport || exportTrigger}
        className={`
          w-full py-3 rounded-lg font-semibold text-white transition-all
          ${
            canExport && !exportTrigger
              ? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
              : 'bg-gray-300 cursor-not-allowed'
          }
        `}
      >
        {exportTrigger ? (
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

      {!canExport && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            モデルをアップロードし、アニメーションを適用してからエクスポートしてください
          </p>
        </div>
      )}
    </div>
  );
}
