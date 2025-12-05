'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { ModelViewer } from './ModelViewer';
import { useAppStore } from '@/store/useAppStore';

export function Scene3D() {
  const uploadedFile = useAppStore((state) => state.uploadedFile);

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* ライティング */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        {/* グリッドとヘルパー */}
        <Grid args={[20, 20]} cellColor="#6b7280" sectionColor="#9ca3af" fadeDistance={30} />

        {/* モデル表示 */}
        {uploadedFile && <ModelViewer url={uploadedFile.url} />}

        {/* カメラコントロール */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Canvas>

      {/* モデルがない場合のメッセージ */}
      {!uploadedFile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-gray-400 text-center">
            <p className="text-lg font-medium">モデルをアップロードしてください</p>
            <p className="text-sm mt-2">GLB または GLTF ファイル</p>
          </div>
        </div>
      )}
    </div>
  );
}
