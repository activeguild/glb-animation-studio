'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

export function ExportGLTF() {
  const { scene } = useThree();
  const exportTrigger = useAppStore((state) => state.exportTrigger);
  const selectedPreset = useAppStore((state) => state.selectedPreset);
  const setExportTrigger = useAppStore((state) => state.setExportTrigger);

  useEffect(() => {
    if (!exportTrigger || !selectedPreset) return;

    // エクスポート実行
    const exportScene = async () => {
      try {
        console.log('Exporting scene with animation...');

        // シーンからAnimationMixerを持つオブジェクト（モデルのシーン）を見つける
        let modelScene: THREE.Object3D | null = null;
        let activeAnimations: THREE.AnimationClip[] = [];

        scene.traverse((obj: any) => {
          if (obj.userData?.mixer) {
            modelScene = obj;
            const mixer = obj.userData.mixer as THREE.AnimationMixer;
            console.log('Found mixer on object:', obj.type, obj.name);
            console.log('Mixer actions:', mixer._actions?.length);

            // mixerから実行中のアクションのクリップを取得
            const actions = mixer._actions || [];
            activeAnimations = actions
              .filter((action: any) => action._clip)
              .map((action: any) => action._clip);

            console.log('Extracted animation clips:', activeAnimations.length);

            if (activeAnimations.length > 0) {
              console.log('Animation details:', activeAnimations.map(clip => ({
                name: clip.name,
                duration: clip.duration,
                tracks: clip.tracks.map(t => ({
                  name: t.name,
                  type: t.constructor.name
                }))
              })));
            }
          }
        });

        if (!modelScene) {
          console.error('Model scene with mixer not found');
          setExportTrigger(false);
          return;
        }

        console.log('Exporting model scene:', modelScene.type);

        const exporter = new GLTFExporter();

        exporter.parse(
          modelScene, // Canvas全体ではなく、モデルのシーンのみをエクスポート
          (result) => {
            // ArrayBufferをBlobに変換
            const blob = new Blob([result as ArrayBuffer], {
              type: 'model/gltf-binary',
            });

            // ダウンロード
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const safeName = selectedPreset.name.replace(/[^a-zA-Z0-9-_]/g, '_');
            const filename = `${safeName}_${timestamp}.glb`;

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();

            // クリーンアップ
            URL.revokeObjectURL(url);
            console.log('Export completed successfully');

            // トリガーをリセット
            setExportTrigger(false);
          },
          (error) => {
            console.error('GLTF parse error:', error);
            setExportTrigger(false);
          },
          {
            binary: true,
            animations: activeAnimations.length > 0 ? activeAnimations : undefined,
            embedImages: true,
            includeCustomExtensions: false,
            onlyVisible: true,
          }
        );
      } catch (error) {
        console.error('Export error:', error);
        setExportTrigger(false);
      }
    };

    exportScene();
  }, [exportTrigger, scene, selectedPreset, setExportTrigger]);

  // 何もレンダリングしない
  return <></>;
}
