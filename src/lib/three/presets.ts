import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { KeyframeBuilder } from './keyframeBuilder';

/**
 * 60種類のアニメーションプリセット定義
 */

// ===== カテゴリ1: 回転系（12種類） =====

export const rotationY: AnimationPreset = {
  id: 'rotation-y',
  name: 'Y軸回転',
  category: 'rotation',
  description: 'Y軸を中心に360度回転します',
  icon: '🔄',
  trackGenerators: [
    (intensity, duration) =>
      new THREE.NumberKeyframeTrack('.rotation[y]', [0, duration], [0, Math.PI * 2 * intensity]),
  ],
};

export const rotationX: AnimationPreset = {
  id: 'rotation-x',
  name: 'X軸回転',
  category: 'rotation',
  description: 'X軸を中心に360度回転します',
  icon: '↻',
  trackGenerators: [
    (intensity, duration) =>
      new THREE.NumberKeyframeTrack('.rotation[x]', [0, duration], [0, Math.PI * 2 * intensity]),
  ],
};

export const rotationZ: AnimationPreset = {
  id: 'rotation-z',
  name: 'Z軸回転',
  category: 'rotation',
  description: 'Z軸を中心に360度回転します',
  icon: '⟳',
  trackGenerators: [
    (intensity, duration) =>
      new THREE.NumberKeyframeTrack('.rotation[z]', [0, duration], [0, Math.PI * 2 * intensity]),
  ],
};

export const spiralRotation: AnimationPreset = {
  id: 'spiral-rotation',
  name: '螺旋回転',
  category: 'rotation',
  description: 'Y軸回転しながら上昇します',
  icon: '🌀',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const rotations = times.map((t) => (t / duration) * Math.PI * 2 * intensity);
      const positions = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * intensity);
      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotations),
        new THREE.NumberKeyframeTrack('.position[y]', times, positions),
      ];
    },
  ],
};

export const pendulumX: AnimationPreset = {
  id: 'pendulum-x',
  name: '振り子回転（X）',
  category: 'rotation',
  description: 'X軸で前後に揺れます',
  icon: '⏰',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * (Math.PI / 4) * intensity);
      return new THREE.NumberKeyframeTrack('.rotation[x]', times, values);
    },
  ],
};

export const pendulumZ: AnimationPreset = {
  id: 'pendulum-z',
  name: '振り子回転（Z）',
  category: 'rotation',
  description: 'Z軸で左右に揺れます',
  icon: '⏱',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * (Math.PI / 4) * intensity);
      return new THREE.NumberKeyframeTrack('.rotation[z]', times, values);
    },
  ],
};

export const doubleRotation: AnimationPreset = {
  id: 'double-rotation',
  name: '二重回転',
  category: 'rotation',
  description: 'X軸とY軸を同時回転します',
  icon: '🔃',
  trackGenerators: [
    (intensity, duration) => [
      new THREE.NumberKeyframeTrack('.rotation[x]', [0, duration], [0, Math.PI * 2 * intensity]),
      new THREE.NumberKeyframeTrack('.rotation[y]', [0, duration], [0, Math.PI * 2 * intensity]),
    ],
  ],
};

export const tripleRotation: AnimationPreset = {
  id: 'triple-rotation',
  name: '三重回転',
  category: 'rotation',
  description: '全軸同時回転します',
  icon: '⚙',
  trackGenerators: [
    (intensity, duration) => [
      new THREE.NumberKeyframeTrack('.rotation[x]', [0, duration], [0, Math.PI * 2 * intensity]),
      new THREE.NumberKeyframeTrack('.rotation[y]', [0, duration], [0, Math.PI * 2 * intensity]),
      new THREE.NumberKeyframeTrack('.rotation[z]', [0, duration], [0, Math.PI * 2 * intensity]),
    ],
  ],
};

export const tumble: AnimationPreset = {
  id: 'tumble',
  name: 'タンブル',
  category: 'rotation',
  description: 'ランダム方向に回転します',
  icon: '🎲',
  trackGenerators: [
    (intensity, duration) => [
      new THREE.NumberKeyframeTrack('.rotation[x]', [0, duration], [0, Math.PI * 3 * intensity]),
      new THREE.NumberKeyframeTrack('.rotation[y]', [0, duration], [0, Math.PI * 2 * intensity]),
      new THREE.NumberKeyframeTrack('.rotation[z]', [0, duration], [0, Math.PI * 1.5 * intensity]),
    ],
  ],
};

export const wobbleRotation: AnimationPreset = {
  id: 'wobble-rotation',
  name: 'ワブル回転',
  category: 'rotation',
  description: 'Y軸回転しながらX/Z軸が揺れます',
  icon: '〰',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const rotY = times.map((t) => (t / duration) * Math.PI * 2);
      const wobbleX = times.map((t) => Math.sin((t / duration) * Math.PI * 4) * 0.3 * intensity);
      const wobbleZ = times.map((t) => Math.cos((t / duration) * Math.PI * 4) * 0.3 * intensity);
      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, wobbleX),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, wobbleZ),
      ];
    },
  ],
};

export const spinUp: AnimationPreset = {
  id: 'spin-up',
  name: 'スピンアップ',
  category: 'rotation',
  description: '徐々に加速回転します',
  icon: '⏫',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        return progress * progress * Math.PI * 2 * intensity;
      });
      return new THREE.NumberKeyframeTrack('.rotation[y]', times, values);
    },
  ],
};

export const spinDown: AnimationPreset = {
  id: 'spin-down',
  name: 'スピンダウン',
  category: 'rotation',
  description: '徐々に減速回転します',
  icon: '⏬',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = t / duration;
        return (1 - (1 - progress) * (1 - progress)) * Math.PI * 2 * intensity;
      });
      return new THREE.NumberKeyframeTrack('.rotation[y]', times, values);
    },
  ],
};

// ===== カテゴリ2: 移動系（15種類） =====

export const moveUpDown: AnimationPreset = {
  id: 'move-up-down',
  name: '上下移動',
  category: 'translation',
  description: 'Y軸方向に往復します',
  icon: '⬆',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * intensity * 2);
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const moveLeftRight: AnimationPreset = {
  id: 'move-left-right',
  name: '左右移動',
  category: 'translation',
  description: 'X軸方向に往復します',
  icon: '↔',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * intensity * 2);
      return new THREE.NumberKeyframeTrack('.position[x]', times, values);
    },
  ],
};

export const moveFrontBack: AnimationPreset = {
  id: 'move-front-back',
  name: '前後移動',
  category: 'translation',
  description: 'Z軸方向に往復します',
  icon: '⇄',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * intensity * 2);
      return new THREE.NumberKeyframeTrack('.position[z]', times, values);
    },
  ],
};

export const circularHorizontal: AnimationPreset = {
  id: 'circular-horizontal',
  name: '円運動（水平）',
  category: 'translation',
  description: 'XZ平面で円を描きます',
  icon: '⭕',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const { x, z } = KeyframeBuilder.circular(intensity * 2, steps);
      const times = KeyframeBuilder.timeArray(steps, duration);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
      ];
    },
  ],
};

export const circularVertical: AnimationPreset = {
  id: 'circular-vertical',
  name: '円運動（垂直）',
  category: 'translation',
  description: 'XY平面で円を描きます',
  icon: '◯',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const x = times.map((t) => Math.cos((t / duration) * Math.PI * 2) * intensity * 2);
      const y = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * intensity * 2);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[y]', times, y),
      ];
    },
  ],
};

export const figure8: AnimationPreset = {
  id: 'figure-8',
  name: '8の字運動',
  category: 'translation',
  description: 'リサージュ曲線で8の字を描きます',
  icon: '∞',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const { x, y } = KeyframeBuilder.figure8(intensity * 2, steps);
      const times = KeyframeBuilder.timeArray(steps, duration);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[y]', times, y),
      ];
    },
  ],
};

export const wave: AnimationPreset = {
  id: 'wave',
  name: '波動運動',
  category: 'translation',
  description: '波のように上下します',
  icon: '〰',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = KeyframeBuilder.sinWave(intensity * 2, 1, steps, duration);
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const spiralUp: AnimationPreset = {
  id: 'spiral-up',
  name: 'スパイラル上昇',
  category: 'translation',
  description: '螺旋を描きながら上昇します',
  icon: '🌀',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const { x, y, z } = KeyframeBuilder.spiral(intensity * 1.5, intensity * 3, 2, steps);
      const times = KeyframeBuilder.timeArray(steps, duration);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[y]', times, y),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
      ];
    },
  ],
};

export const spiralDown: AnimationPreset = {
  id: 'spiral-down',
  name: 'スパイラル下降',
  category: 'translation',
  description: '螺旋を描きながら下降します',
  icon: '🌊',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const { x, y, z } = KeyframeBuilder.spiral(intensity * 1.5, -intensity * 3, 2, steps);
      const times = KeyframeBuilder.timeArray(steps, duration);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[y]', times, y),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
      ];
    },
  ],
};

export const zigzag: AnimationPreset = {
  id: 'zigzag',
  name: 'ジグザグ移動',
  category: 'translation',
  description: 'ギザギザに移動します',
  icon: '⚡',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = KeyframeBuilder.zigzag(intensity * 2, steps);
      return new THREE.NumberKeyframeTrack('.position[x]', times, values);
    },
  ],
};

export const bounceMove: AnimationPreset = {
  id: 'bounce-move',
  name: 'バウンス移動',
  category: 'translation',
  description: '弾みながら移動します',
  icon: '⛹',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const values = times.map((t) => {
        const progress = (t / duration) * 4;
        const bounce = Math.abs(Math.sin(progress * Math.PI)) * intensity * 2;
        return bounce;
      });
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const randomWalk: AnimationPreset = {
  id: 'random-walk',
  name: 'ランダムウォーク',
  category: 'translation',
  description: 'ランダムに移動します',
  icon: '🎲',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const x = KeyframeBuilder.randomWalk(intensity * 2, steps);
      const y = KeyframeBuilder.randomWalk(intensity * 2, steps);
      const z = KeyframeBuilder.randomWalk(intensity * 2, steps);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[y]', times, y),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
      ];
    },
  ],
};

export const orbit: AnimationPreset = {
  id: 'orbit',
  name: '軌道運動',
  category: 'translation',
  description: '楕円軌道を描きます',
  icon: '🛸',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const { x, z } = KeyframeBuilder.elliptical(intensity * 3, intensity * 2, steps);
      const times = KeyframeBuilder.timeArray(steps, duration);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
      ];
    },
  ],
};

export const teleport: AnimationPreset = {
  id: 'teleport',
  name: 'テレポート',
  category: 'translation',
  description: '瞬間移動風に移動します',
  icon: '✨',
  trackGenerators: [
    (intensity, duration) => {
      const times = [0, duration * 0.3, duration * 0.31, duration * 0.7, duration * 0.71, duration];
      const values = [0, 0, intensity * 3, intensity * 3, 0, 0];
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const vibrate: AnimationPreset = {
  id: 'vibrate',
  name: '振動',
  category: 'translation',
  description: '細かく振動します',
  icon: '📳',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const x = KeyframeBuilder.sinWave(intensity * 0.1, 10, steps, duration);
      const y = KeyframeBuilder.sinWave(intensity * 0.1, 10, steps, duration, Math.PI / 2);
      const z = KeyframeBuilder.sinWave(intensity * 0.1, 10, steps, duration, Math.PI);
      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[y]', times, y),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
      ];
    },
  ],
};

// Continue with Scale, Combined, and Easing presets in the next message...
// (Character limit reached, will continue in next file)

// ===== すべてのプリセットをエクスポート =====

// スケール系をインポート
export * from './presetsScale';

// 複合系をインポート
export * from './presetsCombined';

// エモート系をインポート
export * from './presetsEmote';

// イージング系をインポート
export * from './presetsEasing';

// すべてのプリセットを配列にまとめる
import * as scale from './presetsScale';
import * as combined from './presetsCombined';
import * as easing from './presetsEasing';
import * as emote from './presetsEmote';

export const allPresets: AnimationPreset[] = [
  // 回転系（12種類）
  rotationY,
  rotationX,
  rotationZ,
  spiralRotation,
  pendulumX,
  pendulumZ,
  doubleRotation,
  tripleRotation,
  tumble,
  wobbleRotation,
  spinUp,
  spinDown,

  // 移動系（15種類）
  moveUpDown,
  moveLeftRight,
  moveFrontBack,
  circularHorizontal,
  circularVertical,
  figure8,
  wave,
  spiralUp,
  spiralDown,
  zigzag,
  bounceMove,
  randomWalk,
  orbit,
  teleport,
  vibrate,

  // スケール系（10種類）
  scale.pulse,
  scale.breathe,
  scale.heartbeat,
  scale.expand,
  scale.contract,
  scale.pop,
  scale.squeezeHorizontal,
  scale.squeezeVertical,
  scale.aspectDeform,
  scale.bounceScale,

  // 複合系（15種類）
  combined.floating,
  combined.spinAndGrow,
  combined.orbitMotion,
  combined.satellite,
  combined.dance,
  combined.drunk,
  combined.explode,
  combined.implode,
  combined.warpIn,
  combined.warpOut,
  combined.rolling,
  combined.hovering,
  combined.tornado,
  combined.shake,
  combined.glitch,

  // エモート系（8種類）
  emote.jump,
  emote.nod,
  emote.shakeHead,
  emote.surprise,
  emote.happy,
  emote.dizzy,
  emote.shiver,
  emote.bow,

  // イージング系（8種類）
  easing.bounceIn,
  easing.bounceOut,
  easing.elasticIn,
  easing.elasticOut,
  easing.backIn,
  easing.backOut,
  easing.circular,
  easing.exponential,
];

// カテゴリ別にグループ化
export const presetsByCategory = {
  rotation: allPresets.filter((p) => p.category === 'rotation'),
  translation: allPresets.filter((p) => p.category === 'translation'),
  scale: allPresets.filter((p) => p.category === 'scale'),
  combined: allPresets.filter((p) => p.category === 'combined'),
  emote: allPresets.filter((p) => p.category === 'emote'),
  easing: allPresets.filter((p) => p.category === 'easing'),
};

