import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { generateScramble } from '../cube/cube.js';
import { applyMove } from '../cube/animation.js';
import { colors } from '../core/colors.js';

function scrambleCubie(x, y, z) {
  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

  // all possible sticker colors
  const palette = [
    colors.right,
    colors.left,
    colors.top,
    colors.bottom,
    colors.front,
    colors.back
  ];

  // helper to pick random color
  function randColor() {
    return palette[Math.floor(Math.random() * palette.length)];
  }

  const materials = [
    new THREE.MeshBasicMaterial({ color: randColor() }), // +X
    new THREE.MeshBasicMaterial({ color: randColor() }), // -X
    new THREE.MeshBasicMaterial({ color: randColor() }), // +Y
    new THREE.MeshBasicMaterial({ color: randColor() }), // -Y
    new THREE.MeshBasicMaterial({ color: randColor() }), // +Z
    new THREE.MeshBasicMaterial({ color: randColor() })  // -Z
  ];

  const cube = new THREE.Mesh(geometry, materials);
  cube.position.set(x, y, z);

  return cube;
}

export function initScrambleIcon(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(44, 44);
  container.appendChild(renderer.domElement);

  const scrambleGroup = new THREE.Group();
  scene.add(scrambleGroup);

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        scrambleGroup.add(scrambleCubie(x, y, z));
      }
    }
  }

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}