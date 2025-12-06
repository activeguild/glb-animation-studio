import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * アニメーショントラックのパスを修正
 * シーン階層内の実際のオブジェクト名を使用
 */
function fixAnimationPaths(scene: THREE.Group, animations: THREE.AnimationClip[]): THREE.AnimationClip[] {
  console.log('=== Export Debug Info ===');
  console.log('Scene structure:');
  scene.traverse((obj) => {
    console.log(`  ${obj.type}: "${obj.name}" (uuid: ${obj.uuid})`);
  });

  // RootNode（最初の子オブジェクト）を見つける
  const rootNode = scene.children[0];
  if (!rootNode) {
    console.warn('No root node found in scene');
    return animations;
  }

  const targetName = rootNode.name || 'RootNode';
  console.log(`Target for animation: "${targetName}"`);
  console.log(`Scene position:`, scene.position.toArray());
  console.log(`Scene scale:`, scene.scale.toArray());
  console.log(`RootNode position:`, rootNode.position.toArray());

  return animations.map((clip) => {
    console.log(`Processing animation: ${clip.name}`);
    const newTracks = clip.tracks.map((track) => {
      const oldName = track.name;
      let newName = oldName;

      // '.property' -> 'RootNode.property' に変換
      if (oldName.startsWith('.')) {
        newName = `${targetName}${oldName}`;
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

    // アニメーショントラックのパスを修正
    const fixedAnimations = fixAnimationPaths(scene, animations);

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
