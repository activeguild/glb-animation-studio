import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { KeyframeBuilder } from './keyframeBuilder';

/**
 * キャラクターアクション系アニメーションプリセット
 * 人間やキャラクターの動作・アクションを再現
 */

// ========== 簡単（9個） ==========

export const walkCycle: AnimationPreset = {
  id: 'walk-cycle',
  name: '歩行サイクル',
  category: 'character',
  description: '基本的な歩行モーション',
  icon: '🚶',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xValues = times.map((t) => (t / duration) * intensity * 3);
      const yValues = times.map((t) => Math.abs(Math.sin((t / duration) * Math.PI * 4)) * intensity * 0.3);
      const zRotation = times.map((t) => Math.sin((t / duration) * Math.PI * 4) * intensity * 0.1);

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xValues),
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const runCycle: AnimationPreset = {
  id: 'run-cycle',
  name: '走行サイクル',
  category: 'character',
  description: '速く走るモーション',
  icon: '🏃',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xValues = times.map((t) => (t / duration) * intensity * 6);
      const yValues = times.map((t) => Math.abs(Math.sin((t / duration) * Math.PI * 6)) * intensity * 0.5);
      const xRotation = times.map((t) => Math.sin((t / duration) * Math.PI * 6) * intensity * 0.15);

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xValues),
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
      ];
    },
  ],
};

export const idleBreathing: AnimationPreset = {
  id: 'idle-breathing',
  name: '待機呼吸',
  category: 'character',
  description: '静かに呼吸する待機モーション',
  icon: '😌',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const scaleValues = times.map((t) => {
        const breath = Math.sin((t / duration) * Math.PI * 2) * 0.02 * intensity + 1;
        return breath;
      });

      const yValues = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 2) * intensity * 0.05;
      });

      return [
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
      ];
    },
  ],
};

export const turnAround: AnimationPreset = {
  id: 'turn-around',
  name: '振り向き',
  category: 'character',
  description: '180度振り向く',
  icon: '↩',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const rotationValues = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: Math.PI * intensity, duration: 0.7, easing: 'ease-in-out' },
          { startValue: Math.PI * intensity, endValue: Math.PI * intensity, duration: 0.3, easing: 'linear' },
        ],
        steps
      );

      const xShift = times.map((t) => {
        const progress = t / duration;
        return progress < 0.5 ? Math.sin(progress * Math.PI) * intensity * 0.3 : 0;
      });

      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotationValues),
        new THREE.NumberKeyframeTrack('.position[x]', times, xShift),
      ];
    },
  ],
};

export const sitDown: AnimationPreset = {
  id: 'sit-down',
  name: '座る',
  category: 'character',
  description: 'しゃがんで座る動作',
  icon: '🪑',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yValues = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: -intensity * 1.5, duration: 0.6, easing: 'ease-in' },
          { startValue: -intensity * 1.5, endValue: -intensity * 1.5, duration: 0.4, easing: 'linear' },
        ],
        steps
      );

      const xRotation = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: intensity * 0.3, duration: 0.4, easing: 'ease-in' },
          { startValue: intensity * 0.3, endValue: 0, duration: 0.6, easing: 'ease-out' },
        ],
        steps
      );

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
      ];
    },
  ],
};

export const standUp: AnimationPreset = {
  id: 'stand-up',
  name: '立ち上がる',
  category: 'character',
  description: '座った状態から立ち上がる',
  icon: '🧍',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yValues = KeyframeBuilder.multiPhase(
        [
          { startValue: -intensity * 1.5, endValue: -intensity * 1.7, duration: 0.2, easing: 'ease-in' },
          { startValue: -intensity * 1.7, endValue: 0, duration: 0.6, easing: 'ease-out' },
          { startValue: 0, endValue: 0, duration: 0.2, easing: 'linear' },
        ],
        steps
      );

      const xRotation = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: intensity * 0.4, duration: 0.3, easing: 'ease-in' },
          { startValue: intensity * 0.4, endValue: -intensity * 0.1, duration: 0.4, easing: 'ease-out' },
          { startValue: -intensity * 0.1, endValue: 0, duration: 0.3, easing: 'ease-out' },
        ],
        steps
      );

      const scaleValues = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.2) {
          return 1 - progress * intensity * 0.1;
        } else if (progress < 0.5) {
          return 0.98 + (progress - 0.2) * intensity * 0.15;
        }
        return 1;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
      ];
    },
  ],
};

export const pointGesture: AnimationPreset = {
  id: 'point-gesture',
  name: '指差し',
  category: 'character',
  description: '前方を指差すジェスチャー',
  icon: '👉',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xRotation = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: -intensity * 0.2, duration: 0.3, easing: 'ease-out' },
          { startValue: -intensity * 0.2, endValue: -intensity * 0.2, duration: 0.5, easing: 'linear' },
          { startValue: -intensity * 0.2, endValue: 0, duration: 0.2, easing: 'ease-in' },
        ],
        steps
      );

      const zPosition = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: intensity * 0.8, duration: 0.3, easing: 'ease-out' },
          { startValue: intensity * 0.8, endValue: intensity * 0.8, duration: 0.5, easing: 'linear' },
          { startValue: intensity * 0.8, endValue: 0, duration: 0.2, easing: 'ease-in' },
        ],
        steps
      );

      return [
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.position[z]', times, zPosition),
      ];
    },
  ],
};

export const wavingHand: AnimationPreset = {
  id: 'waving-hand',
  name: '手を振る',
  category: 'character',
  description: '手を左右に振る挨拶',
  icon: '👋',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const zRotation = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 6) * intensity * 0.4;
      });

      const yPosition = times.map((t) => {
        return Math.abs(Math.sin((t / duration) * Math.PI * 6)) * intensity * 0.2;
      });

      return [
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
      ];
    },
  ],
};

export const headTilt: AnimationPreset = {
  id: 'head-tilt',
  name: '首を傾げる',
  category: 'character',
  description: '疑問や興味を示す首の傾き',
  icon: '🤔',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const zRotation = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: intensity * 0.3, duration: 0.4, easing: 'ease-out' },
          { startValue: intensity * 0.3, endValue: intensity * 0.3, duration: 0.4, easing: 'linear' },
          { startValue: intensity * 0.3, endValue: 0, duration: 0.2, easing: 'ease-in' },
        ],
        steps
      );

      return new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation);
    },
  ],
};

// ========== 中程度（10個） ==========

export const jumpAction: AnimationPreset = {
  id: 'jump-action',
  name: 'ジャンプアクション',
  category: 'character',
  description: '予備動作から跳躍、着地まで',
  icon: '🦘',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yValues = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: -intensity * 0.5, duration: 0.15, easing: 'ease-in' },
          { startValue: -intensity * 0.5, endValue: intensity * 3, duration: 0.4, easing: 'ease-out' },
          { startValue: intensity * 3, endValue: 0, duration: 0.35, easing: 'ease-in' },
          { startValue: 0, endValue: -intensity * 0.2, duration: 0.05, easing: 'linear' },
          { startValue: -intensity * 0.2, endValue: 0, duration: 0.05, easing: 'ease-out' },
        ],
        steps
      );

      const scaleValues = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.15) {
          return 1 - progress * intensity * 0.2;
        } else if (progress < 0.2) {
          return 0.97 + (progress - 0.15) * intensity * 0.6;
        } else if (progress > 0.9) {
          return 1 - (progress - 0.9) * intensity * 0.3;
        }
        return 1;
      });

      const xRotation = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.55) {
          return -Math.sin(progress * Math.PI * 2) * intensity * 0.2;
        }
        return 0;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
      ];
    },
  ],
};

export const punchAttack: AnimationPreset = {
  id: 'punch-attack',
  name: 'パンチ攻撃',
  category: 'character',
  description: '前方へのパンチモーション',
  icon: '👊',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const zPosition = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: -intensity * 0.5, duration: 0.2, easing: 'ease-in' },
          { startValue: -intensity * 0.5, endValue: intensity * 2, duration: 0.3, easing: 'ease-out' },
          { startValue: intensity * 2, endValue: intensity * 1.5, duration: 0.2, easing: 'linear' },
          { startValue: intensity * 1.5, endValue: 0, duration: 0.3, easing: 'ease-in' },
        ],
        steps
      );

      const yRotation = times.map((t) => {
        const progress = t / duration;
        if (progress > 0.2 && progress < 0.5) {
          return Math.sin((progress - 0.2) * Math.PI * 4) * intensity * 0.15;
        }
        return 0;
      });

      const xPosition = times.map((t) => {
        const progress = t / duration;
        if (progress > 0.2 && progress < 0.5) {
          return -Math.sin((progress - 0.2) * Math.PI * 2) * intensity * 0.3;
        }
        return 0;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[z]', times, zPosition),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, yRotation),
        new THREE.NumberKeyframeTrack('.position[x]', times, xPosition),
      ];
    },
  ],
};

export const kickAttack: AnimationPreset = {
  id: 'kick-attack',
  name: 'キック攻撃',
  category: 'character',
  description: 'キックを繰り出すモーション',
  icon: '🦵',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xPosition = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: -intensity * 0.8, duration: 0.3, easing: 'ease-out' },
          { startValue: -intensity * 0.8, endValue: -intensity * 0.8, duration: 0.3, easing: 'linear' },
          { startValue: -intensity * 0.8, endValue: 0, duration: 0.4, easing: 'ease-in' },
        ],
        steps
      );

      const xRotation = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: intensity * 0.5, duration: 0.25, easing: 'ease-in' },
          { startValue: intensity * 0.5, endValue: intensity * 0.5, duration: 0.3, easing: 'linear' },
          { startValue: intensity * 0.5, endValue: 0, duration: 0.45, easing: 'ease-out' },
        ],
        steps
      );

      const zRotation = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.3) {
          return intensity * 0.2 * Math.sin(progress * Math.PI * 2);
        }
        return 0;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xPosition),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const blockDefense: AnimationPreset = {
  id: 'block-defense',
  name: '防御ブロック',
  category: 'character',
  description: '攻撃を防御する構え',
  icon: '🛡',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xRotation = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: -intensity * 0.3, duration: 0.2, easing: 'ease-out' },
          { startValue: -intensity * 0.3, endValue: -intensity * 0.3, duration: 0.6, easing: 'linear' },
          { startValue: -intensity * 0.3, endValue: 0, duration: 0.2, easing: 'ease-in' },
        ],
        steps
      );

      const scaleValues = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.2) {
          return 1 - (progress / 0.2) * intensity * 0.08;
        } else if (progress < 0.8) {
          return 1 - intensity * 0.08;
        }
        return 1 - intensity * 0.08 + ((progress - 0.8) / 0.2) * intensity * 0.08;
      });

      const yPosition = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.2) {
          return -(progress / 0.2) * intensity * 0.2;
        } else if (progress < 0.8) {
          return -intensity * 0.2;
        }
        return -intensity * 0.2 + ((progress - 0.8) / 0.2) * intensity * 0.2;
      });

      return [
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
      ];
    },
  ],
};

export const dodgeRoll: AnimationPreset = {
  id: 'dodge-roll',
  name: '回避ローリング',
  category: 'character',
  description: '横に転がって回避',
  icon: '🤸',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xPosition = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: intensity * 3, duration: 0.7, easing: 'ease-in-out' },
          { startValue: intensity * 3, endValue: intensity * 3, duration: 0.3, easing: 'linear' },
        ],
        steps
      );

      const yPosition = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.7) {
          return -Math.abs(Math.sin(progress * Math.PI / 0.7)) * intensity * 0.5;
        }
        return 0;
      });

      const zRotation = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.7) {
          return (progress / 0.7) * Math.PI * 2 * intensity;
        }
        return Math.PI * 2 * intensity;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xPosition),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const climbUp: AnimationPreset = {
  id: 'climb-up',
  name: '登る',
  category: 'character',
  description: '壁や梯子を登るモーション',
  icon: '🧗',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yPosition = times.map((t) => (t / duration) * intensity * 4);

      const zRotation = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 4) * intensity * 0.15;
      });

      const xRotation = times.map((t) => {
        return Math.cos((t / duration) * Math.PI * 4) * intensity * 0.1;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
      ];
    },
  ],
};

export const crawl: AnimationPreset = {
  id: 'crawl',
  name: '匍匐前進',
  category: 'character',
  description: '地面を這って進む',
  icon: '🐍',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xPosition = times.map((t) => (t / duration) * intensity * 2);

      const yPosition = times.map((t) => {
        const wave = Math.sin((t / duration) * Math.PI * 4) * intensity * 0.1;
        return -intensity * 1.2 + wave;
      });

      const xRotation = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 4 + Math.PI / 2) * intensity * 0.15;
      });

      const zRotation = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 4) * intensity * 0.1;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xPosition),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const stumble: AnimationPreset = {
  id: 'stumble',
  name: 'よろめく',
  category: 'character',
  description: 'バランスを崩してよろける',
  icon: '😵',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xPosition = times.map((t) => {
        const progress = t / duration;
        return Math.sin(progress * Math.PI * 3) * intensity * 0.8 * (1 - progress);
      });

      const zPosition = times.map((t) => {
        const progress = t / duration;
        return Math.cos(progress * Math.PI * 3) * intensity * 0.5 * (1 - progress);
      });

      const yRotation = times.map((t) => {
        const progress = t / duration;
        return Math.sin(progress * Math.PI * 4) * intensity * 0.3 * (1 - progress);
      });

      const zRotation = times.map((t) => {
        const progress = t / duration;
        return Math.cos(progress * Math.PI * 5) * intensity * 0.2 * (1 - progress);
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xPosition),
        new THREE.NumberKeyframeTrack('.position[z]', times, zPosition),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, yRotation),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const spinAttack: AnimationPreset = {
  id: 'spin-attack',
  name: 'スピンアタック',
  category: 'character',
  description: '回転しながらの攻撃',
  icon: '🌪',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yRotation = times.map((t) => {
        const progress = t / duration;
        return progress * Math.PI * 2 * intensity;
      });

      const scaleValues = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.5) {
          return 1 + progress * intensity * 0.3;
        }
        return 1 + (1 - progress) * intensity * 0.3;
      });

      const yPosition = times.map((t) => {
        return Math.abs(Math.sin((t / duration) * Math.PI)) * intensity * 0.5;
      });

      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, yRotation),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
      ];
    },
  ],
};

export const backstep: AnimationPreset = {
  id: 'backstep',
  name: 'バックステップ',
  category: 'character',
  description: '素早く後退',
  icon: '⬅',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const zPosition = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: 0, duration: 0.1, easing: 'linear' },
          { startValue: 0, endValue: -intensity * 2, duration: 0.4, easing: 'ease-out' },
          { startValue: -intensity * 2, endValue: -intensity * 2, duration: 0.5, easing: 'linear' },
        ],
        steps
      );

      const xRotation = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.5) {
          return -Math.sin(progress * Math.PI * 2) * intensity * 0.2;
        }
        return 0;
      });

      const yPosition = times.map((t) => {
        const progress = t / duration;
        if (progress > 0.1 && progress < 0.5) {
          return Math.abs(Math.sin((progress - 0.1) * Math.PI / 0.4)) * intensity * 0.2;
        }
        return 0;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[z]', times, zPosition),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
      ];
    },
  ],
};

// ========== 複雑（6個） ==========

export const comboAttack: AnimationPreset = {
  id: 'combo-attack',
  name: 'コンボ攻撃',
  category: 'character',
  description: 'パンチ→キック→スピンの連続攻撃',
  icon: '⚡',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const zPosition = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: intensity * 1.5, duration: 0.2, easing: 'ease-out' },
          { startValue: intensity * 1.5, endValue: 0, duration: 0.15, easing: 'ease-in' },
          { startValue: 0, endValue: intensity * 1.2, duration: 0.2, easing: 'ease-out' },
          { startValue: intensity * 1.2, endValue: 0, duration: 0.15, easing: 'ease-in' },
          { startValue: 0, endValue: intensity * 0.8, duration: 0.3, easing: 'linear' },
        ],
        steps
      );

      const xPosition = times.map((t) => {
        const progress = t / duration;
        if (progress > 0.35 && progress < 0.7) {
          return -Math.sin((progress - 0.35) * Math.PI / 0.35) * intensity * 0.8;
        }
        return 0;
      });

      const yRotation = times.map((t) => {
        const progress = t / duration;
        if (progress > 0.7) {
          return ((progress - 0.7) / 0.3) * Math.PI * 2 * intensity;
        }
        return 0;
      });

      const yPosition = times.map((t) => {
        const progress = t / duration;
        if (progress > 0.7) {
          return Math.abs(Math.sin(((progress - 0.7) / 0.3) * Math.PI)) * intensity * 0.5;
        }
        return 0;
      });

      const xRotation = times.map((t) => {
        const progress = t / duration;
        if (progress > 0.35 && progress < 0.7) {
          return Math.sin((progress - 0.35) * Math.PI / 0.35) * intensity * 0.4;
        }
        return 0;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[z]', times, zPosition),
        new THREE.NumberKeyframeTrack('.position[x]', times, xPosition),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, yRotation),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
      ];
    },
  ],
};

export const celebrationDance: AnimationPreset = {
  id: 'celebration-dance',
  name: '勝利ダンス',
  category: 'character',
  description: 'ジャンプと回転を組み合わせた勝利のダンス',
  icon: '🎉',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yPosition = times.map((t) => {
        return Math.abs(Math.sin((t / duration) * Math.PI * 4)) * intensity * 1.5;
      });

      const yRotation = times.map((t) => {
        const progress = t / duration;
        return Math.sin(progress * Math.PI * 6) * intensity * Math.PI / 2;
      });

      const zRotation = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 8) * intensity * 0.3;
      });

      const scaleValues = times.map((t) => {
        return 1 + Math.abs(Math.sin((t / duration) * Math.PI * 4)) * intensity * 0.15;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, yRotation),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
      ];
    },
  ],
};

export const sneakWalk: AnimationPreset = {
  id: 'sneak-walk',
  name: '忍び足',
  category: 'character',
  description: 'しゃがんで静かに移動',
  icon: '🤫',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xPosition = times.map((t) => (t / duration) * intensity * 1.5);

      const yPosition = times.map((t) => {
        const baseHeight = -intensity * 0.8;
        const bob = Math.abs(Math.sin((t / duration) * Math.PI * 6)) * intensity * 0.1;
        return baseHeight + bob;
      });

      const xRotation = times.map((t) => {
        return intensity * 0.3 + Math.sin((t / duration) * Math.PI * 6) * intensity * 0.05;
      });

      const zRotation = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 6 + Math.PI / 2) * intensity * 0.08;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xPosition),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const getHitReaction: AnimationPreset = {
  id: 'get-hit-reaction',
  name: '被弾リアクション',
  category: 'character',
  description: '攻撃を受けて後退するリアクション',
  icon: '💢',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xPosition = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: -intensity * 1.5, duration: 0.2, easing: 'ease-out' },
          { startValue: -intensity * 1.5, endValue: -intensity * 1.2, duration: 0.3, easing: 'linear' },
          { startValue: -intensity * 1.2, endValue: -intensity * 0.5, duration: 0.5, easing: 'ease-in-out' },
        ],
        steps
      );

      const zPosition = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.5) {
          return -Math.sin(progress * Math.PI / 0.5) * intensity * 0.5;
        }
        return 0;
      });

      const xRotation = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: -intensity * 0.4, duration: 0.2, easing: 'ease-out' },
          { startValue: -intensity * 0.4, endValue: -intensity * 0.3, duration: 0.3, easing: 'linear' },
          { startValue: -intensity * 0.3, endValue: 0, duration: 0.5, easing: 'ease-out' },
        ],
        steps
      );

      const yRotation = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.2) {
          return Math.sin(progress * Math.PI / 0.2) * intensity * 0.15;
        }
        return 0;
      });

      const scaleValues = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.2) {
          return 1 - (progress / 0.2) * intensity * 0.1;
        } else if (progress < 0.5) {
          return 1 - intensity * 0.1;
        }
        return 1 - intensity * 0.1 + ((progress - 0.5) / 0.5) * intensity * 0.1;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xPosition),
        new THREE.NumberKeyframeTrack('.position[z]', times, zPosition),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, yRotation),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
      ];
    },
  ],
};

export const chargePower: AnimationPreset = {
  id: 'charge-power',
  name: '力溜め',
  category: 'character',
  description: 'エネルギーをチャージする構え',
  icon: '⚡',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const scaleValues = times.map((t) => {
        const progress = t / duration;
        const pulse = Math.sin(progress * Math.PI * 8) * 0.05 * intensity;
        const grow = 1 + progress * intensity * 0.2;
        return grow + pulse;
      });

      const yPosition = times.map((t) => {
        const vibration = Math.sin((t / duration) * Math.PI * 16) * intensity * 0.05;
        return vibration;
      });

      const yRotation = times.map((t) => {
        return (t / duration) * Math.PI * 2 * intensity * 0.5;
      });

      const xRotation = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 12) * intensity * 0.05;
      });

      const zRotation = times.map((t) => {
        return Math.cos((t / duration) * Math.PI * 12) * intensity * 0.05;
      });

      return [
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, yRotation),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const deathFall: AnimationPreset = {
  id: 'death-fall',
  name: '倒れる',
  category: 'character',
  description: 'よろめいて倒れるアニメーション',
  icon: '💀',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yPosition = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: 0, duration: 0.15, easing: 'linear' },
          { startValue: 0, endValue: -intensity * 0.3, duration: 0.15, easing: 'ease-in' },
          { startValue: -intensity * 0.3, endValue: -intensity * 2, duration: 0.4, easing: 'ease-in' },
          { startValue: -intensity * 2, endValue: -intensity * 2.2, duration: 0.1, easing: 'linear' },
          { startValue: -intensity * 2.2, endValue: -intensity * 2, duration: 0.2, easing: 'ease-out' },
        ],
        steps
      );

      const xRotation = KeyframeBuilder.multiPhase(
        [
          { startValue: 0, endValue: 0, duration: 0.15, easing: 'linear' },
          { startValue: 0, endValue: intensity * 0.2, duration: 0.15, easing: 'ease-in' },
          { startValue: intensity * 0.2, endValue: intensity * Math.PI / 2, duration: 0.4, easing: 'ease-in' },
          { startValue: intensity * Math.PI / 2, endValue: intensity * Math.PI / 2, duration: 0.3, easing: 'linear' },
        ],
        steps
      );

      const zRotation = times.map((t) => {
        const progress = t / duration;
        if (progress < 0.3) {
          return Math.sin(progress * Math.PI / 0.3) * intensity * 0.15;
        } else if (progress < 0.7) {
          return intensity * ((progress - 0.3) / 0.4) * 0.3;
        }
        return intensity * 0.3;
      });

      const scaleValues = times.map((t) => {
        const progress = t / duration;
        if (progress > 0.7) {
          return 1 - ((progress - 0.7) / 0.3) * intensity * 0.15;
        }
        return 1;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, yPosition),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
      ];
    },
  ],
};
