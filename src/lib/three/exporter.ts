import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

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
        animations: animations,      // アニメーションクリップを埋め込み
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
