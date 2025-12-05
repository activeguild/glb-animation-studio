'use client';

import { useAppStore } from '@/store/useAppStore';
import { presetsByCategory } from '@/lib/three/presets';
import { AnimationCategory } from '@/types/animation';

const categories: { id: AnimationCategory; label: string }[] = [
  { id: 'rotation', label: '回転' },
  { id: 'translation', label: '移動' },
  { id: 'scale', label: 'スケール' },
  { id: 'combined', label: '複合' },
  { id: 'easing', label: 'イージング' },
];

export function AnimationSelector() {
  const activeCategory = useAppStore((state) => state.activeCategory);
  const setActiveCategory = useAppStore((state) => state.setActiveCategory);
  const selectedPreset = useAppStore((state) => state.selectedPreset);
  const selectPreset = useAppStore((state) => state.selectPreset);

  const presets = presetsByCategory[activeCategory];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">アニメーションプリセット</h2>

      {/* カテゴリタブ */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* プリセットグリッド */}
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => selectPreset(preset)}
            className={`
              p-3 rounded-lg text-left transition-all
              ${
                selectedPreset?.id === preset.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{preset.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {preset.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {preset.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 選択中のプリセット情報 */}
      {selectedPreset && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900">
            選択中: {selectedPreset.name}
          </div>
          <div className="text-xs text-blue-700 mt-1">
            {selectedPreset.description}
          </div>
        </div>
      )}
    </div>
  );
}
