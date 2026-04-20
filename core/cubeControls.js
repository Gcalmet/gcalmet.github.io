import * as THREE from "three";
import { camera } from "../core/scene.js";
import { cubeGroup } from "../cube/cube.js";
import { uiInteracting } from '../core/speed.js';

const tmpQuat = new THREE.Quaternion();
const q = new THREE.Quaternion();

const camRight = new THREE.Vector3();
const camUp = new THREE.Vector3();

const minZoom = 3;
const maxZoom = 12;
const zoomSpeed = 0.001;

let isDragging = false;
let prev = new THREE.Vector2();
const ROT_SPEED = 0.005;

export function initCubeControls(dom = window) {
  dom.addEventListener("mousedown", onDown);
  dom.addEventListener("mouseup", onUp);
  dom.addEventListener("mousemove", onMove);
}

export function initZoom(dom = window) {
  dom.addEventListener("wheel", onWheel, { passive: false });
}


function onWheel(e) {

  e.preventDefault();

  const direction = new THREE.Vector3();

  // direction caméra → cible (0,0,0)
  direction.subVectors(new THREE.Vector3(0, 0, 0), camera.position);
  direction.normalize();

  const delta = -e.deltaY * zoomSpeed;

  camera.position.addScaledVector(direction, delta);

  // clamp distance
  const dist = camera.position.length();

  if (dist < minZoom) camera.position.setLength(minZoom);
  if (dist > maxZoom) camera.position.setLength(maxZoom);

  camera.lookAt(0, 0, 0);
}

function onDown(e) {
  isDragging = true;
  prev.set(e.clientX, e.clientY);
}

function onUp() {
  isDragging = false;
}

export function onMove(e) {
  if (!isDragging) return;
  if (uiInteracting) return;

  const dx = e.clientX - prev.x;
  const dy = e.clientY - prev.y;

  prev.set(e.clientX, e.clientY);

  const speed = ROT_SPEED;

  // xes caméra
  camera.updateMatrixWorld();

  camera.getWorldDirection(new THREE.Vector3()); // force update

  camRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
  camUp.set(0, 1, 0).applyQuaternion(camera.quaternion);

  const rotX = new THREE.Quaternion().setFromAxisAngle(
    camRight,
    dy * speed
  );

  const rotY = new THREE.Quaternion().setFromAxisAngle(
    camUp,
    dx * speed
  );

  tmpQuat.copy(rotY).multiply(rotX);

  q.premultiply(tmpQuat);

  cubeGroup.quaternion.copy(q);
}