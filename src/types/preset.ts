import * as THREE from 'three';
import { AnimationCategory } from './animation';

export type TrackGenerator = (intensity: number, duration: number) => THREE.KeyframeTrack | THREE.KeyframeTrack[];

export interface AnimationPreset {
  id: string;
  name: string;
  category: AnimationCategory;
  description: string;
  icon: string;
  trackGenerators: TrackGenerator[];
}
