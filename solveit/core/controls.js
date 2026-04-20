import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

export let controls;

export function initControls(camera, renderer) {
  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  controls.enableZoom = true;
  controls.enablePan = false;

  controls.rotateSpeed = 0.6;

  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;

  return controls;
}