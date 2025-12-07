import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { AnimationParams } from '@/types/animation';
import { applyEasingToValues } from '../animation/easingFunctions';

/**
 * アニメーションクリップを生成する
 */
export function generateAnimationClip(
  preset: AnimationPreset,
  params: AnimationParams
): THREE.AnimationClip {
  const tracks: THREE.KeyframeTrack[] = [];

  // 各TrackGeneratorを実行してトラックを生成
  for (const generator of preset.trackGenerators) {
    const result = generator(params.intensity, params.duration);

    // 単一トラックまたは複数トラックの配列
    if (Array.isArray(result)) {
      tracks.push(...result);
    } else {
      tracks.push(result);
    }
  }

  // イージングを適用（linear以外の場合）
  if (params.easing !== 'linear') {
    tracks.forEach((track) => {
      // NumberKeyframeTrackまたはVectorKeyframeTrackの場合のみイージング適用
      if (
        track instanceof THREE.NumberKeyframeTrack ||
        track instanceof THREE.VectorKeyframeTrack
      ) {
        const originalValues = Array.from(track.values);
        const easedValues = applyEasingToValues(originalValues, params.easing);
        track.values = new Float32Array(easedValues);
      }
    });
  }

  // AnimationClipを作成
  const clip = new THREE.AnimationClip(preset.name, params.duration, tracks);

  return clip;
}

/**
 * アニメーションパラメータのバリデーション
 */
export function validateAnimationParams(params: Partial<AnimationParams>): AnimationParams {
  return {
    speed: Math.max(0.1, Math.min(5.0, params.speed ?? 1.0)),
    intensity: Math.max(0.1, Math.min(3.0, params.intensity ?? 1.0)),
    duration: Math.max(0.5, Math.min(30, params.duration ?? 3.0)),
    loopCount: params.loopCount ?? Infinity,
    easing: params.easing ?? 'linear',
  };
}
