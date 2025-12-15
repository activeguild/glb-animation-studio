import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { KeyframeBuilder } from './keyframeBuilder';
import { PhysicsHelper } from './physicsHelper';

/**
 * 物理シミュレーション系アニメーションプリセット
 * 物理法則に基づいたリアルな動きを実装
 */

// ========== 簡単（8個） ==========

export const gravityFall: AnimationPreset = {
  id: 'gravity-fall',
  name: '重力落下',
  category: 'physics',
  description: '重力加速度による自由落下をシミュレーション',
  icon: '⬇',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const initialHeight = intensity * 5;

      const values = times.map((t) => {
        const fallTime = t;
        return Math.max(0, PhysicsHelper.freeFall(initialHeight, fallTime, PhysicsHelper.GRAVITY * intensity));
      });

      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const gravityBounce: AnimationPreset = {
  id: 'gravity-bounce',
  name: '重力バウンス',
  category: 'physics',
  description: '落下してバウンドを繰り返します（反発係数0.7）',
  icon: '⚾',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const bounceValues = PhysicsHelper.bouncingTrajectory(
        intensity * 3,
        0.7,
        steps,
        duration
      );

      return new THREE.NumberKeyframeTrack('.position[y]', times, bounceValues);
    },
  ],
};

export const simpleSpring: AnimationPreset = {
  id: 'simple-spring',
  name: '単純バネ',
  category: 'physics',
  description: '減衰のない調和振動',
  icon: '〰',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);
      const frequency = 1.5 / duration;

      const values = times.map((t) => {
        return Math.cos(2 * Math.PI * frequency * t) * intensity * 2;
      });

      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const dampedSpring: AnimationPreset = {
  id: 'damped-spring',
  name: '減衰バネ',
  category: 'physics',
  description: 'バネの振動が徐々に減衰していきます',
  icon: '📉',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = PhysicsHelper.dampedOscillation(
        intensity * 2,
        1.5,
        2 * Math.PI * 1.5,
        steps,
        duration
      );

      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const pendulumSwing: AnimationPreset = {
  id: 'pendulum-swing',
  name: '振り子の揺れ',
  category: 'physics',
  description: '単振り子の運動をシミュレーション',
  icon: '⏱',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = PhysicsHelper.pendulum(
        (Math.PI / 6) * intensity,
        2.0,
        steps,
        duration
      );

      return new THREE.NumberKeyframeTrack('.rotation[z]', times, values);
    },
  ],
};

export const magneticAttraction: AnimationPreset = {
  id: 'magnetic-attraction',
  name: '磁気引力',
  category: 'physics',
  description: '中心に向かって加速しながら引き寄せられます',
  icon: '🧲',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xValues = KeyframeBuilder.exponentialCurve(intensity * 3, 0, 3, steps);
      const zValues = KeyframeBuilder.exponentialCurve(intensity * 2, 0, 3, steps);

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xValues),
        new THREE.NumberKeyframeTrack('.position[z]', times, zValues),
      ];
    },
  ],
};

export const inertialDrift: AnimationPreset = {
  id: 'inertial-drift',
  name: '慣性ドリフト',
  category: 'physics',
  description: '摩擦により徐々に減速して停止',
  icon: '🛑',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = times.map((t, i) => {
        const velocity = PhysicsHelper.exponentialDecay(intensity * 3, 2, steps, duration);
        const position = velocity.slice(0, i + 1).reduce((sum, v) => sum + v, 0) * (duration / steps);
        return position;
      });

      return new THREE.NumberKeyframeTrack('.position[x]', times, values);
    },
  ],
};

export const centrifugalSpin: AnimationPreset = {
  id: 'centrifugal-spin',
  name: '遠心力スピン',
  category: 'physics',
  description: '回転しながら外側に広がります',
  icon: '🌀',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const rotationValues = times.map((t) => (t / duration) * Math.PI * 4 * intensity);
      const radiusValues = times.map((t) => (t / duration) * intensity * 2);

      const xValues = times.map((t, i) => Math.cos(rotationValues[i]) * radiusValues[i]);
      const zValues = times.map((t, i) => Math.sin(rotationValues[i]) * radiusValues[i]);

      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotationValues),
        new THREE.NumberKeyframeTrack('.position[x]', times, xValues),
        new THREE.NumberKeyframeTrack('.position[z]', times, zValues),
      ];
    },
  ],
};

// ========== 中程度（11個） ==========

export const projectileArc: AnimationPreset = {
  id: 'projectile-arc',
  name: '放物線運動',
  category: 'physics',
  description: '投射体の放物線軌道',
  icon: '🏹',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const { x, y } = PhysicsHelper.projectileMotion(
        intensity * 5,
        Math.PI / 4,
        steps,
        duration
      );

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[y]', times, y),
      ];
    },
  ],
};

export const orbitGravity: AnimationPreset = {
  id: 'orbit-gravity',
  name: '重力軌道',
  category: 'physics',
  description: '楕円軌道を描きます',
  icon: '🛸',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const { x, z } = PhysicsHelper.ellipticalOrbit(intensity * 3, 0.5, steps);

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, x),
        new THREE.NumberKeyframeTrack('.position[z]', times, z),
      ];
    },
  ],
};

export const doublePendulum: AnimationPreset = {
  id: 'double-pendulum',
  name: '二重振り子',
  category: 'physics',
  description: 'カオス的な二重振り子の動き',
  icon: '⚖',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      // 2つの振動を結合
      const swing1 = PhysicsHelper.pendulum(Math.PI / 4 * intensity, 1.5, steps, duration);
      const swing2 = PhysicsHelper.pendulum(Math.PI / 6 * intensity, 2.0, steps, duration, PhysicsHelper.GRAVITY * 1.2);

      const xValues = times.map((t, i) => {
        return (Math.sin(swing1[i]) + Math.sin(swing1[i] + swing2[i])) * intensity;
      });

      const yValues = times.map((t, i) => {
        return -(Math.cos(swing1[i]) + Math.cos(swing1[i] + swing2[i])) * intensity;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xValues),
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
      ];
    },
  ],
};

export const springRebound: AnimationPreset = {
  id: 'spring-rebound',
  name: 'バネ反発',
  category: 'physics',
  description: '圧縮されたバネが解放されて跳ね上がる',
  icon: '⏫',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = times.map((t) => {
        if (t < duration * 0.2) {
          return 0;
        }
        const releaseTime = t - duration * 0.2;
        const initialVelocity = intensity * 8;
        return Math.max(0, initialVelocity * releaseTime - 0.5 * PhysicsHelper.GRAVITY * releaseTime * releaseTime);
      });

      return new THREE.NumberKeyframeTrack('.position[y]', times, values);
    },
  ],
};

export const frictionSlide: AnimationPreset = {
  id: 'friction-slide',
  name: '摩擦滑り',
  category: 'physics',
  description: '摩擦力で等減速しながら停止',
  icon: '🛷',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = times.map((t) => {
        const deceleration = intensity * 3;
        const distance = intensity * 5 * t - 0.5 * deceleration * t * t;
        return Math.max(0, distance);
      });

      return new THREE.NumberKeyframeTrack('.position[x]', times, values);
    },
  ],
};

export const wavePropagation: AnimationPreset = {
  id: 'wave-propagation',
  name: '波動伝播',
  category: 'physics',
  description: '波が伝わる様子を表現',
  icon: '🌊',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yValues = times.map((t) => {
        const k = 2 * Math.PI / (intensity * 2);
        const omega = 2 * Math.PI * 2 / duration;
        return Math.sin(k * t - omega * t) * intensity;
      });

      const zValues = times.map((t) => {
        return Math.sin(4 * Math.PI * t / duration) * intensity * 0.3;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zValues),
      ];
    },
  ],
};

export const torqueRotation: AnimationPreset = {
  id: 'torque-rotation',
  name: 'トルク回転',
  category: 'physics',
  description: 'トルクによる角加速度',
  icon: '⚙',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = times.map((t) => {
        const angularAcceleration = intensity * 2;
        return 0.5 * angularAcceleration * t * t;
      });

      return new THREE.NumberKeyframeTrack('.rotation[y]', times, values);
    },
  ],
};

export const elasticCollision: AnimationPreset = {
  id: 'elastic-collision',
  name: '弾性衝突',
  category: 'physics',
  description: '壁に衝突して跳ね返る',
  icon: '💥',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = times.map((t) => {
        const speed = intensity * 3;
        const collisionTime = duration / 3;

        if (t < collisionTime) {
          return t * speed;
        } else {
          const timeAfterCollision = t - collisionTime;
          const collisionPoint = collisionTime * speed;
          return collisionPoint - timeAfterCollision * speed * 0.8;
        }
      });

      return new THREE.NumberKeyframeTrack('.position[x]', times, values);
    },
  ],
};

export const gyroscopicPrecession: AnimationPreset = {
  id: 'gyroscopic-precession',
  name: 'ジャイロ歳差運動',
  category: 'physics',
  description: 'ジャイロスコープの歳差運動',
  icon: '🌏',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const yRotation = times.map((t) => (t / duration) * Math.PI * 8 * intensity);
      const xRotation = times.map((t) => Math.sin((t / duration) * Math.PI * 2) * 0.3 * intensity);
      const zRotation = times.map((t) => Math.cos((t / duration) * Math.PI * 2) * 0.3 * intensity);

      return [
        new THREE.NumberKeyframeTrack('.rotation[y]', times, yRotation),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRotation),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const airResistance: AnimationPreset = {
  id: 'air-resistance',
  name: '空気抵抗',
  category: 'physics',
  description: '空気抵抗により減速',
  icon: '💨',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xValues = PhysicsHelper.exponentialDecay(0, -intensity * 5, steps, duration);
      const yValues = times.map((t, i) => {
        const fallSpeed = PhysicsHelper.exponentialDecay(intensity * 3, 1.5, steps, duration);
        return Math.max(0, intensity * 3 - fallSpeed[i] * t);
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xValues),
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
      ];
    },
  ],
};

export const coupledOscillators: AnimationPreset = {
  id: 'coupled-oscillators',
  name: '結合振動子',
  category: 'physics',
  description: '2つの振動子が結合してビート現象',
  icon: '〰〰',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 60;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const freq1 = 1.8;
      const freq2 = 2.0;

      const xValues = times.map((t) => {
        return (Math.cos(2 * Math.PI * freq1 * t) + Math.cos(2 * Math.PI * freq2 * t)) * intensity * 0.5;
      });

      const yValues = times.map((t) => {
        return (Math.sin(2 * Math.PI * freq1 * t) - Math.sin(2 * Math.PI * freq2 * t)) * intensity * 0.5;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xValues),
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
      ];
    },
  ],
};

// ========== 複雑（6個） ==========

export const newtonsCradle: AnimationPreset = {
  id: 'newtons-cradle',
  name: 'ニュートンのゆりかご',
  category: 'physics',
  description: '運動量保存の振り子連鎖',
  icon: '⚫⚫⚫',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = times.map((t) => {
        const period = duration / 4;
        const phase = (t % period) / period;

        if (phase < 0.25) {
          return -Math.cos(phase * Math.PI * 4) * intensity;
        } else if (phase < 0.5) {
          return 0;
        } else if (phase < 0.75) {
          return Math.cos((phase - 0.5) * Math.PI * 4) * intensity;
        } else {
          return 0;
        }
      });

      const zRotation = PhysicsHelper.dampedOscillation(intensity * 0.5, 0.5, Math.PI * 4, steps, duration);

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, values),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRotation),
      ];
    },
  ],
};

export const turbulentFlow: AnimationPreset = {
  id: 'turbulent-flow',
  name: '乱流',
  category: 'physics',
  description: 'カオス的な乱流運動',
  icon: '🌪',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const xNoise = PhysicsHelper.organicNoise(intensity * 2, 3, steps, 123);
      const yNoise = PhysicsHelper.organicNoise(intensity * 2, 2.7, steps, 456);
      const zNoise = PhysicsHelper.organicNoise(intensity * 2, 3.3, steps, 789);
      const rotNoise = PhysicsHelper.organicNoise(intensity, 4, steps, 321);

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, xNoise),
        new THREE.NumberKeyframeTrack('.position[y]', times, yNoise),
        new THREE.NumberKeyframeTrack('.position[z]', times, zNoise),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, rotNoise),
      ];
    },
  ],
};

export const vortexMotion: AnimationPreset = {
  id: 'vortex-motion',
  name: '渦運動',
  category: 'physics',
  description: '中心に向かって螺旋状に吸い込まれる',
  icon: '🌀',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = times.map((t) => {
        const progress = t / duration;
        const radius = intensity * 3 * (1 - progress);
        const angle = progress * Math.PI * 8 * intensity;

        return {
          x: Math.cos(angle) * radius,
          y: intensity * 3 * (1 - Math.pow(progress, 2)),
          z: Math.sin(angle) * radius,
          rotY: angle,
        };
      });

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, values.map((v) => v.x)),
        new THREE.NumberKeyframeTrack('.position[y]', times, values.map((v) => v.y)),
        new THREE.NumberKeyframeTrack('.position[z]', times, values.map((v) => v.z)),
        new THREE.NumberKeyframeTrack('.rotation[y]', times, values.map((v) => v.rotY)),
      ];
    },
  ],
};

export const chaosSystem: AnimationPreset = {
  id: 'chaos-system',
  name: 'カオス系',
  category: 'physics',
  description: 'Lorenz attractor風のカオス運動',
  icon: '∞',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      // 簡略化されたLorenz attractor
      const values: { x: number; y: number; z: number }[] = [{ x: 1, y: 1, z: 1 }];
      const dt = duration / steps;
      const sigma = 10;
      const rho = 28;
      const beta = 8 / 3;
      const scale = intensity * 0.1;

      for (let i = 1; i < steps; i++) {
        const prev = values[i - 1];
        const dx = sigma * (prev.y - prev.x) * dt;
        const dy = (prev.x * (rho - prev.z) - prev.y) * dt;
        const dz = (prev.x * prev.y - beta * prev.z) * dt;

        values.push({
          x: prev.x + dx,
          y: prev.y + dy,
          z: prev.z + dz,
        });
      }

      return [
        new THREE.NumberKeyframeTrack('.position[x]', times, values.map((v) => v.x * scale)),
        new THREE.NumberKeyframeTrack('.position[y]', times, values.map((v) => v.y * scale)),
        new THREE.NumberKeyframeTrack('.position[z]', times, values.map((v) => v.z * scale)),
      ];
    },
  ],
};

export const resonanceVibration: AnimationPreset = {
  id: 'resonance-vibration',
  name: '共振振動',
  category: 'physics',
  description: '共振により振幅が増大',
  icon: '📳',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      const values = times.map((t) => {
        const progress = t / duration;
        const amplitude = intensity * (0.5 + progress * 1.5);
        return Math.sin(2 * Math.PI * 3 * t) * amplitude;
      });

      const rotValues = times.map((t) => {
        const progress = t / duration;
        const amplitude = intensity * 0.3 * (0.5 + progress * 1.5);
        return Math.sin(2 * Math.PI * 3 * t) * amplitude;
      });

      const scaleValues = times.map((t) => {
        const progress = t / duration;
        const s = 1 + Math.abs(Math.sin(2 * Math.PI * 3 * t)) * intensity * 0.2 * (0.5 + progress);
        return s;
      });

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, values),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, rotValues),
        new THREE.VectorKeyframeTrack('.scale', times, scaleValues.flatMap((s) => [s, s, s])),
      ];
    },
  ],
};

export const fluidBuoyancy: AnimationPreset = {
  id: 'fluid-buoyancy',
  name: '浮力',
  category: 'physics',
  description: '水中で浮力と重力のバランスで上下',
  icon: '🎈',
  trackGenerators: [
    (intensity, duration) => {
      const steps = 120;
      const times = KeyframeBuilder.timeArray(steps, duration);

      // 沈む → 浮力で浮上 → 平衡点で振動
      const yValues = times.map((t) => {
        if (t < duration * 0.2) {
          return -PhysicsHelper.freeFall(0, t, PhysicsHelper.GRAVITY * intensity);
        } else {
          const oscillationTime = t - duration * 0.2;
          const equilibrium = -intensity * 1.5;
          return equilibrium + PhysicsHelper.dampedOscillation(
            intensity * 2,
            1.0,
            2 * Math.PI * 1.5,
            1,
            1,
            0
          )[0] * Math.exp(-0.5 * oscillationTime);
        }
      });

      const xRot = PhysicsHelper.dampedOscillation(intensity * 0.3, 0.8, Math.PI * 2, steps, duration);
      const zRot = PhysicsHelper.dampedOscillation(intensity * 0.2, 0.8, Math.PI * 2.5, steps, duration, Math.PI / 4);

      return [
        new THREE.NumberKeyframeTrack('.position[y]', times, yValues),
        new THREE.NumberKeyframeTrack('.rotation[x]', times, xRot),
        new THREE.NumberKeyframeTrack('.rotation[z]', times, zRot),
      ];
    },
  ],
};
