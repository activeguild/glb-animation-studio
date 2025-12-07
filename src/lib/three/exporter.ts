import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * アニメーショントラックのパスを修正
 * シーン階層内の実際のオブジェクト名を使用
 */

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

    // エクスポート用にシーンをクローンして、アニメーション適用済みの変換をリセット
    const exportScene = scene.clone();
    exportScene.position.set(0, 0, 0);
    exportScene.rotation.set(0, 0, 0);
    exportScene.updateMatrix();
    exportScene.updateMatrixWorld(true);

    // AnimationMixerを使ってトラックパスを自動解決
    const mixer = new THREE.AnimationMixer(exportScene);
    const resolvedAnimations = animations.map((clip) => {
      const action = mixer.clipAction(clip);
      return action.getClip();
    });

    console.log('Exporting with resolved animations:', resolvedAnimations.map(a => ({
      name: a.name,
      tracks: a.tracks.map(t => t.name)
    })));

    exporter.parse(
      exportScene,
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
          mixer.stopAllAction();
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
        binary: true,                    // GLB形式（バイナリ）
        animations: resolvedAnimations,  // ミキサーで解決されたアニメーション
        embedImages: true,               // 画像を埋め込み
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
