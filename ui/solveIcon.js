import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { createCubie } from '../cube/cube.js';

export function initSolveIcon(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(44, 44);
  container.appendChild(renderer.domElement);

  const cubeGroup = new THREE.Group();
  scene.add(cubeGroup);

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubeGroup.add(createCubie(x, y, z));
      }
    }
  }

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}