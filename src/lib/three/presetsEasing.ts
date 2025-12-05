import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { KeyframeBuilder } from './keyframeBuilder';

/**
 * イージング変化系アニメーションプリセット（8種類）
 */

export const bounceIn: AnimationPreset = {
  id: 'bounce-in',
  name: 'バウンスイン',
  category: 'easing',
  description: '弾んで入ります',
  icon: '⬇',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        const bounceValue = 1 - Math.abs(Math.cos(progress * Math.PI * 4)) * (1 - progress);
        return intensity * 3 * (1 - bounceValue);
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const bounceOut: AnimationPreset = {
  id: 'bounce-out',
  name: 'バウンスアウト',
  category: 'easing',
  description: '弾んで出ます',
  icon: '⬆',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        const bounceValue = Math.abs(Math.cos(progress * Math.PI * 4)) * (1 - progress);
        return intensity * 3 * (progress + bounceValue);
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const elasticIn: AnimationPreset = {
  id: 'elastic-in',
  name: 'エラスティックイン',
  category: 'easing',
  description: 'ゴムのように入ります',
  icon: '🪃',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        if (progress === 0 || progress === 1) return intensity * 3 * progress;
        const c4 = (2 * Math.PI) / 3;
        return intensity * 3 * (1 - Math.pow(2, 10 * progress - 10) * Math.sin((progress * 10 - 10.75) * c4));
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const elasticOut: AnimationPreset = {
  id: 'elastic-out',
  name: 'エラスティックアウト',
  category: 'easing',
  description: 'ゴムのように出ます',
  icon: '🎯',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        if (progress === 0 || progress === 1) return intensity * 3 * progress;
        const c4 = (2 * Math.PI) / 3;
        return intensity * 3 * (Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1);
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const backIn: AnimationPreset = {
  id: 'back-in',
  name: 'バックイン',
  category: 'easing',
  description: '後ろに引いてから入ります',
  icon: '◀',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return intensity * 3 * (c3 * progress * progress * progress - c1 * progress * progress);
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const backOut: AnimationPreset = {
  id: 'back-out',
  name: 'バックアウト',
  category: 'easing',
  description: '前に出てから戻ります',
  icon: '▶',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return intensity * 3 * (1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2));
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const circular: AnimationPreset = {
  id: 'circular',
  name: 'サーキュラー',
  category: 'easing',
  description: '円形曲線で移動します',
  icon: '⭕',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        return intensity * 3 * Math.sqrt(1 - Math.pow(progress - 1, 2));
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const exponential: AnimationPreset = {
  id: 'exponential',
  name: 'エクスポネンシャル',
  category: 'easing',
  description: '指数関数的に変化します',
  icon: '📈',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        if (progress === 0) return 0;
        if (progress === 1) return intensity * 3;
        return intensity * 3 * (1 - Math.pow(2, -10 * progress));
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};
