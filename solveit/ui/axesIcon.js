import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function initAxesIcon(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(44, 44);
  container.appendChild(renderer.domElement);

  // Axes helpers
  const axes = new THREE.AxesHelper(1);
  scene.add(axes);

  function animate() {
    renderer.render(scene, camera);
  }

  animate();
}