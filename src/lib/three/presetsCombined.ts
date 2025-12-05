import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { KeyframeBuilder } from './keyframeBuilder';

/**
 * 複合系アニメーションプリセット（15種類）
 */

export const floating: AnimationPreset = {
  id: 'floating',
  name: '浮遊',
  category: 'combined',
  description: '上下移動しながらY軸回転します',
  icon: '✨',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const posY = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * intensity);
      const rotY = times.map((t) => (t / duration) * Math.PI * 2);
      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const spinAndGrow: AnimationPreset = {
  id: 'spin-and-grow',
  name: 'スピン&グロー',
  category: 'combined',
  description: '回転しながら拡大縮小します',
  icon: '🌟',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const rotY = times.map((t) => (t / duration) * Math.PI * 2 * intensity);
      const scale = times.map((t) => 1 + Math.sin((t / duration) * Math.PI * 2) * 0.5 * intensity);
      const scaleValues = scale.flatMap((s) => [s, s, s]);
      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues),
      ];
    },
  ],
};

export const orbitMotion: AnimationPreset = {
  id: 'orbit-motion',
  name: 'オービット',
  category: 'combined',
  description: '中心軸の周りを公転します',
  icon: '🪐',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const { x, z } = KeyframeBuilder.circular(intensity * 3, steps);
      const rotY = times.map((t) => (t / duration) * Math.PI * 2);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const satellite: AnimationPreset = {
  id: 'satellite',
  name: '衛星運動',
  category: 'combined',
  description: '公転しながら自転します',
  icon: '🛰',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const { x, z } = KeyframeBuilder.circular(intensity * 3, steps);
      const rotY = times.map((t) => (t / duration) * Math.PI * 4);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const dance: AnimationPreset = {
  id: 'dance',
  name: 'ダンス',
  category: 'combined',
  description: '移動・回転・スケールを組み合わせたリズミカルな動き',
  icon: '💃',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const rotY = times.map((t) => (t / duration) * Math.PI * 4);
      const posY = times.map((t) => Math.sin((t / duration) * Math.PI * 8) * intensity * 0.5);
      const scale = times.map((t) => 1 + Math.sin((t / duration) * Math.PI * 16) * intensity * 0.2);
      const scaleValues = scale.flatMap((s) => [s, s, s]);
      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues),
      ];
    },
  ],
};

export const drunk: AnimationPreset = {
  id: 'drunk',
  name: '酔っ払い',
  category: 'combined',
  description: '不規則な動き全般',
  icon: '🍺',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const posX = KeyframeBuilder.randomWalk(intensity * 2, steps);
      const posZ = KeyframeBuilder.randomWalk(intensity * 2, steps);
      const rotY = KeyframeBuilder.randomWalk(Math.PI, steps);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, posX),
        new THREE.NumberKeyframeTrack('.position[z]', times, posZ),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const explode: AnimationPreset = {
  id: 'explode',
  name: '爆発',
  category: 'combined',
  description: '拡大しながら回転して上昇します',
  icon: '💥',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const scale = times.map((t) => 1 + (t / duration) * intensity * 2);
      const scaleValues = scale.flatMap((s) => [s, s, s]);
      const posY = times.map((t) => (t / duration) * intensity * 3);
      const rotY = times.map((t) => (t / duration) * Math.PI * 4);
      return [
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues),
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const implode: AnimationPreset = {
  id: 'implode',
  name: '収束',
  category: 'combined',
  description: '縮小しながら回転して中心へ',
  icon: '🌑',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const scale = times.map((t) => Math.max(0.1, 1 - (t / duration) * intensity * 0.9));
      const scaleValues = scale.flatMap((s) => [s, s, s]);
      const posY = times.map((t) => -(t / duration) * intensity * 2);
      const rotY = times.map((t) => (t / duration) * Math.PI * 4);
      return [
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues),
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const warpIn: AnimationPreset = {
  id: 'warp-in',
  name: 'ワープイン',
  category: 'combined',
  description: 'スケールと回転で出現します',
  icon: '🌀',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const scale = times.map((t) => (t / duration) * intensity);
      const scaleValues = scale.flatMap((s) => [s, s, s]);
      const rotY = times.map((t) => (t / duration) * Math.PI * 6);
      return [
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const warpOut: AnimationPreset = {
  id: 'warp-out',
  name: 'ワープアウト',
  category: 'combined',
  description: 'スケールと回転で消失します',
  icon: '🌪',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const scale = times.map((t) => Math.max(0, 1 - (t / duration)) * intensity);
      const scaleValues = scale.flatMap((s) => [s, s, s]);
      const rotY = times.map((t) => (t / duration) * Math.PI * 6);
      return [
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const rolling: AnimationPreset = {
  id: 'rolling',
  name: 'ローリング',
  category: 'combined',
  description: '転がる動きをします',
  icon: '⚽',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const posX = times.map((t) => (t / duration) * intensity * 5);
      const rotZ = times.map((t) => -(t / duration) * Math.PI * 4 * intensity);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, posX),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, rotZ),
      ];
    },
  ],
};

export const hovering: AnimationPreset = {
  id: 'hovering',
  name: 'ホバリング',
  category: 'combined',
  description: '浮遊しながら微振動します',
  icon: '🚁',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const posY = times.map(
        (t) =>
          Math.sin((t / duration) * Math.PI * 2) * intensity * 0.5 +
          Math.sin((t / duration) * Math.PI * 20) * intensity * 0.05
      );
      const rotY = times.map((t) => (t / duration) * Math.PI * 2);
      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const tornado: AnimationPreset = {
  id: 'tornado',
  name: 'トルネード',
  category: 'combined',
  description: '螺旋回転しながら上昇します',
  icon: '🌪',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const { x, y, z } = KeyframeBuilder.spiral(intensity * 2, intensity * 4, 3, steps);
      const times = KeyframeBuilder.timeArray(steps, duration);
      const rotY = times.map((t) => (t / duration) * Math.PI * 8);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[y]', times, y),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const shake: AnimationPreset = {
  id: 'shake',
  name: 'シェイク',
  category: 'combined',
  description: '激しく振動します',
  icon: '📳',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const posX = KeyframeBuilder.sinWave(intensity * 0.2, 15, steps, duration);
      const posY = KeyframeBuilder.sinWave(intensity * 0.2, 15, steps, duration, Math.PI / 3);
      const posZ = KeyframeBuilder.sinWave(intensity * 0.2, 15, steps, duration, (Math.PI * 2) / 3);
      const rotY = KeyframeBuilder.sinWave(0.2 * intensity, 15, steps, duration);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, posX),
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.NumberKeyframeTrack('.position[z]', times, posZ),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
      ];
    },
  ],
};

export const glitch: AnimationPreset = {
  id: 'glitch',
  name: 'グリッチ',
  category: 'combined',
  description: 'デジタル風エラー効果',
  icon: '⚡',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const posX = times.map((t) => (Math.random() > 0.9 ? (Math.random() - 0.5) * intensity : 0));
      const posY = times.map((t) => (Math.random() > 0.9 ? (Math.random() - 0.5) * intensity : 0));
      const scale = times.map((t) => (Math.random() > 0.95 ? 1 + (Math.random() - 0.5) * intensity * 0.3 : 1));
      const scaleValues = scale.flatMap((s) => [s, s, s]);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, posX),
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues),
      ];
    },
  ],
};
