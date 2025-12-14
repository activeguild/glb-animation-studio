'use client';

import { useAppStore } from '@/store/useAppStore';
import { generateAnimationClip } from '@/lib/three/animationGenerator';
import { presetsByCategory } from '@/lib/three/presets';
import { AnimationCategory } from '@/types/animation';
import { AnimationPreset } from '@/types/preset';

const categories: { id: AnimationCategory; label: string }[] = [
  { id: 'rotation', label: '回転' },
  { id: 'translation', label: '移動' },
  { id: 'scale', label: 'スケール' },
  { id: 'combined', label: '複合' },
  { id: 'emote', label: 'エモート' },
  { id: 'easing', label: 'イージング' },
  { id: 'physics', label: '物理' },
  { id: 'character', label: 'キャラクター' },
];

export function AnimationSelector() {
  const activeCategory = useAppStore((state) => state.activeCategory);
  const setActiveCategory = useAppStore((state) => state.setActiveCategory);
  const selectedPreset = useAppStore((state) => state.selectedPreset);
  const selectPreset = useAppStore((state) => state.selectPreset);
  const animationParams = useAppStore((state) => state.animationParams);
  const setCurrentClip = useAppStore((state) => state.setCurrentClip);

  const presets = presetsByCategory[activeCategory];

  const handlePresetSelect = (preset: AnimationPreset) => {
    selectPreset(preset);
    
    // アニメーションクリップを即座に生成して反映
    const clip = generateAnimationClip(preset, animationParams);
    setCurrentClip(clip);
    
    // 再生中でなければ再生を開始（ユーザー体験向上のため）
    // ユーザーの要望は「再生中に変更したら反映」だが、
    // 未再生時に選択した場合もプレビューとして再生した方が分かりやすいかもしれない
    // しかし、要望に厳密に従うなら、再生状態は維持するべきだが、
    // 「プレビューにも反映してください」とあるので、何かしら動きが見えた方が良い。
    // ここでは、既に再生中ならそのまま更新（ModelViewerが処理）、
    // 停止中なら...一旦停止のままにするか。
    // ModelViewerの実装では currentClip が変わると自動で play() は呼ばれないが、
    // isPlaying が true なら newAction.play() される。
    
    // 要望: "Reflect it in the preview." -> If it's just a static pose, it might not be obvious.
    // However, usually "preview" implies seeing the animation.
    // Let's assume if the user clicks a preset, they want to see it.
    // But forcing play might be annoying if they just want to setup params first.
    // Let's stick to updating the clip. If isPlaying is true, it verifies the "while playing" part.
    // If isPlaying is false, the user can press play.
    // Wait, ModelViewer useEffect dependencies: [currentClip, ..., isPlaying].
    // If isPlaying is true, action.play() is called.
    // So for "while playing", it works.
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-lg font-semibold text-gray-900 shrink-0">アニメーションプリセット</h2>

      {/* カテゴリタブ */}
      <div className="flex gap-2 flex-wrap shrink-0">
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
      <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1 min-h-0 content-start">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset)}
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
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 shrink-0">
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
