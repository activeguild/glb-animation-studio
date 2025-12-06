import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { KeyframeBuilder } from './keyframeBuilder';

/**
 * スケール系アニメーションプリセット（10種類）
 */

export const pulse: AnimationPreset = {
  id: 'pulse',
  name: 'パルス',
  category: 'scale',
  description: '拡大縮小を繰り返します',
  icon: '💓',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const scale = times.map((t) => 1 + Math.sin((t / duration) * Math.PI * 2) * 0.5 * intensity);
      const values = scale.flatMap((s) => [s, s, s]);
      return new THREE.VectorKeyframeTrack('.scale', times, values);
    },
  ],
};

export const breathe: AnimationPreset = {
  id: 'breathe',
  name: '呼吸',
  category: 'scale',
  description: 'ゆっくり拡大縮小します',
  icon: '🫁',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const scale = times.map((t) => 1 + Math.sin((t / duration) * Math.PI * 2) * 0.2 * intensity);
      const values = scale.flatMap((s) => [s, s, s]);
      return new THREE.VectorKeyframeTrack('.scale', times, values);
    },
  ],
};

export const heartbeat: AnimationPreset = {
  id: 'heartbeat',
  name: 'ハートビート',
  category: 'scale',
  description: '心臓の鼓動風に拡大縮小します',
  icon: '❤',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const scale = times.map((t) => {
        const progress = (t / duration) % 1;
        if (progress < 0.3) return 1 + Math.sin(progress * Math.PI * 10) * 0.3 * intensity;
        return 1;
      });
      const values = scale.flatMap((s) => [s, s, s]);
      return new THREE.VectorKeyframeTrack('.scale', times, values);
    },
  ],
};

export const expand: AnimationPreset = {
  id: 'expand',
  name: '膨張',
  category: 'scale',
  description: '徐々に大きくなります',
  icon: '⬜',
  trackGenerators: [
    (intensity, duration) => {
      const scale = 1 + intensity;
      const values = [1, 1, 1, scale, scale, scale];
      return new THREE.VectorKeyframeTrack('.scale', [0, duration], values);
    },
  ],
};

export const contract: AnimationPreset = {
  id: 'contract',
  name: '収縮',
  category: 'scale',
  description: '徐々に小さくなります',
  icon: '▪',
  trackGenerators: [
    (intensity, duration) => {
      const scale = Math.max(0.1, 1 - intensity * 0.9);
      const values = [1, 1, 1, scale, scale, scale];
      return new THREE.VectorKeyframeTrack('.scale', [0, duration], values);
    },
  ],
};

export const pop: AnimationPreset = {
  id: 'pop',
  name: 'ポップ',
  category: 'scale',
  description: '急に大きくなります',
  icon: '💥',
  trackGenerators: [
    (intensity, duration) => {
      const times = [0, duration * 0.3, duration * 0.5, duration];
      const s1 = 1;
      const s2 = 1 + intensity * 1.5;
      const s3 = 1 + intensity * 0.8;
      const values = [s1, s1, s1, s2, s2, s2, s3, s3, s3, s1, s1, s1];
      return new THREE.VectorKeyframeTrack('.scale', times, values);
    },
  ],
};

export const squeezeHorizontal: AnimationPreset = {
  id: 'squeeze-horizontal',
  name: '水平スクイーズ',
  category: 'scale',
  description: '横に伸縮します',
  icon: '↔',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.flatMap((t) => {
        const s = 1 + Math.sin((t / duration) * Math.PI * 2) * 0.5 * intensity;
        return [s, 1, 1];
      });
      return new THREE.VectorKeyframeTrack('.scale', times, values);
    },
  ],
};

export const squeezeVertical: AnimationPreset = {
  id: 'squeeze-vertical',
  name: '垂直スクイーズ',
  category: 'scale',
  description: '縦に伸縮します',
  icon: '↕',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.flatMap((t) => {
        const s = 1 + Math.sin((t / duration) * Math.PI * 2) * 0.5 * intensity;
        return [1, s, 1];
      });
      return new THREE.VectorKeyframeTrack('.scale', times, values);
    },
  ],
};

export const aspectDeform: AnimationPreset = {
  id: 'aspect-deform',
  name: 'アスペクト変形',
  category: 'scale',
  description: '比率を変えながら変形します',
  icon: '⬛',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.flatMap((t) => {
        const progress = t / duration;
        const sx = 1 + Math.sin(progress * Math.PI * 2) * 0.5 * intensity;
        const sy = 1 + Math.cos(progress * Math.PI * 2) * 0.5 * intensity;
        return [sx, sy, 1];
      });
      return new THREE.VectorKeyframeTrack('.scale', times, values);
    },
  ],
};

export const bounceScale: AnimationPreset = {
  id: 'bounce-scale',
  name: 'バウンススケール',
  category: 'scale',
  description: '弾むような拡大縮小をします',
  icon: '🏀',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const scale = times.map((t) => {
        const progress = (t / duration) % 0.5;
        if (progress < 0.25) {
          return 1 + Math.abs(Math.sin(progress * Math.PI * 8)) * 0.5 * intensity;
        }
        return 1;
      });
      const values = scale.flatMap((s) => [s, s, s]);
      return new THREE.VectorKeyframeTrack('.scale', times, values);
    },
  ],
};
