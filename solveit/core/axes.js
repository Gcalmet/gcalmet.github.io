import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { scene } from '../core/scene.js';
import { colors, faceState } from '../cube/cube.js';

let axesVisible = false;
let axisHelpers = [];

export function darken(hex, factor = 0.5) {
  const c = new THREE.Color(hex);
  c.r *= factor;
  c.g *= factor;
  c.b *= factor;
  return c;
}

export function createAxisArrow(dir, color, label, position) {
  const arrowColor = darken(color, 0.1);

  const arrow = new THREE.ArrowHelper(
    dir,
    position,
    1.2,
    arrowColor
  );

  const sprite = makeLabel(
    label,
    position.clone().add(dir.clone().multiplyScalar(1.4)),
    arrowColor
  );

  arrow.userData = { label };
  sprite.userData = { label };

  return { arrow, sprite };
}

export function makeLabel(text, position, color) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 128;
  canvas.height = 64;

  ctx.fillStyle = "#" + color.getHexString();
  ctx.font = "bold 40px monospace";
  ctx.fillText(text, 10, 40);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);

  sprite.position.copy(position);
  sprite.scale.set(0.5, 0.25, 1);

  return sprite;
}

export function toggleAxes() {
  axesVisible = !axesVisible;

  if (axesVisible) {
    showAxes();
  } else {
    hideAxes();
  }
}

export function showAxes() {
  const centers = {
    F: new THREE.Vector3(0, 0, 1.5),
    B: new THREE.Vector3(0, 0, -1.5),
    R: new THREE.Vector3(1.5, 0, 0),
    L: new THREE.Vector3(-1.5, 0, 0),
    U: new THREE.Vector3(0, 1.5, 0),
    D: new THREE.Vector3(0, -1.5, 0),
  };

    const data = [
        { dir: new THREE.Vector3(0,0,1), label: "F", pos: centers.F, color: colors.front },
        { dir: new THREE.Vector3(0,0,-1), label: "B", pos: centers.B, color: colors.back },
        { dir: new THREE.Vector3(1,0,0), label: "R", pos: centers.R, color: colors.right },
        { dir: new THREE.Vector3(-1,0,0), label: "L", pos: centers.L, color: colors.left },
        { dir: new THREE.Vector3(0,1,0), label: "U", pos: centers.U, color: colors.top },
        { dir: new THREE.Vector3(0,-1,0), label: "D", pos: centers.D, color: colors.bottom },
    ];

  data.forEach(d => {
    const { arrow, sprite } = createAxisArrow(d.dir, d.color, d.label, d.pos);

    scene.add(arrow);
    scene.add(sprite);

    axisHelpers.push(arrow, sprite);
  });
}

export function hideAxes() {
  axisHelpers.forEach(h => scene.remove(h));
  axisHelpers = [];
}

export function updateAxisColors() {
  axisHelpers.forEach(h => {
    const label = h.userData.label;
    if (!label) return;

    const baseColor = faceState[label]?.color;
    if (!baseColor) return;

    const color = new THREE.Color(baseColor);

    // darker variant for arrows / labels
    const dark = darken(baseColor, 0.2);

    if (h.type === "ArrowHelper") {
      h.setColor(dark);
    }

    if (h.material) {
      h.material.color.set(dark);
    }
  });
}