import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * アニメーショントラックのパスを修正
 * '.property' -> 'SceneName.property' の形式に変換
 */
function fixAnimationTrackPaths(
  scene: THREE.Group,
  animations: THREE.AnimationClip[]
): THREE.AnimationClip[] {
  // シーンに名前がない場合は付ける
  if (!scene.name) {
    scene.name = 'Scene';
  }

  const sceneName = scene.name;

  return animations.map((clip) => {
    const fixedTracks = clip.tracks.map((track) => {
      // トラック名のパスを修正
      // '.rotation[y]' -> 'Scene.rotation[y]'
      let newName = track.name;
      if (newName.startsWith('.')) {
        newName = sceneName + newName;
      }

      // 新しいトラックを作成（型に応じて）
      if (track instanceof THREE.NumberKeyframeTrack) {
        return new THREE.NumberKeyframeTrack(newName, track.times, track.values);
      } else if (track instanceof THREE.VectorKeyframeTrack) {
        return new THREE.VectorKeyframeTrack(newName, track.times, track.values);
      } else if (track instanceof THREE.QuaternionKeyframeTrack) {
        return new THREE.QuaternionKeyframeTrack(newName, track.times, track.values);
      } else if (track instanceof THREE.ColorKeyframeTrack) {
        return new THREE.ColorKeyframeTrack(newName, track.times, track.values);
      } else if (track instanceof THREE.BooleanKeyframeTrack) {
        return new THREE.BooleanKeyframeTrack(newName, track.times, track.values);
      } else if (track instanceof THREE.StringKeyframeTrack) {
        return new THREE.StringKeyframeTrack(newName, track.times, track.values);
      }
      return track;
    });

    return new THREE.AnimationClip(clip.name, clip.duration, fixedTracks);
  });
}

/**
 * アニメーション付きGLBファイルをエクスポート
 */
export async function exportAnimatedGLB(
  scene: THREE.Group,
  animations: THREE.AnimationClip[],
  filename: string = 'animated-model.glb'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();

    // アニメーショントラックのパスを修正
    const fixedAnimations = fixAnimationTrackPaths(scene, animations);

    exporter.parse(
      scene,
      (result) => {
        try {
          // ArrayBufferをBlobに変換
          const blob = new Blob([result as ArrayBuffer], {
            type: 'model/gltf-binary',
          });

          // ダウンロードリンクを作成
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();

          // クリーンアップ
          URL.revokeObjectURL(url);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      {
        binary: true,                // GLB形式（バイナリ）
        animations: fixedAnimations, // 修正されたアニメーションクリップを埋め込み
        embedImages: true,           // 画像を埋め込み
        includeCustomExtensions: false,
        onlyVisible: true,
      }
    );
  });
}

/**
 * ファイル名を生成（タイムスタンプ付き）
 */
export function generateFilename(presetName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const safeName = presetName.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${safeName}_${timestamp}.glb`;
}
