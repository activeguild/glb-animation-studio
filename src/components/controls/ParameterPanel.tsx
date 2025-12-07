'use client';

import { useAppStore } from '@/store/useAppStore';
import { Slider } from '../ui/Slider';
import { generateAnimationClip } from '@/lib/three/animationGenerator';
import { EasingType } from '@/types/animation';
import { ExportButton } from './ExportButton';

export function ParameterPanel() {
  const selectedPreset = useAppStore((state) => state.selectedPreset);
  const animationParams = useAppStore((state) => state.animationParams);
  const updateParams = useAppStore((state) => state.updateParams);
  const setCurrentClip = useAppStore((state) => state.setCurrentClip);
  const isPlaying = useAppStore((state) => state.isPlaying);
  const setIsPlaying = useAppStore((state) => state.setIsPlaying);

  const handleParamChange = (key: string, value: any) => {
    updateParams({ [key]: value });

    // パラメータ変更時にアニメーションを再生成
    if (selectedPreset) {
      const newClip = generateAnimationClip(selectedPreset, {
        ...animationParams,
        [key]: value,
      });
      setCurrentClip(newClip);
    }
  };

  const handleApply = () => {
    if (!selectedPreset) return;

    const clip = generateAnimationClip(selectedPreset, animationParams);
    setCurrentClip(clip);
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentClip(null);
  };

  if (!selectedPreset) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>アニメーションプリセットを選択してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">パラメータ調整</h2>

      {/* 速度スライダー */}
      <Slider
        label="速度"
        value={animationParams.speed}
        min={0.1}
        max={5.0}
        step={0.1}
        onChange={(value) => handleParamChange('speed', value)}
        unit="x"
      />

      {/* 強度スライダー */}
      <Slider
        label="強度"
        value={animationParams.intensity}
        min={0.1}
        max={3.0}
        step={0.1}
        onChange={(value) => handleParamChange('intensity', value)}
      />

      {/* ループ回数 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">ループ回数</label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 5, 10, Infinity].map((count) => (
            <button
              key={count}
              onClick={() => handleParamChange('loopCount', count)}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${
                  animationParams.loopCount === count
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {count === Infinity ? '無限' : `${count}回`}
            </button>
          ))}
        </div>
      </div>

      {/* イージング選択 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">イージング</label>
        <select
          value={animationParams.easing}
          onChange={(e) => handleParamChange('easing', e.target.value as EasingType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="linear">Linear</option>
          <option value="easeInQuad">Ease In Quad</option>
          <option value="easeOutQuad">Ease Out Quad</option>
          <option value="easeInOutQuad">Ease In-Out Quad</option>
          <option value="easeInCubic">Ease In Cubic</option>
          <option value="easeOutCubic">Ease Out Cubic</option>
          <option value="easeInOutCubic">Ease In-Out Cubic</option>
          <option value="easeInBounce">Ease In Bounce</option>
          <option value="easeOutBounce">Ease Out Bounce</option>
          <option value="easeInElastic">Ease In Elastic</option>
          <option value="easeOutElastic">Ease Out Elastic</option>
        </select>
      </div>

      {/* 再生コントロール */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={!selectedPreset}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPlaying ? '▶ 再生中' : '▶ 再生'}
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={!selectedPreset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={handleStop}
          disabled={!selectedPreset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          ⏹
        </button>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <ExportButton />
      </div>
    </div>
  );
}
