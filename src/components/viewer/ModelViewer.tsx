'use client';

import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';
import { ModelData } from '@/types/model';

interface ModelViewerProps {
  url: string;
}

export function ModelViewer({ url }: ModelViewerProps) {
  const gltf = useGLTF(url);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const sceneRef = useRef<THREE.Group | null>(null);

  const setModelData = useAppStore((state) => state.setModelData);
  const currentClip = useAppStore((state) => state.currentClip);
  const animationParams = useAppStore((state) => state.animationParams);
  const isPlaying = useAppStore((state) => state.isPlaying);

  // モデル読み込み時の初期化
  useEffect(() => {
    if (!gltf.scene || !groupRef.current) return;

    const scene = gltf.scene.clone();
    sceneRef.current = scene;

    // バウンディングボックス計算
    const bounds = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    bounds.getCenter(center);
    bounds.getSize(size);

    // スケール調整（最大サイズを2に正規化）
    const maxSize = Math.max(size.x, size.y, size.z);
    if (maxSize > 2) {
      const scale = 2 / maxSize;
      scene.scale.setScalar(scale);
    }

    // groupに追加
    groupRef.current.clear();
    groupRef.current.add(scene);

    // 中心に配置（シーンではなくgroupRefで調整）
    groupRef.current.position.sub(center);

    const modelData: ModelData = {
      scene,
      animations: gltf.animations || [],
      bounds,
      center,
      size,
    };

    setModelData(modelData);

    // AnimationMixerを作成（レンダリングされるシーンと同じオブジェクトに対して）
    mixerRef.current = new THREE.AnimationMixer(scene);

    // mixerをuserDataに保存（エクスポート時にアクセスできるように）
    scene.userData.mixer = mixerRef.current;

    const currentGroup = groupRef.current;
    
    return () => {
      // クリーンアップ
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(scene);
      }
      if (currentGroup) {
        currentGroup.clear();
      }
    };
  }, [gltf, setModelData]);

  // アニメーションクリップ変更時
  useEffect(() => {
    if (!mixerRef.current || !currentClip) return;

    // 既存のアクションを停止
    if (actionRef.current) {
      actionRef.current.stop();
    }

    // 新しいアクションを作成
    const action = mixerRef.current.clipAction(currentClip);

    // ループ設定
    if (animationParams.loopCount === Infinity) {
      action.setLoop(THREE.LoopRepeat, Infinity);
    } else {
      action.setLoop(THREE.LoopRepeat, animationParams.loopCount);
      action.clampWhenFinished = true;
    }

    // 速度設定
    action.timeScale = animationParams.speed;

    actionRef.current = action;

    if (isPlaying) {
      action.play();
    }

    return () => {
      action.stop();
    };
  }, [currentClip, animationParams.loopCount, animationParams.speed, isPlaying]);

  // 再生/一時停止制御
  useEffect(() => {
    if (!actionRef.current) return;

    if (isPlaying) {
      actionRef.current.play();
    } else {
      actionRef.current.paused = true;
    }
  }, [isPlaying]);

  // アニメーション更新
  useFrame((state, delta) => {
    if (mixerRef.current && isPlaying) {
      mixerRef.current.update(delta);
    }
  });

  return <group ref={groupRef} />;
}

