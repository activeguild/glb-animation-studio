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
}
