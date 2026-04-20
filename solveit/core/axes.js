import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { scene } from '../core/scene.js';
import { cubeGroup, faceState } from '../cube/cube.js';
import { colors } from './colors.js';

let axesVisible = false;
let axisHelpers = [];

const centers = {
  F: new THREE.Vector3(0, 0, 1.5),
  B: new THREE.Vector3(0, 0, -1.5),
  R: new THREE.Vector3(1.5, 0, 0),
  L: new THREE.Vector3(-1.5, 0, 0),
  U: new THREE.Vector3(0, 1.5, 0),
  D: new THREE.Vector3(0, -1.5, 0),
};



export function darken(hex, factor = 0.5) {
  const c = new THREE.Color(hex);
  c.r *= factor;
  c.g *= factor;
  c.b *= factor;
  return c;
}

export function createAxisArrow(dir, color, label, position) {
  const arrowColor = darken(color, 0.2);

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

  const SCALE = 4;

  canvas.width = 128 * SCALE;
  canvas.height = 64 * SCALE;

  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = "#" + color.getHexString();
  ctx.font = "bold 40px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, 64, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    color: 0xffffff,
    depthTest: true,
    depthWrite: false,
    toneMapped: false
  });

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

  const data = [
    { dir: new THREE.Vector3(0,0,1), label: "F", pos: centers.F, color: faceState["F"].color },
    { dir: new THREE.Vector3(0,0,-1), label: "B", pos: centers.B, color: faceState["B"].color },
    { dir: new THREE.Vector3(1,0,0), label: "R", pos: centers.R, color: faceState["R"].color },
    { dir: new THREE.Vector3(-1,0,0), label: "L", pos: centers.L, color: faceState["L"].color },
    { dir: new THREE.Vector3(0,1,0), label: "U", pos: centers.U, color: faceState["U"].color },
    { dir: new THREE.Vector3(0,-1,0), label: "D", pos: centers.D, color: faceState["D"].color },
  ];

  data.forEach(d => {
    const { arrow, sprite } = createAxisArrow(d.dir, d.color, d.label, d.pos);

    cubeGroup.add(arrow);
    cubeGroup.add(sprite);

    axisHelpers.push(arrow, sprite);
  });
}

export function hideAxes() {
  axisHelpers.forEach(h => cubeGroup.remove(h));
  axisHelpers = [];
}

export function updateAxisColors() {
  hideAxes();
  if (axesVisible) showAxes();
}