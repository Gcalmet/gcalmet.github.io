import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

import { scene, camera, renderer } from '../core/scene.js';
import { cubeGroup, cubeState, updateFaceState} from './cube.js';
import { moves } from './moves.js';
import { parseMove } from '../algo/parser.js';
import { updateAxisColors } from '../core/axes.js';
import { animationSpeed } from '../core/speed.js';

let currentMove = null;
let progress = 0;
let rotatingGroup = null;
let moveQueue = [];
let isAnimating = false;

let historyStack = [];
let historyIndex = -1;

export function clearQueue() {
  moveQueue.length = 0;
}

export function isMoving() {
  return currentMove !== null;
}

export function onMoveComplete(callback) {
  if (!currentMove) {
    callback();
    return;
  }

  const moveRef = currentMove;

  const prev = moveRef._onComplete;

  moveRef._onComplete = () => {
    moveRef._onComplete = null;

    if (prev) prev();
    callback();
  };
}

export function getHistoryIndex() {
  return historyIndex;
}

export function getHistoryStack() {
  return historyStack;
}

export function setHistoryIndex(index) {
  historyIndex = index;
}

export function pushToHistory(moveStr) {
  historyStack = historyStack.slice(0, historyIndex + 1);
  historyStack.push(moveStr);
  historyIndex++;
}

history.replaceState({ index: -1 }, "", "");


export function applyMove(m) {
  enqueueMoves([m]);
}

export function enqueueMoves(list) {
  moveQueue.push(...list);

  if (!isAnimating) {
    runNextMove();
  }
}

export function animate() {
  requestAnimationFrame(animate);

  // animation rotation
  if (currentMove) {
    progress += 0.05 * animationSpeed;

    const t = ease(Math.min(progress, 1));

    const target = currentMove.target;

    if (rotatingGroup) {
      rotatingGroup.rotation[currentMove.axis] = target * t;
    }

    if (progress >= 1) {
      finishMove();
    }
  }

  renderer.render(scene, camera);
}

function rotateGrid(p, axis, angle) {
  const a = ((angle % 4) + 4) % 4;

  let { x, y, z } = p;

  for (let i = 0; i < a; i++) {
    if (axis === "x") [y, z] = [-z, y];
    if (axis === "y") [x, z] = [z, -x];
    if (axis === "z") [x, y] = [-y, x];
  }

  return { x, y, z };
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
    set : def.set,
    axis: def.axis,
    angle: angle, // -1, 1, 2
    target: (Math.PI / 2) * angle
  };

  const rotatingCubies = cubeGroup.children.filter(c => {
    if (!c.isMesh) return false;

    const p = cubeState.get(c);
    return def.set.includes(p[def.axis]);
  });

  const fixedlist = [...rotatingCubies];

  rotatingGroup = new THREE.Group(); 
  cubeGroup.add(rotatingGroup);
  rotatingGroup.list = fixedlist;

  fixedlist.forEach(c => rotatingGroup.attach(c));
  
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
  const m = currentMove;
  const rotatingCubies = rotatingGroup.list;

  rotatingCubies.forEach(c => {
    cubeGroup.attach(c);
    const p = cubeState.get(c);
    const newPos = rotateGrid(p, m.axis, m.angle);
    cubeState.set(c, newPos);
  });

  detachRotatingGroup()

  if (m.set.includes(0)) updateFaceState(m);
  updateAxisColors();

  const cb = m._onComplete;
  currentMove = null;
  rotatingGroup = null;
  progress = 0;

  cb?.();
}

export function detachRotatingGroup() {
  if (rotatingGroup) {
    rotatingGroup.children.forEach(c => cubeGroup.attach(c));
    cubeGroup.remove(rotatingGroup);
    rotatingGroup = null;
  }
}

function getAngle(face, suffix = "") {
  const base =
    suffix === "" ? 1 :
    suffix === "'" ? -1 :
    suffix === "2" ? 2 : 1;

  return base;
}

export function rotateCubieFaces(cubie, axis, angle) {
  const faces = cubie.userData.faces;

  const cycleX = ["U", "B", "D", "F"];
  const cycleY = ["F", "L", "B", "R"];
  const cycleZ = ["U", "R", "D", "L"];

  let cycle;

  if (axis === "x") cycle = cycleX;
  if (axis === "y") cycle = cycleY;
  if (axis === "z") cycle = cycleZ;

  const times = ((angle % 4) + 4) % 4;

  for (let t = 0; t < times; t++) {
    const temp = faces[cycle[0]];
    for (let i = 0; i < 3; i++) {
      faces[cycle[i]] = faces[cycle[i + 1]];
    }
    faces[cycle[3]] = temp;
  }

  updateCubieMaterials(cubie);
}

export function updateCubieMaterials(cubie) {
  const f = cubie.userData.faces;

  cubie.material[0].color.set(f.R);
  cubie.material[1].color.set(f.L);
  cubie.material[2].color.set(f.U);
  cubie.material[3].color.set(f.D);
  cubie.material[4].color.set(f.F);
  cubie.material[5].color.set(f.B);
}

export function stopAnimation() {
  currentMove = null;
  rotatingGroup = null;
  progress = 0;
}