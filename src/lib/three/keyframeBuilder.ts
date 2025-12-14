/**
 * キーフレーム生成ヘルパークラス
 * アニメーションの基本パターンを生成するユーティリティ
 */
export class KeyframeBuilder {
  /**
   * 線形補間
   */
  static linear(start: number, end: number, steps: number): number[] {
    return Array.from({ length: steps }, (_, i) =>
      start + (end - start) * (i / (steps - 1))
    );
  }

  /**
   * sin波
   */
  static sinWave(
    amplitude: number,
    frequency: number,
    steps: number,
    duration: number,
    phase: number = 0
  ): number[] {
    return Array.from({ length: steps }, (_, i) => {
      const t = (i / (steps - 1)) * duration;
      return Math.sin(t * Math.PI * 2 * frequency + phase) * amplitude;
    });
  }

  /**
   * cos波
   */
  static cosWave(
    amplitude: number,
    frequency: number,
    steps: number,
    duration: number,
    phase: number = 0
  ): number[] {
    return Array.from({ length: steps }, (_, i) => {
      const t = (i / (steps - 1)) * duration;
      return Math.cos(t * Math.PI * 2 * frequency + phase) * amplitude;
    });
  }

  /**
   * 円運動（XZ平面）
   */
  static circular(radius: number, steps: number): { x: number[]; z: number[] } {
    const x: number[] = [];
    const z: number[] = [];
    for (let i = 0; i < steps; i++) {
      const angle = (i / (steps - 1)) * Math.PI * 2;
      x.push(Math.cos(angle) * radius);
      z.push(Math.sin(angle) * radius);
    }
    return { x, z };
  }

  /**
   * 楕円運動
   */
  static elliptical(
    radiusX: number,
    radiusZ: number,
    steps: number
  ): { x: number[]; z: number[] } {
    const x: number[] = [];
    const z: number[] = [];
    for (let i = 0; i < steps; i++) {
      const angle = (i / (steps - 1)) * Math.PI * 2;
      x.push(Math.cos(angle) * radiusX);
      z.push(Math.sin(angle) * radiusZ);
    }
    return { x, z };
  }

  /**
   * 螺旋
   */
  static spiral(
    radius: number,
    height: number,
    rotations: number,
    steps: number
  ): { x: number[]; y: number[]; z: number[] } {
    const x: number[] = [];
    const y: number[] = [];
    const z: number[] = [];

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const angle = t * Math.PI * 2 * rotations;
      x.push(Math.cos(angle) * radius);
      y.push(t * height);
      z.push(Math.sin(angle) * radius);
    }
    return { x, y, z };
  }

  /**
   * 8の字運動（リサージュ曲線）
   */
  static figure8(amplitude: number, steps: number): { x: number[]; y: number[] } {
    const x: number[] = [];
    const y: number[] = [];
    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * Math.PI * 2;
      x.push(Math.sin(t) * amplitude);
      y.push(Math.sin(t * 2) * amplitude);
    }
    return { x, y };
  }

  /**
   * ジグザグ運動
   */
  static zigzag(amplitude: number, steps: number): number[] {
    return Array.from({ length: steps }, (_, i) => {
      const t = i / (steps - 1);
      return (t % 0.2 < 0.1 ? 1 : -1) * amplitude;
    });
  }

  /**
   * ランダムウォーク
   */
  static randomWalk(amplitude: number, steps: number): number[] {
    const values: number[] = [0];
    for (let i = 1; i < steps; i++) {
      const change = (Math.random() - 0.5) * amplitude * 0.2;
      values.push(Math.max(-amplitude, Math.min(amplitude, values[i - 1] + change)));
    }
    return values;
  }

  /**
   * タイム配列生成
   */
  static timeArray(steps: number, duration: number): number[] {
    return Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * duration);
  }

  /**
   * パルス波（矩形波）
   */
  static pulse(amplitude: number, frequency: number, steps: number, duration: number): number[] {
    return Array.from({ length: steps }, (_, i) => {
      const t = (i / (steps - 1)) * duration;
      return Math.sin(t * Math.PI * 2 * frequency) > 0 ? amplitude : 0;
    });
  }

  /**
   * のこぎり波
   */
  static sawtooth(amplitude: number, frequency: number, steps: number, duration: number): number[] {
    return Array.from({ length: steps }, (_, i) => {
      const t = (i / (steps - 1)) * duration;
      return ((t * frequency) % 1) * amplitude * 2 - amplitude;
    });
  }

  /**
   * 放物線カーブ（二次関数）
   * 重力や加速度効果に使用
   *
   * @param start 開始値
   * @param vertex 頂点値
   * @param end 終了値
   * @param steps キーフレーム数
   */
  static parabola(start: number, vertex: number, end: number, steps: number): number[] {
    const values: number[] = [];

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      // 二次ベジェ曲線を使用
      const a = (1 - t) * (1 - t);
      const b = 2 * (1 - t) * t;
      const c = t * t;
      values.push(a * start + b * vertex + c * end);
    }

    return values;
  }

  /**
   * 指数カーブ（減衰、摩擦用）
   *
   * @param start 開始値
   * @param end 終了値
   * @param rate 減衰率
   * @param steps キーフレーム数
   */
  static exponentialCurve(start: number, end: number, rate: number, steps: number): number[] {
    const values: number[] = [];

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const exponential = 1 - Math.exp(-rate * t);
      values.push(start + (end - start) * exponential);
    }

    return values;
  }

  /**
   * 多段階アニメーション（キャラクターアクション用）
   * 複数のフェーズを異なるタイミングで組み合わせる
   *
   * @param phases フェーズ定義の配列
   * @param totalSteps 総キーフレーム数
   */
  static multiPhase(
    phases: Array<{
      startValue: number;
      endValue: number;
      duration: number; // 0-1の正規化された時間
      easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
    }>,
    totalSteps: number
  ): number[] {
    const values: number[] = [];

    // 各フェーズの累積時間を計算
    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
    const normalizedPhases = phases.map((phase) => ({
      ...phase,
      duration: phase.duration / totalDuration,
    }));

    let cumulativeTime = 0;
    const phaseBoundaries = normalizedPhases.map((phase) => {
      const start = cumulativeTime;
      cumulativeTime += phase.duration;
      return { start, end: cumulativeTime, phase };
    });

    for (let i = 0; i < totalSteps; i++) {
      const t = i / (totalSteps - 1);

      // 現在時刻がどのフェーズに属するか探索
      let value = 0;
      for (const { start, end, phase } of phaseBoundaries) {
        if (t >= start && t <= end) {
          const phaseT = (t - start) / (end - start);
          const easedT = KeyframeBuilder.applyEasing(phaseT, phase.easing || 'linear');
          value = phase.startValue + (phase.endValue - phase.startValue) * easedT;
          break;
        } else if (t > end) {
          value = phase.endValue;
        }
      }

      values.push(value);
    }

    return values;
  }

  /**
   * イージング関数を適用
   */
  private static applyEasing(t: number, easing: string): number {
    switch (easing) {
      case 'ease-in':
        return t * t;
      case 'ease-out':
        return 1 - (1 - t) * (1 - t);
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      case 'linear':
      default:
        return t;
    }
  }

  /**
   * 有機的なノイズ（乱流、自然な動き用）
   * 複数の周波数を組み合わせた擬似Perlinノイズ
   *
   * @param amplitude 振幅
   * @param frequency 基本周波数
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

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);

      // 複数のオクターブを重ね合わせ
      const noise1 = Math.sin(t * frequency * Math.PI * 2 + seed);
      const noise2 = Math.sin(t * frequency * Math.PI * 4 + seed * 1.3) * 0.5;
      const noise3 = Math.sin(t * frequency * Math.PI * 8 + seed * 1.7) * 0.25;
      const noise4 = Math.sin(t * frequency * Math.PI * 16 + seed * 2.1) * 0.125;

      const combinedNoise = (noise1 + noise2 + noise3 + noise4) / 1.875;
      values.push(combinedNoise * amplitude);
    }

    return values;
  }
}
