import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { KeyframeBuilder } from './keyframeBuilder';

/**
 * 感情表現（エモート）系アニメーションプリセット
 */

export const jump: AnimationPreset = {
  id: 'jump',
  name: 'ジャンプ',
  category: 'emote',
  description: '元気にその場でジャンプします',
  icon: '🦘',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      // sin波の絶対値でバウンドを表現 (2回バウンド)
      const values = times.map((t) => {
        const progress = t / duration; // 0 to 1
        // 0 -> 1 -> 0 を2回繰り返すようなカーブ
        // sin(0..2PI) -> -1..1. abs -> 0..1..0..1..0
        // Adjust phase so it starts at 0
        return Math.abs(Math.sin(progress * Math.PI * 2)) * intensity * 2;
      });
      
      // 着地時に少し潰れる表現を入れるとよりリアルだが、まずはシンプルに
      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const nod: AnimationPreset = {
  id: 'nod',
  name: 'うなずく',
  category: 'emote',
  description: '肯定するように首を縦に振ります',
  icon: '🙆',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      // 2回うなずく
      const values = times.map((t) => {
        const p = t / duration;
        return Math.sin(p * Math.PI * 4) * (Math.PI / 8) * intensity;
      });
      return new THREE.NumberKeyframeTrack('.rotation[x]', times, values);
    },
  ],
};

export const shakeHead: AnimationPreset = {
  id: 'shake-head',
  name: '首を振る',
  category: 'emote',
  description: '否定するように首を横に振ります',
  icon: '🙅',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      // 2往復
      const values = times.map((t) => {
        const p = t / duration;
        return Math.sin(p * Math.PI * 4) * (Math.PI / 6) * intensity;
      });
      return new THREE.NumberKeyframeTrack('.rotation[y]', times, values);
    },
  ],
};

export const surprise: AnimationPreset = {
  id: 'surprise',
  name: '驚き',
  category: 'emote',
  description: 'ビクッと跳ね上がります',
  icon: '❗',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      
      // 急に上がってゆっくり降りる
      const posY = times.map((t) => {
        const p = t / duration;
        if (p < 0.2) return (p / 0.2) * intensity; // 急上昇
        return (1 - (p - 0.2) / 0.8) * intensity; // ゆっくり下降
      });

      // 同時に少し拡大
      const scaleVals = times.map((t) => {
        const p = t / duration;
        if (p < 0.2) return 1 + (p / 0.2) * 0.2 * intensity;
        return 1 + (1 - (p - 0.2) / 0.8) * 0.2 * intensity;
      });
      const scaleVector = scaleVals.flatMap(s => [s, s, s]);

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.VectorKeyframeTrack('.scale', times, scaleVector),
      ];
    },
  ],
};

export const happy: AnimationPreset = {
  id: 'happy',
  name: '喜び',
  category: 'emote',
  description: '左右に揺れながら跳ねます',
  icon: '😆',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      
      // 小刻みにジャンプ
      const posY = times.map((t) => {
        return Math.abs(Math.sin((t / duration) * Math.PI * 6)) * 0.5 * intensity;
      });
      
      // 左右に回転揺れ
      const rotZ = times.map((t) => {
        return Math.sin((t / duration) * Math.PI * 4) * 0.2 * intensity;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, posY),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, rotZ),
      ];
    },
  ],
};

export const dizzy: AnimationPreset = {
  id: 'dizzy',
  name: '目が回る',
  category: 'emote',
  description: 'ふらふらと回転します',
  icon: '💫',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      
      // ゆっくりY回転
      const rotY = times.map(t => (t / duration) * Math.PI * 4);
      
      // 頭がぐらぐらする (X, Z回転)
      const rotX = times.map(t => Math.sin((t / duration) * Math.PI * 6) * 0.3 * intensity);
      const rotZ = times.map(t => Math.cos((t / duration) * Math.PI * 5) * 0.3 * intensity);

      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotY),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, rotX),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, rotZ),
      ];
    },
  ],
};

export const shiver: AnimationPreset = {
  id: 'shiver',
  name: '震え',
  category: 'emote',
  description: '怖がるように細かく震えます',
  icon: '🥶',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120; // 高速な動きなのでステップ多め
      const times = KeyframeBuilder.timeArray(steps, duration);
      
      const posX = times.map(() => (Math.random() - 0.5) * 0.2 * intensity);
      const rotZ = times.map(() => (Math.random() - 0.5) * 0.1 * intensity);

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, posX),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, rotZ),
      ];
    },
  ],
};

export const bow: AnimationPreset = {
  id: 'bow',
  name: 'お辞儀',
  category: 'emote',
  description: '深くお辞儀をします',
  icon: '🙇',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      
      // X軸回転で前屈
      // 0 -> 45度 -> 止まる -> 戻る
      const values = times.map((t) => {
        const p = t / duration; // 0..1
        if (p < 0.3) {
            // 下げる
            return (p / 0.3) * (Math.PI / 4) * intensity;
        } else if (p < 0.7) {
            // キープ
            return (Math.PI / 4) * intensity;
        } else {
            // 上げる
            return (1 - (p - 0.7) / 0.3) * (Math.PI / 4) * intensity;
        }
      });
      return new THREE.NumberKeyframeTrack('.rotation[x]', times, values);
    },
  ],
};
