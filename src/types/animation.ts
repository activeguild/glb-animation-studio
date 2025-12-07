
export type AnimationCategory = 'rotation' | 'translation' | 'scale' | 'combined' | 'easing';

export type EasingType =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack';

export interface AnimationParams {
  speed: number;           // 0.1 ~ 5.0
  intensity: number;       // 0.1 ~ 3.0
  duration: number;        // 基本周期（秒）
  loopCount: number | typeof Infinity;
  easing: EasingType;
}

export interface AnimationState {
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
}
