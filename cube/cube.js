import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { moves } from './moves.js';
import { enqueueMoves, stopAnimation } from './animation.js';
import { updateAxisColors } from '../core/axes.js';
import { colors } from '../core/colors.js';
import { clearQueue, isMoving, onMoveComplete, detachRotatingGroup } from '../cube/animation.js';

export const solvedState = new Map();
export const cubeState = new Map();
export const cubeGroup = new THREE.Group();

export const faceState = {
  F: { color: colors.front },
  B: { color: colors.back },
  R: { color: colors.right },
  L: { color: colors.left },
  U: { color: colors.top },
  D: { color: colors.bottom },
};

const cycles = {
  x: ["U", "B", "D", "F"],
  y: ["F", "L", "B", "R"],
  z: ["U", "R", "D", "L"],
};

export function createCube() {

  solvedState.clear();
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cubie = createCubie(x, y, z);
        cubeGroup.add(cubie);
        solvedState.set(cubie, { x, y, z });
        cubeState.set(cubie, { x, y, z });
      }
    }
  }
  return cubeGroup;
}

export function createCubie(x, y, z) {
  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

  const materials = [
    new THREE.MeshBasicMaterial({ color: x === 1 ? colors.right : 0x000000 }),   // +X
    new THREE.MeshBasicMaterial({ color: x === -1 ? colors.left : 0x000000 }),   // -X
    new THREE.MeshBasicMaterial({ color: y === 1 ? colors.top : 0x000000 }),     // +Y
    new THREE.MeshBasicMaterial({ color: y === -1 ? colors.bottom : 0x000000 }), // -Y
    new THREE.MeshBasicMaterial({ color: z === 1 ? colors.front : 0x000000 }),   // +Z
    new THREE.MeshBasicMaterial({ color: z === -1 ? colors.back : 0x000000 })    // -Z
  ];

  const cube = new THREE.Mesh(geometry, materials);

  cube.position.set(x, y, z);

  return cube;
}

export function updateFaceState(move) {
  const { axis, angle } = move;
  const cycle = cycles[axis];
  applyCycle(faceState, cycle, angle);
}

function applyCycle(state, cycle, angle) {
  angle = ((angle % 4) + 4) % 4;
  for (let i = 0; i < angle; i++) {
    const temp = state[cycle[0]].color;
    for (let i = 0; i < cycle.length - 1; i++) {
      state[cycle[i]].color = state[cycle[i + 1]].color;
    }
    state[cycle[cycle.length - 1]].color = temp;
  }
}

export function toggleScramble() {
  const scrambleMoves = generateScramble(25);
  enqueueMoves(scrambleMoves);
}

export function generateScramble(nb) {
  const moveKeys = ["F", "R", "B", "U", "L", "D"];
  const suffixes = ["", "'", "2"];
  const scrambleMoves = [];

  let lastFace = null;

  const opposite = {
    R: "L", L: "R",
    U: "D", D: "U",
    F: "B", B: "F"
  };

  for (let i = 0; i < 25; i++) {
    let key;

    do {
      key = moveKeys[Math.floor(Math.random() * moveKeys.length)];
    } while (
      key === lastFace ||
      key === opposite[lastFace]
    );

    lastFace = key;

    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    scrambleMoves.push(key + suffix);
  }

  return scrambleMoves;
}

function resetCube() {
  detachRotatingGroup()

  solvedState.forEach((pos, cubie) => {
    cubie.position.set(pos.x, pos.y, pos.z);
    cubie.rotation.set(0, 0, 0); // ✅ reset la rotation visuelle du cubie

    // Resync cubeState avec la position initiale
    cubeState.set(cubie, { x: pos.x, y: pos.y, z: pos.z });
  });

  cubeGroup.rotation.set(0, 0, 0);
}

function resetFaceState() {   // pour garder track de quelle couleur sont les centres des faces
  faceState.F.color = colors.front;
  faceState.B.color = colors.back;
  faceState.R.color = colors.right;
  faceState.L.color = colors.left;
  faceState.U.color = colors.top;
  faceState.D.color = colors.bottom;

  updateAxisColors();
}

export function toggleSolve() {
  clearQueue();

  if (isMoving()) {
    onMoveComplete(() => {
      stopAnimation();
      resetCube();
      resetFaceState();
    });
  } else {
    stopAnimation();
    resetCube();
    resetFaceState();
  }
}

