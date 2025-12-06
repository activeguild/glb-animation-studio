import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * アニメーショントラックのパスを修正
 * シーン階層内の実際のオブジェクト名を使用
 */
function fixAnimationPaths(scene: THREE.Group, animations: THREE.AnimationClip[], exportingRootNode: boolean): THREE.AnimationClip[] {
  console.log('=== Animation Track Info ===');

  // RootNodeを直接エクスポートする場合、トラック名からドットを削除
  if (exportingRootNode) {
    console.log('Exporting RootNode directly - removing leading dot from paths');
    return animations.map((clip) => {
      console.log(`Animation: ${clip.name}`);
      const newTracks = clip.tracks.map((track) => {
        const oldName = track.name;
        // ".rotation[y]" -> "rotation[y]" に変換
        const newName = oldName.startsWith('.') ? oldName.substring(1) : oldName;
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

  // Scene全体をエクスポートする場合はRootNode.propertyに変換
  const rootNode = scene.children[0];
  if (!rootNode) {
    console.warn('No root node found in scene');
    return animations;
  }

  const targetName = rootNode.name || 'RootNode';
  console.log(`Converting paths to target: "${targetName}"`);

  return animations.map((clip) => {
    console.log(`Processing animation: ${clip.name}`);
    const newTracks = clip.tracks.map((track) => {
      const oldName = track.name;
      let newName = oldName;

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

    // デバッグ用：シーン構造を確認
    console.log('=== Export Scene Structure ===');
    scene.traverse((obj) => {
      console.log(`${obj.type}: "${obj.name}"`);
    });

    // シーン情報をログ出力
    console.log('Original scene position:', scene.position.toArray());
    console.log('Original scene rotation:', scene.rotation.toArray());
    console.log('Original scene scale:', scene.scale.toArray());

    // エクスポート用にシーンをクローンして、アニメーション適用済みの変換をリセット
    const exportScene = scene.clone();
    exportScene.position.set(0, 0, 0);
    exportScene.rotation.set(0, 0, 0);
    exportScene.updateMatrix();
    exportScene.updateMatrixWorld(true);

    console.log('Export scene position:', exportScene.position.toArray());
    console.log('Export scene rotation:', exportScene.rotation.toArray());

    // RootNodeを直接エクスポート（Sceneではなく）
    const rootNode = exportScene.children[0];
    const exportTarget = rootNode || exportScene;
    const exportingRootNode = rootNode !== null;
    console.log(`Exporting: ${exportTarget.type} "${exportTarget.name}"`);

    // アニメーショントラックのパスを修正
    const fixedAnimations = fixAnimationPaths(scene, animations, exportingRootNode);

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
