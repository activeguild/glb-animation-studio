import * as THREE from 'three';

export interface ModelData {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  bounds: THREE.Box3;
  center: THREE.Vector3;
  size: THREE.Vector3;
}

export interface UploadedFile {
  file: File;
  url: string;
}
