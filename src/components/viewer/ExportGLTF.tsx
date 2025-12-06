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
            const clips = actions
              .filter((action: any) => action._clip)
              .map((action: any) => action._clip);

            console.log('Extracted animation clips:', clips.length);

            if (clips.length > 0) {
              console.log('Original animation details:', clips.map(clip => ({
                name: clip.name,
                duration: clip.duration,
                tracks: clip.tracks.map(t => ({
                  name: t.name,
                  type: t.constructor.name,
                  times: t.times,
                  values: t.values
                }))
              })));

              // アニメーショントラックを GLTF エクスポート用に変換
              // `.rotation[x]` のような個別成分トラックを、GLTF互換形式に変換
              activeAnimations = clips.map(clip => {
                const newTracks: THREE.KeyframeTrack[] = [];

                // Track grouping map: key is "nodeName.property" (e.g. "car.position", ".rotation")
                const tracksByTarget: Map<string, Map<string, THREE.KeyframeTrack>> = new Map();

                clip.tracks.forEach(track => {
                  // Parse track name: optionalNodeName.property[component]
                  // Matches: .rotation[x] OR child.rotation[x]
                  // Group 1: Node Name (prefix) - can be empty
                  // Group 2: Property (position, rotation, scale)
                  // Group 3: Component (x, y, z)
                  const match = track.name.match(/^(.*?)\.?(rotation|position|scale)\[([xyz])\]$/);

                  if (match) {
                    const nodePrefix = match[1];
                    const property = match[2];
                    const component = match[3];
                    const key = `${nodePrefix}.${property}`;

                    if (!tracksByTarget.has(key)) {
                      tracksByTarget.set(key, new Map());
                    }
                    tracksByTarget.get(key)!.set(component, track);
                  } else {
                    // Add non-split tracks as is
                    newTracks.push(track.clone());
                  }
                });

                // Process grouped tracks
                tracksByTarget.forEach((components, key) => {
                  const lastDotIndex = key.lastIndexOf('.');
                  const property = key.substring(lastDotIndex + 1);
                  const nodePrefix = key.substring(0, lastDotIndex);
                  
                  // Reconstruct target name prefix (e.g. "car." or ".")
                  const targetPrefix = nodePrefix ? `${nodePrefix}.` : '.';

                  const xTrack = components.get('x');
                  const yTrack = components.get('y');
                  const zTrack = components.get('z');

                  if (!xTrack && !yTrack && !zTrack) return;

                  const refTrack = xTrack || yTrack || zTrack!;
                  const times = refTrack.times;

                  if (property === 'rotation') {
                    // Convert Euler (split tracks) to Quaternion
                    const quaternions: number[] = [];
                    const euler = new THREE.Euler();
                    const quat = new THREE.Quaternion();

                    for (let i = 0; i < times.length; i++) {
                      euler.x = xTrack ? xTrack.values[i] : 0;
                      euler.y = yTrack ? yTrack.values[i] : 0;
                      euler.z = zTrack ? zTrack.values[i] : 0;

                      quat.setFromEuler(euler);
                      quaternions.push(quat.x, quat.y, quat.z, quat.w);
                    }

                    const quatTrack = new THREE.QuaternionKeyframeTrack(
                      `${targetPrefix}quaternion`,
                      times,
                      quaternions
                    );
                    newTracks.push(quatTrack);

                    console.log(`Converted rotation components for ${targetPrefix} to quaternion`);
                  } else if (property === 'position' || property === 'scale') {
                    // Merge Vector components
                    const values: number[] = [];
                    // Scale defaults to 1, others to 0
                    const defaultValue = property === 'scale' ? 1 : 0;

                    for (let i = 0; i < times.length; i++) {
                      values.push(
                        xTrack ? xTrack.values[i] : defaultValue,
                        yTrack ? yTrack.values[i] : defaultValue,
                        zTrack ? zTrack.values[i] : defaultValue
                      );
                    }

                    const vecTrack = new THREE.VectorKeyframeTrack(
                      `${targetPrefix}${property}`,
                      times,
                      values
                    );
                    newTracks.push(vecTrack);
                    
                    console.log(`Merged ${property} components for ${targetPrefix}`);
                  }
                });

                // 新しいトラックで新しいクリップを作成
                const newClip = new THREE.AnimationClip(clip.name, clip.duration, newTracks);

                console.log('Created new clip:', {
                  name: newClip.name,
                  duration: newClip.duration,
                  tracks: newClip.tracks.map(t => ({
                    name: t.name,
                    type: t.constructor.name
                  }))
                });

                return newClip;
              });
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
