/**
 * PhysicsHelper - 物理シミュレーション用のユーティリティクラス
 *
 * 物理法則に基づいたアニメーションを生成するための数学的計算を提供します。
 */

export class PhysicsHelper {
  static readonly GRAVITY = 9.8;

  /**
   * 自由落下の位置を計算
   * y(t) = y0 - 0.5 * g * t^2
   *
   * @param y0 初期高さ
   * @param t 時間
   * @param gravity 重力加速度（デフォルト: 9.8）
   */
  static freeFall(y0: number, t: number, gravity: number = PhysicsHelper.GRAVITY): number {
    return y0 - 0.5 * gravity * t * t;
  }

  /**
   * バウンス軌道を生成（エネルギー損失あり）
   * 反発係数を使用して徐々に高さが減衰するバウンスを計算
   *
   * @param initialHeight 初期高さ
   * @param restitution 反発係数（0-1）
   * @param steps キーフレーム数
   * @param duration 総時間（秒）
   * @returns Y位置の配列
   */
  static bouncingTrajectory(
    initialHeight: number,
    restitution: number,
    steps: number,
    duration: number
  ): number[] {
    const values: number[] = [];
    const gravity = PhysicsHelper.GRAVITY;

    let currentHeight = initialHeight;
    let currentTime = 0;
    let bounceCount = 0;
    const maxBounces = 10;

    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * duration;

      // 現在のバウンス区間を探索
      let tempTime = 0;
      let tempHeight = initialHeight;
      let tempBounce = 0;

      while (tempTime < t && tempHeight > 0.01 && tempBounce < maxBounces) {
        const bounceDuration = 2 * Math.sqrt((2 * tempHeight) / gravity);
        if (tempTime + bounceDuration > t) {
          break;
        }
        tempTime += bounceDuration;
        tempHeight *= restitution * restitution;
        tempBounce++;
      }

      currentTime = tempTime;
      currentHeight = tempHeight;
      bounceCount = tempBounce;

      const timeInBounce = t - currentTime;

      if (currentHeight > 0.01 && bounceCount < maxBounces) {
        const bounceDuration = 2 * Math.sqrt((2 * currentHeight) / gravity);
        if (timeInBounce <= bounceDuration) {
          const peakTime = bounceDuration / 2;
          const y = currentHeight - 0.5 * gravity * Math.pow(timeInBounce - peakTime, 2);
          values.push(Math.max(0, y));
        } else {
          values.push(0);
        }
      } else {
        values.push(0);
      }
    }

    return values;
  }

  /**
   * 減衰振動（underdamped harmonic oscillator）
   * x(t) = A * e^(-c*t) * cos(ω*t + φ)
   *
   * @param amplitude 初期振幅
   * @param dampingCoeff 減衰係数
   * @param frequency 角周波数
   * @param steps キーフレーム数
   * @param duration 総時間
   * @param phase 位相（デフォルト: 0）
   */
  static dampedOscillation(
    amplitude: number,
    dampingCoeff: number,
    frequency: number,
    steps: number,
    duration: number,
    phase: number = 0
  ): number[] {
    const values: number[] = [];

    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * duration;
      const decay = Math.exp(-dampingCoeff * t);
      const oscillation = Math.cos(frequency * t + phase);
      values.push(amplitude * decay * oscillation);
    }

    return values;
  }

  /**
   * 放物線運動（projectile motion）
   * x(t) = v0 * cos(θ) * t
   * y(t) = v0 * sin(θ) * t - 0.5 * g * t^2
   *
   * @param velocity 初速度
   * @param angle 発射角度（ラジアン）
   * @param steps キーフレーム数
   * @param duration 総時間
   * @param gravity 重力加速度
   */
  static projectileMotion(
    velocity: number,
    angle: number,
    steps: number,
    duration: number,
    gravity: number = PhysicsHelper.GRAVITY
  ): { x: number[]; y: number[] } {
    const xValues: number[] = [];
    const yValues: number[] = [];

    const vx = velocity * Math.cos(angle);
    const vy = velocity * Math.sin(angle);

    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * duration;
      xValues.push(vx * t);
      yValues.push(Math.max(0, vy * t - 0.5 * gravity * t * t));
    }

    return { x: xValues, y: yValues };
  }

  /**
   * 指数減衰（摩擦、空気抵抗）
   * v(t) = v0 * e^(-μt)
   *
   * @param initial 初期値
   * @param decayRate 減衰率
   * @param steps キーフレーム数
   * @param duration 総時間
   */
  static exponentialDecay(
    initial: number,
    decayRate: number,
    steps: number,
    duration: number
  ): number[] {
    const values: number[] = [];

    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * duration;
      values.push(initial * Math.exp(-decayRate * t));
    }

    return values;
  }

  /**
   * バネ運動（減衰あり）
   * Hooke's law: F = -kx
   *
   * @param amplitude 初期振幅
   * @param springConstant バネ定数
   * @param mass 質量
   * @param damping 減衰係数
   * @param steps キーフレーム数
   * @param duration 総時間
   */
  static springMotion(
    amplitude: number,
    springConstant: number,
    mass: number,
    damping: number,
    steps: number,
    duration: number
  ): number[] {
    const omega = Math.sqrt(springConstant / mass);
    const dampingCoeff = damping / (2 * mass);

    return PhysicsHelper.dampedOscillation(
      amplitude,
      dampingCoeff,
      omega,
      steps,
      duration
    );
  }

  /**
   * 楕円軌道（Keplerian orbit approximation）
   *
   * @param semiMajorAxis 軌道長半径
   * @param eccentricity 離心率（0-1）
   * @param steps キーフレーム数
   */
  static ellipticalOrbit(
    semiMajorAxis: number,
    eccentricity: number,
    steps: number
  ): { x: number[]; z: number[]; times: number[] } {
    const xValues: number[] = [];
    const zValues: number[] = [];
    const times: number[] = [];

    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

    for (let i = 0; i < steps; i++) {
      const theta = (i / (steps - 1)) * 2 * Math.PI;

      // 楕円の位置
      const x = semiMajorAxis * Math.cos(theta);
      const z = semiMinorAxis * Math.sin(theta);

      xValues.push(x);
      zValues.push(z);

      times.push(i / (steps - 1));
    }

    return { x: xValues, z: zValues, times };
  }

  /**
   * 振り子運動（小角度近似）
   * θ(t) = θ0 * cos(√(g/L) * t)
   *
   * @param amplitude 初期角度（ラジアン）
   * @param length 振り子の長さ
   * @param steps キーフレーム数
   * @param duration 総時間
   * @param gravity 重力加速度
   */
  static pendulum(
    amplitude: number,
    length: number,
    steps: number,
    duration: number,
    gravity: number = PhysicsHelper.GRAVITY
  ): number[] {
    const values: number[] = [];
    const omega = Math.sqrt(gravity / length);

    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * duration;
      values.push(amplitude * Math.cos(omega * t));
    }

    return values;
  }

  /**
   * 簡易Perlinノイズ（有機的な動き用）
   *
   * @param amplitude 振幅
   * @param frequency 周波数
   * @param steps キーフレーム数
   * @param seed シード値
   */
  static organicNoise(
    amplitude: number,
    frequency: number,
    steps: number,
    seed: number = 0
  ): number[] {
    const values: number[] = [];

    // 簡易的な複数周波数の組み合わせでノイズを生成
    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1));
      const noise =
        Math.sin(t * frequency * Math.PI * 2 + seed) * 0.5 +
        Math.sin(t * frequency * Math.PI * 4 + seed * 1.3) * 0.3 +
        Math.sin(t * frequency * Math.PI * 8 + seed * 1.7) * 0.2;

      values.push(noise * amplitude);
    }

    return values;
  }

  /**
   * 衝突による速度反転
   * Conservation of momentum and energy
   *
   * @param positions 位置配列
   * @param collisionPoint 衝突位置
   * @param restitution 反発係数
   */
  static applyCollision(
    positions: number[],
    collisionPoint: number,
    restitution: number
  ): number[] {
    const result: number[] = [];
    let collided = false;

    for (let i = 0; i < positions.length; i++) {
      if (!collided && positions[i] >= collisionPoint) {
        collided = true;
      }

      if (collided) {
        const reflection = collisionPoint - (positions[i] - collisionPoint) * restitution;
        result.push(reflection);
      } else {
        result.push(positions[i]);
      }
    }

    return result;
  }
}
