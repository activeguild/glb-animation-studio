'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

export function ExportGLTF() {
  const { scene } = useThree();
  const exportTrigger = useAppStore((state) => state.exportTrigger);
  const currentClip = useAppStore((state) => state.currentClip);
  const selectedPreset = useAppStore((state) => state.selectedPreset);
  const setExportTrigger = useAppStore((state) => state.setExportTrigger);

  useEffect(() => {
    if (!exportTrigger || !selectedPreset) return;

    // エクスポート実行
    const exportScene = async () => {
      try {
        console.log('Exporting scene with animation...');

        // シーン内のAnimationMixerからアニメーションクリップを取得
        const animations: THREE.AnimationClip[] = [];
        scene.traverse((obj) => {
          // @ts-ignore - AnimationMixerは内部プロパティ
          if (obj.animations && obj.animations.length > 0) {
            animations.push(...obj.animations);
          }
        });

        // AnimationMixerから直接アニメーションを取得
        // ModelViewerでmixerが作成されているので、そのアクティブなアニメーションを使う
        let activeAnimations: THREE.AnimationClip[] = [];
        scene.traverse((obj: any) => {
          if (obj.type === 'Group' && obj.userData?.mixer) {
            const mixer = obj.userData.mixer as THREE.AnimationMixer;
            const actions = mixer._actions || [];
            activeAnimations = actions
              .filter((action: any) => action._clip)
              .map((action: any) => action._clip);
          }
        });

        console.log('Active animations found:', activeAnimations.length);
        console.log('Animation tracks:', activeAnimations.map(a => ({
          name: a.name,
          tracks: a.tracks.map(t => t.name)
        })));

        const exporter = new GLTFExporter();

        exporter.parse(
          scene,
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
            animations: activeAnimations.length > 0 ? activeAnimations : undefined, // シーン内のアクティブなアニメーション
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
