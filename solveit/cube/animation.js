import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

import { scene, camera, renderer } from '../core/scene.js';
import { controls } from '../core/controls.js';
import { cubeGroup, updateFaceState} from './cube.js';
import { moves } from './moves.js';
import { parseMove } from '../algo/parser.js';
import { updateAxisColors } from '../core/axes.js';

let currentMove = null;
let progress = 0;
let rotatingLayer = null;
let rotatingCubies = [];
let moveQueue = [];
let isAnimating = false;

export function enqueueMoves(list) {
  moveQueue.push(...list);

  if (!isAnimating) {
    runNextMove();
  }
}

export function animate() {
  requestAnimationFrame(animate);

  controls.update();

  // animation rotation
  if (currentMove) {
    progress += 0.05; // vitesse

    const angle = (Math.PI / 2) * currentMove.angle * ease(progress);

    rotatingLayer.rotation[currentMove.axis] = angle;

    if (progress >= 1) {
      finishMove();
    }
  }

  renderer.render(scene, camera);
}

function ease(t) {
  return t * (2 - t); // ease-out simple
}

export function move(m, onComplete) {
  if (currentMove) return;

  const { face, suffix } = parseMove(m);

  const def = moves[face];
  if (!def) return;

  const angle = def.sign * getAngle(face, suffix);

  currentMove = {
    ...def,
    face,
    suffix,
    angle: angle
  };
  progress = 0;

  rotatingLayer = new THREE.Group();
  cubeGroup.add(rotatingLayer);

  rotatingCubies = cubeGroup.children.filter(cubie => {
    if (!cubie.isMesh) return false;
    return shouldRotate(cubie, def);
  });

  rotatingCubies.forEach(c => rotatingLayer.attach(c));

  currentMove._onComplete = onComplete || null;
}

export function runNextMove() {
  if (moveQueue.length === 0) {
    isAnimating = false;
    return;
  }

  isAnimating = true;

  const next = moveQueue.shift();

  move(next, () => {
    runNextMove();
  });
}

function finishMove() {

  rotatingCubies.forEach(cubie => {
    cubeGroup.attach(cubie);
  });

  rotatingCubies.forEach(cubie => {
    const p = cubie.userData.pos;
    const def = currentMove;

    const newPos = rotatePos(p, def.axis, def.angle);

    cubie.userData.pos = newPos;
    cubie.position.set(newPos.x, newPos.y, newPos.z);
  });

  cubeGroup.remove(rotatingLayer);
  const m = currentMove;

  updateFaceState(m);
  updateAxisColors();

  const cb = move?._onComplete;

  currentMove = null;
  rotatingLayer = null;
  rotatingCubies = [];
  progress = 0;

  if (cb) cb();
}

function rotatePos(pos, axis, angle) {
  const { x, y, z } = pos;

  const a = Math.PI / 2 * angle;

  if (axis === "x") {
    return {
      x,
      y: Math.round(y * Math.cos(a) - z * Math.sin(a)),
      z: Math.round(y * Math.sin(a) + z * Math.cos(a))
    };
  }

  if (axis === "y") {
    return {
      x: Math.round(x * Math.cos(a) + z * Math.sin(a)),
      y,
      z: Math.round(-x * Math.sin(a) + z * Math.cos(a))
    };
  }

  if (axis === "z") {
    return {
      x: Math.round(x * Math.cos(a) - y * Math.sin(a)),
      y: Math.round(x * Math.sin(a) + y * Math.cos(a)),
      z
    };
  }

  return pos;
}

function shouldRotate(cubie, def) {
  const p = cubie.userData.pos;
  if (!p) return false;

  return def.set.includes(p[def.axis]);
}

function getAngle(face, suffix = "") {
  const base =
    suffix === "" ? 1 :
    suffix === "'" ? -1 :
    suffix === "2" ? 2 : 1;

  return base;
}