import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * アニメーショントラックのパスを修正
 * シーン階層内の実際のオブジェクト名を使用
 */
function fixAnimationPaths(scene: THREE.Group, animations: THREE.AnimationClip[], exportingRootNode: boolean): THREE.AnimationClip[] {
  // RootNodeを直接エクスポートする場合、GLTF互換のトラック名に変換
  if (exportingRootNode) {
    const rootNode = scene.children[0];
    const nodeName = rootNode?.name || 'RootNode';

    return animations.map((clip) => {
      const newTracks = clip.tracks.map((track) => {
        const oldName = track.name;
        let newName = oldName;

        // ".rotation[x]" -> "RootNode.rotation.x" に変換（GLTF互換形式）
        if (oldName.startsWith('.')) {
          newName = oldName.substring(1); // 先頭の"."を削除
          newName = newName.replace(/\[(\w)\]/g, '.$1'); // "[x]" -> ".x"
          newName = `${nodeName}.${newName}`; // "RootNode.rotation.x"
        }

        console.log(`Track: ${oldName} -> ${newName}`);

        // トラックを複製
        if (track instanceof THREE.NumberKeyframeTrack) {
          return new THREE.NumberKeyframeTrack(newName, track.times, track.values);
        } else if (track instanceof THREE.VectorKeyframeTrack) {
          return new THREE.VectorKeyframeTrack(newName, track.times, track.values);
        } else if (track instanceof THREE.QuaternionKeyframeTrack) {
          return new THREE.QuaternionKeyframeTrack(newName, track.times, track.values);
        }
        return track;
      });

      return new THREE.AnimationClip(clip.name, clip.duration, newTracks);
    });
  }

  // Scene全体をエクスポートする場合、GLTF互換のトラック名に変換
  const rootNode = scene.children[0];
  if (!rootNode) {
    console.warn('No root node found in scene');
    return animations;
  }

  const targetName = rootNode.name || 'RootNode';

  return animations.map((clip) => {
    const newTracks = clip.tracks.map((track) => {
      const oldName = track.name;
      let newName = oldName;

      // ".rotation[y]" -> "RootNode.rotation.y" に変換（GLTF互換形式）
      if (oldName.startsWith('.')) {
        newName = oldName.substring(1); // 先頭の"."を削除
        newName = newName.replace(/\[(\w)\]/g, '.$1'); // "[x]" -> ".x"
        newName = `${targetName}.${newName}`; // "RootNode.rotation.x"
      }

      console.log(`  Track: ${oldName} -> ${newName}`);

      // トラックを複製
      if (track instanceof THREE.NumberKeyframeTrack) {
        return new THREE.NumberKeyframeTrack(newName, track.times, track.values);
      } else if (track instanceof THREE.VectorKeyframeTrack) {
        return new THREE.VectorKeyframeTrack(newName, track.times, track.values);
      } else if (track instanceof THREE.QuaternionKeyframeTrack) {
        return new THREE.QuaternionKeyframeTrack(newName, track.times, track.values);
      }
      return track;
    });

    return new THREE.AnimationClip(clip.name, clip.duration, newTracks);
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

    // デバッグログ（最小限）
    console.log('Exporting animation...');

    // エクスポート用にシーンをクローンして、アニメーション適用済みの変換をリセット
    const exportScene = scene.clone();
    exportScene.position.set(0, 0, 0);
    exportScene.rotation.set(0, 0, 0);
    exportScene.updateMatrix();
    exportScene.updateMatrixWorld(true);

    // Scene全体をエクスポート（RootNodeではなく）
    const exportTarget = exportScene;
    const exportingRootNode = false; // Scene全体をエクスポートする

    // アニメーショントラックのパスを修正
    const fixedAnimations = fixAnimationPaths(exportScene, animations, exportingRootNode);

    exporter.parse(
      exportTarget,
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
          console.log('Export completed successfully');
          resolve();
        } catch (error) {
          console.error('Export error:', error);
          reject(error);
        }
      },
      (error) => {
        console.error('GLTF parse error:', error);
        reject(error);
      },
      {
        binary: true,                  // GLB形式（バイナリ）
        animations: fixedAnimations,   // 修正されたアニメーション
        embedImages: true,             // 画像を埋め込み
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
