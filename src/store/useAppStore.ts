import { create } from 'zustand';
import * as THREE from 'three';
import { AnimationPreset } from '@/types/preset';
import { AnimationParams, AnimationCategory } from '@/types/animation';
import { ModelData, UploadedFile } from '@/types/model';

interface AppState {
  // モデル関連
  uploadedFile: UploadedFile | null;
  modelData: ModelData | null;

  // アニメーション関連
  selectedPreset: AnimationPreset | null;
  animationParams: AnimationParams;
  currentClip: THREE.AnimationClip | null;
  isPlaying: boolean;

  // UI状態
  activeCategory: AnimationCategory;
  searchQuery: string;
  exportTrigger: boolean;

  // アクション
  setUploadedFile: (file: File, url: string) => void;
  setModelData: (modelData: ModelData) => void;
  selectPreset: (preset: AnimationPreset) => void;
  updateParams: (params: Partial<AnimationParams>) => void;
  setCurrentClip: (clip: THREE.AnimationClip | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setActiveCategory: (category: AnimationCategory) => void;
  setSearchQuery: (query: string) => void;
  setExportTrigger: (trigger: boolean) => void;
  reset: () => void;
}

const defaultParams: AnimationParams = {
  speed: 1.0,
  intensity: 1.0,
  duration: 3.0,
  loopCount: Infinity,
  easing: 'linear',
};

export const useAppStore = create<AppState>((set) => ({
  // 初期状態
  uploadedFile: null,
  modelData: null,
  selectedPreset: null,
  animationParams: defaultParams,
  currentClip: null,
  isPlaying: false,
  activeCategory: 'rotation',
  searchQuery: '',
  exportTrigger: false,

  // アクション実装
  setUploadedFile: (file, url) => set({ uploadedFile: { file, url } }),

  setModelData: (modelData) => set({ modelData }),

  selectPreset: (preset) => set({ selectedPreset: preset }),

  updateParams: (params) => set((state) => ({
    animationParams: { ...state.animationParams, ...params }
  })),

  setCurrentClip: (clip) => set({ currentClip: clip }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setExportTrigger: (trigger) => set({ exportTrigger: trigger }),

  reset: () => set({
    uploadedFile: null,
    modelData: null,
    selectedPreset: null,
    animationParams: defaultParams,
    currentClip: null,
    isPlaying: false,
    activeCategory: 'rotation',
    searchQuery: '',
    exportTrigger: false,
  }),
}));
